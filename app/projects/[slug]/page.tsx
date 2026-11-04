import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/Projects/ProjectDetail";
import { getProjectBySlug, getProjectSlugs } from "@/lib/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  /* The subtitle says what the thing is, which is what someone searching by
     problem rather than by name actually types. */
  const title = project.subtitle
    ? `${project.title} — ${project.subtitle} | Mahdi Feriani`
    : `${project.title} | Mahdi Feriani`;

  return {
    title,
    description: project.description,
    ...(project.keywords?.length ? { keywords: project.keywords } : {}),
    alternates: {
      canonical: `/projects/${slug}`,
    },
    openGraph: {
      title,
      type: "article",
      description: project.description,
      images: project.gallery?.length ? [project.gallery[0]] : [project.image],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project?.highlights?.length) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
