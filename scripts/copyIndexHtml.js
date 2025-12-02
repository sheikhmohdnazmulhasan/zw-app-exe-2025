const fs = require("fs");
const path = require("node:path");

const src = path.join(__dirname, "..", "src", "index.html");
const distDir = path.join(__dirname, "..", "dist");
const dest = path.join(distDir, "index.html");

try {
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  fs.copyFileSync(src, dest);
  // Keep log minimal; useful in CI / debugging.
  console.log("Copied src/index.html -> dist/index.html");
} catch (error) {
  console.error("Failed to copy index.html:", error);
  process.exit(1);
}
