# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

City Nexa Networks — a real estate channel partner website. Users browse properties without login, shortlist favorites (localStorage), and submit inquiries. Admin panel manages properties, builders, leads, and site content.

## Tech Stack

- **Framework:** Next.js 14+ (App Router), TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js (admin-only authentication)
- **Validation:** Zod
- **Deployment:** Vercel-ready

## Common Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npx prisma migrate dev    # Run database migrations
npx prisma studio         # Open Prisma database GUI
npx prisma db seed        # Seed sample data
npx prisma generate       # Regenerate Prisma client after schema changes
```

## Architecture

### Route Structure (App Router)

- `app/(public)/` — Public visitor routes (homepage, properties, builders, about, contact, shortlist)
- `app/admin/` — Protected admin routes (dashboard, property/builder/inquiry/testimonial management, settings)
- `app/api/` — API routes for auth, properties, builders, inquiries, file uploads

### Key Directories

- `lib/` — Prisma client, NextAuth config, constants/enums, utility functions
- `components/ui/` — shadcn/ui base components
- `components/forms/` — Form components (inquiry, property, contact)
- `components/property/` — Property cards, gallery, filters
- `components/admin/` — Admin panel components
- `components/common/` — Shared components (header, footer, WhatsApp button)
- `prisma/` — Schema and seed script
- `types/` — TypeScript type definitions

### Data Model

Six core entities: **Builders**, **Properties**, **PropertyImages**, **Inquiries** (leads), **AdminUsers**, **Testimonials**. Properties belong to Builders. PropertyImages belong to Properties. Inquiries optionally reference a Property.

### Key Enums

| Enum | Values |
|------|--------|
| PropertyType | RESIDENTIAL, COMMERCIAL, PLOT |
| ListingType | SALE, RENT |
| PriceUnit | LAKH, CRORE |
| AreaUnit | SQFT, SQYD, SQMT |
| Furnishing | UNFURNISHED, SEMI_FURNISHED, FULLY_FURNISHED |
| PossessionStatus | READY_TO_MOVE, UNDER_CONSTRUCTION, UPCOMING |
| InquiryType | GENERAL, PROPERTY_SPECIFIC, CALLBACK |
| InquiryStatus | NEW, CONTACTED, FOLLOW_UP, CONVERTED, CLOSED |
| AdminRole | SUPER_ADMIN, ADMIN |

## Design Conventions

- **Brand colors:** Navy Blue `#1B3A5C` (primary), light blue/white backgrounds
- **Mobile-first** responsive design
- **No visitor authentication** — shortlist uses localStorage only
- **SEO:** Dynamic meta tags, Open Graph, sitemap.xml, structured data (JSON-LD) for properties
- **Performance:** Next.js Image for optimization, ISR for property pages, lazy loading
- **WhatsApp:** Floating button on all pages with pre-filled property details

## Development Phases

1. **Phase 1 (MVP):** Database setup, admin CRUD for properties & builders, public listings with filters, property detail, contact/inquiry form, homepage
2. **Phase 2:** Builder pages, shortlist, testimonials, SEO, WhatsApp integration, dashboard analytics
3. **Phase 3:** Map-based search, email notifications, CSV export, performance optimization, PWA
