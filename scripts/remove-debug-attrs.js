import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple regex-based cleanup for HTML files
function processHtmlFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, "utf8");

  // Remove specific debugging attributes
  html = html.replace(/\s+data-loc="[^"]*"/g, "");
  html = html.replace(/\s+\$name="[^"]*"/g, "");
  html = html.replace(/\s+data-testid="[^"]*"/g, "");
  html = html.replace(/\s+data-reactroot="[^"]*"/g, "");
  html = html.replace(/\s+data-reactroot/g, "");

  // Clean up double spaces
  html = html.replace(/\s{2,}/g, " ");
  html = html.replace(/\s+>/g, ">");

  fs.writeFileSync(filePath, html);
  console.log("Cleaned debug attributes from:", path.basename(filePath));
}

// Find and process the main HTML file
const distPath = path.join(__dirname, "..", "dist", "spa");
const indexPath = path.join(distPath, "index.html");

if (fs.existsSync(indexPath)) {
  processHtmlFile(indexPath);
  console.log("✅ Debug attributes removed from build");
} else {
  console.log("❌ Build file not found");
}
