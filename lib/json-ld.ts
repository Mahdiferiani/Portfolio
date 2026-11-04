import type { Project } from "@/types/portfolio";
import {
  education,
  heroContent,
  siteConfig,
  socialLinks,
  workExperience,
} from "@/data/portfolio";

/**
 * Structured data for the site.
 *
 * The homepage has to win a query that is a person's name, and for that Google
 * is not matching strings so much as deciding whether there is an entity
 * behind them. What makes that case is corroboration: the schools, the
 * employer, the skills and the off-site profiles, all stated here and all
 * verifiable against the pages they point at. `sameAs` is the load-bearing
 * part — it is the claim that the person on this site is the person on those
 * profiles, which is what lets the three reinforce each other instead of
 * competing as three unrelated pages about similarly-named people.
 */
export function getPersonJsonLd() {
  const linkedIn = socialLinks.find((link) => link.icon === "linkedin")?.href;
  const github = socialLinks.find((link) => link.icon === "github")?.href;

  /** The current role, which is the one `worksFor` should name. */
  const current = workExperience[0];

  /** Schools, most recent first — the data is already in that order. */
  const alumniOf = education.map((item) => ({
    "@type": "EducationalOrganization" as const,
    name: item.school,
  }));

  /**
   * Deduplicated across every role's stack. These are the terms someone
   * actually searches alongside the name ("Mahdi Feriani NestJS"), and the
   * stack lists are already maintained per role, so deriving them here keeps
   * the schema from becoming a second copy that drifts.
   */
  const knowsAbout = Array.from(
    new Set(workExperience.flatMap((job) => job.stack)),
  );

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": `${siteConfig.url}/#person` },
        inLanguage: "en-US",
      },
      {
        "@type": "Person",
        "@id": `${siteConfig.url}/#person`,
        name: siteConfig.name,
        givenName: "Mahdi",
        familyName: "Feriani",
        url: siteConfig.url,
        email: siteConfig.email,
        telephone: siteConfig.phone,
        image: `${siteConfig.url}/og-image.jpg`,
        jobTitle: "Full-Stack Software Engineer",
        description: heroContent.bio,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Sfax",
          addressCountry: "TN",
        },
        ...(current
          ? {
              worksFor: {
                "@type": "Organization",
                name: current.company,
              },
            }
          : {}),
        alumniOf,
        knowsAbout,
        sameAs: [linkedIn, github].filter(Boolean),
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteConfig.url}/#profile`,
        url: siteConfig.url,
        name: siteConfig.title,
        description: siteConfig.description,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: { "@id": `${siteConfig.url}/#person` },
        mainEntity: { "@id": `${siteConfig.url}/#person` },
        inLanguage: "en-US",
      },
    ],
  };
}

/**
 * Structured data for one project page.
 *
 * The homepage's job is to establish a person; a project page's job is to be
 * the page Google returns for the thing itself. So this describes the work as
 * an entity — SoftwareApplication where the project is something you can
 * install, CreativeWork otherwise — with the author tied back to the Person
 * node on the homepage by `@id`, so the two pages corroborate each other
 * instead of reading as unrelated documents.
 *
 * The breadcrumb is here rather than in markup because the page's own "Back to
 * projects" link is not a breadcrumb trail and shouldn't be mistaken for one.
 */
export function getProjectJsonLd(project: Project) {
  const pageUrl = `${siteConfig.url}/projects/${project.slug}`;
  const images = (project.gallery?.length ? project.gallery : [project.image]).map(
    (src) => `${siteConfig.url}${src}`,
  );

  const author = { "@id": `${siteConfig.url}/#person` };

  /**
   * An offer is what makes a SoftwareApplication listing eligible at all —
   * Google drops the entity without a price, and "free" has to be stated as
   * 0 rather than left out.
   */
  const application = project.software
    ? {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}/#software`,
        name: project.title,
        alternateName: project.subtitle,
        url: pageUrl,
        description: project.description,
        applicationCategory: project.software.applicationCategory,
        operatingSystem: project.software.operatingSystem,
        datePublished: project.software.datePublished,
        image: images[0],
        screenshot: images,
        ...(project.demoUrl ? { installUrl: project.demoUrl, downloadUrl: project.demoUrl } : {}),
        ...(project.keywords?.length ? { keywords: project.keywords.join(", ") } : {}),
        offers: {
          "@type": "Offer",
          price: project.software.price,
          priceCurrency: project.software.priceCurrency,
          availability: "https://schema.org/InStock",
        },
        author,
        creator: author,
      }
    : {
        "@type": "CreativeWork",
        "@id": `${pageUrl}/#work`,
        name: project.title,
        alternateName: project.subtitle,
        url: pageUrl,
        description: project.description,
        image: images[0],
        ...(project.keywords?.length ? { keywords: project.keywords.join(", ") } : {}),
        author,
        creator: author,
      };

  return {
    "@context": "https://schema.org",
    "@graph": [
      application,
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Work",
            item: `${siteConfig.url}/#projects`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}/#webpage`,
        url: pageUrl,
        name: `${project.title} | ${siteConfig.name}`,
        description: project.description,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: { "@id": application["@id"] },
        breadcrumb: { "@id": `${pageUrl}/#breadcrumb` },
        inLanguage: "en-US",
      },
    ],
  };
}
