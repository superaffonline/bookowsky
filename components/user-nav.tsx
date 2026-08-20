import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/app/login/actions';

export async function UserNav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <Link className="text-button" href="/login">Sign in</Link>;

  const label = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Reader';
  return (
    <div className="user-nav">
      <span className="user-chip" title={user.email || undefined}><span className="user-dot" />{label}</span>
      <form action={signOut}><button className="icon-button" type="submit" aria-label="Sign out" title="Sign out"><LogOut size={16} /></button></form>
    </div>
  );
}
