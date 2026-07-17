# Job Board Application

A full-stack job board with student and recruiter roles, built with:
- **Frontend:** React + React Router
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Auth:** JWT (JSON Web Tokens)

## Features
1. Student signup/login
2. Recruiter signup/login
3. Recruiters can post jobs
4. Students can browse jobs (with search/filter)
5. Students can apply to jobs (with optional cover letter)
6. Recruiters can view applicants and update application status

## Project Structure
```
job-board/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # PostgreSQL connection pool
│   │   ├── middleware/auth.js    # JWT verification
│   │   ├── middleware/role.js    # Role-based access control
│   │   ├── controllers/          # Route logic
│   │   ├── routes/               # API endpoints
│   │   └── server.js             # Express app entry point
│   ├── schema.sql                # Database schema
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/axios.js          # Axios instance with JWT interceptor
    │   ├── context/AuthContext.js
    │   ├── components/           # Navbar, PrivateRoute
    │   ├── pages/                # Login, Signup, JobList, JobDetails, etc.
    │   └── App.js
    ├── .env.example
    └── package.json
```

## Setup Instructions (VS Code)

### 1. Prerequisites
- Node.js (v18+) installed
- PostgreSQL installed and running locally (or a hosted instance)

### 2. Database Setup
Create a database and run the schema:
```bash
psql -U postgres
CREATE DATABASE job_board;
\q

psql -U postgres -d job_board -f backend/schema.sql
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
Edit `.env` and set your `DATABASE_URL` (PostgreSQL connection string) and a strong `JWT_SECRET`.

Run the backend:
```bash
npm run dev
```
The API will run at `http://localhost:5000`.

### 4. Frontend Setup
Open a **second terminal**:
```bash
cd frontend
npm install
cp .env.example .env
npm start
```
The React app will run at `http://localhost:3000` and will proxy API calls to `http://localhost:5000/api` (configurable via `REACT_APP_API_URL` in `frontend/.env`).

### 5. Using the App
1. Go to `http://localhost:3000/signup`
2. Create a **recruiter** account → post jobs → view applicants
3. Create a **student** account → browse jobs → apply

## API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/signup | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Authenticated |

### Jobs
| Method | Endpoint | Access |
|---|---|---|
| GET | /api/jobs | Public (supports ?search=&location=) |
| GET | /api/jobs/:id | Public |
| GET | /api/jobs/recruiter/mine | Recruiter |
| POST | /api/jobs | Recruiter |
| DELETE | /api/jobs/:id | Recruiter (owner only) |

### Applications
| Method | Endpoint | Access |
|---|---|---|
| POST | /api/applications/:jobId | Student |
| GET | /api/applications/mine | Student |
| GET | /api/applications/job/:jobId | Recruiter (owner only) |
| PATCH | /api/applications/:id/status | Recruiter (owner only) |

## Notes
- Passwords are hashed with bcrypt before storage.
- JWTs are stored in `localStorage` on the frontend and attached automatically to API requests via an axios interceptor.
- Role-based route protection is enforced on both frontend (React Router guards) and backend (middleware).
