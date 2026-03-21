import Link from "next/link";
import { listPosts } from "@/lib/posts";

export default function Home() {
  const posts = listPosts().sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">我的博客</h1>
          <p className="mt-2 text-zinc-600">Markdown 写作 + 点击生成 DeepSeek 摘要（带缓存）</p>
        </header>

        <section className="space-y-4">
          {posts.map((p) => (
            <article key={p.slug} className="rounded-xl border bg-white p-5">
              <h2 className="text-xl font-semibold">
                <Link className="hover:underline" href={`/posts/${p.slug}`}>
                  {p.frontmatter.title}
                </Link>
              </h2>
              <div className="mt-1 text-sm text-zinc-500">{p.frontmatter.date}</div>
              {p.frontmatter.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.frontmatter.tags.map((t) => (
                    <span key={t} className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}

          {!posts.length ? (
            <div className="text-zinc-600">
              还没有文章。把 Markdown 放到 <code className="rounded bg-zinc-100 px-1">content/posts</code> 里即可。
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
