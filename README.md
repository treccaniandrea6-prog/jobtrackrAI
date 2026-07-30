# JobTrackr AI

A full stack SaaS application to manage job applications, with integrated AI tools for cover letter generation, job description analysis, CV feedback and interview preparation.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg)
![Node](https://img.shields.io/badge/Node.js-Express-green.svg)

---

## Overview

JobTrackr AI helps job seekers keep their applications organised and prepare better for each opportunity. Beyond standard tracking, it uses a large language model to generate tailored cover letters, break down job postings, review CV content and predict interview questions.

## Features

### Application management

- User registration and login with JWT authentication
- Protected routes and persistent sessions
- Full CRUD for job applications
- Search by company or position
- Filter by application status
- Dashboard with real-time statistics

### AI tools

- **Cover Letter Generator** — writes a tailored cover letter from company, position and optional job description
- **Job Description Analyzer** — extracts required skills, responsibilities, red flags and seniority level
- **CV Improvement** — returns actionable feedback, suggested action verbs and keywords
- **Interview Preparation** — generates likely questions by category, plus questions to ask the interviewer

## Tech Stack

**Frontend**

- React 19 with TypeScript
- Vite
- TailwindCSS
- React Router
- Axios
- React Markdown

**Backend**

- Node.js with Express
- TypeScript
- MySQL
- JSON Web Tokens
- bcrypt
- Groq SDK (Llama 3.3 70B)

## Architecture

The backend follows a layered structure where each layer has a single responsibility:

```
routes -> middleware -> controllers -> services -> models -> database
```

- **routes** define endpoints and attach authentication
- **middleware** verifies JWT and handles errors centrally
- **controllers** validate input and shape HTTP responses
- **services** contain business logic
- **models** hold typed SQL queries

## Project Structure

```
jobtrackr-ai/
├── backend/
│   └── src/
│       ├── config/          # environment validation, MySQL pool
│       ├── controllers/     # HTTP handlers
│       ├── middleware/      # auth and error handling
│       ├── models/          # SQL queries
│       ├── routes/          # endpoint definitions
│       ├── services/        # business logic, AI integration
│       ├── types/           # shared TypeScript interfaces
│       ├── utils/           # JWT helpers
│       └── app.ts           # server entry point
└── frontend/
    └── src/
        ├── api/             # Axios instance and API calls
        ├── components/      # reusable UI and layout
        ├── pages/           # route-level views
        ├── store/           # authentication context
        ├── types/           # shared TypeScript interfaces
        └── App.tsx          # router
```

## API Endpoints

### Authentication

| Method | Endpoint             | Description                      | Protected |
| ------ | -------------------- | -------------------------------- | --------- |
| POST   | `/api/auth/register` | Create a new account             | No        |
| POST   | `/api/auth/login`    | Authenticate and receive a token | No        |
| GET    | `/api/auth/profile`  | Get the current user             | Yes       |

### Applications

| Method | Endpoint          | Description                               | Protected |
| ------ | ----------------- | ----------------------------------------- | --------- |
| GET    | `/api/jobs`       | List applications with search and filters | Yes       |
| GET    | `/api/jobs/stats` | Get status statistics                     | Yes       |
| GET    | `/api/jobs/:id`   | Get a single application                  | Yes       |
| POST   | `/api/jobs`       | Create an application                     | Yes       |
| PUT    | `/api/jobs/:id`   | Update an application                     | Yes       |
| DELETE | `/api/jobs/:id`   | Delete an application                     | Yes       |

### AI

| Method | Endpoint                      | Description                  | Protected |
| ------ | ----------------------------- | ---------------------------- | --------- |
| POST   | `/api/ai/cover-letter`        | Generate a cover letter      | Yes       |
| POST   | `/api/ai/analyze-job`         | Analyze a job description    | Yes       |
| POST   | `/api/ai/improve-cv`          | Get CV feedback              | Yes       |
| POST   | `/api/ai/interview-questions` | Generate interview questions | Yes       |

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MySQL 8 or higher
- A Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repository

```bash
git clone https://github.com/treccaniandrea6-prog/jobtrackrAI.git
cd jobtrackrAI
```

### 2. Set up the database

```sql
CREATE DATABASE jobtrackr CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE jobtrackr;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  location VARCHAR(255) NULL,
  status ENUM('wishlist','applied','interview','offer','rejected') NOT NULL DEFAULT 'wishlist',
  salary VARCHAR(100) NULL,
  job_url TEXT NULL,
  description TEXT NULL,
  notes TEXT NULL,
  applied_at DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);
```

### 3. Configure and run the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=8000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=jobtrackr
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
GROQ_API_KEY=your_groq_api_key
```

Start the server:

```bash
npm run dev
```

The API runs on `http://localhost:8000`.

### 4. Configure and run the frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:8000/api
```

Start the development server:

```bash
npm run dev
```

The app runs on `http://localhost:5173`.

## Security Notes

- Passwords are hashed with bcrypt using 12 salt rounds
- All protected routes verify a JWT before reaching the controller
- Every database query on applications is scoped to the authenticated user, so users cannot read or modify other users' data
- Environment variables are validated at startup, so the server refuses to run with an incomplete configuration
- Unexpected errors are logged server-side and never exposed to the client

## Author

**Andrea Treccani**  
GitHub: https://github.com/treccaniandrea6-prog

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
