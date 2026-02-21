# 🌊 TaskFlow - Premium Task Management System

TaskFlow is a state-of-the-art, full-stack task management platform built with a "Clean & Simple" yet high-fidelity aesthetic. It features a robust Node.js backend and a vibrant React frontend, providing a seamless experience for administrators and team members alike.

---

## 🚀 Core Features

### 🔐 Advanced Authentication
- **Identity Restoration**: Full support for user display names across the entire platform.
- **Secure Role Selection**: Register as either an **Administrator** or a **Standard User**.
- **UX-First Login**: Includes password visibility toggles and real-time validation for an effortless entry.
- **JWT Security**: Industry-standard token-based authentication for secure session management.

### 👑 Admin Empowerment (Control Center)
- **Universal Task Creation**: Create complex tasks with extended character limits (200 for titles, 5,000 for descriptions).
- **Multi-User Assignment**: Distribute tasks to multiple team members in a single action.
- **Real-Time Progress Oversight**: Track global completion rates with dynamic SVG progress gauges.
- **User Management**: Direct control over the team roster with user deletion and task synchronization.
- **Full CRUD Control**: Edit or delete system-wide tasks with immediate UI updates.

### 👤 Standard User Experience (Workspace)
- **Focused Task Tracking**: A personal dashboard showing assigned tasks with clear progress indicators.
- **Horizontal Task Cards**: Premium full-width layout for better readability and information density.
- **One-Click Completion**: Instantly toggle task status between "Pending" and "Complete" with fluid animations.
- **Detailed Task Briefs**: Specialized read-only modals for deep-diving into task requirements.

---

## UI/UX & Design Philosophy

TaskFlow follows a **Production-Level Glassmorphism** design system:

- **Aesthetic Excellence**: Vibrant HSL-tailored colors, smooth gradients, and deep shadows for a premium feel.
- **Dynamic Interaction**: Powered by `framer-motion` for fluid page transitions, card hover effects, and modal entrance animations.
- **Intelligent Modals**:
    - **Vertical Scrolling**: Custom scrollbars and fixed headers/footers ensure long content remains perfectly accessible.
    - **Responsive Sizing**: Modals adapt seamlessly to both mobile and desktop viewports.
- **Accessibility & Clarity**: High-contrast typography (using the 'Outfit' font) and clear status iconography.

---

## 🛠️ Technical Architecture

### Frontend (Client)
- **Vite + React 19**: Modern build tooling and the latest React features.
- **Tailwind CSS**: Utility-first styling for a custom, highly-responsive design.
- **Lucide Icons**: Consistent, high-quality iconography across the platform.
- **Zod + React Hook Form**: Type-safe form handling and complex validation logic.

### Backend (Server)
- **Express + TypeScript**: Robust, type-safe API architecture.
- **Prisma ORM**: Modern database access layer with PostgreSQL/SQLite support.
- **Role-Based Middlewares**: Granular security checks for protected admin routes.
- **Bcrypt**: Industrial-grade password hashing for maximum security.

---

## 🏁 Getting Started

### 1. Initialize the Backend
```bash
cd server
npm install
# Configure your .env (DATABASE_URL, JWT_SECRET)
npx prisma db push
npm run dev
```

### 2. Initialize the Frontend
```bash
cd client
npm install
npm run dev
```

---

## 🧪 Quality Assurance

Each component of TaskFlow is verified through a rigorous testing suite:

- **Frontend**: Vitest + React Testing Library for component integrity.
- **Backend**: Vitest for API endpoint verification and controller logic.

```bash
# To run tests
npm test
```

---
*Developed for excellence. Focused on productivity.*

