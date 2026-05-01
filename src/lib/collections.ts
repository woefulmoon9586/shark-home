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
