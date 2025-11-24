# vestr-test-task

Express backend + React frontend with TypeScript

## Available Commands

### `npm run install:all`
Install dependencies for both frontend and backend projects.

### `npm run dev`
Run both frontend and backend in development/watch mode.

### `npm run build`
Build both frontend and backend for production.

### `npm start`
Run the compiled backend server.

## Data Files

### `backend/vibe.json`
Contains the quiz questions data for the financial literacy test. This JSON file includes 30 questions with their:
- Question text
- Multiple choice options
- Correct answer index

The backend loads this file at runtime to serve quiz questions and validate answers. The file is cached in memory after the first read for improved performance.
