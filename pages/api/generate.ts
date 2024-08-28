import { Ratelimit } from "@upstash/ratelimit";
import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../utils/redis";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prismadb";

type Data = string;
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    youUrl: string;
    clothingUrl: string;
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
  if (!user || user?.credits <= 0) {
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
  const versionId = "906425dbca90663ff5427624839572cc56ea7d380343d13e2a4c4b09d3f0c30f";
  const garm_img = req.body.clothingUrl;
  const human_img = req.body.youUrl;

  
  // POST request to Replicate to start the image restoration generation process
  let startResponse = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + process.env.REPLICATE_API_KEY,
    },
    body: JSON.stringify({
      version: versionId,
      input: { garm_img, human_img, garment_des: "jacket", category: "upper body" },
    }),
  });

  let jsonStartResponse = await startResponse.json();
  let endpointUrl = jsonStartResponse.urls.get;

  // GET request to get the status of the image restoration process & return the result when it's ready
  let restoredImage: string | null = null;
  const pollingStartTime = Date.now();

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
  if (restoredImage) {
    res
    .status(200)
    .json(restoredImage)
  }
  else {
    res
    .status(400)
    .json("fail");
  }
}
