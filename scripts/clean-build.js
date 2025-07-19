import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to remove data attributes from HTML files
function cleanHtmlFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, "utf8");

  // Remove data-loc attributes
  content = content.replace(/\s*data-loc="[^"]*"/g, "");

  // Remove $name attributes
  content = content.replace(/\s*\$name="[^"]*"/g, "");

  // Remove any remaining builder references
  content = content.replace(/builder\.io/g, "");
  content = content.replace(/Builder\.io/g, "");
  content = content.replace(/BUILDER/g, "");

  // Remove data-testid attributes
  content = content.replace(/\s*data-testid="[^"]*"/g, "");

  // Clean up extra spaces
  content = content.replace(/\s+>/g, ">");

  fs.writeFileSync(filePath, content);
  console.log(`Cleaned: ${filePath}`);
}

// Function to recursively clean all HTML and JS files in dist
function cleanDistDirectory(dir) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      cleanDistDirectory(filePath);
    } else if (file.endsWith(".html") || file.endsWith(".js")) {
      cleanHtmlFile(filePath);
    }
  });
}

// Main execution
const distDir = path.join(__dirname, "..", "dist", "spa");
console.log("Cleaning production build...");
cleanDistDirectory(distDir);
console.log("Production build cleaned successfully!");
