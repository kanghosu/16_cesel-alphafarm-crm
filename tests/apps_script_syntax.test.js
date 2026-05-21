const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "..", "src");
const files = fs.readdirSync(srcDir).filter((name) => name.endsWith(".gs")).sort();

for (const file of files) {
  const code = fs.readFileSync(path.join(srcDir, file), "utf8");
  try {
    // Parse only. Apps Script globals such as SpreadsheetApp are provided at runtime.
    new Function(code);
  } catch (error) {
    error.message = `${file}: ${error.message}`;
    throw error;
  }
}

console.log("apps_script_syntax.test.js passed");
