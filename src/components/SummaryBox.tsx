"use client";

import { useMemo, useState } from "react";

type ApiResp =
  | {
      ok: true;
      cached: boolean;
      slug: string;
      hash: string;
      model: string;
      summary: { bullets: string[]; conclusion: string };
    }
  | { ok: false; error: string };

export default function SummaryBox({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResp | null>(null);

  const bullets = useMemo(() => (data && data.ok ? data.summary.bullets : []), [data]);

  async function run(force = false) {
    setLoading(true);
    try {
      const adminToken = (window as any).__ADMIN_TOKEN__ as string | undefined;
      const resp = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, force, adminToken }),
      });
      const json = (await resp.json()) as ApiResp;
      setData(json);
    } catch (e: any) {
      setData({ ok: false, error: e?.message || String(e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="editorial-kicker text-[var(--muted-foreground)]">AI Layer</div>
          <div className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">内容摘要</div>
          {data && data.ok ? (
            <div className="mt-1 text-xs text-[var(--muted-foreground)]">
              model: {data.model} · {data.cached ? "cached" : "fresh"}
            </div>
          ) : (
            <div className="mt-1 text-xs text-[var(--muted-foreground)]">按需生成，不让 AI 组件抢掉内容本身的视觉主导权。</div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            className="rounded-full border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-slate-950 transition hover:brightness-110 disabled:opacity-60"
            onClick={() => run(false)}
            disabled={loading}
          >
            {loading ? "生成中…" : "生成摘要"}
          </button>
          <button
            className="rounded-full border border-[var(--border-strong)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-muted)] disabled:opacity-60"
            onClick={() => run(true)}
            disabled={loading}
          >
            强制刷新
          </button>
        </div>
      </div>

      {data && !data.ok ? <div className="mt-4 text-sm text-red-400">{data.error}</div> : null}

      {data && data.ok ? (
        <div className="mt-5 space-y-4">
          <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-[var(--foreground)]">
            {bullets.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
          <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm leading-7 text-[var(--foreground)]">
            <span className="font-semibold">结论：</span>
            {data.summary.conclusion}
          </div>
        </div>
      ) : null}
    </div>
  );
}
