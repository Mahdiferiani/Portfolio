import { projects } from "@/data/portfolio";
import type { Project } from "@/types/portfolio";

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function hasProjectDetail(project: Project): boolean {
  return Boolean(project.slug && project.highlights?.length);
}

/**
 * The projects that are actually reachable as their own URL.
 *
 * `hasProjectDetail` is the one rule, applied here once. The detail route
 * calls `notFound()` on a project with no highlights, so anything that enumerates
 * the project pages — the hub, the sitemap, `generateStaticParams` — has to
 * apply the same test or it advertises a URL that 404s. The sitemap used to
 * list every slug regardless, which would have published a dead URL the first
 * time a project was given a slug before its highlights were written.
 */
export function getDetailProjects(): Project[] {
  return projects.filter(hasProjectDetail);
}

export function getProjectSlugs(): string[] {
  return getDetailProjects()
    .map((project) => project.slug)
    .filter((slug): slug is string => Boolean(slug));
}
