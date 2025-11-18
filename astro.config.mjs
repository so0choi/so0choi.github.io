// @ts-check

import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";

import partytown from "@astrojs/partytown";
import pagefind from "astro-pagefind";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://so0choi.github.io",
  integrations: [sitemap(), partytown(), pagefind()],
  experimental: {
    fonts: [
      {
        name: "Playfair Display",
        cssVariable: "--font-playfair-display",
        provider: fontProviders.google(),
      },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
