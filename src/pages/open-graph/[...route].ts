import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

const collectionEntries = await getCollection("blog");
const pages = Object.fromEntries(
  collectionEntries.map(({ id, data }) => [id, data]),
);
export const { getStaticPaths, GET } = OGImageRoute({
  // the name of dynamic route segment.
  param: "route",

  // A collection of pages to generate images for.
  // The keys of this object are used to generate the path for that image.
  // In this example, we generate one image at `/open-graph/example.png`.
  pages: pages,

  // For each page, this callback will be used to customize the OpenGraph image.
  getImageOptions: (path, page) => ({
    title: page.title,
    description: page.description,
    logo: {
      // Use site favicon (or replace with a specific site logo)
      path: new URL("../../../public/favicon.png", import.meta.url).pathname,
    },
  }),
});
