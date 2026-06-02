# 🍿 Namkeen Store — Full-Stack E-Commerce

> A production-ready Indian namkeen e-commerce platform built with Next.js, Node.js, MongoDB & Razorpay.

---

## 🗂 Project Structure

```
namkeen-store/
├── backend/                  # Node.js + Express API
│   ├── config/
│   │   ├── db.js             # MongoDB connection
│   │   └── cloudinary.js     # Image upload config
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── cartController.js
│   │   ├── paymentController.js
│   │   └── miscControllers.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect/admin
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   └── index.js          # Review, Cart, Wishlist, Coupon, Newsletter
│   ├── routes/               # All API routes
│   ├── utils/
│   │   ├── sendEmail.js      # Nodemailer templates
│   │   └── seeder.js         # Database seed script
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/                 # Next.js 14 App Router
    ├── app/
    │   ├── layout.js          # Root layout with providers
    │   ├── page.js            # Home page
    │   ├── auth/login/        # Login + Register
    │   ├── auth/forgot-password/
    │   ├── products/          # Products listing
    │   ├── products/[slug]/   # Product detail
    │   ├── cart/              # Shopping cart
    │   ├── checkout/          # Checkout + Razorpay
    │   ├── orders/            # Order history
    │   ├── orders/[id]/       # Order detail + tracking
    │   ├── profile/           # User profile + addresses
    │   ├── wishlist/          # Wishlist
    │   └── admin/             # Admin panel
    │       ├── layout.js      # Admin sidebar
    │       ├── page.js        # Dashboard + analytics
    │       ├── products/      # Product CRUD
    │       ├── categories/    # Category CRUD
    │       ├── orders/        # Order management
    │       ├── users/         # User management
    │       └── coupons/       # Coupon CRUD
    ├── components/
    │   ├── layout/            # Navbar, Footer
    │   ├── product/           # ProductCard
    │   └── common/            # StarRating, Skeletons, WhatsAppButton
    ├── context/
    │   ├── AuthContext.js     # Auth state
    │   └── CartContext.js     # Cart state
    ├── lib/api.js             # Axios instance + all API calls
    ├── styles/globals.css
    ├── tailwind.config.js
    ├── next.config.js
    └── .env.example
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org)
- **MongoDB** — [Install locally](https://www.mongodb.com/try/download/community) OR use [MongoDB Atlas](https://cloud.mongodb.com) (free tier)
- **npm** or **yarn**

---

## 🔧 Step 1 — Backend Setup

```bash
# Navigate to backend folder
cd namkeen-store/backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### Edit `.env` with your values:

```env
PORT=5000
NODE_ENV=development

# MongoDB — use local or Atlas URI
MONGO_URI=mongodb://localhost:27017/namkeen_store
# OR Atlas: MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/namkeen_store

# JWT
JWT_SECRET=supersecretkey_change_in_production_min32chars
JWT_EXPIRE=30d

# Cloudinary (get from cloudinary.com — free tier available)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay (get from razorpay.com — test mode available)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email (use Gmail with App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16char_app_password
EMAIL_FROM=noreply@namkeenstore.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin seeder credentials
ADMIN_EMAIL=admin@namkeenstore.com
ADMIN_PASSWORD=Admin@123456
```

### Seed the database with sample data:

```bash
npm run seed
```

This creates:
- ✅ Admin user: `admin@namkeenstore.com` / `Admin@123456`
- ✅ Test user: `user@test.com` / `Test@123456`
- ✅ 8 categories (Bhujia, Sev, Mixture, Chips, etc.)
- ✅ 12 sample products with images
- ✅ 3 coupon codes: `WELCOME10`, `FLAT50`, `DIWALI20`

### Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

✅ Backend runs at: `http://localhost:5000`
✅ Health check: `http://localhost:5000/api/health`

---

## 🎨 Step 2 — Frontend Setup

```bash
# Navigate to frontend folder
cd namkeen-store/frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
```

### Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxxxxxx
```

### Start the frontend:

```bash
# Development
npm run dev

# Build for production
npm run build
npm start
```

✅ Frontend runs at: `http://localhost:3000`

---

## 🧪 Test the Application

Open your browser and visit:

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Home page |
| `http://localhost:3000/products` | All products |
| `http://localhost:3000/auth/login` | Login / Register |
| `http://localhost:3000/admin` | Admin panel |
| `http://localhost:5000/api/health` | API health check |

### Test Login Credentials:
- **Admin:** `admin@namkeenstore.com` / `Admin@123456`
- **User:** `user@test.com` / `Test@123456`

### Test Coupon Codes:
- `WELCOME10` — 10% off (min order ₹200)
- `FLAT50` — ₹50 flat off (min order ₹500)
- `DIWALI20` — 20% off (min order ₹300)

### Test Razorpay Payment (Test Mode):
- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: `1234`

---

## 🚀 Deployment

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

cd namkeen-store/frontend
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
# NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_xxxxxxxxxxxx
```

### Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, select `backend/` folder
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add all environment variables from `.env`
6. Deploy!

### Database → MongoDB Atlas

1. Create free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Get connection string and update `MONGO_URI` in all environments
3. Whitelist IP `0.0.0.0/0` for Render access

---

## 📧 Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail
2. Go to Google Account → Security → App Passwords
3. Generate password for "Mail" + "Windows Computer"
4. Use the 16-character password as `EMAIL_PASS`

---

## ☁️ Cloudinary Setup (Image Uploads)

1. Sign up free at [cloudinary.com](https://cloudinary.com)
2. Get Cloud Name, API Key, API Secret from dashboard
3. Add to backend `.env`

---

## 💳 Razorpay Setup

1. Sign up at [razorpay.com](https://razorpay.com) (free test mode)
2. Get Test Key ID and Secret from Dashboard → Settings → API Keys
3. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to backend `.env`
4. Add `NEXT_PUBLIC_RAZORPAY_KEY` to frontend `.env.local`

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get profile |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/auth/forgot-password` | Request reset |
| POST | `/api/auth/reset-password` | Reset password |
| POST | `/api/auth/address` | Add address |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | All products (filter/sort/paginate) |
| GET | `/api/products/featured` | Featured/bestseller/new |
| GET | `/api/products/:slug` | Single product + related |
| POST | `/api/products` | Create (admin) |
| PUT | `/api/products/:id` | Update (admin) |
| DELETE | `/api/products/:id` | Delete (admin) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order |
| GET | `/api/orders/my` | My orders |
| GET | `/api/orders/:id` | Order detail |
| PUT | `/api/orders/:id/cancel` | Cancel order |
| GET | `/api/orders/admin/all` | All orders (admin) |
| PUT | `/api/orders/:id/status` | Update status (admin) |
| GET | `/api/orders/admin/stats` | Dashboard stats |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart |
| POST | `/api/cart` | Add item |
| PUT | `/api/cart/:productId` | Update quantity |
| DELETE | `/api/cart/:productId` | Remove item |
| POST | `/api/cart/coupon` | Apply coupon |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/razorpay/create` | Create Razorpay order |
| POST | `/api/payments/razorpay/verify` | Verify payment |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Payments | Razorpay |
| Images | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| Icons | React Icons (Feather) |
| Animations | CSS + Framer Motion |
| State | React Context API |
| HTTP Client | Axios + SWR |

---

## 🔐 Security Features

- ✅ Password hashing with bcryptjs (12 salt rounds)
- ✅ JWT authentication with expiry
- ✅ Rate limiting (200 req/15min per IP)
- ✅ Protected admin routes
- ✅ Razorpay signature verification
- ✅ CORS configured for frontend origin
- ✅ Input validation and sanitization
- ✅ MongoDB injection protection via Mongoose

---

## 📱 Features Checklist

### Customer Features
- ✅ Browse products with filters, search, sort, pagination
- ✅ Product detail with image gallery, ratings, reviews
- ✅ Shopping cart with quantity controls
- ✅ Coupon code system
- ✅ Checkout with address management
- ✅ Razorpay online payment + Cash on Delivery
- ✅ Order tracking with status history
- ✅ Wishlist management
- ✅ User profile + address book
- ✅ Password change and forgot password

### Admin Features
- ✅ Dashboard with revenue charts + stats
- ✅ Full product CRUD + image upload
- ✅ Category management
- ✅ Order management + status updates
- ✅ User management + role control
- ✅ Coupon CRUD

### Design & UX
- ✅ Mobile-first responsive design
- ✅ Premium Indian snack brand aesthetic
- ✅ Smooth animations and transitions
- ✅ Skeleton loading states
- ✅ Toast notifications
- ✅ WhatsApp contact button
- ✅ Newsletter subscription
- ✅ SEO-friendly metadata
- ✅ Sticky navbar with search overlay

---

## 🐛 Troubleshooting

**MongoDB connection failed:**
- Ensure MongoDB is running: `sudo service mongod start` (Linux) or MongoDB Compass
- Check `MONGO_URI` in `.env`

**Images not uploading:**
- Verify Cloudinary credentials in `.env`
- Ensure file size < 5MB

**Razorpay payment not loading:**
- Check `NEXT_PUBLIC_RAZORPAY_KEY` in frontend `.env.local`
- Use test mode keys for development

**CORS errors:**
- Ensure `FRONTEND_URL=http://localhost:3000` in backend `.env`

---

Built with ❤️ for the Indian snack industry 🍿
