# City Nexa Networks — Phase 1 MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-ready real estate channel partner website with admin panel, property listings, filters, and inquiry forms for City Nexa Networks (Bangalore).

**Architecture:** Single Next.js 14+ monolith using App Router. Server Components by default, Client Components for interactivity (filters, forms). Supabase PostgreSQL via Prisma ORM. NextAuth.js v5 for admin-only auth. Deployed to Vercel.

**Tech Stack:** Next.js 14+, TypeScript (strict), Tailwind CSS, shadcn/ui, Prisma, Supabase PostgreSQL, NextAuth.js v5, Zod, Supabase Storage

**Design doc:** `docs/plans/2026-02-24-citynexa-website-design.md`

**Builder partner logos:** Located at `parterners/` (14 JPEG files). Must be copied to `public/images/builders/` with clean filenames during Task 2.

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `.env.example`, `.env.local`, `.gitignore`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/lib/utils.ts`, `components.json`

**Step 1: Initialize Next.js project**

```bash
cd /c/Users/DSI-LPT-081/Desktop/Pods
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Accept defaults. This creates the project in the current directory. If it asks about overwriting existing files, say yes (only README.md and .gitignore will conflict).

**Step 2: Install core dependencies**

```bash
npm install prisma @prisma/client next-auth@beta @auth/prisma-adapter
npm install zod react-hook-form @hookform/resolvers
npm install @supabase/supabase-js
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install date-fns slugify
npm install -D @types/node
```

**Step 3: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

Choose: New York style, Zinc base color, CSS variables: yes. This creates `components.json` and updates `tailwind.config.ts` and `globals.css`.

**Step 4: Add essential shadcn/ui components**

```bash
npx shadcn@latest add button card input label textarea select badge separator sheet dialog dropdown-menu table tabs avatar toast sonner form checkbox radio-group slider switch popover command scroll-area skeleton tooltip
```

**Step 5: Configure brand colors in globals.css**

Update `src/app/globals.css` — replace the shadcn default CSS variables in `:root` and `.dark` with City Nexa brand colors:

```css
@layer base {
  :root {
    --background: 210 33% 98%; /* #F0F4F8 */
    --foreground: 210 40% 15%; /* Dark navy text */
    --card: 0 0% 100%;
    --card-foreground: 210 40% 15%;
    --popover: 0 0% 100%;
    --popover-foreground: 210 40% 15%;
    --primary: 210 52% 23%; /* #1B3A5C navy */
    --primary-foreground: 0 0% 100%;
    --secondary: 210 20% 95%;
    --secondary-foreground: 210 40% 15%;
    --muted: 210 20% 95%;
    --muted-foreground: 210 10% 45%;
    --accent: 40 50% 55%; /* #C5A355 gold */
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 210 20% 90%;
    --input: 210 20% 90%;
    --ring: 210 52% 23%;
    --radius: 0.5rem;
  }
}
```

**Step 6: Create .env.example**

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Supabase (for image storage)
NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

Copy to `.env.local` and fill in real values.

**Step 7: Update .gitignore**

Ensure `.env.local` and `node_modules` are in `.gitignore` (create-next-app should handle this, but verify).

**Step 8: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts at http://localhost:3000 with default Next.js page.

**Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind, shadcn/ui, and dependencies"
```

---

## Task 2: Prisma Schema & Database Setup

**Files:**
- Create: `prisma/schema.prisma`, `src/lib/prisma.ts`
- Copy: `parterners/*.jpeg` → `public/images/builders/` (with clean names)

**Step 1: Initialize Prisma**

```bash
npx prisma init
```

This creates `prisma/schema.prisma` and updates `.env` (we use `.env.local` instead).

**Step 2: Write the Prisma schema**

Replace `prisma/schema.prisma` with the full schema:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum PropertyType {
  RESIDENTIAL
  COMMERCIAL
  PLOT
}

enum ListingType {
  SALE
  RENT
}

enum PriceUnit {
  LAKH
  CRORE
}

enum AreaUnit {
  SQFT
  SQYD
  SQMT
}

enum Furnishing {
  UNFURNISHED
  SEMI_FURNISHED
  FULLY_FURNISHED
}

enum PossessionStatus {
  READY_TO_MOVE
  UNDER_CONSTRUCTION
  UPCOMING
}

enum InquiryType {
  GENERAL
  PROPERTY_SPECIFIC
  CALLBACK
}

enum InquiryStatus {
  NEW
  CONTACTED
  FOLLOW_UP
  CONVERTED
  CLOSED
}

enum AdminRole {
  SUPER_ADMIN
  ADMIN
}

model Builder {
  id              String     @id @default(cuid())
  name            String
  logoUrl         String?    @map("logo_url")
  description     String?
  websiteUrl      String?    @map("website_url")
  totalProjects   Int        @default(0) @map("total_projects")
  establishedYear Int?       @map("established_year")
  isActive        Boolean    @default(true) @map("is_active")
  createdAt       DateTime   @default(now()) @map("created_at")
  updatedAt       DateTime   @updatedAt @map("updated_at")
  properties      Property[]

  @@map("builders")
}

model Property {
  id               String           @id @default(cuid())
  title            String
  slug             String           @unique
  description      String?
  propertyType     PropertyType     @map("property_type")
  listingType      ListingType      @map("listing_type")
  builderId        String           @map("builder_id")
  builder          Builder          @relation(fields: [builderId], references: [id])
  price            Float
  priceUnit        PriceUnit        @map("price_unit")
  carpetArea       Float?           @map("carpet_area")
  carpetAreaUnit   AreaUnit?        @map("carpet_area_unit")
  builtUpArea      Float?           @map("built_up_area")
  bedrooms         Int?
  bathrooms        Int?
  floorNumber      Int?             @map("floor_number")
  totalFloors      Int?             @map("total_floors")
  facingDirection  String?          @map("facing_direction")
  furnishing       Furnishing?
  possessionStatus PossessionStatus @map("possession_status")
  possessionDate   DateTime?        @map("possession_date")
  amenities        Json             @default("[]")
  address          String?
  city             String           @default("Bangalore")
  locality         String?
  state            String           @default("Karnataka")
  pincode          String?
  latitude         Float?
  longitude        Float?
  reraNumber       String?          @map("rera_number")
  isFeatured       Boolean          @default(false) @map("is_featured")
  isActive         Boolean          @default(true) @map("is_active")
  createdAt        DateTime         @default(now()) @map("created_at")
  updatedAt        DateTime         @updatedAt @map("updated_at")
  images           PropertyImage[]
  inquiries        Inquiry[]

  @@map("properties")
}

model PropertyImage {
  id         String   @id @default(cuid())
  propertyId String   @map("property_id")
  property   Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
  imageUrl   String   @map("image_url")
  isPrimary  Boolean  @default(false) @map("is_primary")
  sortOrder  Int      @default(0) @map("sort_order")

  @@map("property_images")
}

model Inquiry {
  id          String        @id @default(cuid())
  name        String
  email       String
  phone       String
  message     String?
  propertyId  String?       @map("property_id")
  property    Property?     @relation(fields: [propertyId], references: [id])
  inquiryType InquiryType   @default(GENERAL) @map("inquiry_type")
  status      InquiryStatus @default(NEW)
  adminNotes  String?       @map("admin_notes")
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")

  @@map("inquiries")
}

model AdminUser {
  id           String    @id @default(cuid())
  name         String
  email        String    @unique
  passwordHash String    @map("password_hash")
  role         AdminRole @default(ADMIN)
  isActive     Boolean   @default(true) @map("is_active")
  createdAt    DateTime  @default(now()) @map("created_at")

  @@map("admin_users")
}

model Testimonial {
  id        String   @id @default(cuid())
  name      String
  text      String
  rating    Int      @default(5)
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now()) @map("created_at")

  @@map("testimonials")
}
```

**Step 3: Create Prisma client singleton**

Create `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**Step 4: Copy builder partner logos**

```bash
mkdir -p public/images/builders
```

Copy and rename each file from `parterners/` to `public/images/builders/` with clean names:

```bash
cp "parterners/WhatsApp Image 2026-02-24 at 7.42.34 PM.jpeg" public/images/builders/casatrance.jpeg
cp "parterners/WhatsApp Image 2026-02-24 at 7.42.34 PM (1).jpeg" public/images/builders/goyal-hariyana.jpeg
cp "parterners/WhatsApp Image 2026-02-24 at 7.42.35 PM.jpeg" public/images/builders/casagrand.jpeg
cp "parterners/WhatsApp Image 2026-02-24 at 7.42.36 PM.jpeg" public/images/builders/modern-spaaces.jpeg
cp "parterners/WhatsApp Image 2026-02-24 at 7.42.36 PM (1).jpeg" public/images/builders/sumadhura.jpeg
cp "parterners/WhatsApp Image 2026-02-24 at 7.42.37 PM.jpeg" public/images/builders/lodha.jpeg
cp "parterners/WhatsApp Image 2026-02-24 at 7.42.37 PM (1).jpeg" public/images/builders/sobha.jpeg
cp "parterners/WhatsApp Image 2026-02-24 at 7.42.38 PM.jpeg" public/images/builders/ds-max.jpeg
cp "parterners/WhatsApp Image 2026-02-24 at 7.42.39 PM.jpeg" public/images/builders/elv-projects.jpeg
cp "parterners/WhatsApp Image 2026-02-24 at 7.42.39 PM (1).jpeg" public/images/builders/sowparnika.jpeg
cp "parterners/WhatsApp Image 2026-02-24 at 7.42.40 PM.jpeg" public/images/builders/sbr-group.jpeg
cp "parterners/WhatsApp Image 2026-02-24 at 7.42.40 PM (1).jpeg" public/images/builders/m1-homes.jpeg
cp "parterners/WhatsApp Image 2026-02-24 at 7.44.08 PM.jpeg" public/images/builders/assetz.jpeg
cp "parterners/WhatsApp Image 2026-02-24 at 7.44.09 PM.jpeg" public/images/builders/abhinandan-lodha.jpeg
```

Also copy company logo:

```bash
mkdir -p public/images
cp image.jpeg public/images/citynexa-logo.jpeg
```

**Step 5: Run first migration**

Make sure `.env.local` has valid `DATABASE_URL` and `DIRECT_URL` from Supabase. Then:

```bash
npx prisma migrate dev --name init
```

Expected: Migration creates all 6 tables and enums in Supabase.

**Step 6: Generate Prisma client**

```bash
npx prisma generate
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Prisma schema with all models, enums, and builder logos"
```

---

## Task 3: Seed Data

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json` (add prisma seed config)

**Step 1: Install ts-node for seed script**

```bash
npm install -D ts-node
```

**Step 2: Add prisma seed config to package.json**

Add to `package.json`:

```json
"prisma": {
  "seed": "npx ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

**Step 3: Write seed script**

Create `prisma/seed.ts` with:

- 14 builders matching partner logos (name, logo path, description, established year)
- 15 properties across Bangalore localities with realistic data:
  - 5 residential (2BHK/3BHK in Whitefield, Sarjapur, Hebbal)
  - 4 commercial (offices/shops in Electronic City, MG Road)
  - 3 plots (Devanahalli, Yelahanka, Hosur Road)
  - 3 luxury (4BHK penthouses, villas)
- Each property gets 3-4 images from Unsplash real estate placeholder URLs
- 5 testimonials with realistic names and text
- 1 SUPER_ADMIN user: admin@citynexa.com / admin123 (bcrypt hashed)

The seed script must:
- Use `prisma.builder.upsert()` for idempotent seeding
- Hash the admin password with bcrypt (`npm install bcryptjs && npm install -D @types/bcryptjs`)
- Auto-generate slugs using the `slugify` package
- Set `is_featured: true` on 4-5 properties

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

**Step 4: Run seed**

```bash
npx prisma db seed
```

Expected: Console logs showing created builders, properties, testimonials, admin user.

**Step 5: Verify in Prisma Studio**

```bash
npx prisma studio
```

Open http://localhost:5555 and verify all data looks correct.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add seed script with 14 builders, 15 properties, and sample data"
```

---

## Task 4: NextAuth.js Admin Authentication

**Files:**
- Create: `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/middleware.ts`, `src/app/admin/login/page.tsx`

**Step 1: Configure NextAuth.js**

Create `src/lib/auth.ts`:

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.adminUser.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || !user.isActive) return null;

        const passwordMatch = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        );
        if (!passwordMatch) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
});
```

**Step 2: Create API route handler**

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
```

**Step 3: Create auth middleware**

Create `src/middleware.ts`:

```typescript
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage && !req.auth) {
    return Response.redirect(new URL("/admin/login", req.url));
  }

  if (isLoginPage && req.auth) {
    return Response.redirect(new URL("/admin/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
```

**Step 4: Create admin login page**

Create `src/app/admin/login/page.tsx` — a centered login card with email/password form, brand logo, error handling via `useFormState`. Uses shadcn/ui Card, Input, Button, Label. On success redirects to `/admin/dashboard`.

This is a Client Component (`"use client"`) that calls `signIn("credentials", ...)` from `next-auth/react`.

**Step 5: Create NextAuth type extension**

Create `src/types/next-auth.d.ts`:

```typescript
import { AdminRole } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface User {
    role?: AdminRole;
  }
  interface Session {
    user: {
      id: string;
      role: AdminRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AdminRole;
  }
}
```

**Step 6: Verify login works**

Run `npm run dev`, navigate to `/admin/login`, log in with `admin@citynexa.com` / `admin123`. Should redirect to `/admin/dashboard` (which will 404 for now — that's expected).

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add NextAuth.js admin authentication with credentials provider"
```

---

## Task 5: Admin Layout & Sidebar

**Files:**
- Create: `src/app/admin/layout.tsx`, `src/components/admin/admin-sidebar.tsx`, `src/components/admin/admin-header.tsx`

**Step 1: Create admin sidebar component**

`src/components/admin/admin-sidebar.tsx` — Client Component with:
- City Nexa logo at top
- Navigation links: Dashboard, Properties, Builders, Inquiries, Testimonials, Settings
- Each link uses `lucide-react` icons (LayoutDashboard, Building2, Home, MessageSquare, Star, Settings)
- Active link highlighted with primary color
- Collapsible on mobile (Sheet from shadcn/ui)
- Sign out button at bottom using `signOut()` from `next-auth/react`

**Step 2: Create admin header**

`src/components/admin/admin-header.tsx` — Displays current page title, mobile menu trigger (hamburger icon to open sidebar sheet), and user avatar/name from session.

**Step 3: Create admin layout**

`src/app/admin/layout.tsx` — Server Component that:
- Wraps admin pages in a flex container: sidebar (fixed left, 256px wide) + main content area
- Includes `SessionProvider` from `next-auth/react` wrapping children
- On mobile: sidebar hidden, accessible via hamburger menu

**Step 4: Create admin dashboard placeholder**

Create `src/app/admin/dashboard/page.tsx` — Simple page with "Dashboard" heading. Full implementation comes later in Task 11.

**Step 5: Verify layout renders**

Navigate to `/admin/dashboard` after login. Should see sidebar with navigation links and the dashboard heading.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add admin layout with sidebar navigation"
```

---

## Task 6: Admin Builder Management (CRUD)

**Files:**
- Create: `src/app/admin/builders/page.tsx`, `src/app/admin/builders/new/page.tsx`, `src/app/admin/builders/[id]/edit/page.tsx`, `src/lib/actions/builders.ts`, `src/lib/validations/builder.ts`, `src/components/admin/builder-form.tsx`

**Step 1: Create Zod validation schema**

`src/lib/validations/builder.ts`:

```typescript
import { z } from "zod";

export const builderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  totalProjects: z.coerce.number().int().min(0).default(0),
  establishedYear: z.coerce.number().int().min(1900).max(2030).optional(),
  isActive: z.boolean().default(true),
});
```

**Step 2: Create Server Actions**

`src/lib/actions/builders.ts` — Server Actions using `"use server"`:
- `getBuilders()` — Paginated list with search, returns `{ builders, totalCount }`
- `getBuilder(id)` — Single builder by ID
- `createBuilder(formData)` — Validate with Zod, create in DB, `revalidatePath`
- `updateBuilder(id, formData)` — Validate, update, `revalidatePath`
- `deleteBuilder(id)` — Delete builder, `revalidatePath`
- `toggleBuilderActive(id)` — Toggle `is_active`, `revalidatePath`

Each action validates input with the Zod schema, handles errors, and returns `{ success, error? }`.

**Step 3: Create builder form component**

`src/components/admin/builder-form.tsx` — Client Component shared by create/edit pages. Uses `react-hook-form` with `@hookform/resolvers/zod`. Fields: name, description (textarea), website URL, total projects, established year, active toggle. Submit calls the appropriate server action. Logo upload will be added in a later task (Supabase Storage integration).

**Step 4: Create builders list page**

`src/app/admin/builders/page.tsx` — Server Component:
- Search input (controlled, updates URL search params)
- Data table: name, logo thumbnail, total projects, established year, active status toggle, edit/delete buttons
- "Add Builder" button links to `/admin/builders/new`
- Delete triggers confirmation dialog, then calls `deleteBuilder` action

**Step 5: Create new builder page**

`src/app/admin/builders/new/page.tsx` — Renders `BuilderForm` with no initial data. On success redirect to `/admin/builders`.

**Step 6: Create edit builder page**

`src/app/admin/builders/[id]/edit/page.tsx` — Fetches builder by ID, passes to `BuilderForm` as initial data. On success redirect to `/admin/builders`.

**Step 7: Verify CRUD operations**

Test: create a builder, see it in the list, edit it, toggle active, delete it.

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: add admin builder management with CRUD operations"
```

---

## Task 7: Admin Property Management (CRUD)

**Files:**
- Create: `src/app/admin/properties/page.tsx`, `src/app/admin/properties/new/page.tsx`, `src/app/admin/properties/[id]/edit/page.tsx`, `src/lib/actions/properties.ts`, `src/lib/validations/property.ts`, `src/components/admin/property-form.tsx`

**Step 1: Create Zod validation schema**

`src/lib/validations/property.ts`:

```typescript
import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  propertyType: z.enum(["RESIDENTIAL", "COMMERCIAL", "PLOT"]),
  listingType: z.enum(["SALE", "RENT"]),
  builderId: z.string().min(1, "Builder is required"),
  price: z.coerce.number().positive("Price must be positive"),
  priceUnit: z.enum(["LAKH", "CRORE"]),
  carpetArea: z.coerce.number().positive().optional(),
  carpetAreaUnit: z.enum(["SQFT", "SQYD", "SQMT"]).optional(),
  builtUpArea: z.coerce.number().positive().optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  floorNumber: z.coerce.number().int().optional(),
  totalFloors: z.coerce.number().int().optional(),
  facingDirection: z.string().optional(),
  furnishing: z.enum(["UNFURNISHED", "SEMI_FURNISHED", "FULLY_FURNISHED"]).optional(),
  possessionStatus: z.enum(["READY_TO_MOVE", "UNDER_CONSTRUCTION", "UPCOMING"]),
  possessionDate: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  address: z.string().optional(),
  city: z.string().default("Bangalore"),
  locality: z.string().optional(),
  state: z.string().default("Karnataka"),
  pincode: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  reraNumber: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
```

**Step 2: Create Server Actions**

`src/lib/actions/properties.ts` — Server Actions:
- `getProperties(filters?)` — Paginated list with search, filter by type/status/builder, returns `{ properties, totalCount }`
- `getProperty(id)` — Single property with builder and images
- `createProperty(formData)` — Validate, auto-generate slug via `slugify(title)`, create in DB, `revalidatePath`
- `updateProperty(id, formData)` — Validate, update, regenerate slug if title changed, `revalidatePath`
- `deleteProperty(id)` — Delete property + cascade images, `revalidatePath`
- `togglePropertyActive(id)` — Toggle `is_active`
- `togglePropertyFeatured(id)` — Toggle `is_featured`

Slug generation: `slugify(title, { lower: true, strict: true })` + append random 4-char suffix to ensure uniqueness.

**Step 3: Create property form component**

`src/components/admin/property-form.tsx` — Client Component, large form with sections:
- **Basic Info:** Title, description, property type select, listing type select
- **Builder:** Builder dropdown (fetched from DB)
- **Pricing:** Price input, price unit select
- **Specifications:** Carpet area + unit, built-up area, bedrooms, bathrooms, floor, total floors, facing direction dropdown, furnishing select
- **Possession:** Status select, date picker
- **Amenities:** Multi-select checkboxes (Swimming Pool, Gym, Parking, Clubhouse, Garden, Security, Power Backup, Lift, etc.)
- **Location:** Address, city (default Bangalore), locality dropdown (Whitefield, Sarjapur Road, Electronic City, Hebbal, Yelahanka, etc.), state, pincode
- **Meta:** RERA number, featured toggle, active toggle

Uses `react-hook-form` with Zod resolver. Multi-step accordion layout using shadcn Tabs or collapsible sections.

**Step 4: Create properties list page**

`src/app/admin/properties/page.tsx` — Server Component:
- Search + filter row (property type, listing type, builder dropdown)
- Data table: title, type badge, listing type, price, builder name, active toggle, featured toggle, edit/delete buttons
- "Add Property" button

**Step 5: Create new/edit property pages**

`src/app/admin/properties/new/page.tsx` and `src/app/admin/properties/[id]/edit/page.tsx` — Same pattern as builders.

**Step 6: Verify CRUD**

Test: create a property linked to a builder, see it in list, edit, toggle featured/active, delete.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add admin property management with full CRUD"
```

---

## Task 8: Image Upload (Supabase Storage)

**Files:**
- Create: `src/lib/supabase.ts`, `src/lib/actions/upload.ts`, `src/components/admin/image-upload.tsx`, `src/app/api/upload/route.ts`

**Step 1: Create Supabase client**

`src/lib/supabase.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

**Step 2: Create upload API route**

`src/app/api/upload/route.ts` — POST handler that:
- Accepts `multipart/form-data` with file(s)
- Validates file type (jpeg, png, webp) and size (max 5MB)
- Uploads to Supabase Storage bucket `property-images` (or `builder-logos`)
- Returns the public URL

**Note:** Create two storage buckets in Supabase dashboard before testing: `property-images` (public) and `builder-logos` (public).

**Step 3: Create image upload component**

`src/components/admin/image-upload.tsx` — Client Component:
- Drag-and-drop zone (or click to browse)
- Shows upload progress
- Preview thumbnails of uploaded images
- For properties: support multiple images, drag to reorder, click to set primary, click X to remove
- Returns array of `{ imageUrl, isPrimary, sortOrder }`

**Step 4: Integrate into property form**

Update `src/components/admin/property-form.tsx` to include `ImageUpload` component. When saving property, also create/update `PropertyImage` records.

Update `src/lib/actions/properties.ts` — `createProperty` and `updateProperty` to handle images array: create `PropertyImage` entries, handle reordering and primary selection.

**Step 5: Integrate into builder form**

Update `src/components/admin/builder-form.tsx` to include single image upload for builder logo. Saves to `builder-logos` bucket, stores URL in `logoUrl` field.

**Step 6: Verify uploads**

Test: upload images when creating/editing a property, upload a logo for a builder. Verify images appear in Supabase Storage dashboard.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add image upload to Supabase Storage for properties and builders"
```

---

## Task 9: Public Layout (Header, Footer, WhatsApp Button)

**Files:**
- Create: `src/app/(public)/layout.tsx`, `src/components/common/header.tsx`, `src/components/common/footer.tsx`, `src/components/common/whatsapp-button.tsx`, `src/components/common/mobile-nav.tsx`

**Step 1: Create public layout**

`src/app/(public)/layout.tsx` — Wraps all public pages with Header + main content + Footer + WhatsApp floating button.

**Step 2: Create header**

`src/components/common/header.tsx` — Sticky header:
- City Nexa logo (left) linking to `/`
- Nav links: Home, Properties, Builders, About, Contact
- "Shortlist" link with heart icon + count badge (reads from localStorage via client component)
- Mobile: hamburger menu opens `mobile-nav` (Sheet from shadcn/ui)
- Background: white with shadow on scroll

**Step 3: Create footer**

`src/components/common/footer.tsx`:
- 4-column grid: Company info, Quick Links, Property Types, Contact Info
- Social media icon links (placeholder hrefs)
- Copyright line
- Navy blue background, white text

**Step 4: Create WhatsApp floating button**

`src/components/common/whatsapp-button.tsx` — Client Component:
- Fixed position bottom-right (bottom: 24px, right: 24px)
- Green WhatsApp icon (from lucide or inline SVG)
- Links to `https://wa.me/91XXXXXXXXXX` (placeholder number)
- Bounce animation on first load
- z-index: 50

**Step 5: Move existing homepage**

Move `src/app/page.tsx` to `src/app/(public)/page.tsx` (temporary placeholder — full homepage built in Task 13).

**Step 6: Verify layout**

Navigate to `/`. Should see header, placeholder content, footer, WhatsApp button.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add public layout with header, footer, and WhatsApp button"
```

---

## Task 10: Public Property Listing Page

**Files:**
- Create: `src/app/(public)/properties/page.tsx`, `src/components/property/property-card.tsx`, `src/components/property/property-filters.tsx`, `src/components/property/property-grid.tsx`, `src/lib/actions/public-properties.ts`, `src/lib/constants.ts`

**Step 1: Create constants file**

`src/lib/constants.ts` — Bangalore localities array, amenity options, facing directions, BHK options, price range presets.

```typescript
export const BANGALORE_LOCALITIES = [
  "Whitefield", "Sarjapur Road", "Electronic City", "Hebbal",
  "Yelahanka", "Devanahalli", "Marathahalli", "Koramangala",
  "HSR Layout", "BTM Layout", "Bannerghatta Road", "Hosur Road",
  "Rajajinagar", "Malleshwaram", "Jayanagar", "JP Nagar",
  "Kanakapura Road", "Thanisandra", "Hennur", "Bagalur",
];

export const AMENITIES = [
  "Swimming Pool", "Gym", "Clubhouse", "Garden", "Parking",
  "24/7 Security", "Power Backup", "Lift", "Children's Play Area",
  "Jogging Track", "Indoor Games", "Basketball Court", "Tennis Court",
  "Multipurpose Hall", "Intercom", "Rain Water Harvesting",
];
```

**Step 2: Create public properties server action**

`src/lib/actions/public-properties.ts`:
- `getPublicProperties(filters)` — Returns paginated, active properties with primary image and builder name. Accepts filter params: propertyType, listingType, minPrice, maxPrice, bedrooms, minArea, maxArea, possessionStatus, furnishing, locality, builderId, sortBy, page, limit.
- `getPropertyBySlug(slug)` — Returns single active property with all images, builder info, for detail page.
- `getSimilarProperties(propertyId, propertyType, locality)` — Returns 3-4 similar active properties.

**Step 3: Create property card component**

`src/components/property/property-card.tsx`:
- Next.js `<Image>` for primary photo (with fallback placeholder)
- Title, price with unit (e.g., "₹45 Lakh"), locality + city
- Specs row: bedrooms, bathrooms, carpet area
- Builder name small text
- Possession status badge (green for Ready, yellow for Under Construction, blue for Upcoming)
- Heart icon button for shortlist (client-side localStorage toggle — stubbed for now, full implementation in Phase 2)
- Links to `/properties/[slug]`

**Step 4: Create property filters sidebar**

`src/components/property/property-filters.tsx` — Client Component (`"use client"`):
- Property Type: checkbox group (Residential, Commercial, Plot)
- Listing Type: radio (Sale, Rent)
- Budget Range: min/max inputs with price unit toggle
- Bedrooms: button group (1, 2, 3, 4, 5+)
- Area Range: min/max inputs
- Possession Status: checkbox group
- Furnishing: checkbox group
- Locality: searchable dropdown (from constants)
- Builder: dropdown (fetched from active builders)
- "Apply Filters" and "Clear All" buttons
- Filters update URL search params (for shareable URLs and SSR)
- Mobile: filters in a Sheet, triggered by "Filters" button

**Step 5: Create property grid**

`src/components/property/property-grid.tsx`:
- Receives properties array and displays in responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)
- Grid/list view toggle button
- Sort dropdown (Price Low-High, Price High-Low, Newest First)
- Results count text ("Showing 1-12 of 45 properties")
- Pagination at bottom (Previous/Next + page numbers)

**Step 6: Create listing page**

`src/app/(public)/properties/page.tsx` — Server Component:
- Reads URL search params for filters
- Calls `getPublicProperties(filters)` server action
- Renders filter sidebar + property grid
- Page metadata: "Properties for Sale & Rent in Bangalore | City Nexa"

**Step 7: Verify listing page**

Navigate to `/properties`. Should see seeded properties in a grid, filter sidebar working, pagination working.

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: add public property listing page with filters and pagination"
```

---

## Task 11: Public Property Detail Page

**Files:**
- Create: `src/app/(public)/properties/[slug]/page.tsx`, `src/components/property/image-gallery.tsx`, `src/components/property/property-specs.tsx`, `src/components/property/inquiry-form.tsx`, `src/components/property/similar-properties.tsx`, `src/lib/actions/inquiries.ts`, `src/lib/validations/inquiry.ts`

**Step 1: Create inquiry validation**

`src/lib/validations/inquiry.ts`:

```typescript
import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  message: z.string().optional(),
  propertyId: z.string().optional(),
  inquiryType: z.enum(["GENERAL", "PROPERTY_SPECIFIC", "CALLBACK"]).default("PROPERTY_SPECIFIC"),
});
```

**Step 2: Create inquiry server action**

`src/lib/actions/inquiries.ts`:
- `submitInquiry(data)` — Validate with Zod, create Inquiry record, return success/error.
- `getInquiries(filters?)` — For admin: paginated list, filter by status.
- `updateInquiryStatus(id, status, notes?)` — For admin: update status and notes.

**Step 3: Create image gallery component**

`src/components/property/image-gallery.tsx` — Client Component:
- Main large image + thumbnail row below
- Click thumbnail to switch main image
- Click main image to open lightbox (full-screen overlay with prev/next navigation)
- Uses Next.js `<Image>` with proper sizing

**Step 4: Create property specs component**

`src/components/property/property-specs.tsx`:
- Grid of spec items: Bedrooms, Bathrooms, Carpet Area, Built-up Area, Floor, Facing, Furnishing, Possession Status
- Each with icon + label + value
- Only renders specs that have values

**Step 5: Create inquiry form component**

`src/components/property/inquiry-form.tsx` — Client Component:
- Name, email, phone, message fields
- Pre-filled hidden field with property ID and title reference in message
- Submit calls `submitInquiry` server action
- Success toast notification using Sonner
- Loading state on submit button

**Step 6: Create similar properties component**

`src/components/property/similar-properties.tsx`:
- Calls `getSimilarProperties(propertyId, type, locality)` — same type or locality, limit 4
- Renders as horizontal scroll of `PropertyCard` components

**Step 7: Create property detail page**

`src/app/(public)/properties/[slug]/page.tsx` — Server Component:
- Fetch property by slug via `getPropertyBySlug(slug)`, 404 if not found
- Layout: image gallery (full width), then two-column: main content (specs, description, amenities, map) + sidebar (price card, inquiry form, builder card)
- Amenities rendered as icon + text grid
- Google Maps embed iframe using latitude/longitude (if available)
- Builder card: logo, name, link to `/builders/[id]`
- Dynamic metadata: title, description, Open Graph image (primary property image)

**Step 8: Verify detail page**

Navigate to `/properties/[any-seeded-slug]`. Should see full detail page with gallery, specs, inquiry form.

**Step 9: Test inquiry submission**

Fill out inquiry form and submit. Verify record created in DB via Prisma Studio.

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: add property detail page with gallery, specs, and inquiry form"
```

---

## Task 12: Admin Dashboard & Inquiry Management

**Files:**
- Modify: `src/app/admin/dashboard/page.tsx`
- Create: `src/app/admin/inquiries/page.tsx`, `src/app/admin/inquiries/[id]/page.tsx`, `src/components/admin/stats-card.tsx`, `src/components/admin/recent-inquiries.tsx`

**Step 1: Create stats card component**

`src/components/admin/stats-card.tsx` — Reusable card showing icon, label, count number. Uses shadcn Card.

**Step 2: Build dashboard page**

`src/app/admin/dashboard/page.tsx` — Server Component:
- 4 stats cards in a row: Total Properties, Active Listings, Total Inquiries, New Leads Today
- Counts fetched directly via Prisma queries
- Recent inquiries table below (last 10, with name, property, status, date)
- Quick action buttons: "Add Property", "Add Builder"

**Step 3: Create inquiries list page**

`src/app/admin/inquiries/page.tsx` — Server Component:
- Filter tabs: All, New, Contacted, Follow-up, Converted, Closed
- Data table: name, email, phone, property title, type, status badge, date
- Status badge colors: New=blue, Contacted=yellow, Follow-up=orange, Converted=green, Closed=gray

**Step 4: Create inquiry detail page**

`src/app/admin/inquiries/[id]/page.tsx`:
- Full inquiry info (name, email, phone, message, linked property)
- Status update dropdown (calls `updateInquiryStatus` server action)
- Admin notes textarea (saved on blur or button click)
- Timeline/history of status changes (optional stretch — can skip for MVP)

**Step 5: Verify**

Test: view dashboard stats, view inquiries list, update inquiry status.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add admin dashboard and inquiry management"
```

---

## Task 13: Homepage

**Files:**
- Modify: `src/app/(public)/page.tsx`
- Create: `src/components/home/hero-section.tsx`, `src/components/home/featured-properties.tsx`, `src/components/home/builder-partners.tsx`, `src/components/home/why-choose-us.tsx`, `src/components/home/stats-counter.tsx`, `src/components/home/testimonials-section.tsx`, `src/components/home/cta-section.tsx`

**Step 1: Create hero section**

`src/components/home/hero-section.tsx`:
- Full-width hero with background gradient (navy to light blue)
- Large heading: "Find Your Dream Property in Bangalore"
- Subtext: "Your trusted real estate partner — Zero commission for buyers"
- Search bar (text input + search button) that navigates to `/properties?search=query`
- Quick filter chips below: Residential, Commercial, Plots (link to `/properties?propertyType=X`)

**Step 2: Create featured properties carousel**

`src/components/home/featured-properties.tsx` — Server Component:
- Fetches featured properties (`is_featured: true`, `is_active: true`)
- Horizontal scrollable row of `PropertyCard` components
- "View All Properties" link at the end

**Step 3: Create builder partners section**

`src/components/home/builder-partners.tsx`:
- Heading: "Our Trusted Builder Partners"
- Auto-scrolling logo marquee (CSS animation, no JS library needed)
- Shows all 14 builder logos from `public/images/builders/`
- Logos rendered with Next.js `<Image>`, grayscale filter that removes on hover

**Step 4: Create "Why Choose Us" section**

`src/components/home/why-choose-us.tsx`:
- 4 cards in a row: "Zero Commission", "Trusted Partners", "Expert Guidance", "End-to-End Support"
- Each with an icon (from lucide-react), heading, short description
- Light background section

**Step 5: Create stats counter**

`src/components/home/stats-counter.tsx` — Client Component:
- 4 animated counters: "500+ Properties", "1000+ Happy Customers", "14 Builder Partners", "1 City"
- Numbers animate up on scroll into view (use `IntersectionObserver`)
- Navy background section with white text

**Step 6: Create testimonials section**

`src/components/home/testimonials-section.tsx` — Server Component:
- Fetches active testimonials from DB
- Carousel/slider of testimonial cards (name, text, star rating)
- Auto-rotate every 5 seconds

**Step 7: Create CTA section with inquiry form**

`src/components/home/cta-section.tsx`:
- Two-column: left = heading "Looking for the Perfect Property?" + bullet points, right = inquiry form (reuses `InquiryForm` component from Task 11 with `inquiryType: GENERAL`)
- Navy blue background

**Step 8: Assemble homepage**

`src/app/(public)/page.tsx` — Server Component composing all sections:
1. Hero
2. Featured Properties
3. Builder Partners
4. Why Choose Us
5. Stats Counter
6. Testimonials
7. CTA Section

Metadata: "City Nexa Networks — Your Trusted Real Estate Partner in Bangalore"

**Step 9: Verify**

Navigate to `/`. Full homepage should render with all sections, real data from DB.

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: add homepage with hero, featured properties, builders, testimonials"
```

---

## Task 14: Contact Page

**Files:**
- Create: `src/app/(public)/contact/page.tsx`

**Step 1: Create contact page**

`src/app/(public)/contact/page.tsx`:
- Two-column layout: left = contact form (reuses InquiryForm with `inquiryType: GENERAL`), right = contact info cards
- Contact info: office address (placeholder Bangalore address), phone, email
- Google Maps embed iframe (placeholder Bangalore location)
- Metadata: "Contact Us | City Nexa Networks"

**Step 2: Verify**

Navigate to `/contact`, submit a test inquiry, verify it appears in admin inquiries.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add contact page with inquiry form and map"
```

---

## Task 15: Admin Testimonials Management

**Files:**
- Create: `src/app/admin/testimonials/page.tsx`, `src/app/admin/testimonials/new/page.tsx`, `src/app/admin/testimonials/[id]/edit/page.tsx`, `src/lib/actions/testimonials.ts`, `src/lib/validations/testimonial.ts`, `src/components/admin/testimonial-form.tsx`

**Step 1: Create validation, actions, form, and pages**

Follow same CRUD pattern as Task 6 (builders). Fields: name, text, rating (1-5 star selector), active toggle.

**Step 2: Verify**

Test: create, edit, toggle active, delete testimonials. Verify homepage testimonials section updates.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add admin testimonials management"
```

---

## Task 16: Polish, Error Handling & Loading States

**Files:**
- Create: `src/app/(public)/not-found.tsx`, `src/app/(public)/loading.tsx`, `src/app/(public)/properties/loading.tsx`, `src/app/admin/loading.tsx`, `src/app/(public)/error.tsx`

**Step 1: Create loading skeletons**

Loading pages using shadcn Skeleton components for:
- Property listing (grid of skeleton cards)
- Admin pages (skeleton table rows)

**Step 2: Create error and 404 pages**

- `not-found.tsx` — Friendly 404 with "Back to Home" button
- `error.tsx` — Client Component error boundary with retry button

**Step 3: Add metadata to all pages**

Verify every public page has proper `metadata` export with title, description, Open Graph tags.

**Step 4: Responsive testing**

Verify all pages look good on mobile (375px), tablet (768px), desktop (1280px). Fix any layout issues.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add loading states, error handling, and responsive polish"
```

---

## Task 17: Vercel Deployment Setup

**Files:**
- Modify: `next.config.ts`, `package.json`

**Step 1: Configure next.config.ts for production**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
```

**Step 2: Add Prisma build hook**

In `package.json`, update build script:

```json
"scripts": {
  "build": "prisma generate && next build",
  "postinstall": "prisma generate"
}
```

**Step 3: Verify production build locally**

```bash
npm run build
npm run start
```

Expected: No build errors. Site works at http://localhost:3000.

**Step 4: Push to GitHub**

```bash
git add -A
git commit -m "feat: configure for Vercel deployment"
git push origin main
```

**Step 5: Deploy to Vercel**

1. Go to vercel.com, import the `subramanyaSgb/citynexa` repo
2. Set environment variables (DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
3. Deploy

**Step 6: Run migration on production DB**

If not done during Vercel build, run:

```bash
npx prisma migrate deploy
npx prisma db seed
```

**Step 7: Verify production site**

Test all pages, admin login, property CRUD, inquiry submission on the deployed URL.

**Step 8: Commit any final fixes**

```bash
git add -A
git commit -m "fix: production deployment adjustments"
git push origin main
```

---

## Summary

| Task | Description | Key Deliverable |
|------|-------------|----------------|
| 1 | Project Scaffolding | Next.js + Tailwind + shadcn/ui + all deps |
| 2 | Prisma Schema & DB | 6 models, all enums, builder logos copied |
| 3 | Seed Data | 14 builders, 15 properties, testimonials, admin user |
| 4 | Admin Auth | NextAuth.js login, middleware, protected routes |
| 5 | Admin Layout | Sidebar navigation, responsive |
| 6 | Admin Builders | Full CRUD with form |
| 7 | Admin Properties | Full CRUD with all fields |
| 8 | Image Upload | Supabase Storage, multi-image for properties |
| 9 | Public Layout | Header, footer, WhatsApp button |
| 10 | Property Listing | Filters, grid, pagination |
| 11 | Property Detail | Gallery, specs, inquiry form, similar |
| 12 | Admin Dashboard | Stats, inquiry management |
| 13 | Homepage | Hero, featured, builders, testimonials, CTA |
| 14 | Contact Page | Form + map |
| 15 | Admin Testimonials | CRUD |
| 16 | Polish | Loading, errors, responsive |
| 17 | Deployment | Vercel config, push, deploy |
