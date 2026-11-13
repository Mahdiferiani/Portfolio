import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { getProjectsIndexJsonLd } from "@/lib/json-ld";
import { getDetailProjects } from "@/lib/projects";
import styles from "./ProjectsIndex.module.css";

/**
 * The hub at /projects.
 *
 * It exists for the link graph as much as for the reader. Before this page
 * each project had exactly one inbound internal link — a card inside the
 * home page's pinned reel, several screens down a route that is one long
 * document. A crawler that gave up on the home page early, or weighted a link
 * that deep accordingly, had no second path to the detail pages. This gives
 * every one of them a second, shallow route from a page whose whole subject
 * is the work.
 *
 * Deliberately a plain server component: no reel, no tilt, no reveal. The
 * home page already carries the motion, and the job here is to be a fast,
 * fully-formed document in the HTML with five real anchors in it.
 */
export default function ProjectsIndex() {
  const projects = getDetailProjects();
  const jsonLd = getProjectsIndexJsonLd(projects);

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main id="main" className={`container ${styles.content}`}>
        <header className={styles.head}>
          <p className="eyebrow">Work</p>
          <div className={styles.headTitle}>
            <h1 className="sectionTitle">Selected work</h1>
            <span className="sectionMarker" aria-hidden="true" />
          </div>
          <p className={styles.intro}>
            Five projects shipped end to end — a published Chrome extension, two
            cross-platform mobile apps, a full-stack adoption platform and an
            open-source AI tool. Each one has its own write-up covering what it
            does, how it was built and what it took to get it live.
          </p>
        </header>

        <ul className={styles.grid}>
          {projects.map((project, index) => (
            <li key={project.slug}>
              <Link href={`/projects/${project.slug}`} className={styles.card}>
                {project.imageStyle === "iconBackground" ? (
                  <div className={`${styles.media} ${styles.iconMedia}`}>
                    <Image
                      src={project.image}
                      alt={`${project.title} app icon`}
                      width={96}
                      height={96}
                      className={styles.appIcon}
                    />
                  </div>
                ) : (
                  <div className={styles.media}>
                    <Image
                      src={project.image}
                      alt={`${project.title} cover`}
                      width={640}
                      height={400}
                      className={styles.image}
                    />
                  </div>
                )}

                <div className={styles.body}>
                  <i className={styles.index}>
                    {String(index + 1).padStart(2, "0")}
                    {project.company ? ` · ${project.company}` : ""}
                  </i>
                  {/* h2 under the page's single h1 — the hub is a list of
                      things, and each entry is a heading in that list. */}
                  <h2 className={styles.cardTitle}>{project.title}</h2>
                  {project.subtitle && (
                    <p className={styles.subtitle}>{project.subtitle}</p>
                  )}
                  {project.description && (
                    <p className={styles.description}>{project.description}</p>
                  )}
                  <span className={styles.cta}>
                    View project
                    <span aria-hidden="true">&#8599;</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <Link href="/#contact" className={styles.contactButton}>
            Get in touch
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
