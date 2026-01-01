import { $ } from "bun";

// Clean dist directory
await $`rm -rf dist`;
await $`mkdir -p dist/content dist/popup dist/icons`;

// Build content script
await Bun.build({
  entrypoints: ["./src/content/content.ts"],
  outdir: "./dist/content",
  naming: "[name].js",
  target: "browser",
  minify: true,
});

// Build popup script
await Bun.build({
  entrypoints: ["./src/popup/popup.ts"],
  outdir: "./dist/popup",
  naming: "[name].js",
  target: "browser",
  minify: true,
});

// Copy static files
await $`cp src/content/content.css dist/content/`;
await $`cp src/popup/popup.html dist/popup/`;
await $`cp src/popup/popup.css dist/popup/`;
await $`cp manifest.json dist/`;
await $`cp icons/*.png dist/icons/`;

console.log("Build complete! Extension ready in ./dist");
