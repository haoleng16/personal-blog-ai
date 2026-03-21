import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostFrontmatter = {
  title: string;
  date: string;
  tags?: string[];
};

export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export function listPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.(md|mdx)$/, ""))
    .sort();
}

export function getPostBySlug(slug: string): Post {
  const mdPath = path.join(POSTS_DIR, `${slug}.md`);
  const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);

  const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath;
  if (!fs.existsSync(filePath)) {
    throw new Error(`Post not found: ${slug}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);

  const fm = parsed.data as Partial<PostFrontmatter>;
  if (!fm.title || !fm.date) {
    throw new Error(`Missing required frontmatter (title/date) in ${filePath}`);
  }

  return {
    slug,
    frontmatter: {
      title: fm.title,
      date: fm.date,
      tags: Array.isArray(fm.tags) ? (fm.tags as string[]) : undefined,
    },
    content: parsed.content.trim(),
  };
}

export function listPosts(): Array<Omit<Post, "content">> {
  return listPostSlugs().map((slug) => {
    const { content: _content, ...rest } = getPostBySlug(slug);
    return rest;
  });
}
