# Hunar - Hand-Crafted Crochet E-Commerce Platform

A production-ready, full-stack e-commerce platform built for selling hand-crafted crochet products. Features a modern tech stack with Next.js 14, Express, PostgreSQL, Redis, and Stripe integration.

![Hunar Platform](https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&h=400&fit=crop)

## 🌟 Features

### Customer Features
- **Product Browsing**: Browse products by category (Women, Men, Accessories, Home) with advanced filtering
- **Search**: Full-text search with typeahead suggestions
- **Product Details**: Rich product pages with image galleries, variants (color/size), materials, and care instructions
- **Shopping Cart**: Persistent cart in localStorage with guest checkout support
- **Checkout**: Secure checkout with Stripe payment processing
- **User Accounts**: Registration, authentication, order history, and saved addresses
- **Wishlist**: Save favorite products for later
- **Responsive Design**: Mobile-first, fully responsive UI with beautiful design

### Admin Features
- **Dashboard**: Overview of products, orders, revenue, and customers
- **Product Management**: Full CRUD operations for products with variant support
- **Order Management**: View and update order statuses
- **Category Management**: Organize products into categories
- **Coupon Management**: Create and manage discount codes
- **Homepage Customization**: Configure featured sections and hero content

### Technical Features
- **SEO Optimized**: SSR/ISR pages with metadata, JSON-LD structured data, and OG images
- **Performance**: Redis caching, code splitting, image optimization (Core Web Vitals optimized)
- **Security**: Helmet.js, rate limiting, CORS configuration, secure authentication
- **Scalable Architecture**: Monorepo with Turborepo, modular backend routes
- **Type Safety**: Full TypeScript coverage across the stack
- **Testing**: E2E tests with Playwright, CI/CD pipeline with GitHub Actions

## 🏗️ Tech Stack

### Frontend (`apps/web`)
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State**: Zustand for cart management
- **Auth**: NextAuth.js (Email/Password + Google OAuth)
- **Payments**: Stripe.js
- **Fonts**: Playfair Display (serif) + Inter (sans-serif)

### Backend (`apps/server`)
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **Cache**: Redis (ioredis)
- **Payments**: Stripe
- **Email**: Resend
- **Media**: Cloudinary
- **Validation**: Zod

### Packages
- `packages/ui`: Shared UI components
- `packages/config`: Shared ESLint, TypeScript, Prettier configs

### DevOps
- **Build**: Turborepo
- **Package Manager**: pnpm
- **Testing**: Playwright (E2E)
- **CI/CD**: GitHub Actions
- **Containerization**: Docker + Docker Compose
- **Deployment**: Vercel (web), Render/Fly.io (server)

## 📦 Project Structure

```
hunar/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/        # App Router pages
│   │   │   ├── components/ # React components
│   │   │   ├── lib/        # Utilities and API client
│   │   │   └── store/      # Zustand stores
│   │   ├── public/         # Static assets
│   │   └── tests/          # E2E tests
│   │
│   └── server/             # Express backend
│       ├── src/
│       │   ├── routes/     # API routes
│       │   ├── lib/        # DB, Redis, Auth, Stripe
│       │   ├── index.ts    # Server entry
│       │   └── seed.ts     # Database seeding
│       └── prisma/         # Database schema
│
├── packages/
│   ├── ui/                 # Shared UI components
│   └── config/             # Shared configs
│
├── .github/workflows/      # CI/CD pipelines
├── docker-compose.yml      # Local development stack
└── turbo.json             # Turborepo config
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **pnpm** 8+
- **PostgreSQL** 15+
- **Redis** 7+
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/hunar.git
cd hunar
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create `.env` files in the root and apps:

**Root `.env`:**
```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hunar?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-random-string-min-32-chars"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Redis
REDIS_URL="redis://localhost:6379"

# Email
RESEND_API_KEY="re_..."
EMAIL_FROM="Hunar <noreply@hunar.com>"

# API
SERVER_URL="http://localhost:4000"
API_URL="http://localhost:4000/api"
NEXT_PUBLIC_API_URL="http://localhost:4000/api"

# JWT
JWT_SECRET="generate-another-secure-random-string"

# Stripe Public (Frontend)
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."
```

### 4. Start Database and Redis

**Option A: Using Docker Compose (Recommended)**

```bash
docker-compose up -d postgres redis
```

**Option B: Local Installation**

Install PostgreSQL and Redis locally and ensure they're running.

### 5. Run Database Migrations

```bash
cd apps/server
pnpm db:push
```

### 6. Seed the Database

```bash
cd apps/server
pnpm db:seed
```

This creates:
- Admin user: `admin@hunar.com` / `admin123`
- 20+ products across categories
- Sample coupons: `WELCOME10`, `SAVE20`, `FREESHIP`

### 7. Start Development Servers

From the root directory:

```bash
pnpm dev
```

This starts:
- **Web**: http://localhost:3000
- **Server**: http://localhost:4000

## 🧪 Testing

### Run E2E Tests

```bash
cd apps/web
pnpm test:e2e
```

### Run Linting

```bash
pnpm lint
```

### Run Type Checking

```bash
pnpm typecheck
```

## 📝 API Documentation

### Public Endpoints

- `GET /api/products` - List products with filters
- `GET /api/products/:slug` - Get single product
- `GET /api/categories` - List categories
- `GET /api/search?q=query` - Search products
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/checkout/create-session` - Create Stripe checkout

### Protected Endpoints (Require Authentication)

- `GET /api/orders` - User's orders
- `GET /api/user/profile` - User profile
- `POST /api/user/addresses` - Add address
- `POST /api/wishlist` - Add to wishlist

### Admin Endpoints (Require Admin Role)

- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - List all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/stats` - Dashboard statistics

## 🎨 Design System

### Colors

- **Cream**: `#FAF5EF` - Background
- **Brown**: `#6B4F3B` - Primary
- **Charcoal**: `#2B2B2B` - Text
- **Gold**: `#C5A880` - Accent

### Typography

- **Headlines**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Border Radius

- Standard: `1rem` (rounded-2xl)
- Buttons: `1rem`

## 🚢 Deployment

### Deploy Web (Vercel)

1. Push code to GitHub
2. Import project on Vercel
3. Set environment variables
4. Deploy automatically on push

### Deploy Server (Render/Fly.io)

**Using Docker:**

```bash
docker build -f apps/server/Dockerfile -t hunar-server .
docker push your-registry/hunar-server
```

**Environment Variables for Production:**
- Set all environment variables in your hosting platform
- Update `DATABASE_URL` to production database
- Update `REDIS_URL` to production Redis
- Update `NEXTAUTH_URL` to production domain
- Use production Stripe keys

### Database Migrations

Run migrations on production:

```bash
cd apps/server
pnpm exec prisma migrate deploy
```

## 🔐 Security Considerations

- All passwords are hashed with bcrypt
- JWT tokens for API authentication
- Helmet.js for HTTP headers
- Rate limiting on API routes
- CORS configured for specific origins
- Stripe webhooks verified with signatures
- Input validation with Zod

## 🛠️ Admin Access

After seeding, login with:
- **Email**: `admin@hunar.com`
- **Password**: `admin123`

Admin dashboard: http://localhost:3000/admin

## 📊 Performance

The platform is optimized for Core Web Vitals:
- Server-side rendering (SSR) for key pages
- Incremental static regeneration (ISR)
- Redis caching for product lists
- Image optimization with Next/Image
- Code splitting and lazy loading
- Lighthouse score target: 90+ (desktop), 80+ (mobile)

## 🌍 Internationalization

The project is structured to support multiple languages using `next-intl`. Currently English is implemented, with scaffolding for Urdu (ur) locale.

## 📧 Email Templates

Order confirmation emails are sent via Resend after successful payment. Customize templates in `apps/server/src/lib/email.ts`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with love for artisan craftspeople
- Inspired by traditional crochet techniques
- Designed for modern e-commerce needs

## 📞 Support

For issues or questions:
- Email: contact@hunar.com
- GitHub Issues: https://github.com/yourusername/hunar/issues

---

**Made with ❤️ by the Hunar Team**

