# BOOKOWSKY v0.5 — Supabase Auth setup

## 1. Create a Supabase project
Create a project in the Supabase dashboard and copy the Project URL and Publishable key.

## 2. Configure local environment
Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 3. Configure URL settings in Supabase Auth
Set the Site URL to:

```text
http://localhost:3000
```

Add this Redirect URL:

```text
http://localhost:3000/auth/callback
```

When deploying, also add your production callback, for example:

```text
https://your-domain.com/auth/callback
```

## 4. Enable Google
In Supabase Authentication > Providers > Google, enable Google and provide the OAuth Client ID and Client Secret from Google Cloud.

In Google Cloud, add the Supabase callback URL shown by Supabase to the OAuth client's Authorized redirect URIs.

## 5. Magic link
Email magic links work through Supabase Auth. For production, configure a custom SMTP provider rather than relying on development email limits.

## 6. Install dependencies and run

```bash
npm install
npm run dev
```

Protected routes:

```text
/read/*
/api/books/*/content
```

Public routes remain indexable:

```text
/
/books
/books/*
```
