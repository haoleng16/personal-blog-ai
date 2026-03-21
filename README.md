# Personal Blog + AI Summary (DeepSeek)

- 写作：`content/posts/*.md(x)`
- 功能：文章页点击按钮生成 AI 摘要（DeepSeek），并缓存到 `data/summaries/*.json`
- 目标：个人博客、低成本（强缓存 + 手动触发）

## 1) 配置环境变量

创建 `.env.local`：

```bash
DEEPSEEK_API_KEY=你的key
# 可选：不写就默认 deepseek-chat
DEEPSEEK_MODEL=deepseek-chat

# 可选：开启后，调用 /api/summarize 必须传 adminToken
# ADMIN_TOKEN=随便一个长字符串
```

## 2) 写文章

把文章放到：

- `content/posts/hello-world.md`

Frontmatter 至少包含：

```md
---
title: "标题"
date: "2026-03-21"
---
```

## 3) 本地运行

```bash
npm run dev
```

打开 http://localhost:3000

## 4) 摘要缓存说明

- 缓存 key = `slug + sha256(content)`
- 文章内容没变：重复点击会直接读缓存（省钱）
- 文章内容变了：hash 变，会生成新摘要

## 5) Vercel 部署（方案 A）

这个项目可以直接部署到 Vercel。

### 必填环境变量

在 Vercel 项目设置里添加：

- `DEEPSEEK_API_KEY` = 你的 DeepSeek Key
- `DEEPSEEK_MODEL` = `deepseek-chat`（或你想用的模型）

可选：

- `ADMIN_TOKEN` = 一段长随机字符串
  - 如果设置了它，调用 `/api/summarize` 时必须带上 `adminToken`
  - 当前前端会尝试读取 `window.__ADMIN_TOKEN__`，如果你不打算开放“强制刷新/生成”给所有人，建议后续再补一个更正式的鉴权方案

### 关于缓存

- 本地开发：摘要缓存写入 `data/summaries/*.json`
- Vercel 线上：摘要缓存写入 `/tmp/personal-blog-ai/summaries/*.json`
- **注意**：Vercel 的 `/tmp` 是临时缓存，不保证跨实例、跨部署持久保存

如果你想让缓存长期保留，建议后续改成：

- Upstash Redis
- Vercel KV / Blob
- Supabase / PostgreSQL
- 或者本地提前生成 `data/summaries/*.json` 后一起提交到 Git

### Vercel 一键流程

1. 把代码推到 GitHub
2. 在 Vercel 导入该 GitHub 仓库
3. 在 Vercel 添加上面的环境变量
4. 点击 Deploy

### GitHub + Vercel 具体命令

下面假设你已经安装并登录了 GitHub CLI（`gh`），并且有权限创建 GitHub 仓库。

```bash
cd /Users/mac/Projects/personal-blog-ai

# 1) 确认 .env.local 不会被提交
cat .gitignore

# 2) 查看当前改动
git status

# 3) 提交代码
git add .
git commit -m "chore: prepare app for vercel deployment"

# 4) 在 GitHub 创建远程仓库并推送
# 如果想建私有仓库，把 --public 改成 --private
gh repo create personal-blog-ai --source=. --remote=origin --push --public
```

### 在 Vercel 上连接部署

#### 方法 1：网页最省事（推荐）

> 这一步需要你自己登录 GitHub / Vercel，属于必须人工完成的凭证步骤。

1. 打开 <https://vercel.com/new>
2. 选择 GitHub 仓库 `personal-blog-ai`
3. Framework Preset 保持 `Next.js`
4. 点击 **Environment Variables**，添加：
   - `DEEPSEEK_API_KEY`
   - `DEEPSEEK_MODEL=deepseek-chat`
   - 可选：`ADMIN_TOKEN`
5. 点击 **Deploy**

#### 方法 2：Vercel CLI

> 同样需要你先登录 Vercel，属于必须人工完成的凭证步骤。

```bash
cd /Users/mac/Projects/personal-blog-ai
vercel
```

按提示操作：

- Link to existing project? 选 `N`
- Set up and deploy? 选 `Y`
- Project name: `personal-blog-ai`

然后设置环境变量：

```bash
vercel env add DEEPSEEK_API_KEY production
vercel env add DEEPSEEK_MODEL production
# 可选
vercel env add ADMIN_TOKEN production

# 如果还要给预览环境也配一份：
vercel env add DEEPSEEK_API_KEY preview
vercel env add DEEPSEEK_MODEL preview
# 可选
vercel env add ADMIN_TOKEN preview
```

设置完后重新部署：

```bash
vercel --prod
```

## 6) 部署建议（尽量省钱）

- 直接部署到 Vercel 没问题，但要把 `DEEPSEEK_API_KEY` 配到 Vercel 环境变量
- 更省钱/更稳的做法：
  - 本地生成好摘要（点击或写个脚本批量生成）
  - 把 `data/summaries/*.json` 一起提交到 git
  - 线上只做展示，减少大模型调用
