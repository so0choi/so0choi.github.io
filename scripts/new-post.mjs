#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";

const BLOG_ROOT = path.join(process.cwd(), "src", "content", "blog");

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    }),
  );
}

function slugify(input) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "untitled";
}

function formatDate(date) {
  const pad = (n) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

function quote(str) {
  return `"${str.replace(/"/g, '\\"')}"`;
}

async function main() {
  const title = await prompt("Post title: ");
  if (!title) {
    console.error("Title is required. Aborting.");
    process.exit(1);
  }

  const descriptionInput = await prompt(
    "Short description (default: same as title): ",
  );
  const description = descriptionInput || title;

  const categoryInput = await prompt("Category (e.g. frontend, backend): ");
  if (!categoryInput) {
    console.error("Category is required. Aborting.");
    process.exit(1);
  }
  const category = slugify(categoryInput);

  const slugInput = await prompt(
    "Slug (folder name, leave empty to derive from title): ",
  );
  const slug = slugInput ? slugify(slugInput) : slugify(title);

  const postDir = path.join(BLOG_ROOT, category, slug);
  const postPath = path.join(postDir, "index.md");

  try {
    await fs.access(postPath);
    console.error(`A post already exists at ${postPath}. Aborting.`);
    process.exit(1);
  } catch {
    // file does not exist, continue
  }

  await fs.mkdir(postDir, { recursive: true });

  const now = new Date();
  const pubDate = formatDate(now);

  const frontmatter = [
    "---",
    `title: ${quote(title)}`,
    `description: ${quote(description)}`,
    `pubDate: ${pubDate}`,
    `category: ${category}`,
    "",
    "---",
    "",
    "# " + title,
    "",
  ].join("\n");

  await fs.writeFile(postPath, frontmatter, "utf8");
  console.log(`Created ${postPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
