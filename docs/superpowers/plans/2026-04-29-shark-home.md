# Shark Home 个人主页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal tech blog + portfolio site with dark terminal aesthetic, using Astro 5 + Tailwind CSS 4, all content in Chinese.

**Architecture:** Multi-page static site (SSG) with Astro Content Collections for blog posts and project entries. Tailwind CSS 4 with custom dark theme defined in CSS via `@theme`. Zero client-side JavaScript. All content managed through Markdown files.

**Tech Stack:** Astro 5, Tailwind CSS 4 (`@tailwindcss/vite`), TypeScript, Zod (via `astro/zod`)

**Design Spec:** [docs/superpowers/specs/2026-04-29-shark-home-design.md](docs/superpowers/specs/2026-04-29-shark-home-design.md)

---

## File Structure

```
shark-home/
├── src/
│   ├── config.ts                  # Site-wide config (author, links)
│   ├── content.config.ts          # Content Collections schema definitions
│   ├── blog/                      # Blog Markdown files
│   │   └── hello-world.md
│   ├── projects/                  # Project Markdown files
│   │   └── sample-project.md
│   ├── layouts/
│   │   ├── BaseLayout.astro       # HTML shell, nav, footer, meta
│   │   └── PostLayout.astro       # Detail page layout for blog/project
│   ├── components/
│   │   ├── Navbar.astro           # Top navigation bar
│   │   ├── Footer.astro           # Site footer
│   │   ├── ProjectCard.astro      # Project preview card
│   │   ├── PostCard.astro         # Blog post preview card
│   │   ├── TagBadge.astro         # Tag pill component
│   │   └── TerminalIntro.astro    # Hero terminal window
│   ├── pages/
│   │   ├── index.astro            # Homepage
│   │   ├── about.astro            # About page
│   │   ├── projects/
│   │   │   ├── index.astro        # Projects list
│   │   │   └── [id].astro         # Project detail
│   │   └── blog/
│   │       ├── index.astro        # Blog list
│   │       └── [id].astro         # Blog post detail
│   └── styles/
│       └── global.css             # Tailwind import + custom theme
├── public/
│   └── favicon.svg
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json` (via `npm create astro`)
- Create: `astro.config.mjs`
- Create: `src/styles/global.css`
- Create: `src/config.ts`
- Create: `src/content.config.ts`
- Create: `tsconfig.json`
- Create: `public/favicon.svg`

- [ ] **Step 1: Create Astro project**

```bash
cd e:/Workspace/Personal/Code/shark-home
npm create astro@latest . -- --template minimal --install --typescript strict --no-git
```

Choose: `. ` (current directory), `minimal` template, `strict` TypeScript, install dependencies, skip git init (we'll handle that).

- [ ] **Step 2: Install Tailwind CSS 4**

```bash
npm install tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Configure `astro.config.mjs`**

Replace the generated `astro.config.mjs` with:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://shark.dev',
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
```

- [ ] **Step 4: Create `src/styles/global.css`**

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-bg: #0d1117;
  --color-surface: #161b22;
  --color-border: #30363d;
  --color-text: #c9d1d9;
  --color-text-muted: #8b949e;
  --color-accent: #58a6ff;
  --color-green: #7ee787;
  --color-purple: #d2a8ff;

  --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
}

html {
  font-family: var(--font-sans);
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.7;
}

body {
  min-height: 100vh;
}

::selection {
  background-color: var(--color-accent);
  color: var(--color-bg);
}

a {
  color: var(--color-accent);
  text-decoration: none;
  transition: opacity 0.2s;
}

a:hover {
  opacity: 0.8;
}

/* Markdown content styling */
.prose h1, .prose h2, .prose h3, .prose h4 {
  color: var(--color-text);
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.prose h1 { font-size: 1.875rem; }
.prose h2 { font-size: 1.5rem; }
.prose h3 { font-size: 1.25rem; }

.prose p {
  margin-bottom: 1em;
}

.prose ul, .prose ol {
  margin-bottom: 1em;
  padding-left: 1.5em;
}

.prose li {
  margin-bottom: 0.25em;
}

.prose code {
  font-family: var(--font-mono);
  background-color: var(--color-surface);
  padding: 0.125em 0.375em;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.prose pre {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1em;
}

.prose pre code {
  background: none;
  padding: 0;
}

.prose blockquote {
  border-left: 3px solid var(--color-accent);
  padding-left: 1rem;
  color: var(--color-text-muted);
  margin-bottom: 1em;
}

.prose img {
  border-radius: 0.5rem;
  max-width: 100%;
}

.prose hr {
  border-color: var(--color-border);
  margin: 2em 0;
}
```

- [ ] **Step 5: Create `src/config.ts`**

```ts
export const siteConfig = {
  title: "Shark's Space",
  description: "全栈开发者 · 热爱开源",
  author: "Shark",
  github: "https://github.com/shark",
  email: "shark@example.com",
};
```

- [ ] **Step 6: Create `src/content.config.ts`**

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    techStack: z.array(z.string()).default([]),
    github: z.string().optional(),
    demo: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = { blog, projects };
```

- [ ] **Step 7: Create `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#0d1117"/>
  <text x="32" y="44" font-family="monospace" font-size="32" fill="#58a6ff" text-anchor="middle">S</text>
</svg>
```

- [ ] **Step 8: Verify build works**

```bash
npm run build
```

Expected: Build succeeds, output in `dist/` directory.

- [ ] **Step 9: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Astro 5 + Tailwind CSS 4 project"
```

---

### Task 2: Base Layout, Navbar, and Footer

**Files:**
- Create: `src/components/Navbar.astro`
- Create: `src/components/Footer.astro`
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create `src/components/Navbar.astro`**

```astro
---
import { siteConfig } from '../config';

const navLinks = [
  { href: '/', label: '~/shark' },
  { href: '/projects', label: '项目' },
  { href: '/blog', label: '博客' },
  { href: '/about', label: '关于' },
];

const currentPath = Astro.url.pathname;
---

<nav class="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-sm">
  <div class="mx-auto max-w-4xl flex items-center justify-between px-6 py-3">
    <a href="/" class="font-mono text-accent font-semibold text-lg hover:opacity-100">
      {siteConfig.author}
    </a>

    <!-- Desktop nav -->
    <div class="hidden sm:flex items-center gap-1">
      {navLinks.map((link) => (
        <a
          href={link.href}
          class:list={[
            'px-3 py-1.5 rounded-md font-mono text-sm transition-colors',
            currentPath === link.href || (link.href !== '/' && currentPath.startsWith(link.href))
              ? 'bg-surface text-accent'
              : 'text-text-muted hover:text-text hover:bg-surface/50',
          ]}
        >
          {link.label}
        </a>
      ))}
    </div>

    <!-- Mobile hamburger -->
    <button
      id="mobile-menu-btn"
      class="sm:hidden text-text-muted hover:text-text p-1"
      aria-label="菜单"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12h18M3 6h18M3 18h18" />
      </svg>
    </button>
  </div>

  <!-- Mobile menu (hidden by default) -->
  <div id="mobile-menu" class="hidden sm:hidden border-t border-border bg-bg px-6 py-3">
    {navLinks.map((link) => (
      <a
        href={link.href}
        class:list={[
          'block py-2 font-mono text-sm',
          currentPath === link.href ? 'text-accent' : 'text-text-muted',
        ]}
      >
        {link.label}
      </a>
    ))}
  </div>
</nav>

<script is:inline>
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }
</script>
```

- [ ] **Step 2: Create `src/components/Footer.astro`**

```astro
---
import { siteConfig } from '../config';
const year = new Date().getFullYear();
---

<footer class="border-t border-border mt-16">
  <div class="mx-auto max-w-4xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-text-muted text-sm">
    <div class="font-mono">
      <span class="text-green">&copy;</span> {year} {siteConfig.author}
    </div>
    <div class="flex items-center gap-4">
      <a href={siteConfig.github} target="_blank" rel="noopener" class="hover:text-accent">
        GitHub
      </a>
      <a href={`mailto:${siteConfig.email}`} class="hover:text-accent">
        邮箱
      </a>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Create `src/layouts/BaseLayout.astro`**

```astro
---
import { siteConfig } from '../config';
import Navbar from '../components/Navbar.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
}

const {
  title = siteConfig.title,
  description = siteConfig.description,
} = Astro.props;

const pageTitle = title === siteConfig.title ? title : `${title} | ${siteConfig.author}`;
---

<!doctype html>
<html lang="zh-CN" class="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content={description} />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
  <title>{pageTitle}</title>
</head>
<body class="flex flex-col min-h-screen">
  <Navbar />
  <main class="flex-1 mx-auto w-full max-w-4xl px-6 py-10">
    <slot />
  </main>
  <Footer />
</body>
</html>
```

- [ ] **Step 4: Create placeholder `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout>
  <h1 class="text-2xl font-mono text-accent">// 欢迎来到 Shark's Space</h1>
  <p class="text-text-muted mt-4">页面建设中...</p>
</BaseLayout>
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/components/ src/layouts/ src/pages/ src/styles/
git commit -m "feat: add base layout, navbar, and footer"
```

---

### Task 3: TagBadge and Reusable Components

**Files:**
- Create: `src/components/TagBadge.astro`
- Create: `src/components/ProjectCard.astro`
- Create: `src/components/PostCard.astro`
- Create: `src/components/TerminalIntro.astro`

- [ ] **Step 1: Create `src/components/TagBadge.astro`**

```astro
---
interface Props {
  label: string;
  variant?: 'green' | 'purple' | 'accent';
}

const { label, variant = 'accent' } = Astro.props;

const colorMap = {
  green: 'bg-green/10 text-green',
  purple: 'bg-purple/10 text-purple',
  accent: 'bg-accent/10 text-accent',
};
---

<span class:list={['inline-block px-2 py-0.5 rounded text-xs font-mono', colorMap[variant]]}>
  {label}
</span>
```

- [ ] **Step 2: Create `src/components/ProjectCard.astro`**

```astro
---
import TagBadge from './TagBadge.astro';
import type { CollectionEntry } from 'astro:content';

interface Props {
  project: CollectionEntry<'projects'>;
}

const { project } = Astro.props;
const { title, description, techStack, github, demo } = project.data;
---

<div class="group border border-border rounded-lg bg-surface p-5 transition-all hover:border-accent/50 hover:shadow-[0_0_15px_rgba(88,166,255,0.1)]">
  <h3 class="text-lg font-semibold text-text mb-2">
    <a href={`/projects/${project.id}/`} class="hover:text-accent">
      {title}
    </a>
  </h3>
  <p class="text-text-muted text-sm mb-3">{description}</p>
  <div class="flex flex-wrap gap-1.5 mb-3">
    {techStack.map((tech: string) => (
      <TagBadge label={tech} variant="green" />
    ))}
  </div>
  <div class="flex items-center gap-3 text-xs font-mono text-text-muted">
    {github && (
      <a href={github} target="_blank" rel="noopener" class="hover:text-accent">
        GitHub →
      </a>
    )}
    {demo && (
      <a href={demo} target="_blank" rel="noopener" class="hover:text-accent">
        Demo →
      </a>
    )}
  </div>
</div>
```

- [ ] **Step 3: Create `src/components/PostCard.astro`**

```astro
---
import TagBadge from './TagBadge.astro';
import type { CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'blog'>;
}

const { post } = Astro.props;
const { title, date, tags, summary } = post.data;

const dateStr = date.toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
---

<article class="group py-4 border-b border-border last:border-b-0">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
    <a href={`/blog/${post.id}/`} class="text-text hover:text-accent font-medium">
      {title}
    </a>
    <time class="text-text-muted text-sm font-mono shrink-0" datetime={date.toISOString()}>
      {dateStr}
    </time>
  </div>
  <p class="text-text-muted text-sm mb-2">{summary}</p>
  <div class="flex flex-wrap gap-1.5">
    {tags.map((tag: string) => (
      <TagBadge label={tag} variant="purple" />
    ))}
  </div>
</article>
```

- [ ] **Step 4: Create `src/components/TerminalIntro.astro`**

```astro
---
import { siteConfig } from '../config';
---

<div class="border border-border rounded-lg bg-surface overflow-hidden">
  <!-- Terminal title bar -->
  <div class="flex items-center gap-2 px-4 py-2.5 bg-bg border-b border-border">
    <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
    <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
    <div class="w-3 h-3 rounded-full bg-green/80"></div>
    <span class="ml-2 text-text-muted text-xs font-mono">~/{siteConfig.author.toLowerCase()}</span>
  </div>
  <!-- Terminal body -->
  <div class="p-5 font-mono text-sm leading-relaxed">
    <div class="text-green mb-1">$ whoami</div>
    <div class="text-text mb-3">
      > {siteConfig.description}
    </div>
    <div class="text-green mb-1">$ cat intro.txt</div>
    <div class="text-text-muted">
      > 你好，我是 {siteConfig.author}，一名热爱技术与开源的全栈开发者。<br />
      > 这里是我的数字花园，记录项目、思考与学习笔记。
    </div>
  </div>
</div>
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/components/
git commit -m "feat: add TagBadge, ProjectCard, PostCard, and TerminalIntro components"
```

---

### Task 4: Sample Content

**Files:**
- Create: `src/blog/hello-world.md`
- Create: `src/projects/sample-project.md`

- [ ] **Step 1: Create `src/blog/hello-world.md`**

```markdown
---
title: "你好，世界"
date: 2025-01-01
tags: ["随笔", "Astro"]
summary: "这是我的第一篇博客，记录建站的心路历程。"
draft: false
---

## 为什么建这个博客？

作为一名开发者，我一直想要一个属于自己的空间来记录技术思考和学习笔记。

## 技术选型

这个博客使用了以下技术：

- **Astro** — 极速的静态站点生成器
- **Tailwind CSS** — 实用优先的 CSS 框架
- **Markdown** — 简洁的写作格式

```typescript
const greeting = "你好，世界！";
console.log(greeting);
```

## 未来计划

- 写更多技术文章
- 展示个人项目
- 分享开源经验
```

- [ ] **Step 2: Create `src/projects/sample-project.md`**

```markdown
---
title: "Shark Home"
description: "我的个人主页，使用 Astro + Tailwind CSS 构建"
techStack: ["Astro", "Tailwind CSS", "TypeScript"]
github: "https://github.com/shark/shark-home"
featured: true
order: 1
---

## 简介

这是你现在看到的这个网站！一个极客风格的个人主页，包含博客、项目展示和自我介绍。

## 功能特性

- 暗色终端美学风格
- 响应式设计，适配各种设备
- Markdown 写博客和项目介绍
- 零 JavaScript 运行时，加载速度极快

## 技术细节

使用 Astro 5 的 Content Collections 管理内容，Tailwind CSS 4 的 `@theme` 自定义暗色配色。全部静态生成，无需服务端。
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds. Content files are processed without errors.

- [ ] **Step 4: Commit**

```bash
git add src/blog/ src/projects/
git commit -m "feat: add sample blog post and project content"
```

---

### Task 5: Homepage

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Build the homepage**

Replace `src/pages/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import TerminalIntro from '../components/TerminalIntro.astro';
import ProjectCard from '../components/ProjectCard.astro';
import PostCard from '../components/PostCard.astro';

const featuredProjects = (await getCollection('projects', ({ data }) => {
  return data.featured === true;
})).sort((a, b) => a.data.order - b.data.order);

const latestPosts = (await getCollection('blog', ({ data }) => {
  return import.meta.env.PROD ? data.draft !== true : true;
})).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf()).slice(0, 3);
---

<BaseLayout>
  <section class="mb-12">
    <TerminalIntro />
  </section>

  <section class="mb-12">
    <h2 class="text-lg font-mono text-accent mb-4">
      <span class="text-green">//</span> 精选项目
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {featuredProjects.map((project) => (
        <ProjectCard project={project} />
      ))}
    </div>
  </section>

  <section>
    <h2 class="text-lg font-mono text-accent mb-4">
      <span class="text-green">//</span> 最新文章
    </h2>
    <div>
      {latestPosts.map((post) => (
        <PostCard post={post} />
      ))}
    </div>
    {latestPosts.length > 0 && (
      <a href="/blog/" class="inline-block mt-4 text-sm font-mono text-accent">
        查看全部文章 →
      </a>
    )}
  </section>
</BaseLayout>
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds. Homepage renders with sample content.

- [ ] **Step 3: Preview in browser**

```bash
npm run preview
```

Open the URL shown. Verify: terminal intro displays, sample project card shows, hello-world post card shows.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: build homepage with terminal intro, featured projects, and latest posts"
```

---

### Task 6: Projects Pages

**Files:**
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/projects/[id].astro`
- Create: `src/layouts/PostLayout.astro`

- [ ] **Step 1: Create `src/layouts/PostLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';
import TagBadge from '../components/TagBadge.astro';

interface Props {
  title: string;
  tags?: string[];
  date?: Date;
  backLink: string;
  backLabel: string;
}

const { title, tags = [], date, backLink, backLabel } = Astro.props;

const dateStr = date
  ? date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
  : null;
---

<BaseLayout title={title}>
  <article>
    <div class="mb-8">
      <a href={backLink} class="text-sm font-mono text-text-muted hover:text-accent">
        ← {backLabel}
      </a>
    </div>

    <header class="mb-8">
      <h1 class="text-3xl font-bold text-text mb-3">{title}</h1>
      <div class="flex flex-wrap items-center gap-3">
        {dateStr && (
          <time class="text-text-muted text-sm font-mono" datetime={date!.toISOString()}>
            {dateStr}
          </time>
        )}
        {tags.length > 0 && (
          <div class="flex flex-wrap gap-1.5">
            {tags.map((tag: string) => (
              <TagBadge label={tag} variant="green" />
            ))}
          </div>
        )}
      </div>
    </header>

    <div class="prose">
      <slot />
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Create `src/pages/projects/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectCard from '../../components/ProjectCard.astro';

const projects = (await getCollection('projects')).sort(
  (a, b) => a.data.order - b.data.order
);
---

<BaseLayout title="项目">
  <h1 class="text-2xl font-mono text-accent mb-8">
    <span class="text-green">/**</span> 项目列表 <span class="text-green">*/</span>
  </h1>

  {projects.length > 0 ? (
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {projects.map((project) => (
        <ProjectCard project={project} />
      ))}
    </div>
  ) : (
    <p class="text-text-muted font-mono">// 暂无项目</p>
  )}
</BaseLayout>
```

- [ ] **Step 3: Create `src/pages/projects/[id].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({
    params: { id: project.id },
    props: { project },
  }));
}

const { project } = Astro.props;
const { title, techStack } = project.data;
const { Content } = await render(project);
---

<PostLayout title={title} tags={techStack} backLink="/projects/" backLabel="返回项目列表">
  <Content />
</PostLayout>
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: `/projects/index.html` and `/projects/sample-project/index.html` generated.

- [ ] **Step 5: Commit**

```bash
git add src/pages/projects/ src/layouts/PostLayout.astro
git commit -m "feat: add projects list and detail pages"
```

---

### Task 7: Blog Pages

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[id].astro`

- [ ] **Step 1: Create `src/pages/blog/index.astro`**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';

const posts = (await getCollection('blog', ({ data }) => {
  return import.meta.env.PROD ? data.draft !== true : true;
})).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

<BaseLayout title="博客">
  <h1 class="text-2xl font-mono text-accent mb-8">
    <span class="text-green">/**</span> 博客文章 <span class="text-green">*/</span>
  </h1>

  {posts.length > 0 ? (
    <div>
      {posts.map((post) => (
        <PostCard post={post} />
      ))}
    </div>
  ) : (
    <p class="text-text-muted font-mono">// 暂无文章</p>
  )}
</BaseLayout>
```

- [ ] **Step 2: Create `src/pages/blog/[id].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  return posts.map((post) => ({
    params: { id: post.id },
    props: { post },
  }));
}

const { post } = Astro.props;
const { title, date, tags } = post.data;
const { Content } = await render(post);
---

<PostLayout title={title} tags={tags} date={date} backLink="/blog/" backLabel="返回博客">
  <Content />
</PostLayout>
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: `/blog/index.html` and `/blog/hello-world/index.html` generated.

- [ ] **Step 4: Commit**

```bash
git add src/pages/blog/
git commit -m "feat: add blog list and post detail pages"
```

---

### Task 8: About Page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create `src/pages/about.astro`**

```astro
---
import { siteConfig } from '../config';
import BaseLayout from '../layouts/BaseLayout.astro';
import TagBadge from '../components/TagBadge.astro';

const skills = {
  languages: ['TypeScript', 'Python', 'Go', 'Rust'],
  frontend: ['React', 'Vue', 'Astro', 'Tailwind CSS'],
  backend: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'],
  tools: ['Git', 'Linux', 'VS Code', 'Neovim'],
};
---

<BaseLayout title="关于我">
  <h1 class="text-2xl font-mono text-accent mb-8">
    <span class="text-green">/**</span> 关于我 <span class="text-green">*/</span>
  </h1>

  <!-- Bio -->
  <section class="mb-10">
    <div class="border border-border rounded-lg bg-surface p-6">
      <p class="text-text leading-relaxed mb-4">
        你好！我是 {siteConfig.author}，一名全栈开发者，热爱技术与开源。
      </p>
      <p class="text-text-muted leading-relaxed">
        我喜欢探索新技术，用代码解决实际问题。平时活跃在 GitHub 上，参与开源项目，也喜欢通过写博客来整理和分享学习心得。
      </p>
    </div>
  </section>

  <!-- Skills -->
  <section class="mb-10">
    <h2 class="text-lg font-mono text-accent mb-4">
      <span class="text-green">//</span> 技能栈
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Object.entries(skills).map(([category, items]) => (
        <div class="border border-border rounded-lg bg-surface p-4">
          <h3 class="text-sm font-mono text-green mb-2 uppercase">{category}</h3>
          <div class="flex flex-wrap gap-1.5">
            {items.map((skill) => (
              <TagBadge label={skill} variant="accent" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>

  <!-- Contact -->
  <section>
    <h2 class="text-lg font-mono text-accent mb-4">
      <span class="text-green">//</span> 联系方式
    </h2>
    <div class="border border-border rounded-lg bg-surface p-6">
      <ul class="space-y-3 font-mono text-sm">
        <li>
          <span class="text-green">$</span>
          <span class="text-text-muted">github:</span>
          <a href={siteConfig.github} target="_blank" rel="noopener" class="text-accent ml-2">
            {siteConfig.github}
          </a>
        </li>
        <li>
          <span class="text-green">$</span>
          <span class="text-text-muted">email:</span>
          <a href={`mailto:${siteConfig.email}`} class="text-accent ml-2">
            {siteConfig.email}
          </a>
        </li>
      </ul>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds. `/about/index.html` generated.

- [ ] **Step 3: Final full preview**

```bash
npm run preview
```

Visit all pages and verify:
- `/` — terminal intro, featured projects, latest posts
- `/projects` — project cards grid
- `/projects/sample-project` — project detail with Markdown content
- `/blog` — post list with dates and tags
- `/blog/hello-world` — post detail with rendered Markdown
- `/about` — bio, skills grid, contact info
- Mobile: hamburger menu works, layout is responsive

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add about page with bio, skills, and contact"
```
