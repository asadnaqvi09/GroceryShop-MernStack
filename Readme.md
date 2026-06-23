# 🛍️ Grocery Shop (Bazaarly) — Full‑Stack MERN E‑Commerce

A complete grocery e‑commerce web application with a **customer storefront** and a **role‑based admin panel**.

Built as a MERN project:
- **Frontend**: React (Vite), Redux Toolkit, Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **Integrations**: Cloudinary (images), Nodemailer (OTP + order emails), Multer (uploads)

---

## ✨ Key Features

### Customer Website
- **Responsive UI** (mobile/tablet/desktop)
- **Landing page** sections (hero, featured/popular products, services)
- **Product listing** with filtering & sorting:
  - Category, price range, rating
  - Sort by price/rating
- **Product search** page
- **Product details** with quantity selection, related products, and **reviews**
- **Authentication**:
  - Register + **Email OTP verification**
  - Login / Logout
  - Forgot password → reset via OTP + reset token
- **Cart** (server-backed): add/update/remove/clear items + totals
- **Checkout**:
  - Save/select **delivery addresses**
  - Payment methods: **COD** and **Easypaisa**
  - Easypaisa **payment screenshot upload** + “under review” flow
- **My Orders**: view order history and statuses

### Admin Panel (role: `admin`)
- **Dashboard stats**: total orders, pending payments, low‑stock items
- **Products CRUD**: create/update/delete products + Cloudinary image upload
- **Order management**:
  - Filters for payment method/status and order status
  - View Easypaisa payment screenshot
  - Approve/reject payments, mark COD delivered/paid, cancel orders

---

## 📁 Project Structure

```
Grocery-Shop/
├─ Project-Client/   # React + Vite frontend
└─ Project-Server/   # Node + Express backend
```

---

## ✅ Prerequisites

- Node.js **18+** (recommended)
- npm (or yarn/pnpm)
- MongoDB Atlas database (or MongoDB URI you control)
- Cloudinary account (for product images)
- Gmail SMTP credentials (for OTP and order emails)

---

## 🔐 Environment Variables

### Backend (`Project-Server/.env`)

Create a file at `Project-Server/.env`:

```env
# Server
PORT=4000
NODE_ENV=development

# CORS (frontend URL)
CLIENT_URL=http://localhost:5173

# Auth
JWT_SECRET=your_long_random_secret

# MongoDB Atlas (used to build the connection string in config/db.js)
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password

# Cloudinary (product images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail SMTP)
SMTP_EMAIL=youremail@gmail.com
SMTP_PASSWORD=your_app_password
```

Notes:
- `CLIENT_URL` must match where the frontend runs, otherwise cookies/auth requests may fail.
- Use a **Gmail App Password** (recommended) instead of your normal password.

### Frontend (`Project-Client/.env`)

Create a file at `Project-Client/.env`:

```env
VITE_API_URL=http://localhost:4000
```

---

## 🚀 Run Locally

### 1) Backend

```bash
cd Project-Server
npm install
npm run dev
```

The API will run on `http://localhost:4000` (or your `PORT`).

### 2) Frontend

```bash
cd Project-Client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`.

---

## 🌱 Seed Products (Optional)

This project includes a seed script that inserts sample products.

```bash
cd Project-Server
node seedData/seed.js
```

---

## 🧭 Main Routes (Frontend)

- `/` — Landing page
- `/category` and `/category/:name` — Product listing
- `/:category/:name` — Product details
- `/search?search=...` — Search page
- `/cart` — Cart (auth required)
- `/checkout` — Checkout (auth required)
- `/orders` — My Orders (auth required)

Admin (role required):
- `/admin/dashboard`
- `/admin/products`
- `/admin/orders`

---

## 🔌 API Overview (Backend)

Base URL: `/api`

- `POST /users/register` (OTP email)
- `POST /users/verify-otp`
- `POST /users/resend-otp`
- `POST /users/login`
- `POST /users/logout`
- `POST /users/forgot-password`
- `POST /users/verify-reset-otp`
- `POST /users/resend-reset-otp`
- `POST /users/reset-password`

- `GET /products`
- `GET /products/search?q=...`
- `GET /products/category/:category`
- `GET /products/:id`
- `POST /products` (admin)
- `PUT /products/:id` (admin)
- `DELETE /products/:id` (admin)

- `POST /reviews/create` (auth)
- `GET /reviews/:productID`
- `PUT /reviews/:reviewID` (auth)
- `DELETE /reviews/:reviewID` (auth)

- `GET /cart` (auth)
- `POST /cart/add` (auth)
- `PUT /cart/:productId` (auth)
- `DELETE /cart/:productId` (auth)
- `DELETE /cart` (auth)

- `GET /addresses` (auth)
- `POST /addresses` (auth)
- `PUT /addresses/:id` (auth)
- `DELETE /addresses/:id` (auth)

- `POST /orders/create` (auth) — supports screenshot upload for Easypaisa
- `GET /orders/my-orders` (auth)
- `GET /orders/admin/all` (admin)
- `GET /orders/admin/stats` (admin)
- `POST /orders/verify` (admin)

---

## 📌 Deployment Notes

- The frontend is Vite-based and includes a `vercel.json` rewrite for SPA routing.
- When deploying, set:
  - Frontend env: `VITE_API_URL=<your_backend_url>`
  - Backend env: `CLIENT_URL=<your_frontend_url>`

---

## 👤 Author

**Asad Abbas** — Full‑Stack MERN Developer (UI/UX background)
