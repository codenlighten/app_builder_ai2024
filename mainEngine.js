import TreeGenerator from "./TreeGenerator.js";
import FileGenerator from "./FileGenerator.js";
import fs from "fs/promises";
import path from "path";

class ProjectWriter {
  constructor(baseDir = "project") {
    this.baseDir = baseDir;
  }

  async createDirectory(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (error.code !== "EEXIST") {
        throw error;
      }
    }
  }

  async writeFile(filePath, content) {
    const dir = path.dirname(filePath);
    await this.createDirectory(dir);
    await fs.writeFile(filePath, content, "utf8");
  }

  async cleanDirectory(dir) {
    try {
      await fs.rm(dir, { recursive: true, force: true });
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }
}

const runGenerator = async () => {
  try {
    // Initialize generators and writer
    const treeGenerator = new TreeGenerator();
    const fileGenerator = new FileGenerator();
    const projectWriter = new ProjectWriter();

    console.log("🚀 Starting project generation...");

    // Clean existing project directory
    await projectWriter.cleanDirectory("project");
    console.log("📁 Cleaned existing project directory");

    // Generate app structure
    console.log("📊 Generating application structure...");
    const treeStructure = await treeGenerator.generateApplication(
      "TaskManager",
      "A simple task management application with user authentication and task CRUD operations",
      "JavaScript"
    );

    // Generate file contents
    console.log("📝 Generating file contents...");
    const generatedFiles = await fileGenerator.generateAllFiles(treeStructure);

    // Write files to disk
    console.log("💾 Writing files to disk...");
    for (const [fileName, content] of Object.entries(generatedFiles)) {
      const fullPath = path.join(projectWriter.baseDir, fileName);
      await projectWriter.writeFile(fullPath, content);
      console.log(`✅ Written: ${fileName}`);
    }

    // Create any empty directories from the structure
    const directories = treeStructure.file_structure
      .filter((item) => item.type === "directory")
      .map((dir) => dir.fileName);

    for (const dir of directories) {
      const fullPath = path.join(projectWriter.baseDir, dir);
      await projectWriter.createDirectory(fullPath);
      console.log(`📁 Created directory: ${dir}`);
    }

    console.log(
      '\n✨ Project generation complete! Your project is ready in the "project" directory.'
    );

    // Log the full directory structure
    console.log("\n📚 Project Structure:");
    const { execSync } = await import("child_process");
    try {
      const treeOutput = execSync("tree project", { encoding: "utf8" });
      console.log(treeOutput);
    } catch (error) {
      // Fallback if tree command is not available
      console.log("Directory structure available in ./project");
    }
  } catch (error) {
    console.error("❌ Generation Error:", error);
    process.exit(1);
  }
};

// Run the generator
runGenerator();

export { runGenerator };
