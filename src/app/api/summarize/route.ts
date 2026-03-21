import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/posts";
import {
  contentHash,
  readSummaryCache,
  writeSummaryCache,
  type SummaryCache,
} from "@/lib/summaries";

export const runtime = "nodejs";
export const maxDuration = 30;

type ReqBody = {
  slug: string;
  force?: boolean;
  adminToken?: string;
};

function requireAdmin(body: ReqBody) {
  const required = process.env.ADMIN_TOKEN;
  if (!required) return; // not enabled
  if (!body.adminToken || body.adminToken !== required) {
    throw new Error("Unauthorized: missing/invalid adminToken");
  }
}

async function deepseekSummarize(params: { content: string; title: string }) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("Missing DEEPSEEK_API_KEY");

  const system =
    "你是一个中文博客编辑。你的任务是把文章总结成可读、可信、没有编造的摘要。";

  const user = `请把下面文章总结成严格 JSON（不要输出任何多余文字）：\n\n` +
    `{"bullets":["要点1","要点2","要点3","要点4","要点5"],"conclusion":"一句话结论"}\n\n` +
    `规则：\n` +
    `- bullets 必须正好 5 条，每条不超过 20 个中文字符\n` +
    `- conclusion 不超过 30 个中文字符\n` +
    `- 不要编造文章中不存在的信息\n\n` +
    `标题：${params.title}\n\n正文：\n${params.content}`;

  const resp = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`DeepSeek API error: ${resp.status} ${resp.statusText} ${text}`);
  }

  const data = (await resp.json()) as any;
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("DeepSeek API returned empty content");
  }

  // Sometimes models wrap JSON in ```json fences
  const cleaned = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned) as { bullets: unknown; conclusion: unknown };
  const bullets = Array.isArray(parsed.bullets) ? parsed.bullets.map(String) : [];
  const conclusion = typeof parsed.conclusion === "string" ? parsed.conclusion : "";

  if (bullets.length !== 5) throw new Error("Invalid summary JSON: bullets must be 5 items");
  return { bullets, conclusion };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ReqBody;
    if (!body?.slug) throw new Error("Missing slug");

    requireAdmin(body);

    const post = getPostBySlug(body.slug);
    const hash = contentHash(post.content);

    if (!body.force) {
      const cached = readSummaryCache(post.slug, hash);
      if (cached) return NextResponse.json({ ok: true, cached: true, ...cached });
    }

    const summary = await deepseekSummarize({ content: post.content, title: post.frontmatter.title });

    const payload: SummaryCache = {
      slug: post.slug,
      hash,
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
      summary,
      createdAt: new Date().toISOString(),
    };

    writeSummaryCache(payload);
    return NextResponse.json({ ok: true, cached: false, ...payload });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 400 },
    );
  }
}
