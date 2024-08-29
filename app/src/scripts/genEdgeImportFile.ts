import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "fs"
import {basename, join, relative, resolve} from "path"
import {fileURLToPath, URL} from "url"

// Configuration constants
const THIS_DIR = fileURLToPath(new URL(".", import.meta.url))
const SRC_DIR = resolve(THIS_DIR, "..")
const OUTPUT_FILE = resolve(SRC_DIR, "./edges.ts")

// Function to get the relative path without extension
function getRelativePath(filePath: string): string {
  return relative(SRC_DIR, filePath).replace(/\.[^/.]+$/, "")
}

// Function to generate a valid variable name from a file path
function generateVariableName(filePath: string): string {
  return basename(filePath, ".ts")
    .replace(/[^a-zA-Z0-9_]/g, "_")
    .replace(/^(\d)/, "_$1")
}

// Function to recursively find all TypeScript files
function findTypeScriptFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir)

  for (const file of files) {
    const filePath = join(dir, file)
    if (statSync(filePath).isDirectory()) {
      findTypeScriptFiles(filePath, fileList)
    } else {
      const content = readFileSync(filePath, "utf8")
      if (!content.includes("\nexport default createEdge")) continue
      fileList.push(filePath)
    }
  }

  return fileList
}

// Main function
export function getEdgeImportFile(): void {
  const files = findTypeScriptFiles(SRC_DIR)
  let outputContent = `// This file is generated automatically. Do not modify it.\n\n`
  let exportStatements = ""

  const assets = []
  for (const file of files) {
    const relativePath = getRelativePath(file)
    const varName = generateVariableName(file)
    assets.push({varName, relativePath})
  }

  assets.sort((a, b) => a.varName.localeCompare(b.varName))

  for (const asset of assets) {
    const {varName, relativePath} = asset

    outputContent += `import ${varName} from './${relativePath}';\n`
    exportStatements += `  ${varName},\n`
  }

  outputContent += "\nexport {\n" + exportStatements + "};\n"

  if (
    existsSync(OUTPUT_FILE) &&
    readFileSync(OUTPUT_FILE, "utf8") === outputContent
  ) {
    console.log(`Edge file is up to date`)
  } else {
    writeFileSync(OUTPUT_FILE, outputContent)
    console.log(`Edge file updated: ${relative(SRC_DIR, OUTPUT_FILE)}`)
  }
}
