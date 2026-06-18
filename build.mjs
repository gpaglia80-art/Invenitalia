import * as esbuild from "esbuild";
import { cpSync, rmSync, mkdirSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist/assets", { recursive: true });

await esbuild.build({
  entryPoints: ["src/main.jsx"],
  bundle: true,
  outfile: "dist/assets/bundle.js",
  jsx: "automatic",
  jsxImportSource: "react",
  minify: true,
  target: "es2020",
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "info",
});

// copy all static assets (index.html, manifest, sw, icons, _headers, etc.) into dist/
cpSync("static", "dist", { recursive: true });
console.log("✓ Build complete → dist/");
