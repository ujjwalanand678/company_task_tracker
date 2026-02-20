# Task Tracker - Frontend

A modern, responsive React-based task management application with role-based access control.

## ✨ Features

- **Authentication**: Secure Login and Registration with JWT.
- **Role-Based Access**:
  - **User**: Manage personal tasks (Create, View, Edit, Delete).
  - **Admin**: View all system users and all tasks across the platform.
- **Responsive Design**: Premium UI built with Tailwind CSS, fully optimized for mobile and desktop.
- **Form Validation**: Robust client-side validation using React Hook Form and Zod.
- **API Integration**: Connected to a Node.js/Express/Prisma backend.

## 🚀 Tech Stack

- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Networking**: Axios
- **Testing**: Vitest + React Testing Library

## 📦 Setup Instructions

1. **Prerequisites**: Ensure you have the [Backend API](file:///e:/PROJECTS/GIT%20FOR%20COMPANY%20TASK/task_tracker/server) running.
2. **Installation**:
   ```bash
   cd client
   npm install
   ```
3. **Environment**:
   Copy `.env.example` to `.env` and configure your API URL:
   ```bash
   cp .env.example .env
   ```
   *Default: `VITE_API_URL=http://localhost:3000`*

## 🛠️ Commands

- **Run Development**: `npm run dev`
- **Build Production**: `npm run build`
- **Run Tests**: `npm test`

## 🧪 Testing

The project includes:
- **Component Tests**: `TaskCard.test.tsx` (Validates UI rendering and logic).
- **Page Tests**: `Login.test.tsx` (Ensures form accessibility and initial state).
- **Integration Configuration**: Ready for API mocking using Vitest.

---
*Built as a hiring evaluation assignment.*
