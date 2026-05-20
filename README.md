# Smart Leads Dashboard

A production-grade MERN stack application for managing sales leads with a modern dashboard UI, advanced filtering, RBAC, and analytics.

![Dashboard Preview](./docs/dashboard-preview.png)

## Features

- **Authentication System** - JWT-based auth with access/refresh tokens, HTTP-only cookies, rate limiting
- **Role-Based Access Control** - Admin (full access) and Sales User (CRUD, no delete)
- **Lead Management** - Full CRUD operations with status and source tracking
- **Advanced Filtering** - Search by name/email, filter by status/source, sort by date
- **Pagination** - Server-side pagination with 10 records per page
- **CSV Export** - Export filtered leads to CSV
- **Dashboard Analytics** - Charts and stats using Recharts
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Toast Notifications** - Real-time feedback for user actions
- **Form Validation** - Client-side (Zod + React Hook Form) and server-side (Zod)

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router v6
- TanStack Query (React Query)
- Zustand (state management)
- React Hook Form + Zod
- Framer Motion
- Recharts
- Lucide Icons

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- Zod validation
- Helmet, CORS, Rate Limiting

### DevOps
- Docker + Docker Compose
- Nginx (frontend proxy)

## Project Structure

```
Smart_Leads_Dashboard/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment & database config
│   │   ├── constants/       # Application constants
│   │   ├── controllers/     # Route controllers
│   │   ├── interfaces/      # TypeScript interfaces
│   │   ├── middlewares/     # Auth, validation, error handling
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Helper functions
│   │   ├── validators/      # Zod schemas
│   │   └── app.ts           # Express app entry point
│   ├── scripts/
│   │   └── seed.ts          # Database seeder
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # API client & services
│   │   ├── components/
│   │   │   ├── common/      # Reusable UI components
│   │   │   ├── forms/       # Form components
│   │   │   └── layout/      # Layout components
│   │   ├── context/         # React contexts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand stores
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
└── docker-compose.yml
```

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Docker & Docker Compose (optional)

### Local Development

#### Backend Setup

```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env

# Start MongoDB (if not already running)
# mongod

# Run database seeder
npm run seed

# Start development server
npm run dev
```

#### Frontend Setup

```bash
cd frontend
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Docker Setup

```bash
# Build and start all services
docker compose up --build

# Run in detached mode
docker compose up -d --build

# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v
```

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/smart-leads |
| JWT_ACCESS_SECRET | Access token secret | (change in production) |
| JWT_REFRESH_SECRET | Refresh token secret | (change in production) |
| JWT_ACCESS_EXPIRY | Access token expiry | 15m |
| JWT_REFRESH_EXPIRY | Refresh token expiry | 7d |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |
| RATE_LIMIT_WINDOW_MS | Rate limit window | 900000 |
| RATE_LIMIT_MAX | Max requests per window | 100 |
| BCRYPT_ROUNDS | Password hashing rounds | 12 |

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | /api |

## Demo Credentials

After running the seeder (`npm run seed` in backend):

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smartleads.com | admin123 |
| Sales | sales@smartleads.com | sales123 |

## API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### Leads

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/leads` | Get all leads (paginated) | All |
| GET | `/api/leads/:id` | Get single lead | All |
| POST | `/api/leads` | Create lead | Admin, Sales |
| PUT | `/api/leads/:id` | Update lead | Admin, Sales |
| DELETE | `/api/leads/:id` | Delete lead | Admin only |
| GET | `/api/leads/export/csv` | Export leads as CSV | All |
| GET | `/api/leads/stats` | Get dashboard stats | All |

### Query Parameters (GET /api/leads)

| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Search by name or email |
| status | string | Filter by status (New, Contacted, Qualified, Lost) |
| source | string | Filter by source (Website, Instagram, Referral) |
| sort | string | Sort order (latest, oldest) |
| page | number | Page number |
| limit | number | Items per page |

### API Response Format

```json
{
  "success": true,
  "message": "Leads fetched successfully.",
  "data": [...],
  "meta": {
    "total": 50,
    "page": 1,
    "pages": 5,
    "limit": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Role Permissions

| Action | Admin | Sales |
|--------|-------|-------|
| View leads | Yes | Yes |
| Create leads | Yes | Yes |
| Update leads | Yes | Yes |
| Delete leads | Yes | No |
| Export CSV | Yes | Yes |
| View dashboard | Yes | Yes |

## Deployment

### Production Build

```bash
# Backend
cd backend
npm install
npm run build
NODE_ENV=production node dist/app.js

# Frontend
cd frontend
npm install
npm run build
# Serve dist/ with nginx or any static server
```

### Docker Production

```bash
docker compose -f docker-compose.yml up -d --build
```

### Environment Setup for Production

1. Set strong JWT secrets (use `openssl rand -hex 32`)
2. Use MongoDB Atlas or a managed MongoDB service
3. Set `NODE_ENV=production`
4. Configure proper CORS origin
5. Use HTTPS in production
6. Set up proper rate limiting

## Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run seed` | Seed database with demo data |
| `npm run lint` | Run ESLint |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT access tokens (15 min expiry)
- JWT refresh tokens (7 day expiry)
- HTTP-only cookies for refresh tokens
- Rate limiting on auth routes (20 req/15 min)
- General API rate limiting (100 req/15 min)
- Helmet security headers
- CORS protection
- Input validation with Zod
- MongoDB injection prevention

