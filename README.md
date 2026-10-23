# Voltcart

A tech and gadgets e-commerce storefront with a live deal zone, quick-view product previews, a spec compare drawer, and wishlist/cart hooks. Built with React, Vite, Tailwind and Supabase.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5300 (its own slot: pixcodes is on 5310, starter-kit on 5320)
npm test           # node:test, no extra dependencies
```

## Backend (optional)

Without env vars the app runs on a built-in local demo store, so every page is browsable.

To use Supabase:

1. Copy `.env.example` to `.env.local`
2. Fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Supabase, Project Settings, API
3. Apply `supabase/migrations/0001_voltcart_init.sql` (schema + seed of ~30 products, categories and deals)

## Features

- Deal Zone: rotating spotlight banners with live countdown timers, sponsored chips with glow borders
- Preview: quick-view modal on every product card, image galleries, compare drawer (pin up to 3)
- Engagement: wishlist, add-to-cart toasts, "people viewing" signal, recently-viewed strip
- Full cart with quantities and totals; checkout is a stub (no payments by design)

## Deploy

Deploys to Vercel as a static site (SPA). `vercel.json` routes deep links back to `index.html`.
