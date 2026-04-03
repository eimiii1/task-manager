# Noto - Task Manager

A minimal, full-stack task management application. Users can register, login, create tasks, edit tasks, and delete tasks.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete tasks
- Tasks organized by status (In Progress / Completed)
- User ownership validation — only see your own tasks

## Design Philosophy

This is an MVP (Minimum Viable Product) — the focus is on **functionality over aesthetics**. The design is intentionally minimal:

- Clean, functional UI without unnecessary visual elements
- No animations or fancy effects beyond basic interactions
- Simple color scheme and typography
- Focus on core features: auth and task management

Future iterations will polish the design, add micro-interactions, and improve UX. For now, it works and solves the problem.

## Tech Stack

### Frontend
- **Next.js 14** — React framework with App Router
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — High-quality UI components
- **Framer Motion** — Smooth animations
- **Lucide React** — Icon library

### Backend
- **Next.js API Routes** — Serverless API endpoints
- **Node.js** — Runtime environment
- **Express patterns** — RESTful API design
- **MongoDB** — NoSQL database
- **Mongoose** — ODM for MongoDB
- **JWT** — JSON Web Tokens for authentication
- **bcrypt** — Password hashing
- **Zod** — Schema validation

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm or pnpm

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd task-manager
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
Create `.env.local` in the root directory:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
```

4. **Run the development server**
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── api/
│   ├── auth/
│   │   ├── register/route.ts
│   │   ├── login/route.ts
│   │   ├── logout/route.ts
│   │   └── check/route.ts
│   └── tasks/
│       ├── route.ts                 (GET all, POST create)
│       └── [id]/route.ts            (GET, PUT, DELETE)
├── components/
│   ├── Sidebar.tsx
│   ├── MobileHeader.tsx
│   └── ui/                          (shadcn components)
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── dashboard/page.tsx
├── tasks/
│   ├── page.tsx
│   └── [id]/page.tsx
└── layout.tsx
```

## API Routes

### Authentication
- `POST /api/auth/register` — Create new user account
- `POST /api/auth/login` — Sign in user
- `POST /api/auth/logout` — Sign out user
- `GET /api/auth/check` — Verify auth status

### Tasks
- `GET /api/tasks` — Fetch all user's tasks
- `POST /api/tasks` — Create new task
- `GET /api/tasks/[id]` — Fetch single task
- `PUT /api/tasks/[id]` — Update task
- `DELETE /api/tasks/[id]` — Delete task

## Usage

### Creating a Task
1. Navigate to Dashboard or Tasks page
2. Click "Create Task" button
3. Fill in title and description
4. Select status (In Progress / Completed)
5. Submit

### Editing a Task
1. Click on a task or Edit button
2. Modify title, description, or status
3. Click Update

### Deleting a Task
1. Click Delete button on any task
2. Task removed immediately

## Authentication Flow

1. **Registration** — User creates account with email/password
2. **Login** — User signs in, receives JWT token stored in httpOnly cookie
3. **Protected