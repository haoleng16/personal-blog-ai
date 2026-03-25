import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostFrontmatter = {
  title: string;
  date: string;
  tags?: string[];
  section?: string;
  order?: number;
  description?: string;
};

export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
};

export type PostGroup = {
  section: string;
  posts: Array<Omit<Post, "content">>;
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
      section: typeof fm.section === "string" ? fm.section : undefined,
      order: typeof fm.order === "number" ? fm.order : undefined,
      description: typeof fm.description === "string" ? fm.description : undefined,
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

function comparePosts(a: Omit<Post, "content">, b: Omit<Post, "content">) {
  const orderA = a.frontmatter.order ?? Number.MAX_SAFE_INTEGER;
  const orderB = b.frontmatter.order ?? Number.MAX_SAFE_INTEGER;

  if (orderA !== orderB) return orderA - orderB;
  if (a.frontmatter.date !== b.frontmatter.date) {
    return a.frontmatter.date < b.frontmatter.date ? 1 : -1;
  }
  return a.frontmatter.title.localeCompare(b.frontmatter.title, "zh-CN");
}

export function getGroupedPosts(): PostGroup[] {
  const groups = new Map<string, Array<Omit<Post, "content">>>();

  for (const post of listPosts()) {
    const section = post.frontmatter.section || "未分类";
    if (!groups.has(section)) groups.set(section, []);
    groups.get(section)!.push(post);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b, "zh-CN"))
    .map(([section, posts]) => ({
      section,
      posts: posts.sort(comparePosts),
    }));
}

export function getAdjacentPosts(slug: string) {
  const ordered = listPosts().sort(comparePosts);
  const index = ordered.findIndex((post) => post.slug === slug);
  return {
    previous: index > 0 ? ordered[index - 1] : null,
    next: index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}
