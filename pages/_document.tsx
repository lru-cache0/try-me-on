import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Your AI Wardrobe Assistant"
          />
          <meta property="og:site_name" content="try-me-on.vercel.app" />
          <meta
            property="og:description"
            content="Your AI Interior Designer."
          />
          <meta property="og:title" content="AI Clothes Try-On" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="AI Clothes Try-On" />
          <meta
            name="twitter:description"
            content="Try on clothes with AI."
          />
          <meta
            property="og:image"
            content="https://room-genius-xi.vercel.app/olivia.png"
          />
          <meta
            name="twitter:image"
            content="https://room-genius-xi.vercel.app/olivia.png"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
