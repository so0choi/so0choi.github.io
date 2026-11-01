import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const posts = await getCollection("blog");

export const { GET, getStaticPaths } = OGImageRoute({
  param: "route",
  // Keys become the image path: "ai/foo" → /open-graph/ai/foo.png.
  // (An array here would produce /open-graph/0.png, 1.png, ...)
  pages: Object.fromEntries(
    posts.map((post) => [
      post.id,
      {
        title: post.data.title,
        description: post.data.description,
        category: post.id.split("/")[0],
      },
    ]),
  ),

  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description ?? "",
    width: 1200,
    height: 630,
    padding: 80,
    bgGradient: [[15, 20, 18]],
    border: { color: [124, 224, 163], width: 12, side: "inline-start" },
    fonts: [
      "./public/fonts/Pretendard-Bold.woff",
      "./public/fonts/Pretendard-Regular.woff",
    ],
    font: {
      title: {
        families: ["Pretendard"],
        weight: "Bold",
        size: 64,
        lineHeight: 1.25,
        color: [230, 237, 233],
      },
      description: {
        families: ["Pretendard"],
        weight: "Normal",
        size: 32,
        lineHeight: 1.5,
        color: [154, 169, 161],
      },
    },
  }),
});
