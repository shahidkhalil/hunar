# Quick Setup Guide

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] pnpm 8+ installed (`npm install -g pnpm`)
- [ ] PostgreSQL running locally or accessible
- [ ] Redis running locally or accessible
- [ ] Git installed

## Quick Start (5 minutes)

### 1. Clone and Install

```bash
git clone <your-repo-url> hunar
cd hunar
pnpm install
```

### 2. Start Services

**Using Docker (Easiest):**
```bash
docker-compose up -d postgres redis
```

**Or install PostgreSQL and Redis locally**

### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your credentials
# Minimum required:
# - DATABASE_URL
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - JWT_SECRET (generate with: openssl rand -base64 32)
```

### 4. Setup Database

```bash
cd apps/server
pnpm db:push
pnpm db:seed
cd ../..
```

### 5. Start Development

```bash
pnpm dev
```

Visit:
- **Web**: http://localhost:3000
- **API**: http://localhost:4000
- **Admin**: http://localhost:3000/admin (admin@hunar.com / admin123)

## Stripe Setup (for payments)

1. Create account at https://stripe.com
2. Get test API keys from dashboard
3. Add to `.env`:
   ```
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
   ```
4. Set up webhook for `checkout.session.completed` event
5. Add webhook secret to `.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`

## Cloudinary Setup (for images)

1. Create account at https://cloudinary.com
2. Get credentials from dashboard
3. Add to `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

## Resend Setup (for emails)

1. Create account at https://resend.com
2. Get API key
3. Add to `.env`:
   ```
   RESEND_API_KEY=re_...
   EMAIL_FROM="Hunar <noreply@yourdomain.com>"
   ```

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 4000
lsof -ti:4000 | xargs kill -9
```

### Database connection issues
```bash
# Check if PostgreSQL is running
psql -h localhost -U postgres -c "SELECT 1"

# Reset database
cd apps/server
pnpm db:push --force-reset
pnpm db:seed
```

### Redis connection issues
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG
```

### Build errors
```bash
# Clean everything and reinstall
pnpm clean
rm -rf node_modules
pnpm install
pnpm build
```

## Next Steps

1. **Customize branding**: Update logo, colors in `tailwind.config.js`
2. **Add products**: Use admin dashboard or seed script
3. **Configure payment**: Set up Stripe webhooks
4. **Add images**: Upload to Cloudinary
5. **Deploy**: See README.md for deployment instructions

## Support

If you encounter issues:
1. Check the main README.md
2. Review environment variables
3. Check server logs: `cd apps/server && pnpm dev`
4. Open an issue on GitHub

