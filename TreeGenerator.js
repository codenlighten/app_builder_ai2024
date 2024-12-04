import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

class TreeGenerator {
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

  APP_STRUCTURE_SCHEMA = {
    name: "app_structure_schema",
    description: "Schema for application structure generation",
    strict: true,
    schema: {
      type: "object",
      properties: {
        app_info: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name of the application" },
            description: {
              type: "string",
              description: "Brief description of the application",
            },
            language: {
              type: "string",
              description: "Programming language to be used",
            },
            framework: {
              type: "string",
              description: "Suggested framework for the application",
            },
          },
          required: ["name", "description", "language", "framework"],
        },
        file_structure: {
          type: "array",
          description: "List of files and directories in the application",
          items: {
            type: "object",
            properties: {
              fileName: {
                type: "string",
                description: "Name of the file or directory including path",
              },
              type: {
                type: "string",
                enum: ["file", "directory"],
                description: "Whether this is a file or directory",
              },
              content: {
                type: "string",
                description: "Expected content or purpose of the file",
              },
              dependencies: {
                type: "array",
                items: { type: "string" },
                description: "List of dependencies required for this file",
              },
            },
            required: ["fileName", "type", "content"],
          },
        },
        setup_instructions: {
          type: "array",
          description: "Step-by-step instructions to set up the project",
          items: {
            type: "string",
          },
        },
      },
      required: ["app_info", "file_structure", "setup_instructions"],
    },
  };

  async generateAppStructure(appName, appDescription, language) {
    const prompt = {
      role: "system",
      content: `You are an expert application architect specializing in creating well-structured applications. Generate a comprehensive application structure based on the following requirements:

      Application Name: ${appName}
      Description: ${appDescription}
      Language: ${language}

      Your task is to:
      1. Analyze the requirements and suggest an appropriate framework
      2. Create a detailed file structure including all necessary files and directories
      3. Provide setup instructions
      4. Consider best practices and common patterns for the chosen language/framework
      
      ### **Schema for JSON Output**
      ${JSON.stringify(this.APP_STRUCTURE_SCHEMA.schema, null, 2)}
      
      ---Provide a professional and well-organized application structure---
      **Important:** Include all necessary configuration files, documentation, and testing structure. Respond in JSON format.`,
    };

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [prompt],
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      const structure = JSON.parse(response.choices[0]?.message?.content);
      this.validateStructure(structure);
      return structure;
    } catch (error) {
      console.error("OpenAI API Error:", error);
      throw new Error(`Failed to generate app structure: ${error.message}`);
    }
  }

  validateStructure(structure) {
    try {
      if (!structure || typeof structure !== "object") {
        throw new Error("Invalid structure format");
      }

      const requiredSections = [
        "app_info",
        "file_structure",
        "setup_instructions",
      ];
      for (const section of requiredSections) {
        if (!(section in structure)) {
          throw new Error(`Missing required section: ${section}`);
        }
      }

      // Validate app_info
      const requiredAppInfo = ["name", "description", "language", "framework"];
      for (const field of requiredAppInfo) {
        if (!(field in structure.app_info)) {
          throw new Error(`Missing required field in app_info: ${field}`);
        }
      }

      // Validate file_structure
      if (!Array.isArray(structure.file_structure)) {
        throw new Error("file_structure must be an array");
      }

      structure.file_structure.forEach((file, index) => {
        if (!file.fileName || !file.type || !file.content) {
          throw new Error(`Invalid file structure entry at index ${index}`);
        }
        if (!["file", "directory"].includes(file.type)) {
          throw new Error(`Invalid file type at index ${index}: ${file.type}`);
        }
      });

      // Validate setup_instructions
      if (!Array.isArray(structure.setup_instructions)) {
        throw new Error("setup_instructions must be an array");
      }
    } catch (error) {
      console.error("Structure Validation Error:", error);
      throw new Error(`Invalid app structure: ${error.message}`);
    }
  }

  async generateApplication(appName, appDescription, language) {
    const appStructure = await this.generateAppStructure(
      appName,
      appDescription,
      language
    );
    console.log(
      "Generated Application Structure:",
      JSON.stringify(appStructure, null, 2)
    );
    return appStructure;
  }
}

// Example usage:
const generator = new TreeGenerator();
generator.generateApplication(
  "TaskManager",
  "A simple task management application with user authentication and task CRUD operations",
  "JavaScript"
);

export default TreeGenerator;
