"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <section id="faq">
      <div className="py-14 max-w-[600px] mx-auto">
        <div className="mx-auto max-w-md text-center sm:max-w-2xl">
          <h2 className="font-display text-4xl font-bold leading-tight text-black sm:text-5xl sm:leading-tight">
            Frequently Asked Questions
          </h2>
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>How does it work?</AccordionTrigger>
            <AccordionContent>
              We provide 2 solutions. The first is a no-code solution which
              requires you to enter your OpenAI API key to get access to a
              dashboard of analytics. The second is a code-based solution which
              requires you to install our SDK in your app.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What is your pricing?</AccordionTrigger>
            <AccordionContent>
              We have a free plan which allows you to track up to 100,000
              requests every month. We also have a paid plan targeted towards
              startups and enterprises which allow you to track unlimited
              requests.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
