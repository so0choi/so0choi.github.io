import { OGImageRoute } from "astro-og-canvas";
import { type CollectionEntry, getCollection } from "astro:content";

type BlogEntry = CollectionEntry<"blog">;
const posts: BlogEntry[] = await getCollection("blog");

export const { GET, getStaticPaths } = OGImageRoute({
  param: "route",
  pages: posts.map((post) => ({
    route: post.id.split("/"),
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
  })),

  // Canvas 옵션
  getImageOptions: (path, page) => ({
    title: page.title,
    description: page.description ?? "",
    subtitle: page.category ? `#${page.category}` : "",
    width: 1200,
    height: 630,
  }),
});
