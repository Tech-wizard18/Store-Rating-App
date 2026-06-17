# Store Rating Platform

A full-stack web application where users can submit ratings for registered stores.

## Tech Stack

- **Backend:** Node.js + Express.js
- **Database:** MySQL
- **Frontend:** React.js

## Features

### Roles
| Role | Access |
|------|--------|
| Admin | Dashboard stats, manage users & stores |
| Normal User | Browse stores, submit/modify ratings |
| Store Owner | View their store's ratings & raters |

### Key Functionality
- JWT-based auth with role-based routing
- Admin dashboard: total users, stores, ratings
- Admin can add users (any role) and stores
- Filter + sort on all table listings
- Normal users: search stores, submit/update ratings (1–5 stars)
- Store owner: see average rating + list of raters
- Password change for all roles

## Form Validations
- Name: 20–60 characters
- Address: max 400 characters
- Password: 8–16 chars, requires uppercase + special character
- Email: standard format

## Project Structure

```
store-rating-app/
├── backend/
│   ├── src/
│   │   ├── config/       # DB connection + init
│   │   ├── controllers/  # Route logic
│   │   ├── middleware/   # Auth + validation
│   │   └── routes/       # API routes
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/          # Axios instance
    │   ├── components/   # Shared UI (Navbar, StarRating, SortIcon)
    │   ├── context/      # Auth context
    │   └── pages/        # admin / user / storeowner / shared
    └── package.json
```

## Getting Started

### 1. Database Setup (MySQL)

```sql
CREATE DATABASE store_rating_db;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run dev
```

The server starts on `http://localhost:5000`.  
On first run, it creates the tables and seeds a default admin:

> Email: `admin@storerating.com`  
> Password: `Admin@12345`

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Opens at `http://localhost:3000`. Proxies API calls to port 5000.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register new user |
| POST | /api/auth/login | — | Login |
| PUT | /api/auth/change-password | Any | Change password |
| GET | /api/admin/dashboard | Admin | Stats |
| GET | /api/admin/users | Admin | List users |
| POST | /api/admin/users | Admin | Create user |
| GET | /api/admin/users/:id | Admin | User detail |
| GET | /api/admin/stores | Admin | List stores |
| POST | /api/admin/stores | Admin | Create store |
| GET | /api/stores | User | Browse stores |
| POST | /api/stores/:id/rate | User | Submit/update rating |
| GET | /api/store-owner/dashboard | Store Owner | My store dashboard |
