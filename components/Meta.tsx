import Head from "next/head";

const DOMAIN = "https://llm.report";

const Meta = ({
  title = "LLM Report | OpenAI API Analytics",
  description = "Analyze your OpenAI API usage and billing in real-time.",
  image = `${DOMAIN}/screenshot.png`,
  type = "website",
}: {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta itemProp="image" content={image} />
      <meta property="og:url" content={DOMAIN} />
      <meta property="og:logo" content={`${DOMAIN}/logo.png`}></meta>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:image:url" content={image} />
      <meta property="og:image:secure_url" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@dillionverma" />
      <meta name="twitter:creator" content="@dillionverma" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
    </Head>
  );
};

export default Meta;
