import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getPostBySlug, listPostSlugs } from "@/lib/posts";
import SummaryBox from "@/components/SummaryBox";
import { CatBlob } from "@/components/CuteAnimals";

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
    <div className="min-h-dvh">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link className="text-sm font-medium text-sky-800 hover:underline" href="/">
            ← 返回首页
          </Link>
          <div className="hidden sm:block h-10 w-10 opacity-80">
            <CatBlob className="h-full w-full" />
          </div>
        </div>

        <header className="rounded-3xl border border-sky-100 bg-white/70 p-6 shadow-sm backdrop-blur">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{post.frontmatter.title}</h1>
          <div className="mt-2 text-sm text-slate-500">{post.frontmatter.date}</div>
          {post.frontmatter.tags?.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.frontmatter.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-700 ring-1 ring-inset ring-sky-100"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        <section className="mt-6">
          <SummaryBox slug={post.slug} />
        </section>

        <article className="prose prose-slate mt-8 max-w-none rounded-3xl border border-sky-100 bg-white/70 p-7 shadow-sm backdrop-blur">
          {content}
        </article>
      </main>
    </div>
  );
}
