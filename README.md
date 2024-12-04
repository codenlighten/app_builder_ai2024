# AI Project Generator

An advanced AI-powered project generator that creates complete application structures and generates corresponding code files based on project descriptions.

## Overview

This project consists of three main components:

- **TreeGenerator**: Generates the complete file and directory structure for a project
- **FileGenerator**: Creates the actual code content for each file
- **ProjectWriter**: Handles file system operations to create the project structure

## Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
cd [repository-name]
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

```bash
cp .env.example .env
```

Add your OpenAI API key to the `.env` file:

```
OPENAI_API_KEY=your_api_key_here
```

## Usage

Run the generator:

```bash
node mainEngine.js
```

The generator will:

1. Clean any existing project directory
2. Generate a complete application structure
3. Create code content for all files
4. Write the files to disk in the correct directory structure

### Example Project Generation

```javascript
const runGenerator = async () => {
  const treeGenerator = new TreeGenerator();
  const fileGenerator = new FileGenerator();
  const projectWriter = new ProjectWriter();

  const treeStructure = await treeGenerator.generateApplication(
    "YourApp",
    "Your app description",
    "JavaScript"
  );

  const files = await fileGenerator.generateAllFiles(treeStructure);
  // Files will be written to ./project directory
};
```

## Project Structure

The generator creates a complete project structure in the `project` directory:

```
project/
├── backend/
│   ├── server.js
│   ├── config/
│   ├── models/
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   └── ...
└── ...
```

## Components

### TreeGenerator

- Generates application structure based on project requirements
- Creates a complete file tree with dependencies
- Handles both frontend and backend structures

### FileGenerator

- Generates actual code content for each file
- Handles imports, functions, and exports
- Creates production-ready code with proper documentation

### ProjectWriter

- Manages file system operations
- Creates directories and files
- Handles cleaning and writing operations

## Error Handling

The project includes comprehensive error handling:

- Directory creation errors
- File writing errors
- API response validation
- Structure generation errors

## Dependencies

- OpenAI API
- Node.js fs/promises
- path module
- dotenv

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Note

This is an AI-powered tool. While it generates production-ready code, it's recommended to review the generated code before using it in production environments.
# app_builder_ai2024
