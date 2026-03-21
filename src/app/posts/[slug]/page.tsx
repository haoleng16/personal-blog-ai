import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getPostBySlug, listPostSlugs } from "@/lib/posts";
import SummaryBox from "@/components/SummaryBox";

export function generateStaticParams() {
  return listPostSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { content } = await compileMDX({
    source: post.content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [],
      },
    },
  });

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link className="text-sm text-zinc-600 hover:underline" href="/">
          ← 返回首页
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight">{post.frontmatter.title}</h1>
          <div className="mt-2 text-sm text-zinc-500">{post.frontmatter.date}</div>
        </header>

        <section className="mt-6">
          <SummaryBox slug={post.slug} />
        </section>

        <article className="prose prose-zinc mt-8 max-w-none rounded-xl border bg-white p-6">
          {content}
        </article>
      </main>
    </div>
  );
}
