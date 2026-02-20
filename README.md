# TaskFlow - Full Stack Task Tracker

A professional, full-stack task management application featuring a premium React frontend and a robust Node.js/Prisma backend. Built as a hiring evaluation assignment to demonstrate UI/UX skills, API integration, and testing proficiency.

## 🚀 Project Overview

TaskFlow is designed for efficient task management with role-based access control. It features a "Clean & Simple" yet high-fidelity aesthetic, ensuring a premium user experience across all devices.

### Key Components

- **[Frontend (Client)](./client)**: React 19, TypeScript, Tailwind CSS, Framer Motion, and Vitest.
- **[Backend (Server)](./server)**: Node.js, Express, Prisma ORM, SQLite, and JWT Authentication.

## ✨ Features

- **Authentication**: Secure Login and Registration with JWT and role selection (Standard vs. Admin).
- **Task Management**: Full CRUD operations with real-time feedback.
- **Role-Based Access**:
  - **Standard User**: Manage personal tasks.
  - **Admin**: Oversight of all system users and tasks.
- **Premium UI/UX**:
  - Glassmorphic design with animated background decorations.
  - Fluid page transitions and micro-interactions.
  - Desktop and mobile optimized responsive layout.
- **Robust Testing**: Comprehensive unit and integration tests for both frontend and backend.

## 🛠️ Quick Start

To get the entire system running locally, follow these steps:

### 1. Prerequisites
- Node.js (v18+)
- npm

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```
*The server will start at `http://localhost:3000`*

### 3. Frontend Setup
```bash
cd ../client
npm install
cp .env.example .env
npm run dev
```
*The application will be available at `http://localhost:5173`*

## 🧪 Running Tests

### Frontend Tests
```bash
cd client
npm test
```

### Backend Tests
```bash
cd server
npm test
```

## 📂 Repository Structure

```text
task_tracker/
├── client/              # React Frontend Application
│   ├── src/             # Source code
│   ├── tests/           # Unit and Integration tests
│   └── README.md        # Frontend-specific documentation
└── server/              # Node.js Backend API
    ├── src/             # Source code
    ├── prisma/          # Database schema and migrations
    ├── tests/           # API and Unit tests
    └── README.md        # Backend-specific documentation
```

---
*Developed for hiring evaluation.*
