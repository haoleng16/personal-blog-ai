import Link from "next/link";
import { listPosts } from "@/lib/posts";
import { CatBlob, WhaleBlob } from "@/components/CuteAnimals";

export default function Home() {
  const posts = listPosts().sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));

  return (
    <div className="min-h-dvh">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <header className="relative overflow-hidden rounded-3xl border border-sky-100 bg-white/70 p-8 shadow-sm backdrop-blur">
          <div className="pointer-events-none absolute -right-6 -top-10 h-40 w-40 opacity-80">
            <CatBlob className="h-full w-full" />
          </div>
          <div className="pointer-events-none absolute -left-8 bottom-0 h-32 w-32 opacity-80">
            <WhaleBlob className="h-full w-full" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              淡蓝主题 · 可爱小动物 · AI 摘要
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
              我的博客
            </h1>
            <p className="mt-2 max-w-xl text-slate-600">
              Markdown 写作 + 点击生成 DeepSeek 摘要（带缓存）。不搞花活，但要好看、好用。
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-700"
                href="#posts"
              >
                看文章
              </a>
              <Link
                className="rounded-xl border border-sky-200 bg-white/60 px-4 py-2 text-sm font-medium text-sky-800 hover:bg-sky-50"
                href="/posts/openclaw-browser-automation-247"
              >
                读一篇示例
              </Link>
            </div>
          </div>
        </header>

        <section id="posts" className="mt-10 space-y-4">
          {posts.map((p) => (
            <article
              key={p.slug}
              className="group rounded-2xl border border-sky-100 bg-white/70 p-5 shadow-sm backdrop-blur hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                <Link className="hover:underline decoration-sky-400" href={`/posts/${p.slug}`}>
                  {p.frontmatter.title}
                </Link>
              </h2>
              <div className="mt-1 text-sm text-slate-500">{p.frontmatter.date}</div>
              {p.frontmatter.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.frontmatter.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-sky-50 px-3 py-1 text-xs text-sky-700 ring-1 ring-inset ring-sky-100"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          ))}

          {!posts.length ? (
            <div className="rounded-2xl border border-sky-100 bg-white/70 p-6 text-slate-600">
              还没有文章。把 Markdown 放到{" "}
              <code className="rounded bg-sky-50 px-1">content/posts</code> 里即可。
            </div>
          ) : null}
        </section>

        <footer className="mt-12 text-center text-xs text-slate-500">
          <span className="rounded-full bg-white/60 px-3 py-1 ring-1 ring-inset ring-sky-100">
            Built with Next.js + Tailwind · Theme: sky
          </span>
        </footer>
      </main>
    </div>
  );
}
