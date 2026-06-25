

<h1 align="center">BookReads</h1>

<p align="center">
  Full-stack MERN bookstore — browse, cart, checkout, Firebase auth, and a JWT-secured admin dashboard with sales analytics.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&labelColor=20232a" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white" />
  <img alt="Redux Toolkit" src="https://img.shields.io/badge/Redux%20Toolkit-2-764ABC?logo=redux&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC?logo=tailwind-css&logoColor=white" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" />
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=white" />
</p>

---

## Overview

BookReads is an online bookstore built on the **MERN** stack (MongoDB, Express, React, Node.js). Customers can browse books by category, view book details, add items to a cart, and place orders. Admins get a separate, JWT-protected dashboard to manage the book catalog and view store analytics — total orders, total revenue, trending books, and a monthly sales chart.

The project is split into two independent apps:

- **`frontend/`** — Vite + React SPA styled with Tailwind CSS, state managed via Redux Toolkit and RTK Query
- **`backend/`** — REST API built with Express and MongoDB (Mongoose)

---

## Features

### Customer

- Home page with hero banner, top sellers carousel, recommended books, and category filtering
- Book detail pages with description, pricing, and category
- Shopping cart with add/remove and live subtotal calculation
- Checkout flow with shipping address form and order placement (cash on delivery)
- User authentication via Firebase (email/password and Google sign-in)
- Per-user order history page
- Protected routes — unauthenticated users are redirected to login

### Admin

- Separate admin login at `/admin` secured with JWT
- Dashboard with key metrics: total books, total sales, trending books, total orders
- Monthly revenue and orders bar chart (Chart.js)
- Add, edit, and delete books from the inventory
- Full catalog management table

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + Vite |
| State Management | Redux Toolkit + RTK Query (data fetching, caching, mutations) |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| User Auth | Firebase Authentication (email/password + Google OAuth) |
| Forms | React Hook Form |
| Charts | Chart.js + react-chartjs-2 |
| UI Utilities | SweetAlert2, Swiper, React Icons, Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Admin Auth | JSON Web Tokens (jsonwebtoken) + bcrypt |

---

## Architecture Highlights

- **Dual authentication model** — user auth is handled entirely by Firebase on the client (Google OAuth + email/password), while admin auth uses a separate server-side JWT flow with bcrypt-hashed passwords and a `verifyAdminToken` Express middleware guarding all write operations
- **RTK Query for data fetching** — all API calls go through RTK Query endpoints (`booksApi`, `ordersApi`) giving automatic caching, loading/error states, and cache invalidation on mutations without any manual `useEffect` fetching
- **Role-based route protection** — `PrivateRoute` checks for a Firebase `currentUser` for customer routes; `AdminRoute` checks for a valid JWT in `localStorage` for admin routes — both implemented as React Router wrapper components
- **Seed scripts for reproducibility** — `seed:books` populates the MongoDB catalog from a local JSON file; `seed:admin` creates or updates an admin account — making the dev environment fully reproducible from a clean state
- **Separated concerns** — backend follows an MVC-style layout with distinct `model`, `controller`, and `route` files per resource (`books`, `orders`, `users`, `stats`)

---

## Project Structure

```
BookReads/
├── backend/
│   ├── index.js                  # Express entry point, MongoDB connection
│   └── src/
│       ├── books/                # Book model, controller, routes (CRUD)
│       ├── orders/               # Order model, controller, routes
│       ├── users/                # Admin user model + JWT login route
│       ├── stats/                # Admin dashboard stats aggregation
│       ├── middleware/           # verifyAdminToken JWT middleware
│       └── seed/                 # createAdmin.js + seedBooks.js CLI scripts
└── frontend/
    └── src/
        ├── components/           # Navbar, Footer, Login, Register, AdminLogin, Loading
        ├── pages/
        │   ├── home/             # Banner, TopSellers, Recommended, News sections
        │   ├── books/            # BookCard, SingleBook, CartPage, CheckoutPage, OrderPage
        │   └── dashboard/        # Admin dashboard, AddBook, UpdateBook, ManageBooks, RevenueChart
        ├── redux/                # Store config, booksApi, ordersApi, cartSlice
        ├── context/              # Firebase AuthContext (register, login, Google, logout)
        ├── routers/              # App router, PrivateRoute, AdminRoute
        └── firebase/             # Firebase initialization
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database (free tier works)
- A [Firebase](https://console.firebase.google.com/) project with **Email/Password** and **Google** sign-in providers enabled (Authentication → Sign-in method)

### 1. Clone and install

```bash
git clone https://github.com/anagha2312/BookReads.git
cd BookReads
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
DB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/book-store?retryWrites=true&w=majority
JWT_SECRET_KEY=<a long random string — e.g. output of openssl rand -hex 32>
PORT=5000
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/` (Firebase config from Firebase Console → Project Settings → Your apps):

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_API_KEY=...
VITE_Auth_Domain=...
VITE_PROJECT_ID=...
VITE_STORAGE_BUCKET=...
VITE_MESSAGING_SENDERID=...
VITE_APPID=...
```

### 4. Seed the database

From `backend/` (with `.env` configured and MongoDB reachable):

```bash
npm run seed:books                        # populates catalog with sample books
npm run seed:admin -- <username> <password>  # creates the admin account
```

### 5. Run

In two terminals:

```bash
# Terminal 1 — API
cd backend && npm run start:dev    # http://localhost:5000

# Terminal 2 — Frontend
cd frontend && npm run dev         # http://localhost:5173
```

- Storefront: `http://localhost:5173`
- Admin panel: `http://localhost:5173/admin`

---

## API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/admin` | — | Admin login, returns JWT |
| GET | `/books` | — | List all books |
| GET | `/books/:id` | — | Get single book |
| POST | `/books/create-book` | Admin JWT | Create a book |
| PUT | `/books/edit/:id` | Admin JWT | Update a book |
| DELETE | `/books/:id` | Admin JWT | Delete a book |
| POST | `/orders` | — | Create an order |
| GET | `/orders/email/:email` | — | Get orders by user email |
| GET | `/admin` | Admin JWT | Dashboard stats |

Admin-protected routes require an `Authorization: Bearer <token>` header using the JWT returned from `/auth/admin`.

---

## Available Scripts

**Backend** (`backend/`)

| Script | Description |
|---|---|
| `npm run start:dev` | Start API with nodemon (auto-reload) |
| `npm start` | Start API with node |
| `npm run seed:books` | Insert sample books if collection is empty |
| `npm run seed:admin` | Create or update the admin user |

**Frontend** (`frontend/`)

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---


---

<p align="center">Built by <a href="https://github.com/anagha2312">Anagha Prajapati</a></p>
