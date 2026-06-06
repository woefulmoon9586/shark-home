#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import * as cheerio from 'cheerio';
import { XMLParser } from 'fast-xml-parser';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const publicRoot = path.join(projectRoot, 'public');
const blogRoot = path.join(projectRoot, 'src', 'content', 'blog');
const publicMediaRoot = path.join(publicRoot, 'assets', 'blog');
const reportPath = path.join(projectRoot, 'docs', 'blog-import-report.json');

const RESOURCE_EXTENSIONS = new Set([
  '.7z',
  '.apng',
  '.avi',
  '.csv',
  '.doc',
  '.docx',
  '.epub',
  '.gif',
  '.heic',
  '.jpeg',
  '.jpg',
  '.m4a',
  '.m4v',
  '.mov',
  '.mp3',
  '.mp4',
  '.mpeg',
  '.mpg',
  '.odt',
  '.ogg',
  '.ogv',
  '.pdf',
  '.png',
  '.ppt',
  '.pptx',
  '.rar',
  '.svg',
  '.tar',
  '.tgz',
  '.txt',
  '.wav',
  '.webm',
  '.webp',
  '.xls',
  '.xlsx',
  '.zip',
]);

const KEEP_EMBED_HOSTS = new Set([
  'youtu.be',
  'youtube.com',
  'www.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'bilibili.com',
  'www.bilibili.com',
  'player.bilibili.com',
  'vimeo.com',
  'www.vimeo.com',
  'player.vimeo.com',
]);

const MIME_EXTENSION_FALLBACKS = {
  'application/msword': '.doc',
  'application/pdf': '.pdf',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.ms-powerpoint': '.ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/zip': '.zip',
  'audio/mpeg': '.mp3',
  'audio/mp4': '.m4a',
  'audio/ogg': '.ogg',
  'audio/wav': '.wav',
  'image/gif': '.gif',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/svg+xml': '.svg',
  'image/webp': '.webp',
  'text/plain': '.txt',
  'video/mp4': '.mp4',
  'video/ogg': '.ogv',
  'video/quicktime': '.mov',
  'video/webm': '.webm',
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseTagValue: false,
  trimValues: false,
});

const turndown = new TurndownService({
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  headingStyle: 'atx',
});
turndown.use(gfm);
turndown.keep(['audio', 'iframe', 'source', 'video']);

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}

function textValue(value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (value && typeof value === 'object') {
    if (typeof value['#text'] === 'string') return value['#text'];
    if (typeof value.__cdata === 'string') return value.__cdata;
  }
  return '';
}

function slugifySegment(input, fallback) {
  let source = String(input || '');

  try {
    source = decodeURIComponent(source);
  } catch {
    // keep original value
  }

  const normalized = source
    .normalize('NFKC')
    .replace(/[\/\\:*?"<>|]/g, '-')
    .replace(/[%]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^\.+|\.+$/g, '')
    .replace(/^-+|-+$/g, '')
    .trim();

  return normalized || fallback;
}

function yamlString(value) {
  return JSON.stringify(String(value ?? ''));
}

function formatDate(date) {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function normalizeWhitespace(input) {
  return input.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function decodeEntities(input) {
  return String(input || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function stripHtml(html) {
  return decodeEntities(
    textValue(html)
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function summarize(excerpt, content) {
  const source = stripHtml(excerpt) || stripHtml(content);
  return source.length > 160 ? `${source.slice(0, 157).trim()}...` : source;
}

function stripRichText(input) {
  return decodeEntities(
    String(input || '')
      .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
      .replace(/\[[^\]]*]\([^)]+\)/g, ' ')
      .replace(/<video[\s\S]*?<\/video>/gi, ' ')
      .replace(/<audio[\s\S]*?<\/audio>/gi, ' ')
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, ' ')
      .replace(/<img[^>]*>/gi, ' ')
      .replace(/\[\/?(video|audio)[^\]]*]/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function summarizeContent(excerpt, content, title) {
  const source = stripRichText(excerpt) || stripRichText(content) || String(title || '').trim();
  return source.length > 160 ? `${source.slice(0, 157).trim()}...` : source;
}

function preprocessWordPressShortcodes(input) {
  return String(input || '')
    .replace(
      /\[video([^\]]*?)mp4="([^"]+)"([^\]]*?)\]\s*\[\/video\]/gi,
      (_, before, src, after) => {
        const width = before.match(/width="(\d+)"/i)?.[1] || after.match(/width="(\d+)"/i)?.[1];
        const height =
          before.match(/height="(\d+)"/i)?.[1] || after.match(/height="(\d+)"/i)?.[1];
        const sizeAttrs = [
          width ? ` width="${width}"` : '',
          height ? ` height="${height}"` : '',
        ].join('');
        return `<video controls${sizeAttrs} src="${src}"></video>`;
      }
    )
    .replace(
      /\[audio([^\]]*?)mp3="([^"]+)"([^\]]*?)\]\s*\[\/audio\]/gi,
      (_, _before, src) => `<audio controls src="${src}"></audio>`
    );
}

function normalizeUrl(value) {
  try {
    const url = new URL(value);
    url.hash = '';
    url.search = '';
    const normalized = url.toString();
    return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
  } catch {
    return value;
  }
}

function isThirdPartyEmbed(urlString) {
  try {
    return KEEP_EMBED_HOSTS.has(new URL(urlString).hostname.toLowerCase());
  } catch {
    return false;
  }
}

function shouldTreatAsResource(urlString, internalHosts) {
  try {
    const url = new URL(urlString);
    const ext = path.extname(url.pathname).toLowerCase();
    return RESOURCE_EXTENSIONS.has(ext) || internalHosts.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

function extractResourceTargets(srcset) {
  return String(srcset || '')
    .split(',')
    .map((candidate) => candidate.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function guessDatePath(urlString, fallbackDate) {
  try {
    const pathname = decodeURIComponent(new URL(urlString).pathname);
    const match = pathname.match(/\/(20\d{2})\/(0[1-9]|1[0-2])\//);
    if (match) return { year: match[1], month: match[2] };
  } catch {
    // ignore
  }

  return {
    year: String(fallbackDate.getUTCFullYear()),
    month: String(fallbackDate.getUTCMonth() + 1).padStart(2, '0'),
  };
}

function safeFilename(urlString, fallbackName, contentType) {
  let candidate = fallbackName;

  try {
    const pathname = decodeURIComponent(new URL(urlString).pathname);
    candidate = path.basename(pathname) || fallbackName;
  } catch {
    // ignore
  }

  let ext = path.extname(candidate).toLowerCase();
  if (!ext) {
    const mime = String(contentType || '').split(';')[0].trim().toLowerCase();
    ext = MIME_EXTENSION_FALLBACKS[mime] || '';
  }

  const base = slugifySegment(path.basename(candidate, path.extname(candidate)), 'asset');
  return `${base}${ext}`;
}

function getCategories(categoryNodes) {
  const categories = [];
  const tags = [];

  for (const entry of toArray(categoryNodes)) {
    const name = textValue(entry).trim();
    if (!name) continue;

    if (entry?.['@_domain'] === 'category') {
      categories.push(name);
    } else if (entry?.['@_domain'] === 'post_tag') {
      tags.push(name);
    }
  }

  return { categories, tags };
}

function buildFrontmatter(post, markdown) {
  const lines = [
    '---',
    `title: ${yamlString(post.title)}`,
    `date: ${yamlString(post.date.toISOString())}`,
    `displayDate: ${yamlString(post.displayDate)}`,
    `tags: [${post.tags.map((tag) => yamlString(tag)).join(', ')}]`,
    `summary: ${yamlString(post.summary || summarizeContent('', markdown, post.title))}`,
    'draft: false',
    '---',
    '',
  ];

  return `${lines.join('\n')}${markdown.trim()}\n`;
}

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function uniqueFilePath(baseDir, fileName) {
  const ext = path.extname(fileName);
  const stem = path.basename(fileName, ext);
  let counter = 0;

  while (true) {
    const resolvedName = counter === 0 ? fileName : `${stem}-${counter}${ext}`;
    const candidate = path.join(baseDir, resolvedName);
    if (!(await fileExists(candidate))) return candidate;
    counter += 1;
  }
}

function collectInternalHosts(posts, attachments) {
  const hosts = new Set();

  for (const entry of [...posts, ...attachments]) {
    for (const candidate of [entry.link, entry.attachmentUrl]) {
      if (!candidate) continue;
      try {
        hosts.add(new URL(candidate).hostname.toLowerCase());
      } catch {
        // ignore
      }
    }
  }

  return hosts;
}

async function downloadToProject(urlString, postDate, state) {
  const normalized = normalizeUrl(urlString);
  if (state.downloadedAssets.has(normalized)) {
    return state.downloadedAssets.get(normalized);
  }

  const candidates = buildResourceCandidates(urlString);
  let response = null;
  let successfulUrl = null;
  let lastError = null;

  for (const candidate of candidates) {
    try {
      const currentResponse = await fetch(candidate);
      if (!currentResponse.ok) {
        lastError = `HTTP ${currentResponse.status} ${currentResponse.statusText}`;
        continue;
      }
      response = currentResponse;
      successfulUrl = candidate;
      break;
    } catch (error) {
      lastError = error.message;
    }
  }

  if (!response || !successfulUrl) {
    state.failedDownloads.push({ url: urlString, reason: lastError || 'Unknown download failure' });
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  const { year, month } = guessDatePath(successfulUrl, postDate);
  const outputDir = path.join(publicMediaRoot, year, month);
  await ensureDir(outputDir);

  const filename = safeFilename(successfulUrl, 'asset', contentType);
  const outputPath = await uniqueFilePath(outputDir, filename);
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(outputPath, buffer);

  const publicPath = `/${path.relative(publicRoot, outputPath).split(path.sep).join('/')}`;
  state.downloadedAssets.set(normalized, publicPath);
  state.downloadedAssets.set(normalizeUrl(successfulUrl), publicPath);
  state.downloadedAssetFiles.push(outputPath);
  return publicPath;
}

function buildResourceCandidates(urlString) {
  const candidates = [];
  const seen = new Set();

  function pushCandidate(candidate) {
    const normalized = normalizeUrl(candidate);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    candidates.push(candidate);
  }

  pushCandidate(urlString);

  try {
    const url = new URL(urlString);
    if (url.protocol === 'http:') {
      const httpsUrl = new URL(urlString);
      httpsUrl.protocol = 'https:';
      pushCandidate(httpsUrl.toString());
    }

    const ext = path.extname(url.pathname).toLowerCase();
    const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    if (isImage) {
      const withoutSizedSuffix = url.pathname.replace(/-\d+x\d+(?=\.[^.]+$)/, '');
      if (withoutSizedSuffix !== url.pathname) {
        const variant = new URL(url.toString());
        variant.pathname = withoutSizedSuffix;
        pushCandidate(variant.toString());

        if (variant.protocol === 'http:') {
          const httpsVariant = new URL(variant.toString());
          httpsVariant.protocol = 'https:';
          pushCandidate(httpsVariant.toString());
        }
      }

      const withoutScaledSuffix = url.pathname.replace(/-scaled(?=\.[^.]+$)/, '');
      if (withoutScaledSuffix !== url.pathname) {
        const variant = new URL(url.toString());
        variant.pathname = withoutScaledSuffix;
        pushCandidate(variant.toString());

        if (variant.protocol === 'http:') {
          const httpsVariant = new URL(variant.toString());
          httpsVariant.protocol = 'https:';
          pushCandidate(httpsVariant.toString());
        }
      }
    }
  } catch {
    // ignore malformed URL
  }

  return candidates;
}

async function rewriteHtmlContent(html, post, state, attachmentLinkMap) {
  const $ = cheerio.load(html || '', { decodeEntities: false });

  $('img').each((_, element) => {
    $(element).removeAttr('loading');
    $(element).removeAttr('decoding');
    $(element).removeAttr('sizes');
  });

  const work = [];

  function queueAttr(node, attrName, urlString) {
    work.push({ node, attrName, urlString });
  }

  $('img, source, video, audio, a').each((_, element) => {
    const node = $(element);

    for (const attrName of ['src', 'href', 'poster']) {
      const value = node.attr(attrName);
      if (value) queueAttr(node, attrName, value);
    }

    const srcset = node.attr('srcset');
    if (srcset) {
      for (const target of extractResourceTargets(srcset)) {
        queueAttr(node, 'srcset', target);
      }
      node.removeAttr('srcset');
    }
  });

  for (const task of work) {
    const rawValue = task.urlString.trim();
    if (!rawValue || rawValue.startsWith('#') || rawValue.startsWith('mailto:') || rawValue.startsWith('tel:')) {
      continue;
    }

    let resolvedUrl;
    try {
      resolvedUrl = new URL(rawValue, post.link || undefined).toString();
    } catch {
      continue;
    }

    const normalized = normalizeUrl(resolvedUrl);

    if (attachmentLinkMap.has(normalized)) {
      task.node.attr(task.attrName, attachmentLinkMap.get(normalized));
      continue;
    }

    if (state.urlMap.has(normalized)) {
      task.node.attr(task.attrName, state.urlMap.get(normalized));
      continue;
    }

    if (isThirdPartyEmbed(resolvedUrl)) {
      task.node.attr(task.attrName, resolvedUrl);
      continue;
    }

    if (!shouldTreatAsResource(resolvedUrl, state.internalHosts)) {
      if (task.attrName !== 'srcset') task.node.attr(task.attrName, resolvedUrl);
      continue;
    }

    const localPath = await downloadToProject(resolvedUrl, post.date, state);
    if (localPath) {
      task.node.attr(task.attrName, localPath);
    }
  }

  $('source').each((_, element) => {
    const node = $(element);
    if (!node.attr('src')) node.remove();
  });

  return $.html();
}

function markdownFromHtml(html) {
  return normalizeWhitespace(turndown.turndown(html || ''));
}

function parseWordPressExport(xmlText) {
  const parsed = parser.parse(xmlText);
  const items = toArray(parsed?.rss?.channel?.item);

  const posts = [];
  const attachments = [];

  for (const item of items) {
    const postType = textValue(item['wp:post_type']).trim();
    const status = textValue(item['wp:status']).trim();
    const title = textValue(item.title).trim();
    const link = textValue(item.link).trim();
    const slug = textValue(item['wp:post_name']).trim();
    const pubDateRaw = textValue(item.pubDate).trim();
    const postDateRaw = textValue(item['wp:post_date']).trim();
    const postDateGmtRaw = textValue(item['wp:post_date_gmt']).trim();
    const postId = textValue(item['wp:post_id']).trim();
    const attachmentUrl = textValue(item['wp:attachment_url']).trim();
    const content = preprocessWordPressShortcodes(textValue(item['content:encoded']));
    const excerpt = textValue(item['excerpt:encoded']);
    const { categories, tags } = getCategories(item.category);

    const entry = {
      id: postId,
      title: title || slug || `post-${postId}`,
      link,
      slug,
      status,
      categories,
      tags,
      pubDateRaw,
      postDateRaw,
      postDateGmtRaw,
      content,
      excerpt,
      attachmentUrl,
      parentId: textValue(item['wp:post_parent']).trim(),
    };

    if (postType === 'post' && status === 'publish') {
      posts.push(entry);
    } else if (postType === 'attachment' && attachmentUrl) {
      attachments.push(entry);
    }
  }

  return { posts, attachments };
}

function parseWordPressDate(postDateRaw, postDateGmtRaw, pubDateRaw) {
  const displayDate = /^\d{4}-\d{2}-\d{2}/.test(postDateRaw)
    ? postDateRaw.slice(0, 10)
    : formatDate(pubDateRaw ? new Date(pubDateRaw) : new Date());

  if (postDateGmtRaw && postDateGmtRaw !== '0000-00-00 00:00:00') {
    return {
      date: new Date(`${postDateGmtRaw.replace(' ', 'T')}Z`),
      displayDate,
    };
  }

  if (postDateRaw && postDateRaw !== '0000-00-00 00:00:00') {
    return {
      date: new Date(`${postDateRaw.replace(' ', 'T')}+08:00`),
      displayDate,
    };
  }

  return {
    date: pubDateRaw ? new Date(pubDateRaw) : new Date(),
    displayDate,
  };
}

function preparePosts(posts) {
  return posts.map((post) => {
    const { date, displayDate } = parseWordPressDate(
      post.postDateRaw,
      post.postDateGmtRaw,
      post.pubDateRaw
    );
    const primaryCategory = slugifySegment(post.categories[0] || '未分类', '未分类');
    const fileSlug = slugifySegment(post.slug || post.title, `post-${post.id || 'untitled'}`);
    const newUrl = `/blog/${encodeURIComponent(primaryCategory)}/${encodeURIComponent(fileSlug)}/`;

    return {
      ...post,
      date,
      displayDate,
      primaryCategory,
      fileSlug,
      outputDir: path.join(blogRoot, primaryCategory),
      outputPath: path.join(blogRoot, primaryCategory, `${fileSlug}.md`),
      summary: summarizeContent(post.excerpt, post.content, post.title),
      newUrl,
    };
  });
}

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Usage: npm run import:wordpress -- <wordpress-export.xml>');
    process.exit(1);
  }

  const resolvedInput = path.resolve(projectRoot, inputPath);
  const xmlText = await fs.readFile(resolvedInput, 'utf8');
  const { posts: rawPosts, attachments } = parseWordPressExport(xmlText);
  const posts = preparePosts(rawPosts);
  const attachmentByParent = new Map();

  for (const attachment of attachments) {
    if (!attachment.parentId) continue;
    if (!attachmentByParent.has(attachment.parentId)) {
      attachmentByParent.set(attachment.parentId, []);
    }
    attachmentByParent.get(attachment.parentId).push(attachment);
  }

  const state = {
    internalHosts: collectInternalHosts(posts, attachments),
    urlMap: new Map(),
    downloadedAssets: new Map(),
    downloadedAssetFiles: [],
    failedDownloads: [],
    skippedPosts: [],
    writtenPosts: [],
  };

  for (const post of posts) {
    if (post.link) state.urlMap.set(normalizeUrl(post.link), post.newUrl);
  }

  for (const post of posts) {
    await ensureDir(post.outputDir);

    if (await fileExists(post.outputPath)) {
      state.skippedPosts.push({
        title: post.title,
        outputPath: post.outputPath,
        reason: 'Target file already exists',
      });
      continue;
    }

    const attachmentLinkMap = new Map();
    for (const attachment of attachmentByParent.get(post.id) || []) {
      const localPath = await downloadToProject(attachment.attachmentUrl, post.date, state);
      if (!localPath) continue;
      attachmentLinkMap.set(normalizeUrl(attachment.attachmentUrl), localPath);
      if (attachment.link) attachmentLinkMap.set(normalizeUrl(attachment.link), localPath);
    }

    const rewrittenHtml = await rewriteHtmlContent(post.content, post, state, attachmentLinkMap);
    const markdown = markdownFromHtml(rewrittenHtml);
    const fileContent = buildFrontmatter(post, markdown);
    await fs.writeFile(post.outputPath, fileContent, 'utf8');
    state.writtenPosts.push({
      title: post.title,
      outputPath: post.outputPath,
      url: post.newUrl,
    });
  }

  await ensureDir(path.dirname(reportPath));
  const report = {
    sourceXml: resolvedInput,
    importedPosts: state.writtenPosts.length,
    skippedPosts: state.skippedPosts.length,
    downloadedAssets: state.downloadedAssetFiles.length,
    failedDownloads: state.failedDownloads.length,
    posts: state.writtenPosts,
    skipped: state.skippedPosts,
    failures: state.failedDownloads,
  };

  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(`Imported posts: ${report.importedPosts}`);
  console.log(`Skipped posts: ${report.skippedPosts}`);
  console.log(`Downloaded assets: ${report.downloadedAssets}`);
  console.log(`Failed downloads: ${report.failedDownloads}`);
  console.log(`Report: ${reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
