import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { SectionNav } from "@/components/section-nav";
import { AllProjects } from "@/components/sections/all-projects";
import { Community } from "@/components/sections/community";
import { ContactCta } from "@/components/sections/contact-cta";
import { Experience } from "@/components/sections/experience";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Hackathons } from "@/components/sections/hackathons";
import { Hero } from "@/components/sections/hero";
import { LatestPosts } from "@/components/sections/latest-posts";
import { Maker } from "@/components/sections/maker";
import { Sports } from "@/components/sections/sports";
import { buildMetadata } from "@/lib/metadata";
import { personSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: `${site.name} — ${site.jobTitle}`,
  description: site.description,
  path: "/",
  absoluteTitle: true,
});

/**
 * Single-scroll homepage.
 *
 * Section order is deliberate: shipped work sits directly under the hero,
 * because that is the argument the whole site is making. Everything after it
 * is supporting evidence. The order here must match `homeSections`, which
 * drives the jump-nav rail.
 */
export default function Home() {
  return (
    <>
      <JsonLd data={personSchema()} />
      <SectionNav />
      <Hero />
      <FeaturedProjects />
      <AllProjects />
      <Experience />
      <Hackathons />
      <Maker />
      <Sports />
      <Community />
      <LatestPosts />
      <ContactCta />
    </>
  );
}
