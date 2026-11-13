import type { Metadata } from "next";
import ProjectsIndex from "@/components/Projects/ProjectsIndex";

/**
 * The description is the one the search result will actually show, so it
 * names the work rather than describing the page — "projects by Mahdi
 * Feriani" is what a page about a page says.
 */
export const metadata: Metadata = {
  title: "Projects — Chrome Extensions, Mobile Apps & Full-Stack Platforms | Mahdi Feriani",
  description:
    "Selected engineering work by Mahdi Feriani: a published Chrome extension for batch image generation, two cross-platform React Native apps on the App Store and Google Play, a full-stack pet adoption platform, an open-source AI B-roll search tool and a freelance e-commerce build.",
  keywords: [
    "Mahdi Feriani projects",
    "Mahdi Feriani portfolio",
    "full-stack engineer portfolio",
    "React Native app developer Tunisia",
    "Next.js NestJS projects",
    "Chrome extension developer",
  ],
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | Mahdi Feriani",
    type: "website",
    description:
      "Selected engineering work: a published Chrome extension, two cross-platform mobile apps, a full-stack adoption platform and an open-source AI tool.",
  },
};

export default function ProjectsPage() {
  return <ProjectsIndex />;
}
