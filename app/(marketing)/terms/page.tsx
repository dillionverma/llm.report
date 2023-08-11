import Link from "next/link";

const Terms = () => {
  return (
    <div className="prose container flex flex-col justify-center max-w-10xl pb-16 px-8">
      <h1 className="tracking-wide font-semibold flex m-auto text-5xl text-left pt-12 text-gray-950">
        Terms
      </h1>

      <p>
        llm.report operates the https://llm.report website, which provides
        monitoring and reporting services.
      </p>

      <h2>Contact Us</h2>

      <p>
        If you have any questions or suggestions about our Privacy Policy, do
        not hesitate to contact us at{" "}
        <Link href="mailto:dillion@llm.report">dillion@llm.report</Link>.
      </p>
    </div>
  );
};

export default Terms;
