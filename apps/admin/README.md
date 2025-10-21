# Hunar Admin Panel

Separate admin panel for managing the Hunar e-commerce platform.

## Features

- **Dashboard**: View key statistics (products, orders, revenue, customers)
- **Orders Management**: View and update order statuses with COD support
- **Products Management**: (Coming soon)
- **Independent Application**: Runs separately from the main website

## Development

```bash
# From the root directory
pnpm dev

# Or run just the admin panel
cd apps/admin
pnpm dev
```

The admin panel will be available at: **http://localhost:3001**

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-change-in-production
```

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React**
- **Lucide React** (Icons)

## Pages

- `/` - Dashboard with statistics
- `/orders` - Orders management with status updates
- `/products` - Products management (placeholder)

## API Integration

The admin panel connects to the backend API at `http://localhost:4000/api` to:
- Fetch statistics
- Get orders list
- Update order statuses
- Manage products (coming soon)

## Notes

- Authentication is currently disabled for easier development
- All prices are displayed in PKR (Pakistani Rupees)
- Orders are COD (Cash on Delivery) only
