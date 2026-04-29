import { getCollection } from 'astro:content';

export async function getPublishedPosts() {
  return (await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  })).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
