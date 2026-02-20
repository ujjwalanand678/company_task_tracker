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
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Networking**: Axios
- **Testing**: Vitest + React Testing Library + JSDOM

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

The project includes a robust test suite covering multiple layers:
- **Unit Tests**: `TaskCard.test.tsx`, `Login.test.tsx` (Validates rendering and interactions).
- **Integration Test**: `api.test.tsx` (Ensures the Dashboard correctly fetches and displays data from the API).
- **Configuration**: Uses `vitest` with `jsdom` and `@testing-library/jest-dom` for reliable DOM assertions.

---
*Built as a hiring evaluation assignment.*
