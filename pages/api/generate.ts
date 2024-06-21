import { Ratelimit } from "@upstash/ratelimit";
import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../utils/redis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prismadb";

type Data = string;
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    imageUrl: string;
    prompt: string;
  };
}

// Create a new ratelimiter, that allows 5 requests per day
/*
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.fixedWindow(5, "0 m"),
      analytics: true,
    })
  : undefined;
*/

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  // Check if user is logged in
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(500).json("Login to upload.");
  }

  // Get user from DB
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!,
    },
    select: {
      credits: true,
    },
  });

  // Check if user has any credits left
  if (user?.credits === 0) {
    return res.status(400).json(`You have no generations left`);
  }

  // If they have credits, decrease their credits by one and continue
  /*
  await prisma.user.update({
    where: {
      email: session.user.email!,
    },
    data: {
      credits: {
        decrement: 1,
      },
    },
  });
  */

  // Rate Limiting by user email
  /*
  if (ratelimit) {
    const identifier = session.user.email;
    const result = await ratelimit.limit(identifier!);
    res.setHeader("X-RateLimit-Limit", result.limit);
    res.setHeader("X-RateLimit-Remaining", result.remaining);

    // Calcualte the remaining time until generations are reset
    const diff = Math.abs(
      new Date(result.reset).getTime() - new Date().getTime()
    );
    //const hours = Math.floor(diff / 1000 / 60 / 60);
    //const minutes = Math.floor(diff / 1000 / 60) - hours * 60;
    const hours = 0;
    const minutes = 0;

    if (!result.success) {
      return res
        .status(429)
        .json(
          `You need more credits!`
        );
    }
  }
  */

  //const versionId = "76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38";
  const versionId = "854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b";
  const imageUrl = req.body.imageUrl;
  const prompt = req.body.prompt;
  const negativePrompt = "illustration, painting, cartoon, worst quality, low quality, lowres, watermark, banner, logo, watermark, contactinfo, text, deformed, blurry, blur, out of focus, out of frame, surreal, extra, ugly, upholstered walls, fabric walls, plush walls, mirror, mirrored, functional";
  const aPrompt = "room, bedroom, bathroom, kitchen, dining room, realistic, cinematic photo, highly detailed, cinematic lighting, ultra-detailed, ultrarealistic, photorealism, 8k., masterpiece, cinematic light, ultrarealistic+, photorealistic+, 8k, raw photo, realistic, hyperrealistic, highest quality, best quality, highly detailed, masterpiece, best quality, extremely detailed 8k wallpaper, masterpiece, best quality, ultra-detailed, best shadow, detailed background, high contrast, best illumination, detailed face, dulux, caustic, dynamic angle, detailed glow. dramatic lighting, highly detailed, insanely detailed hair, symmetrical, intricate details, professionally retouched, 8k high definition. strong bokeh. award winning photo.";
  const timeoutDuration = 12000;
  
  // POST request to Replicate to start the image restoration generation process
  let startResponse = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + process.env.REPLICATE_API_KEY,
    },
    body: JSON.stringify({
      version: versionId,
      input: { image: imageUrl, prompt: prompt, a_prompt: aPrompt, n_prompt: negativePrompt},
    }),
  });

  let jsonStartResponse = await startResponse.json();
  let endpointUrl = jsonStartResponse.urls.get;

  // GET request to get the status of the image restoration process & return the result when it's ready
  let restoredImage: string | null = null;
  while (!restoredImage) {
    // Loop in 1s intervals until the alt text is ready
    console.log("polling for result...");
    let finalResponse = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_KEY,
      },
    });
    let jsonFinalResponse = await finalResponse.json();
    console.log(jsonFinalResponse)

    if (jsonFinalResponse.status === "succeeded") {
      await prisma.user.update({
        where: {
          email: session.user.email!,
        },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });
      restoredImage = jsonFinalResponse.output;
    } else if (jsonFinalResponse.status === "failed") {
      console.log("failed");
      break;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  res
    .status(200)
    .json(restoredImage ? restoredImage : "Failed to restore image");
}
