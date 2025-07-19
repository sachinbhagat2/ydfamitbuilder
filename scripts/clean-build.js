import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to remove data attributes from HTML and JS files
function cleanFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, "utf8");
  const originalLength = content.length;

  // Remove data-loc attributes (various formats)
  content = content.replace(/\s*data-loc="[^"]*"/g, "");
  content = content.replace(/\s*data-loc='[^']*'/g, "");
  content = content.replace(/\s*data-loc=[^\s>]+/g, "");

  // Remove $name attributes
  content = content.replace(/\s*\$name="[^"]*"/g, "");
  content = content.replace(/\s*\$name='[^']*'/g, "");
  content = content.replace(/\s*\$name=[^\s>]+/g, "");

  // Remove data-testid attributes
  content = content.replace(/\s*data-testid="[^"]*"/g, "");
  content = content.replace(/\s*data-testid='[^']*'/g, "");

  // Remove any remaining builder references
  content = content.replace(/builder\.io/gi, "youthdreamers.org");
  content = content.replace(/Builder\.io/gi, "Youth Dreamers Foundation");
  content = content.replace(/BUILDER/gi, "YDF");
  content = content.replace(/data-builder-[^=]*=["'][^"']*["']/gi, "");

  // Remove React DevTools attributes
  content = content.replace(/\s*data-reactroot/g, "");
  content = content.replace(/\s*data-react-[^=]*=["'][^"']*["']/gi, "");

  // Clean up extra spaces and empty attributes
  content = content.replace(/\s+>/g, ">");
  content = content.replace(/\s+\s+/g, " ");
  content = content.replace(/=""/g, "");

  if (content.length !== originalLength) {
    fs.writeFileSync(filePath, content);
    console.log(
      `Cleaned: ${filePath} (${originalLength - content.length} characters removed)`,
    );
  }
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
    } else if (
      file.endsWith(".html") ||
      file.endsWith(".js") ||
      file.endsWith(".css")
    ) {
      cleanFile(filePath);
    }
  });
}

// Main execution
const distDir = path.join(__dirname, "..", "dist", "spa");
console.log("Cleaning production build...");
cleanDistDirectory(distDir);
console.log("Production build cleaned successfully!");
