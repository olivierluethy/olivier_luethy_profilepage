import { absoluteUrl } from "@/lib/metadata";
import { site, socials } from "@/lib/site";
import type { BlogPost, Project } from "@/lib/content/types";

/** Drops placeholder URLs so they never end up in structured data. */
function realUrls(urls: readonly string[]): string[] {
  return urls.filter((url) => url && !url.includes("[["));
}

/** `Person` for the homepage. */
export function personSchema(): Record<string, unknown> {
  const sameAs = realUrls(socials.map((social) => social.href));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: absoluteUrl("/"),
    jobTitle: site.jobTitle,
    description: site.description,
    email: `mailto:${site.email}`,
    image: absoluteUrl(site.profileImage),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/**
 * `SoftwareApplication` for a project.
 *
 * Projects here are shipped applications, which SoftwareApplication describes
 * far more precisely than the generic CreativeWork.
 */
export function projectSchema(project: Project): Record<string, unknown> {
  const { frontmatter } = project;
  const sameAs = realUrls([frontmatter.githubUrl, frontmatter.linkedinPostUrl]);
  const liveUrl = realUrls([frontmatter.liveUrl])[0];

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: frontmatter.title,
    description: frontmatter.summary,
    url: absoluteUrl(`/projects/${frontmatter.slug}`),
    applicationCategory: "DeveloperApplication",
    operatingSystem: frontmatter.techStack.join(", "),
    author: { "@type": "Person", name: site.name, url: absoluteUrl("/") },
    keywords: frontmatter.tags.join(", "),
    dateCreated: frontmatter.startDate,
    ...(frontmatter.endDate ? { dateModified: frontmatter.endDate } : {}),
    ...(frontmatter.coverImage
      ? { image: absoluteUrl(frontmatter.coverImage) }
      : {}),
    ...(liveUrl ? { installUrl: liveUrl } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** `BlogPosting` for a post. */
export function blogPostingSchema(post: BlogPost): Record<string, unknown> {
  const { frontmatter } = post;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.summary,
    url: absoluteUrl(`/blog/${frontmatter.slug}`),
    mainEntityOfPage: absoluteUrl(`/blog/${frontmatter.slug}`),
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: { "@type": "Person", name: site.name, url: absoluteUrl("/") },
    publisher: { "@type": "Person", name: site.name },
    keywords: frontmatter.tags.join(", "),
    ...(frontmatter.coverImage
      ? { image: absoluteUrl(frontmatter.coverImage) }
      : {}),
  };
}
