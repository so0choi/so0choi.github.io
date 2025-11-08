// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

import partytown from "@astrojs/partytown";
import pagefind from "astro-pagefind";

// https://astro.build/config
export default defineConfig({
  site: "https://so0choi.github.io",
  integrations: [mdx(), sitemap(), partytown(), pagefind()],
});
