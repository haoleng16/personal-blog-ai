import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import DocsSidebar from "@/components/DocsSidebar";
import SummaryBox from "@/components/SummaryBox";
import { getAdjacentPosts, getPostBySlug, listPostSlugs } from "@/lib/posts";

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

  const { previous, next } = getAdjacentPosts(slug);

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
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <DocsSidebar currentSlug={slug} />
          </div>

          <div className="space-y-6">
            <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <Link href="/" className="font-medium text-sky-700 hover:underline">
                  Docs
                </Link>
                <span>/</span>
                <span>{post.frontmatter.section || "未分类"}</span>
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                {post.frontmatter.title}
              </h1>
              <div className="mt-3 text-sm text-slate-500">{post.frontmatter.date}</div>
              {post.frontmatter.tags?.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {post.frontmatter.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs text-sky-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
              {post.frontmatter.description ? (
                <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
                  {post.frontmatter.description}
                </p>
              ) : null}
            </header>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <SummaryBox slug={post.slug} />
            </section>

            <article className="docs-prose rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              {content}
            </article>

            <nav className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-xs uppercase tracking-[0.14em] text-slate-400">上一篇</div>
                {previous ? (
                  <Link href={`/posts/${previous.slug}`} className="mt-2 block text-sm font-medium text-slate-900 hover:text-sky-700">
                    {previous.frontmatter.title}
                  </Link>
                ) : (
                  <div className="mt-2 text-sm text-slate-400">没有了</div>
                )}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-xs uppercase tracking-[0.14em] text-slate-400">下一篇</div>
                {next ? (
                  <Link href={`/posts/${next.slug}`} className="mt-2 block text-sm font-medium text-slate-900 hover:text-sky-700">
                    {next.frontmatter.title}
                  </Link>
                ) : (
                  <div className="mt-2 text-sm text-slate-400">没有了</div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}
