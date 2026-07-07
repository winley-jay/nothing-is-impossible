# Nothing Is Impossible

Apple-inspired artist profile site built with React, TypeScript, and Vite.

## Local development

```bash
pnpm install
pnpm run dev
```

Public site: `http://127.0.0.1:5174/`

Admin studio: `http://127.0.0.1:5174/studio-gift`

The public `/admin` path redirects back to the fan site in this prototype.

Admin login uses Supabase Auth when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. In Supabase Auth, create the admin user.
4. Copy that user's Auth UID.
5. In the SQL editor, run:

```sql
insert into public.admin_users (user_id)
values ('PASTE-AUTH-USER-ID-HERE');
```

6. Copy `.env.example` to `.env.local` for local development and fill in:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

7. Add the same environment variables in Vercel.

## Vercel

Build command:

```bash
pnpm run build
```

Output directory:

```bash
dist
```

`vercel.json` is included so direct routes such as `/studio-gift` load the React app correctly.

## Data layer

Production data is stored in Supabase:

- `public.site_content` stores the site content document.
- `public.admin_users` controls who can edit.
- Supabase Auth handles login.
- Supabase Storage bucket `site-images` stores uploaded images.
- Public visitors can read content.
- Only admin users can update content or upload images.
- Public love-button clicks use the `increment_love_count` RPC and `fan_love_devices` table so each saved device can send love once.

If Supabase environment variables are missing, the app falls back to local browser storage for development only.
