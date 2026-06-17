# StoreRate — Full-Stack Rating Platform

A complete web application for rating registered stores, built with:
- **Backend**: NestJS + TypeORM
- **Database**: PostgreSQL
- **Frontend**: React + CSS Modules

---

## Features by Role

| Feature | Admin | User | Store Owner |
|---|:---:|:---:|:---:|
| Dashboard with stats | ✅ | — | ✅ |
| Add users & stores | ✅ | — | — |
| View all users (filter/sort) | ✅ | — | — |
| View all stores (filter/sort) | ✅ | ✅ | — |
| Submit / update ratings | — | ✅ | — |
| View store raters list | — | — | ✅ |
| Change password | — | ✅ | ✅ |

---

## Project Structure

```
store-rating-app/
├── backend/               # NestJS API
│   ├── src/
│   │   ├── auth/          # JWT auth, login, register, password change
│   │   ├── users/         # User CRUD, admin dashboard stats
│   │   ├── stores/        # Store CRUD, owner dashboard
│   │   ├── ratings/       # Submit/update ratings
│   │   └── common/        # Roles guard & decorator
│   ├── .env.example
│   └── Dockerfile
├── frontend/              # React app
│   ├── src/
│   │   ├── components/    # Reusable UI (Table, StarRating, Button, etc.)
│   │   ├── pages/
│   │   │   ├── admin/     # Dashboard, Users, Stores, Add User, Add Store, User Detail
│   │   │   ├── user/      # Browse & rate stores
│   │   │   └── owner/     # Store owner dashboard
│   │   ├── context/       # AuthContext
│   │   ├── services/      # Axios API layer
│   │   └── utils/         # Form validation helpers
│   ├── nginx.conf
│   └── Dockerfile
└── docker-compose.yml
```

---

## Quick Start (Docker)

```bash
git clone <repo>
cd store-rating-app
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api

---

## Manual Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DB credentials and JWT secret
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

The React dev server proxies `/api` requests to `http://localhost:4000`.

---

## Seeding an Admin User

After the backend starts, run this SQL against your `store_rating` database to create the first admin:

```sql
INSERT INTO users (id, name, email, password, address, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'System Administrator Account',
  'admin@storerate.com',
  -- bcrypt hash of "Admin@123" (8 chars, 1 uppercase, 1 special)
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  '123 Admin Street, City, State 00000',
  'admin',
  NOW(), NOW()
);
```

Or use the `/api/auth/register` endpoint once, then manually update `role = 'admin'` in the DB.

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register normal user |
| POST | `/api/auth/login` | None | Login (all roles) |
| PUT | `/api/auth/password` | JWT | Change own password |

### Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users (filter: name, email, address, role; sort: sortBy, order) |
| POST | `/api/users` | Create user |
| GET | `/api/users/dashboard` | Stats (totalUsers, totalStores, totalRatings) |
| GET | `/api/users/:id` | User detail (includes storeRating if store_owner) |

### Stores
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/stores` | JWT | List stores (filter: name, address; includes userRating) |
| POST | `/api/stores` | Admin | Create store (optionally assign owner) |
| GET | `/api/stores/owner/dashboard` | Store Owner | Owner's store stats + raters list |

### Ratings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/ratings` | User | Submit or update rating `{ storeId, value: 1-5 }` |

---

## Form Validation Rules

| Field | Rule |
|-------|------|
| Name | 20–60 characters |
| Email | Standard email format |
| Address | Max 400 characters |
| Password | 8–16 chars, ≥1 uppercase, ≥1 special character |

---

## Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=store_rating
JWT_SECRET=your_strong_secret_here
PORT=4000
FRONTEND_URL=http://localhost:3000
```
