# KayBirks E-commerce

A production-ready Next.js (App Router) + TypeScript e-commerce web application for men's Birkenstock footwear with a premium blue and white aesthetic.

## Features

### Customer
- 🏠 Premium landing page with hero, featured products, and trust sections
- 🛍️ Shop with filters (size, color, price, category), sorting, and search
- 👟 Product detail with 3D viewer (Three.js), image gallery, and reviews
- 🛒 Cart with quantity management and promo codes
- 💳 Checkout with shipping info and order summary
- 👤 User authentication (signup/login)
- 📦 Account page with order history

### Admin Panel
- 📊 Dashboard with stats overview and alerts
- 📦 Products CRUD management
- 🛍️ Orders management with status updates
- ⭐ Reviews moderation

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS 4
- **3D**: Three.js (@react-three/fiber, @react-three/drei)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd kaybirks
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file with your environment variables:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/kaybirks"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

4. Generate Prisma client and push schema:
```bash
npx prisma generate
npx prisma db push
```

5. Seed the database:
```bash
npx prisma db seed
```

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Default Credentials

After seeding, use these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kaybirks.com | admin123 |
| User | user@example.com | user1234 |

## Project Structure

```
kaybirks/
├── app/
│   ├── (auth)/           # Login/signup pages
│   ├── admin/            # Admin panel pages
│   ├── api/              # API routes
│   ├── cart/             # Shopping cart
│   ├── checkout/         # Checkout flow
│   ├── shop/             # Product pages
│   ├── account/          # User account
│   ├── globals.css       # Design system
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Base UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── hooks/
│   └── useCart.tsx       # Cart state management
├── lib/
│   ├── auth.ts           # NextAuth config
│   ├── prisma.ts         # Prisma client
│   ├── utils.ts          # Utilities
│   └── validations.ts    # Zod schemas
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── types/
│   └── index.ts          # TypeScript types
└── middleware.ts         # Route protection
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | /api/products | List/create products |
| GET/PUT/DELETE | /api/products/[id] | Single product |
| GET/POST | /api/orders | List/create orders |
| GET/PUT | /api/orders/[id] | Single order |
| GET/POST | /api/reviews | List/create reviews |
| DELETE | /api/reviews/[id] | Delete review |
| POST | /api/auth/signup | User registration |
| GET | /api/admin/stats | Dashboard stats |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| NEXTAUTH_SECRET | Secret for JWT signing | Yes |
| NEXTAUTH_URL | Application URL | Yes |

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## License

MIT
