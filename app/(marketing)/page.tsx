import Hero from "@/components/landing/Hero";
import Testimonials from "@/components/landing/Testimonials";
import { TrustedBy } from "@/components/landing/TrustedBy";
import CommunitySection from "@/components/landing/community-section";
import FeatureSections from "@/components/landing/feature-sections";
import TestimonialHighlight from "@/components/landing/testimonial-highlight";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect("/openai");
  return (
    <>
      <Hero />
      <TrustedBy />
      <TestimonialHighlight />
      <FeatureSections />
      <Testimonials />
      <CommunitySection />
    </>
  );
}
