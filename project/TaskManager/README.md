
# TaskManager

## Overview

TaskManager is a simple task management application built with Node.js and Express.js, utilizing MongoDB for data storage. It provides user authentication and allows users to perform CRUD operations on tasks.

## Features
- User authentication (registration, login, token-based authentication)
- Create, Read, Update, Delete (CRUD) operations for tasks
- Middleware for protecting routes

## Technologies Used
- **Language:** JavaScript
- **Framework:** Node.js with Express.js
- **Database:** MongoDB
- **Testing:** Jest and Supertest

## Setup Instructions
1. Clone the repository from GitHub.
2. Navigate to the project directory: `cd TaskManager`
3. Install the dependencies: `npm install`
4. Create a `.env` file in the root directory and add the necessary environment variables (e.g., `DB_URI`, `JWT_SECRET`).
5. Start the MongoDB server if not running.
6. Run the application: `npm start`
7. Access the application at `http://localhost:3000`
8. Run tests: `npm test`

## Directory Structure
```
TaskManager/
├── config/                # Configuration files
│   └── db.js             # Database connection configuration
├── controllers/           # Controllers for handling requests
│   ├── authController.js  # User authentication logic
│   └── taskController.js  # Task CRUD operations
├── middleware/            # Custom middleware
│   └── authMiddleware.js   # Middleware for protecting routes
├── models/                # Mongoose models
│   ├── User.js           # User model schema
│   └── Task.js           # Task model schema
├── routes/                # Express routes
│   ├── authRoutes.js      # Routes for user authentication
│   └── taskRoutes.js      # Routes for task operations
├── tests/                 # Unit and integration tests
│   ├── auth.test.js       # Tests for authentication functionality
│   └── task.test.js       # Tests for task CRUD operations
├── .env                   # Environment variables
├── .gitignore             # Files to be ignored by Git
├── package.json           # Project metadata and dependencies
├── package-lock.json      # Locks the versions of dependencies
└── server.js              # Main entry point of the application
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
export {};
