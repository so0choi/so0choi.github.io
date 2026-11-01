import { getCollection } from "astro:content";

export async function getSortedPosts() {
  const all = await getCollection("blog");
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

// Categories are the first folder of a post's id (e.g. "aws/foo" → "aws").
export async function getCategories() {
  const posts = await getCollection("blog");
  const counts = new Map<string, number>();
  for (const p of posts) {
    const area = p.id.split("/")[0];
    counts.set(area, (counts.get(area) ?? 0) + 1);
  }
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
