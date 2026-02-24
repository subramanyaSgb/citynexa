# City Nexa Networks Website — Design Document

**Date:** 2026-02-24
**Status:** Approved

---

## 1. Overview

Full-stack real estate channel partner website for City Nexa Networks Pvt Ltd (Bangalore). Visitors browse properties without login, shortlist via localStorage, and submit inquiries. Admin panel manages properties, builders, leads, and site content.

## 2. Architecture

**Single Next.js 14+ monolith** deployed to Vercel. App Router with Server Components by default, Client Components only for interactive elements (filters, shortlist, forms).

## 3. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v5 (credentials provider, admin-only) |
| Validation | Zod |
| Image Storage | Supabase Storage |
| Deployment | Vercel |

## 4. Brand

- **Primary:** Navy Blue `#1B3A5C`
- **Background:** Light blue `#F0F4F8`, white
- **Accent:** Gold `#C5A355` (CTAs, featured badges)
- **Font:** System default / Inter (via Next.js font optimization)

## 5. Data Architecture

```
Builder 1──∞ Property 1──∞ PropertyImage
                │
                └──0..∞ Inquiry

AdminUser (standalone, NextAuth credentials)
Testimonial (standalone)
```

### Models

**Builder:** id, name, logo_url, description, website_url, total_projects, established_year, is_active, created_at, updated_at

**Property:** id, title, slug (auto-generated), description, property_type, listing_type, builder_id (FK), price, price_unit, carpet_area, carpet_area_unit, built_up_area, bedrooms, bathrooms, floor_number, total_floors, facing_direction, furnishing, possession_status, possession_date, amenities (JSON), address, city, locality, state, pincode, latitude, longitude, rera_number, is_featured, is_active, created_at, updated_at

**PropertyImage:** id, property_id (FK), image_url, is_primary, sort_order

**Inquiry:** id, name, email, phone, message, property_id (FK, nullable), inquiry_type, status, admin_notes, created_at, updated_at

**AdminUser:** id, name, email, password_hash, role (SUPER_ADMIN/ADMIN), is_active, created_at

**Testimonial:** id, name, text, rating, is_active, created_at

### Enums

PropertyType: RESIDENTIAL, COMMERCIAL, PLOT
ListingType: SALE, RENT
PriceUnit: LAKH, CRORE
AreaUnit: SQFT, SQYD, SQMT
Furnishing: UNFURNISHED, SEMI_FURNISHED, FULLY_FURNISHED
PossessionStatus: READY_TO_MOVE, UNDER_CONSTRUCTION, UPCOMING
InquiryType: GENERAL, PROPERTY_SPECIFIC, CALLBACK
InquiryStatus: NEW, CONTACTED, FOLLOW_UP, CONVERTED, CLOSED
AdminRole: SUPER_ADMIN, ADMIN

## 6. Public Website Pages

### Homepage
- Hero with search bar (locality/project name)
- Quick filter chips: Residential | Commercial | Plots
- Featured properties carousel
- Builder partner logo grid (14 logos, auto-scrolling)
- "Why Choose Us" section
- Testimonials carousel
- Stats counter
- CTA with inquiry form
- Footer

### Property Listing `/properties`
- Grid/list view toggle
- Left sidebar filters: property type, listing type, budget slider, BHK, area range, possession status, furnishing, locality dropdown, builder dropdown
- Sort: price, newest
- Pagination
- Property cards: image, title, price, location, specs, builder, possession badge, heart icon

### Property Detail `/properties/[slug]`
- Image gallery with lightbox
- Key specs bar
- Full description, amenities with icons
- Google Maps embed
- Builder info card
- Inquiry form (pre-filled property reference)
- Similar properties

### Builder Pages
- `/builders` — grid of builder cards
- `/builders/[id]` — detail page with builder info + all their properties

### Other Pages
- `/about` — company story, mission, 3-step process
- `/contact` — form, office info, map
- `/shortlist` — localStorage-based wishlist, bulk inquire

### Site-wide
- Sticky header with nav
- WhatsApp floating button (bottom-right, placeholder number)
- Responsive mobile menu
- Footer with contact info, social links, quick links

## 7. Admin Panel

### Auth
- `/admin/login` — email/password via NextAuth.js
- All `/admin/*` protected by middleware
- SUPER_ADMIN: full access + user management
- ADMIN: everything except user management

### Pages
- **Dashboard** `/admin/dashboard` — stats cards, recent inquiries, quick actions
- **Properties** `/admin/properties` — data table, CRUD, multi-image upload, drag-reorder, toggle active/featured
- **Builders** `/admin/builders` — CRUD, logo upload, toggle active
- **Inquiries** `/admin/inquiries` — table, filter by status, detail view, status update, admin notes, CSV export
- **Testimonials** `/admin/testimonials` — CRUD, toggle active
- **Settings** `/admin/settings` — company info, homepage stats, admin user management (SUPER_ADMIN only)

### Admin UI
- Sidebar layout: collapsible nav left, content right
- Same shadcn/ui component library as public site

## 8. Seed Data

- 14 builders matching provided partner logos
- 12-15 properties across Bangalore localities (Whitefield, Sarjapur Road, Electronic City, Hebbal, Yelahanka, Devanahalli)
- Property images from Unsplash placeholder URLs
- 5 sample testimonials
- 1 SUPER_ADMIN user (admin@citynexa.com / admin123)

## 9. Performance & SEO

- Server Components by default
- ISR for property detail pages (revalidate: 3600)
- Next.js `<Image>` with WebP optimization
- Lazy loading for below-fold sections
- Dynamic `metadata` on every page
- Open Graph images, sitemap.xml, robots.txt
- JSON-LD structured data (schema.org/RealEstateListing)

## 10. Environment Variables

```
DATABASE_URL=          # Supabase pooled connection
DIRECT_URL=            # Supabase direct connection (Prisma migrations)
NEXTAUTH_SECRET=       # Random secret for NextAuth
NEXTAUTH_URL=          # Site URL (http://localhost:3000 in dev)
NEXT_PUBLIC_SUPABASE_URL=     # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Supabase anon key (for storage)
```

## 11. Development Phases

**Phase 1 (MVP):** Database + Prisma schema, admin auth, admin CRUD (properties, builders), public property listing with filters, property detail page, contact/inquiry form, homepage

**Phase 2:** Builder pages, shortlist feature, testimonials management, SEO (sitemap, structured data, OG), WhatsApp integration, dashboard analytics

**Phase 3:** Map-based search, email notifications on new inquiry, CSV export, performance optimization, PWA support
