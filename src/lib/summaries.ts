import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type SummaryCache = {
  slug: string;
  hash: string;
  model: string;
  summary: {
    bullets: string[];
    conclusion: string;
  };
  createdAt: string;
};

function getSummariesDirs() {
  const projectDir = path.join(/*turbopackIgnore: true*/ process.cwd(), "data", "summaries");
  const tmpDir = path.join("/tmp", "personal-blog-ai", "summaries");

  if (process.env.VERCEL === "1") {
    return { readDir: tmpDir, writeDir: tmpDir };
  }

  return { readDir: projectDir, writeDir: projectDir };
}

export function ensureSummariesDir() {
  const { writeDir } = getSummariesDirs();
  if (!fs.existsSync(writeDir)) fs.mkdirSync(writeDir, { recursive: true });
}

export function contentHash(content: string) {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex").slice(0, 16);
}

export function summaryCachePath(slug: string, hash: string, dir?: string) {
  const { readDir } = getSummariesDirs();
  return path.join(dir ?? readDir, `${slug}.${hash}.json`);
}

export function readSummaryCache(slug: string, hash: string): SummaryCache | null {
  const { readDir } = getSummariesDirs();
  const p = summaryCachePath(slug, hash, readDir);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8")) as SummaryCache;
  } catch {
    return null;
  }
}

export function writeSummaryCache(data: SummaryCache) {
  ensureSummariesDir();
  const { writeDir } = getSummariesDirs();
  const p = summaryCachePath(data.slug, data.hash, writeDir);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf8");
}
