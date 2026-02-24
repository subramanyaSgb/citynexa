Here's the PRD for City Nexa Networks:

---

# Product Requirements Document (PRD)
## City Nexa Networks Pvt Ltd — Real Estate Channel Partner Website

**Version:** 1.0
**Date:** February 24, 2026

---

## 1. Product Overview

City Nexa Networks is a real estate channel partner (middleman between builders and customers). The company helps customers find the right property based on their needs from available builder inventory. **No commission is charged from customers.** Commission comes from builder partners.

The website serves as the digital storefront — allowing users to browse properties without login, filter/search, shortlist favorites, and contact City Nexa for assistance. An admin panel allows the team to manage all properties, builders, leads, and site content.

---

## 2. Tech Stack (for Claude Code)

**Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
**Backend:** Next.js API Routes / Server Actions
**Database:** PostgreSQL with Prisma ORM
**Auth:** NextAuth.js (admin only)
**Image Storage:** Local uploads (or Cloudinary integration ready)
**Deployment:** Vercel-ready

---

## 3. User Roles

**Visitor (No Login Required):** Browse properties, use filters, view builder partners, shortlist properties (localStorage), submit contact/inquiry forms.

**Admin (Login Required):** Full CRUD on properties, builders, leads, site settings. Dashboard with analytics.

---

## 4. Database Schema

### Builders
- id, name, logo_url, description, website_url, total_projects, established_year, is_active, created_at, updated_at

### Properties
- id, title, slug, description, property_type (enum: RESIDENTIAL, COMMERCIAL, PLOT), listing_type (enum: SALE, RENT), builder_id (FK), price, price_unit (enum: LAKH, CRORE), carpet_area, carpet_area_unit (enum: SQFT, SQYD, SQMT), built_up_area, bedrooms, bathrooms, floor_number, total_floors, facing_direction, furnishing (enum: UNFURNISHED, SEMI_FURNISHED, FULLY_FURNISHED), possession_status (enum: READY_TO_MOVE, UNDER_CONSTRUCTION, UPCOMING), possession_date, amenities (JSON array), address, city, locality, state, pincode, latitude, longitude, rera_number, is_featured, is_active, created_at, updated_at

### PropertyImages
- id, property_id (FK), image_url, is_primary, sort_order

### Inquiries (Leads)
- id, name, email, phone, message, property_id (FK, nullable), inquiry_type (enum: GENERAL, PROPERTY_SPECIFIC, CALLBACK), status (enum: NEW, CONTACTED, FOLLOW_UP, CONVERTED, CLOSED), admin_notes, created_at, updated_at

### Admin Users
- id, name, email, password_hash, role (enum: SUPER_ADMIN, ADMIN), is_active, created_at

### Testimonials
- id, name, text, rating, is_active, created_at

---

## 5. Public Website Pages & Features

### 5.1 Homepage
- Hero banner with search bar (search by city/locality/project name)
- Quick filter chips: Residential | Commercial | Plots
- Featured properties carousel (is_featured = true)
- Builder partners logo grid section
- "Why Choose Us" section (No commission, Trusted partners, Expert guidance, End-to-end support)
- Testimonials section
- Stats counter (Properties listed, Happy customers, Builder partners, Cities)
- CTA section with inquiry form
- Footer with contact info, social links, quick links

### 5.2 Properties Listing Page (`/properties`)
- Grid/List view toggle
- **Filter Sidebar:**
  - Property Type: Residential / Commercial / Plot
  - Listing Type: Sale / Rent
  - Budget Range: Min–Max slider (custom ranges in Lakhs/Crores)
  - Bedrooms: 1BHK, 2BHK, 3BHK, 4BHK, 5BHK+
  - Area Range: Min–Max sqft
  - Possession Status: Ready to Move / Under Construction / Upcoming
  - Furnishing: Unfurnished / Semi / Fully
  - City / Locality dropdown
  - Builder dropdown
- Sort by: Price Low-High, Price High-Low, Newest First, Most Popular
- Pagination
- Property cards showing: Primary image, title, price, location, bedrooms/bathrooms/area, builder name, possession status badge

### 5.3 Property Detail Page (`/properties/[slug]`)
- Image gallery with lightbox
- Price, property type badge, RERA number
- Key specs: Bedrooms, Bathrooms, Area, Floor, Facing, Furnishing
- Full description
- Amenities list with icons
- Location map (embed Google Maps)
- Builder info card with link to builder page
- "Interested?" inquiry form (pre-filled with property reference)
- Similar properties section

### 5.4 Builder Partners Page (`/builders`)
- Grid of builder cards: Logo, name, project count, established year
- Click to view builder detail page

### 5.5 Builder Detail Page (`/builders/[id]`)
- Builder logo, name, description, website link
- All properties by this builder (with filters)

### 5.6 About Us Page (`/about`)
- Company story, mission, how we work (3-step process), team section

### 5.7 Contact Us Page (`/contact`)
- Contact form (name, email, phone, message)
- Office address, phone, email, Google Map embed
- WhatsApp floating button (site-wide)

### 5.8 Shortlist / Wishlist (localStorage, no login)
- Heart icon on property cards to add/remove
- `/shortlist` page showing all saved properties
- "Inquire about all shortlisted" bulk action

---

## 6. Admin Panel (`/admin`)

### 6.1 Admin Login
- Email/password authentication
- Protected routes, session management

### 6.2 Dashboard
- Total properties, active listings, total inquiries, new leads today
- Recent inquiries list
- Quick action buttons

### 6.3 Property Management (`/admin/properties`)
- Table with search, filter by type/status/builder
- Add/Edit property form with all fields from schema
- Multi-image upload with drag-reorder, set primary
- Toggle active/featured status
- Delete with confirmation

### 6.4 Builder Management (`/admin/builders`)
- CRUD for builder profiles
- Logo upload
- Toggle active status

### 6.5 Inquiry/Lead Management (`/admin/inquiries`)
- Table of all inquiries sorted by newest
- Filter by status (New, Contacted, Follow-up, Converted, Closed)
- Click to view details, update status, add admin notes
- Export to CSV

### 6.6 Testimonials Management (`/admin/testimonials`)
- CRUD for testimonials
- Toggle active/inactive

### 6.7 Site Settings (`/admin/settings`)
- Company info (name, phone, email, address, social links)
- Homepage stats (editable counters)
- Admin user management (Super Admin only)

---

## 7. Non-Functional Requirements

- **Responsive:** Mobile-first design, works on all devices
- **SEO:** Dynamic meta tags, Open Graph, sitemap.xml, structured data for properties
- **Performance:** Image optimization (Next.js Image), lazy loading, ISR for property pages
- **Branding:** Use City Nexa brand colors — Navy Blue (#1B3A5C) as primary, light blue/white backgrounds, professional real estate aesthetic
- **WhatsApp Integration:** Floating WhatsApp button on all pages, pre-filled message with property details
- **Security:** Input validation (Zod), SQL injection prevention (Prisma), rate limiting on forms, CSRF protection

---

## 8. Development Phases

**Phase 1 (MVP):** Database setup, Admin CRUD for properties & builders, Public property listing with filters, Property detail page, Contact/Inquiry form, Basic homepage

**Phase 2:** Builder pages, Shortlist feature, Testimonials, SEO optimization, WhatsApp integration, Dashboard analytics

**Phase 3:** Advanced filters (map-based search), Email notifications on new inquiry, CSV export, Performance optimization, PWA support

---

## 9. Seed Data

Include seed script with 10-15 sample properties across all types (2BHK flats, commercial shops, plots), 4-5 sample builders, and sample testimonials for demo purposes.
