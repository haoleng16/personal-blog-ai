import Link from "next/link";
import DocsSidebar from "@/components/DocsSidebar";
import { getGroupedPosts } from "@/lib/posts";

export default function Home() {
  const groups = getGroupedPosts();
  const totalPosts = groups.reduce((sum, group) => sum + group.posts.length, 0);
  const firstPost = groups[0]?.posts[0];

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <DocsSidebar />
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-6">
              <div className="inline-flex rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-medium text-sky-700">
                Docs Home
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">文档中心</h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                现在这个站点已经调整为文档页风格：文章继续使用 Markdown 编写，左侧按层级分组导航，右侧展示正文，整体更接近知识库 / Docs 的阅读体验。
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">{groups.length} 个分组</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">{totalPosts} 篇文档</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">Markdown 驱动</span>
              </div>
              {firstPost ? (
                <div className="mt-6">
                  <Link
                    href={`/posts/${firstPost.slug}`}
                    className="inline-flex items-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
                  >
                    开始阅读
                  </Link>
                </div>
              ) : null}
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {groups.map((group) => (
                <section key={group.section} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h2 className="text-lg font-semibold text-slate-900">{group.section}</h2>
                  <ul className="mt-4 space-y-3">
                    {group.posts.map((post) => (
                      <li key={post.slug}>
                        <Link href={`/posts/${post.slug}`} className="group block rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100 transition hover:ring-sky-200">
                          <div className="font-medium text-slate-900 group-hover:text-sky-700">
                            {post.frontmatter.title}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">{post.frontmatter.date}</div>
                          {post.frontmatter.description ? (
                            <p className="mt-2 text-sm leading-6 text-slate-600">{post.frontmatter.description}</p>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
