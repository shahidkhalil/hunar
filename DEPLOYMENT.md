# Deployment Guide

This guide covers deploying the Hunar e-commerce platform to production.

## Architecture Overview

- **Frontend (Web)**: Vercel (recommended) or any Node.js host
- **Backend (Server)**: Render, Fly.io, Railway, or VPS
- **Database**: Neon, Supabase, or managed PostgreSQL
- **Redis**: Upstash, Redis Cloud, or managed Redis
- **Media**: Cloudinary
- **Email**: Resend

## Prerequisites

- [ ] Production domain name
- [ ] SSL certificate (usually automatic)
- [ ] Stripe account with production keys
- [ ] Cloudinary account
- [ ] Resend account
- [ ] Database provisioned
- [ ] Redis instance provisioned

## Deploy Backend (Server)

### Option 1: Render

1. **Create New Web Service**
   - Connect your GitHub repository
   - Root Directory: `apps/server`
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `node dist/index.js`

2. **Set Environment Variables**
   ```
   DATABASE_URL=<your-postgres-url>
   REDIS_URL=<your-redis-url>
   JWT_SECRET=<generate-secret>
   STRIPE_SECRET_KEY=<stripe-secret>
   STRIPE_WEBHOOK_SECRET=<stripe-webhook>
   RESEND_API_KEY=<resend-key>
   CLOUDINARY_CLOUD_NAME=<cloud-name>
   CLOUDINARY_API_KEY=<api-key>
   CLOUDINARY_API_SECRET=<api-secret>
   WEB_URL=<your-frontend-url>
   NODE_ENV=production
   ```

3. **Run Migrations**
   ```bash
   # In Render shell or manually
   cd apps/server
   pnpm exec prisma migrate deploy
   pnpm db:seed
   ```

### Option 2: Fly.io

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Create fly.toml**
   ```toml
   app = "hunar-server"
   
   [build]
     dockerfile = "apps/server/Dockerfile"
   
   [[services]]
     internal_port = 4000
     protocol = "tcp"
   
     [[services.ports]]
       port = 80
   ```

3. **Deploy**
   ```bash
   fly launch
   fly secrets set DATABASE_URL="..." REDIS_URL="..."
   fly deploy
   ```

### Option 3: Docker on VPS

1. **Build and Push**
   ```bash
   docker build -f apps/server/Dockerfile -t your-registry/hunar-server .
   docker push your-registry/hunar-server
   ```

2. **Run on Server**
   ```bash
   docker pull your-registry/hunar-server
   docker run -d \
     -p 4000:4000 \
     -e DATABASE_URL="..." \
     -e REDIS_URL="..." \
     --name hunar-server \
     your-registry/hunar-server
   ```

## Deploy Frontend (Web)

### Vercel (Recommended)

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Connect Repository**
   - Go to vercel.com
   - Import your GitHub repository
   - Select `apps/web` as root directory

3. **Configure Build**
   - Framework: Next.js
   - Build Command: `cd ../.. && pnpm install && cd apps/web && pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

4. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=<your-backend-url>/api
   NEXTAUTH_URL=<your-domain>
   NEXTAUTH_SECRET=<generate-secret>
   GOOGLE_CLIENT_ID=<google-oauth>
   GOOGLE_CLIENT_SECRET=<google-oauth-secret>
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=<stripe-public>
   API_URL=<your-backend-url>/api
   ```

5. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Connect Repository**
2. **Build Settings**
   - Base directory: `apps/web`
   - Build command: `pnpm install && pnpm build`
   - Publish directory: `.next`

3. **Set Environment Variables** (same as Vercel)

4. **Deploy**

## Database Setup

### Neon (Recommended)

1. Create project at neon.tech
2. Copy connection string
3. Update `DATABASE_URL` in server environment
4. Run migrations from Render shell or locally:
   ```bash
   DATABASE_URL="<production-url>" pnpm exec prisma migrate deploy
   ```

### Supabase

1. Create project at supabase.com
2. Get connection string from Settings > Database
3. Enable connection pooling
4. Run migrations

## Redis Setup

### Upstash (Recommended)

1. Create database at upstash.com
2. Copy Redis URL
3. Update `REDIS_URL` in server environment

### Redis Cloud

1. Create subscription at redis.com/cloud
2. Create database
3. Copy connection string

## Stripe Configuration

1. **Get Production Keys**
   - Dashboard > Developers > API Keys
   - Copy Publishable and Secret keys

2. **Set Up Webhooks**
   - Dashboard > Developers > Webhooks
   - Add endpoint: `https://your-api.com/api/webhooks/stripe`
   - Select events: `checkout.session.completed`
   - Copy webhook signing secret

3. **Update Environment**
   - `STRIPE_SECRET_KEY` (server)
   - `STRIPE_WEBHOOK_SECRET` (server)
   - `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` (web)

## DNS Configuration

1. **Add Records**
   - A record: `@` → Vercel IP or CNAME
   - CNAME: `api` → your-server.render.com

2. **SSL Certificate**
   - Usually automatic with Vercel/Render
   - Verify HTTPS is working

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] API health check: `https://api.yourdomain.com/health`
- [ ] Admin login works
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Checkout flow completes
- [ ] Test Stripe payment (use test card: 4242 4242 4242 4242)
- [ ] Order confirmation email received
- [ ] Webhook events processing
- [ ] Image uploads working (Cloudinary)
- [ ] Search functionality working
- [ ] Performance check (Lighthouse)
- [ ] SEO metadata correct
- [ ] Error tracking enabled (optional: Sentry)

## Monitoring

### Set Up Error Tracking

**Sentry (Optional)**

```bash
pnpm add @sentry/nextjs @sentry/node
```

Configure in `apps/web/sentry.config.js` and `apps/server/src/index.ts`

### Performance Monitoring

1. **Vercel Analytics** (automatic)
2. **PostHog** (add to environment)
3. **Google Analytics** (add to Next.js config)

### Health Checks

Set up uptime monitoring:
- UptimeRobot
- Pingdom
- Better Uptime

Check endpoints:
- `https://api.yourdomain.com/health`
- `https://yourdomain.com`

## Backup Strategy

### Database Backups

**Neon**: Automatic backups, 7-day retention

**Manual Backup**:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Redis Backups

**Upstash**: Automatic snapshots

### Environment Variables

Keep secure backup of all environment variables in password manager

## Rollback Plan

### Frontend (Vercel)

```bash
# Revert to previous deployment
vercel rollback
```

### Backend

```bash
# Docker
docker pull your-registry/hunar-server:previous-tag
docker stop hunar-server
docker run ... previous-tag
```

### Database

```bash
# Restore from backup
psql $DATABASE_URL < backup.sql
```

## Scaling Considerations

### Database
- Enable connection pooling (PgBouncer)
- Add read replicas for heavy read traffic
- Monitor query performance

### Redis
- Increase memory as needed
- Enable persistence if required
- Consider Redis Cluster for high availability

### Backend
- Scale horizontally (add more server instances)
- Enable load balancing
- Use CDN for static assets

### Frontend
- Vercel handles scaling automatically
- Configure ISR for dynamic pages
- Optimize images with Cloudinary

## Cost Estimates (Monthly)

**Small Scale** (< 1000 orders/month):
- Vercel: $0 (Hobby) or $20 (Pro)
- Render: $7-25 (Web Service)
- Neon: $0-19 (Free tier or Scale)
- Upstash: $0-10 (Free tier or Pro)
- Cloudinary: $0 (Free tier)
- Resend: $0-20 (Free tier or Pro)
- **Total**: $7-100/month

**Medium Scale** (1000-10000 orders/month):
- Vercel: $20 (Pro)
- Render: $25-85 (Standard)
- Neon: $19-69 (Scale)
- Upstash: $10-40 (Pro/Enterprise)
- Cloudinary: $89+ (Advanced)
- Resend: $20 (Pro)
- **Total**: $183-333/month

## Security Hardening

- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Enable database SSL
- [ ] Set up security headers
- [ ] Regular dependency updates
- [ ] Enable 2FA on all services
- [ ] Implement IP whitelisting for admin
- [ ] Regular security audits

## Support

For deployment issues:
1. Check service status pages
2. Review application logs
3. Test locally with production environment variables
4. Contact service support (Vercel, Render, etc.)

