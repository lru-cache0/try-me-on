import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Your AI Interior Designer."
          />
          <meta property="og:site_name" content="room-genius-xi.vercel.app" />
          <meta
            property="og:description"
            content="Your AI Interior Designer."
          />
          <meta property="og:title" content="AI Interior Designer" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="AI Interior Designer" />
          <meta
            name="twitter:description"
            content="Your AI Interior Designer."
          />
          <meta
            property="og:image"
            content="https://restore-photos.vercel.app/og-image.png"
          />
          <meta
            name="twitter:image"
            content="https://restore-photos.vercel.app/og-image.png"
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
