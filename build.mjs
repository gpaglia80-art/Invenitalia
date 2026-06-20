import * as esbuild from "esbuild";
import { cpSync, rmSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/assets", { recursive: true });

await esbuild.build({
  entryPoints: ["src/main.jsx"],
  bundle: true,
  outdir: "dist/assets",
  entryNames: "bundle-[hash]",          // content hash → new URL every build
  jsx: "automatic",
  jsxImportSource: "react",
  minify: true,
  target: "es2020",
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "info",
});

// find the hashed bundle esbuild just produced
const bundleFile = readdirSync("dist/assets").find((f) => /^bundle-.*\.js$/.test(f));
if (!bundleFile) throw new Error("Build failed: hashed bundle not found in dist/assets");

// copy static assets (index.html, manifest, sw, icons, _headers, .well-known, etc.)
cpSync("static", "dist", { recursive: true });

// rewrite index.html to point at the hashed bundle (matches bundle.js OR bundle-<hash>.js)
const idx = "dist/index.html";
let html = readFileSync(idx, "utf8");
html = html.replace(/\/assets\/bundle(?:-[A-Za-z0-9]+)?\.js/g, `/assets/${bundleFile}`);
writeFileSync(idx, html);

console.log(`✓ Build complete → dist/  (entry: ${bundleFile})`);
