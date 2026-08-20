'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/books';
  return next;
}

export async function signInWithGoogle(formData: FormData) {
  const supabase = await createClient();
  const headerStore = await headers();
  const origin = headerStore.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const next = safeNext(formData.get('next'));

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) redirect('/login?error=google');
  redirect(data.url);
}

export async function signInWithMagicLink(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const next = safeNext(formData.get('next'));
  const headerStore = await headers();
  const origin = headerStore.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) redirect(`/login?error=magic&next=${encodeURIComponent(next)}`);
  redirect(`/login?sent=1&next=${encodeURIComponent(next)}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
