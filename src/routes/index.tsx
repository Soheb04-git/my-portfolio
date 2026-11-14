import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";

import { Cursor } from "@/components/cursor/Cursor";
import { Hero } from "@/components/hero/Hero";
import { SiteNav } from "@/components/navigation/SiteNav";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { BeyondCode, Certification, Education } from "@/components/sections/Credentials";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { profile } from "@/data/portfolio";

const TITLE = "MD Soheb Ansari | Software Developer Portfolio";
const DESCRIPTION =
  "Explore the portfolio of MD Soheb Ansari, a Computer Science undergraduate from BCET, Durgapur, showcasing software projects, technical skills, hackathon work and leadership experience.";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: profile.name,
      jobTitle: "Computer Science undergraduate, aspiring Software Developer",
      email: `mailto:${profile.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Durgapur", addressRegion: "West Bengal", addressCountry: "IN" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Bengal College of Engineering and Technology" },
      sameAs: [profile.github, profile.linkedin],
      knowsAbout: ["Java", "Spring Boot", "React", "JavaScript", "Python", "SQL", "Data Structures and Algorithms"],
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        name: "Oracle Cloud Infrastructure Generative AI Professional",
        recognizedBy: { "@type": "Organization", name: "Oracle" },
      },
    },
    { "@type": "WebSite", name: TITLE, description: DESCRIPTION, author: { "@type": "Person", name: profile.name } },
  ],
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "profile:first_name", content: "Soheb" },
      { property: "profile:last_name", content: "Ansari" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  }),
  component: Index,
});

function Index() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="label-mono fixed left-4 top-4 z-[60] -translate-y-24 bg-primary px-4 py-3 text-primary-foreground focus:translate-y-0"
      >
        Skip to content
      </a>
      <SiteNav />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certification />
        <Education />
        <BeyondCode />
        <Contact />
      </main>
      <Cursor />
    </MotionConfig>
  );
}
