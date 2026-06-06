#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const projectRoot = process.cwd();
const targets = [
  path.join(projectRoot, 'src', 'content', 'blog', 'Java'),
  path.join(projectRoot, 'src', 'content', 'blog', '学习'),
  path.join(projectRoot, 'src', 'content', 'blog', '我们俩'),
];

function normalizeWhitespace(input) {
  return input.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function unescapeMarkdownCode(code) {
  return code.replace(/\\([\[\]_*])/g, '$1');
}

function convertCcShortcodes(text) {
  return text.replace(
    /\\?\[cc\s+lang="([^"]+)"\\?\]([\s\S]*?)\\?\[\/cc\\?\]/gi,
    (_match, lang, code) => `\n\`\`\`${String(lang || '').trim() || 'text'}\n${unescapeMarkdownCode(String(code).trim())}\n\`\`\`\n`
  );
}

function stripLeadingCssBlock(text) {
  return text.replace(
    /^[\s\S]*?(?:body\s*\{[\s\S]*?)(?=\n(?:(?:#)|!\[|<video|<audio|## |### |#### ))/i,
    ''
  );
}

function stripInlineCssParagraphs(text) {
  return text
    .replace(
      /(?:^|\n)(?:[^\n]*?)?body\s*\{[\s\S]*?(?=\n(?:(?:#)|!\[|<video|<audio|$))/gi,
      '\n'
    )
    .replace(
      /(?:^|\n)(?:[^\n]*?)?\.gallery\s*\{[\s\S]*?(?=\n(?:(?:#)|!\[|<video|<audio|$))/gi,
      '\n'
    );
}

function stripRichText(input) {
  return String(input || '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/<video[\s\S]*?<\/video>/gi, ' ')
    .replace(/<audio[\s\S]*?<\/audio>/gi, ' ')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, ' ')
    .replace(/<img[^>]*>/gi, ' ')
    .replace(/\[\/?(video|audio)[^\]]*]/gi, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function summarizeContent(content, title) {
  const firstParagraph = String(content || '')
    .split(/\n\s*\n/)
    .map((block) => stripRichText(block))
    .find(Boolean);
  const source = firstParagraph || stripRichText(content) || String(title || '').trim();
  return source.length > 110 ? `${source.slice(0, 107).trim()}...` : source;
}

function addDefaultCodeLanguages(text, filePath) {
  if (!filePath.includes(`${path.sep}Java${path.sep}`)) return text;
  const lines = text.split('\n');
  let inFence = false;

  for (let i = 0; i < lines.length; i += 1) {
    if (/^```(?:java)?\s*$/.test(lines[i])) {
      if (!inFence) {
        lines[i] = '```java';
        inFence = true;
      } else {
        lines[i] = '```';
        inFence = false;
      }
    }
  }

  return lines.join('\n');
}

function sanitizeMarkdown(markdown, title = '') {
  return normalizeWhitespace(
    stripInlineCssParagraphs(
      stripLeadingCssBlock(
        convertCcShortcodes(String(markdown || ''))
          .replace(/\\\[系统架构图\\\]/g, '')
          .replace(/\\_/g, '_')
      )
    )
      .replace(
        new RegExp(`^${String(title).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+`, 'i'),
        ''
      )
      .replace(/\n```java\n\s*\n/g, '\n```java\n')
      .replace(/\n```\n\s*\n/g, '\n```\n')
      .replace(/\n{3,}/g, '\n\n')
  );
}

async function walk(dir) {
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(fullPath);
      return fullPath.endsWith('.md') ? [fullPath] : [];
    })
  );

  return files.flat();
}

function updateFrontmatter(source, filePath) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return source;

  let frontmatter = match[1];
  const body = match[2];
  const title = frontmatter.match(/^title:\s*"?(.*?)"?$/m)?.[1] || '';
  const cleanedBody = addDefaultCodeLanguages(sanitizeMarkdown(body, title), filePath);
  const nextSummary = JSON.stringify(summarizeContent(cleanedBody, title));

  if (/^summary:/m.test(frontmatter)) {
    frontmatter = frontmatter.replace(/^summary:\s*.*$/m, `summary: ${nextSummary}`);
  }

  return `---\n${frontmatter}\n---\n${cleanedBody}\n`;
}

async function main() {
  const files = (await Promise.all(targets.map((dir) => walk(dir)))).flat();

  for (const file of files) {
    const source = await fs.readFile(file, 'utf8');
    const cleaned = updateFrontmatter(source, file);
    if (cleaned !== source) {
      await fs.writeFile(file, cleaned, 'utf8');
    }
  }

  console.log(`Cleaned ${files.length} imported markdown files.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
