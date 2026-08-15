# Diamond Wedding Registry

A private, shareable wedding gift registry web app. Guests browse gifts by category, claim one item to purchase, and self-identify with a privacy-redacted name. The couple manages the registry via a password-protected admin panel.

## Tech Stack

- **Frontend:** Next.js + React + TypeScript
- **Styling:** Tailwind CSS v4
- **Backend:** Supabase (configured, ready to connect)
- **Hosting:** Cloudflare Pages / Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the registry.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

## Features

- **Public Registry:** Browse gifts by category, view product details
- **Claim Flow:** Guests claim gifts with name input, race condition protection
- **Name Redaction:** Privacy-first display (e.g., "J*** D**")
- **Admin Panel:** Password-protected CRUD for products, view real claimer names

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
```

## Supabase Schema

Run this SQL in your Supabase SQL editor to set up the database:

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price TEXT,
  image_url TEXT,
  external_link TEXT,
  category TEXT NOT NULL DEFAULT 'Uncategorized',
  is_claimed BOOLEAN DEFAULT false,
  claimed_by_real TEXT,
  claimed_by_display TEXT,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER DEFAULT 0
);
```
