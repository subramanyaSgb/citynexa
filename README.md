# City Nexa Networks

Real estate channel partner website for City Nexa Networks Pvt Ltd. Connects customers with builder inventory — browse properties, filter, shortlist, and inquire, all without login. Admin panel for managing properties, builders, leads, and site content.

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes / Server Actions
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js (admin only)
- **Validation:** Zod
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/subramanyaSgb/citynexa.git
cd citynexa

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database URL, NextAuth secret, etc.

# Run database migrations
npx prisma migrate dev

# Seed sample data
npx prisma db seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/citynexa"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Project Structure

```
app/
├── (public)/          # Public visitor pages
│   ├── page.tsx       # Homepage
│   ├── properties/    # Property listing & detail
│   ├── builders/      # Builder partners
│   ├── about/         # About us
│   ├── contact/       # Contact page
│   └── shortlist/     # Saved properties (localStorage)
├── admin/             # Protected admin panel
│   ├── dashboard/     # Analytics dashboard
│   ├── properties/    # Property CRUD
│   ├── builders/      # Builder CRUD
│   ├── inquiries/     # Lead management
│   ├── testimonials/  # Testimonial management
│   └── settings/      # Site settings
└── api/               # API routes
components/            # React components (ui, forms, property, admin, common)
lib/                   # Prisma client, auth config, utilities
prisma/                # Schema & seed script
types/                 # TypeScript definitions
```

## Features

### Public Website
- Property browsing with advanced filters (type, budget, bedrooms, area, possession, furnishing, location, builder)
- Property detail pages with image gallery, amenities, map, and inquiry form
- Builder partner directory
- Shortlist/wishlist using localStorage (no login required)
- Contact and inquiry forms
- WhatsApp integration with pre-filled messages
- Mobile-first responsive design
- SEO optimized with structured data

### Admin Panel
- Dashboard with lead analytics
- Full CRUD for properties, builders, testimonials
- Multi-image upload with drag-reorder
- Lead/inquiry management with status tracking
- CSV export for inquiries
- Site settings and admin user management
- Role-based access (Super Admin / Admin)

## Scripts

```bash
npm run dev            # Start dev server
npm run build          # Production build
npm run start          # Start production server
npm run lint           # Run ESLint
npx prisma studio      # Open database GUI
npx prisma migrate dev # Run migrations
npx prisma db seed     # Seed sample data
```

## License

Private — City Nexa Networks Pvt Ltd.
