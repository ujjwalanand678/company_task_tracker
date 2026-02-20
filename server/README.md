# Task Tracker Backend

A simple backend system for managing tasks with user authentication and role-based access control.

## Technology Stack
- **Node.js**: Runtime environment
- **Express**: Web framework
- **Prisma**: ORM for database management
- **SQLite**: Database (Local file)
- **JWT**: Authentication
- **Bcryptjs**: Password hashing
- **Zod**: Validation

## Project Structure
```text
server/
├── prisma/             # Prisma schema and migrations
├── src/
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Authentication and role checks
│   ├── routes/         # API routes
│   ├── services/       # Database services
│   ├── utils/          # Utility functions
│   └── index.ts        # Entry point
├── tests/              # Unit and API tests
├── .env.example        # Template for environment variables
└── README.md           # Documentation
```

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd task_tracker/server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file and fill in your secrets.
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure `JWT_SECRET` is set to a secure string.*

4. **Initialize Database**:
   Run the Prisma migrations to set up your SQLite database.
   ```bash
   npx prisma migrate dev --name init
   ```

## Running the Server

- **Development Mode** (with auto-reload):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm run build
  npm start
  ```

The server will be running at `http://localhost:3000` (or the port specified in your `.env`).

## Running Tests

To execute the test suite (Unit and API tests):
```bash
npm test
```

## API Documentation

### Authentication
- `POST /auth/register`: Register a new user (`email`, `password`, `role`).
- `POST /auth/login`: Login and receive a JWT token.

### Tasks
- `POST /tasks`: Create a new task (`title`, `description`). [Protected]
- `GET /tasks`: List all tasks (Users see their own, Admin sees all). [Protected]
- `PUT /tasks/:id`: Update a task (`title`, `description`, `status`). [Protected]
- `DELETE /tasks/:id`: Delete a task. [Protected]

### User Management
- `GET /profile`: View your own profile. [Protected]
- `GET /admin/users`: View all users. [Admin Only]
- `DELETE /admin/users/:id`: Delete a user. [Admin Only]

## Sample API Requests

### Register
```bash
curl -X POST http://localhost:3000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "user@example.com", "password": "password123"}'
```
