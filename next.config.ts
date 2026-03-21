import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We compile Markdown/MDX from /content using next-mdx-remote at runtime,
  // so we don't need Next's MDX file-loader pipeline.
};

export default nextConfig;
