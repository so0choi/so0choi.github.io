import { type CollectionEntry, getCollection } from "astro:content";

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

type Post = CollectionEntry<"blog">;

// Other parts of the post's series in reading order, or [] when it isn't in one.
export function getSeriesPosts(post: Post, all: Post[]) {
  const { series } = post.data;
  if (!series) return [];
  return all
    .filter((p) => p.data.series === series)
    .sort((a, b) => (a.data.seriesOrder ?? 0) - (b.data.seriesOrder ?? 0));
}

// Up to `limit` posts ranked by shared tags (2 each) and same category (1),
// newest first on ties. Same-series posts are left out since the series nav lists them.
export function getRelatedPosts(post: Post, all: Post[], limit = 3) {
  const tags = new Set(post.data.tags);
  const category = post.id.split("/")[0];
  return all
    .filter((p) => p.id !== post.id && !(post.data.series && p.data.series === post.data.series))
    .map((p) => ({
      post: p,
      score:
        p.data.tags.filter((t) => tags.has(t)).length * 2 +
        (p.id.split("/")[0] === category ? 1 : 0),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf())
    .slice(0, limit)
    .map((r) => r.post);
}
