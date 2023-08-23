"use client";

import { Cobe } from "./Cobe";
import { Features } from "./Features";

const FeatureGrid = () => {
  return (
    <section id="features">
      <Features.Cards
        features={[
          {
            Image: Cobe,
            imageClassName: "-z-10 top-[20%] w-[100%] mx-auto",
            title: "Built on Cloudflare Workers",
            text: "< 20ms response times anywhere in the world, built-in caching, and 99.99% uptime SLA.",
          },
          {
            Image: () => (
              <>
                {/* <WordStar /> */}

                <div
                  style={{
                    position: "absolute",
                    top: "60%",
                    left: "50%",
                    transform: "translate3d(-50%,-50%,0)",
                  }}
                >
                  <h1
                    className="hidden md:block"
                    style={{
                      margin: 0,
                      padding: 0,
                      fontSize: "3em",
                      fontWeight: 500,
                      letterSpacing: "-0.05em",
                      textAlign: "center",
                      lineHeight: 1,
                    }}
                  >
                    stop guessing your cost per API key.
                  </h1>
                </div>
              </>
            ),
            imageClassName: "-z-10",
            title: "Complete Visibility",
            text: "Know how much your AI project is costing you. See exactly how much you spend per model, API key, and user.",
          },
        ]}
      />
    </section>
  );
};

export default FeatureGrid;
