# Content Grouping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add directory-based content grouping so projects and blog posts are organized by subdirectories, with category filter tabs and per-category pages.

**Architecture:** Content files live in subdirectories (e.g., `projects/frontend/xxx.md`). A custom `generateId` preserves the directory structure in the entry ID (e.g., `frontend/sample-vue-app`). A `getCategory()` helper extracts the category from the ID. A shared `CategoryTabs` component renders the filter bar. The existing `[id].astro` routes are renamed to `[...id].astro` (rest parameter) to handle multi-segment IDs. Each `[...id].astro` handles both individual items (2-segment IDs like `frontend/sample-vue-app`) and category listing pages (1-segment IDs like `frontend`).

**Tech Stack:** Astro 5 (content layer API), Tailwind CSS v4, TypeScript, Zod

---

### Task 1: Create sample content in subdirectories

**Files:**
- Create: `src/content/projects/frontend/sample-vue-app.md`
- Create: `src/content/blog/随笔/hello-world-copy.md`

- [ ] **Step 1: Create a sample project in a subdirectory**

Create `src/content/projects/frontend/sample-vue-app.md`:

```markdown
---
title: "Sample Vue App"
description: "A sample Vue 3 application for testing category grouping"
techStack: ["Vue", "TypeScript"]
featured: false
order: 2
---

This is a sample project in the frontend category.
```

- [ ] **Step 2: Create a sample blog post in a subdirectory**

Create `src/content/blog/随笔/hello-world-copy.md`:

```markdown
---
title: "你好世界（副本）"
date: 2026-04-30
tags: ["随笔"]
summary: "这是一篇测试分组功能的文章。"
draft: false
---

这是测试分类功能的第二篇文章。
```

- [ ] **Step 3: Verify content files exist**

Run: `ls -R src/content/projects/ src/content/blog/`
Expected: See both root-level files and new subdirectory files.

---

### Task 2: Update content config with custom generateId

**Files:**
- Modify: `src/content.config.ts:1-29`

- [ ] **Step 1: Add generateId to both collections**

Replace `src/content.config.ts` with:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const generateId = ({ entry }: { entry: string }) => entry.replace(/\.md$/, '');

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md', generateId }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md', generateId }),
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

- [ ] **Step 2: Verify build doesn't break**

Run: `npx astro build 2>&1 | tail -20`
Expected: Build completes without errors. IDs now preserve directory paths.

---

### Task 3: Add category helper functions to collections.ts

**Files:**
- Modify: `src/lib/collections.ts:1-7`

- [ ] **Step 1: Add getCategory and groupByCategory helpers**

Replace `src/lib/collections.ts` with:

```ts
import { getCollection, type CollectionEntry } from 'astro:content';

export function getCategory(id: string): string {
  const parts = id.split('/');
  return parts.length > 1 ? parts[0] : '';
}

export function groupByCategory<T extends { id: string }>(
  items: T[]
): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const cat = getCategory(item.id);
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push(item);
  }
  return groups;
}

export async function getPublishedPosts() {
  return (await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  })).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
```

- [ ] **Step 2: Verify build**

Run: `npx astro build 2>&1 | tail -20`
Expected: Build completes without errors.

---

### Task 4: Create CategoryTabs component

**Files:**
- Create: `src/components/CategoryTabs.astro`

- [ ] **Step 1: Create the CategoryTabs component**

Create `src/components/CategoryTabs.astro`:

```astro
---
interface Props {
  categories: { name: string; count: number }[];
  basePath: string;
  current: string;
}

const { categories, basePath, current } = Astro.props;
const totalCount = categories.reduce((sum, c) => sum + c.count, 0);
---

<div class="flex flex-wrap gap-2 mb-6">
  <a
    href={basePath}
    class:list={[
      'px-3 py-1.5 rounded-md font-mono text-sm border transition-colors',
      current === ''
        ? 'border-accent text-accent bg-accent/10'
        : 'border-border text-text-muted hover:text-text hover:border-border',
    ]}
  >
    全部
    <span class="text-text-muted text-xs ml-1">{totalCount}</span>
  </a>
  {categories.map((cat) => (
    <a
      href={`${basePath}${cat.name}/`}
      class:list={[
        'px-3 py-1.5 rounded-md font-mono text-sm border transition-colors',
        current === cat.name
          ? 'border-accent text-accent bg-accent/10'
          : 'border-border text-text-muted hover:text-text hover:border-border',
      ]}
    >
      {cat.name || '未分类'}
      <span class="text-text-muted text-xs ml-1">{cat.count}</span>
    </a>
  ))}
</div>
```

- [ ] **Step 2: Verify build**

Run: `npx astro build 2>&1 | tail -20`
Expected: Build succeeds (component is created but not yet imported).

---

### Task 5: Update projects index page with category tabs and grouping

**Files:**
- Modify: `src/pages/projects/index.astro:1-25`

- [ ] **Step 1: Rewrite projects/index.astro**

Replace `src/pages/projects/index.astro` with:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectCard from '../../components/ProjectCard.astro';
import CategoryTabs from '../../components/CategoryTabs.astro';
import { getCategory, groupByCategory } from '../../lib/collections';

const projects = (await getCollection('projects')).sort(
  (a, b) => a.data.order - b.data.order
);

const groups = groupByCategory(projects);
const categories = Array.from(groups.entries())
  .filter(([name]) => name !== '')
  .map(([name, items]) => ({ name, count: items.length }));

const uncategorized = groups.get('') || [];
---

<BaseLayout title="项目">
  <h1 class="text-2xl font-mono text-accent mb-8">
    <span class="text-green">/**</span> 项目列表 <span class="text-green">*/</span>
  </h1>

  {projects.length > 0 ? (
    <>
      <CategoryTabs categories={categories} basePath="/projects/" current="" />

      {categories.map((cat) => (
        <div class="mb-8">
          <h2 class="text-lg font-mono text-accent mb-4">
            <span class="text-green">//</span> {cat.name}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups.get(cat.name)!.map((project) => (
              <ProjectCard project={project} />
            ))}
          </div>
        </div>
      ))}

      {uncategorized.length > 0 && (
        <div class="mb-8">
          <h2 class="text-lg font-mono text-accent mb-4">
            <span class="text-green">//</span> 未分类
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {uncategorized.map((project) => (
              <ProjectCard project={project} />
            ))}
          </div>
        </div>
      )}
    </>
  ) : (
    <p class="text-text-muted font-mono">// 暂无项目</p>
  )}
</BaseLayout>
```

- [ ] **Step 2: Verify build**

Run: `npx astro build 2>&1 | tail -20`
Expected: Build succeeds. Projects grouped by category on the index page.

---

### Task 6: Update blog index page with category tabs and grouping

**Files:**
- Modify: `src/pages/blog/index.astro:1-23`

- [ ] **Step 1: Rewrite blog/index.astro**

Replace `src/pages/blog/index.astro` with:

```astro
---
import { getPublishedPosts, groupByCategory } from '../../lib/collections';
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';
import CategoryTabs from '../../components/CategoryTabs.astro';

const posts = await getPublishedPosts();

const groups = groupByCategory(posts);
const categories = Array.from(groups.entries())
  .filter(([name]) => name !== '')
  .map(([name, items]) => ({ name, count: items.length }));

const uncategorized = groups.get('') || [];
---

<BaseLayout title="博客">
  <h1 class="text-2xl font-mono text-accent mb-8">
    <span class="text-green">/**</span> 博客文章 <span class="text-green">*/</span>
  </h1>

  {posts.length > 0 ? (
    <>
      <CategoryTabs categories={categories} basePath="/blog/" current="" />

      {categories.map((cat) => (
        <div class="mb-8">
          <h2 class="text-lg font-mono text-accent mb-4">
            <span class="text-green">//</span> {cat.name}
          </h2>
          <div>
            {groups.get(cat.name)!.map((post) => (
              <PostCard post={post} />
            ))}
          </div>
        </div>
      ))}

      {uncategorized.length > 0 && (
        <div class="mb-8">
          <h2 class="text-lg font-mono text-accent mb-4">
            <span class="text-green">//</span> 未分类
          </h2>
          <div>
            {uncategorized.map((post) => (
              <PostCard post={post} />
            ))}
          </div>
        </div>
      )}
    </>
  ) : (
    <p class="text-text-muted font-mono">// 暂无文章</p>
  )}
</BaseLayout>
```

- [ ] **Step 2: Verify build**

Run: `npx astro build 2>&1 | tail -20`
Expected: Build succeeds.

---

### Task 7: Rename projects [id].astro to [...id].astro for multi-segment IDs

**Files:**
- Delete: `src/pages/projects/[id].astro`
- Create: `src/pages/projects/[...id].astro`

- [ ] **Step 1: Create the new catch-all route**

Create `src/pages/projects/[...id].astro`:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectCard from '../../components/ProjectCard.astro';
import PostLayout from '../../layouts/PostLayout.astro';
import CategoryTabs from '../../components/CategoryTabs.astro';
import { getCategory, groupByCategory } from '../../lib/collections';
import { render } from 'astro:content';

export async function getStaticPaths() {
  const projects = (await getCollection('projects')).sort(
    (a, b) => a.data.order - b.data.order
  );
  const groups = groupByCategory(projects);
  const categories = Array.from(groups.entries())
    .filter(([name]) => name !== '')
    .map(([name, items]) => ({ name, count: items.length }));

  const paths: any[] = [];

  // Individual items: 2-segment IDs like "frontend/sample-vue-app"
  for (const project of projects) {
    const parts = project.id.split('/');
    if (parts.length >= 2) {
      paths.push({
        params: { id: project.id },
        props: { type: 'item', project, categories },
      });
    }
  }

  // Category pages: 1-segment IDs (categories)
  for (const [catName, catProjects] of groups) {
    if (catName !== '') {
      paths.push({
        params: { id: catName },
        props: { type: 'category', category: catName, projects: catProjects, categories },
      });
    }
  }

  return paths;
}

const props = Astro.props;

if (props.type === 'category') {
  const { category, projects, categories } = props;
---

<BaseLayout title={`项目 - ${category}`}>
  <h1 class="text-2xl font-mono text-accent mb-8">
    <span class="text-green">/**</span> 项目 - {category} <span class="text-green">*/</span>
  </h1>

  <CategoryTabs categories={categories} basePath="/projects/" current={category} />

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {projects.map((project) => (
      <ProjectCard project={project} />
    ))}
  </div>
</BaseLayout>

{ } else {
  const { project } = props;
  const { title, techStack } = project.data;
  const { Content } = await render(project);
---

<PostLayout title={title} tags={techStack} backLink="/projects/" backLabel="返回项目列表">
  <Content />
</PostLayout>
{ }
```

- [ ] **Step 2: Delete the old [id].astro**

Run: `rm src/pages/projects/[id].astro`

- [ ] **Step 3: Verify build**

Run: `npx astro build 2>&1 | tail -30`
Expected: Build succeeds. Both category pages (e.g., `/projects/frontend/`) and individual item pages (e.g., `/projects/frontend/sample-vue-app/`) are generated.

---

### Task 8: Rename blog [id].astro to [...id].astro for multi-segment IDs

**Files:**
- Delete: `src/pages/blog/[id].astro`
- Create: `src/pages/blog/[...id].astro`

- [ ] **Step 1: Create the new catch-all route**

Create `src/pages/blog/[...id].astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';
import PostLayout from '../../layouts/PostLayout.astro';
import CategoryTabs from '../../components/CategoryTabs.astro';
import { getPublishedPosts, groupByCategory } from '../../lib/collections';
import { render } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getPublishedPosts();
  const groups = groupByCategory(posts);
  const categories = Array.from(groups.entries())
    .filter(([name]) => name !== '')
    .map(([name, items]) => ({ name, count: items.length }));

  const paths: any[] = [];

  // Individual items: 2-segment IDs like "随笔/hello-world-copy"
  for (const post of posts) {
    const parts = post.id.split('/');
    if (parts.length >= 2) {
      paths.push({
        params: { id: post.id },
        props: { type: 'item', post, categories },
      });
    }
  }

  // Category pages: 1-segment IDs (categories)
  for (const [catName, catPosts] of groups) {
    if (catName !== '') {
      paths.push({
        params: { id: catName },
        props: { type: 'category', category: catName, posts: catPosts, categories },
      });
    }
  }

  return paths;
}

const props = Astro.props;

if (props.type === 'category') {
  const { category, posts, categories } = props;
---

<BaseLayout title={`博客 - ${category}`}>
  <h1 class="text-2xl font-mono text-accent mb-8">
    <span class="text-green">/**</span> 博客 - {category} <span class="text-green">*/</span>
  </h1>

  <CategoryTabs categories={categories} basePath="/blog/" current={category} />

  <div>
    {posts.map((post) => (
      <PostCard post={post} />
    ))}
  </div>
</BaseLayout>

{ } else {
  const { post } = props;
  const { title, date, tags } = post.data;
  const { Content } = await render(post);
---

<PostLayout title={title} tags={tags} date={date} backLink="/blog/" backLabel="返回博客">
  <Content />
</PostLayout>
{ }
```

- [ ] **Step 2: Delete the old [id].astro**

Run: `rm src/pages/blog/[id].astro`

- [ ] **Step 3: Verify build**

Run: `npx astro build 2>&1 | tail -30`
Expected: Build succeeds. Blog category pages and individual post pages both generated.

---

### Task 9: Full build verification and commit

**Files:**
- All files from previous tasks

- [ ] **Step 1: Run full build**

Run: `npx astro build 2>&1`
Expected: Clean build with no errors. Output includes pages for both `/projects/` index, `/projects/frontend/`, `/blog/` index, `/blog/随笔/`, and all individual content pages.

- [ ] **Step 2: Verify generated page structure**

Run: `find dist/projects dist/blog -name '*.html' | sort`
Expected: See `index.html` for both projects and blog root, plus category `index.html` files.

- [ ] **Step 3: Commit all changes**

```bash
git add src/content.config.ts src/lib/collections.ts src/components/CategoryTabs.astro \
  src/pages/projects/index.astro src/pages/projects/\[...id\].astro \
  src/pages/blog/index.astro src/pages/blog/\[...id\].astro \
  src/content/projects/frontend/ src/content/blog/随笔/
git commit -m "feat: add directory-based content grouping with category tabs and pages"
```
