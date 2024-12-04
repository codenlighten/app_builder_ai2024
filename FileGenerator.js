import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

class FileGenerator {
  openai = null;

  constructor(apiKey) {
    if (apiKey) {
      this.setApiKey(apiKey);
    } else if (process.env.OPENAI_API_KEY) {
      this.setApiKey(process.env.OPENAI_API_KEY);
    }
  }

  setApiKey(apiKey) {
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }
    try {
      this.openai = new OpenAI({ apiKey });
    } catch (error) {
      throw new Error(`Failed to initialize OpenAI client: ${error.message}`);
    }
  }

  FILE_CONTENT_SCHEMA = {
    name: "file_content_schema",
    description: "Schema for generating file content",
    strict: true,
    schema: {
      type: "object",
      properties: {
        fileName: {
          type: "string",
          description: "Name of the file being generated",
        },
        fileType: {
          type: "string",
          description: "Type/extension of the file",
        },
        imports: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              path: { type: "string" },
            },
          },
          description: "List of imports required for the file",
        },
        functions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              params: { type: "array", items: { type: "string" } },
              body: { type: "string" },
              description: { type: "string" },
            },
          },
          description: "List of functions in the file",
        },
        exports: {
          type: "object",
          description: "Export configuration for the file",
        },
        additionalContent: {
          type: "string",
          description: "Any additional content needed in the file",
        },
      },
      required: ["fileName", "fileType", "imports", "functions"],
    },
  };

  async generateFileContent(fileInfo, appStructure) {
    const prompt = {
      role: "system",
      content: `You are an expert software developer. Generate complete file content based on the following file information and application structure:

      File Information:
      ${JSON.stringify(fileInfo, null, 2)}

      Application Structure Context:
      ${JSON.stringify(appStructure, null, 2)}

      Your task is to:
      1. Generate complete, production-ready code for this file
      2. Include all necessary imports based on dependencies
      3. Create fully implemented functions with proper error handling
      4. Add appropriate comments and documentation
      5. Follow best practices for the specified language/framework
      
      ### **Schema for JSON Output**
      ${JSON.stringify(this.FILE_CONTENT_SCHEMA.schema, null, 2)}
      
      ---Generate complete, functional code following best practices---
      **Important:** The code should be ready to use with proper error handling and documentation. Respond in JSON format.`,
    };

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [prompt],
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      const fileContent = JSON.parse(response.choices[0]?.message?.content);
      this.validateFileContent(fileContent);
      return this.formatFileContent(fileContent);
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw new Error(`Failed to generate file content: ${error.message}`);
    }
  }

  validateFileContent(content) {
    try {
      if (!content || typeof content !== "object") {
        throw new Error("Invalid content format");
      }

      const requiredFields = ["fileName", "fileType", "imports", "functions"];
      for (const field of requiredFields) {
        if (!(field in content)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      if (!Array.isArray(content.imports)) {
        throw new Error("Imports must be an array");
      }

      if (!Array.isArray(content.functions)) {
        throw new Error("Functions must be an array");
      }

      content.functions.forEach((func, index) => {
        if (!func.name || !func.body) {
          throw new Error(`Invalid function definition at index ${index}`);
        }
      });
    } catch (error) {
      console.error("Content Validation Error:", error);
      throw new Error(`Invalid file content: ${error.message}`);
    }
  }

  formatFileContent(content) {
    let formattedContent = "";

    // Add imports
    content.imports.forEach((imp) => {
      formattedContent += `import ${imp.name} from '${imp.path}';\n`;
    });
    formattedContent += "\n";

    // Add functions with documentation
    content.functions.forEach((func) => {
      // Add JSDoc comment
      formattedContent += "/**\n";
      formattedContent += ` * ${func.description}\n`;
      if (func.params) {
        func.params.forEach((param) => {
          formattedContent += ` * @param {*} ${param}\n`;
        });
      }
      formattedContent += " */\n";

      // Add function
      formattedContent += `${func.name} = (${
        func.params ? func.params.join(", ") : ""
      }) => {\n`;
      formattedContent += `${func.body}\n`;
      formattedContent += "}\n\n";
    });

    // Add additional content if present
    if (content.additionalContent) {
      formattedContent += content.additionalContent + "\n";
    }

    // Add exports
    if (content.exports) {
      formattedContent += `export ${JSON.stringify(content.exports)};\n`;
    }

    return formattedContent;
  }

  async generateAllFiles(appStructure) {
    const files = {};
    for (const file of appStructure.file_structure) {
      if (file.type === "file") {
        const content = await this.generateFileContent(file, appStructure);
        files[file.fileName] = content;
      }
    }
    return files;
  }
}

// Example usage:
// const generator = new FileGenerator();
// generator.generateFileContent(
//   {
//     fileName: "server.js",
//     type: "file",
//     content: "Entry point for the backend application",
//     dependencies: ["express", "mongoose", "dotenv"]
//   },
//   appStructure
// );

export default FileGenerator;
