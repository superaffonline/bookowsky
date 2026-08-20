import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { Logo } from '@/components/logo';
import { brand } from '@/lib/brand';
import { signInWithGoogle, signInWithMagicLink } from './actions';

export const metadata = {
  title: 'Sign in',
  description: `Sign in to ${brand.name} to read books online.`,
  robots: { index: false, follow: true },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const next = typeof params.next === 'string' && params.next.startsWith('/') && !params.next.startsWith('//') ? params.next : '/books';
  const sent = params.sent === '1';
  const error = typeof params.error === 'string';

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Link className="brand auth-brand" href="/" aria-label={`${brand.name} home`}><Logo /><span>{brand.name}</span></Link>
        <div className="auth-heading">
          <p className="eyebrow">MEMBERS ONLY READING</p>
          <h1>Open a book.<br />Keep your place.</h1>
          <p>Sign in to read online and keep your reading experience private to your account.</p>
        </div>

        {sent ? <div className="auth-notice"><strong>Check your inbox.</strong><span>We sent you a secure magic link. You can close this tab after opening it.</span></div> : null}
        {error ? <div className="auth-error">We couldn't complete that sign-in. Please try again.</div> : null}

        <form action={signInWithGoogle}>
          <input type="hidden" name="next" value={next} />
          <button className="button button-dark auth-button" type="submit">
            <span className="google-mark" aria-hidden="true">G</span> Continue with Google
          </button>
        </form>

        <div className="auth-divider"><span>or use a magic link</span></div>

        <form className="magic-form" action={signInWithMagicLink}>
          <input type="hidden" name="next" value={next} />
          <label htmlFor="email">Email address</label>
          <div className="magic-input-wrap"><Mail size={17} /><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></div>
          <button className="button button-ghost auth-button" type="submit">Email me a magic link</button>
        </form>

        <p className="auth-terms">By continuing, you agree to use the library responsibly. Public-domain files remain available from their original sources.</p>
        <Link className="back-link auth-back" href="/books"><ArrowLeft size={15} /> Browse without signing in</Link>
      </section>
      <aside className="auth-art" aria-hidden="true"><div className="auth-orbit orbit-one" /><div className="auth-orbit orbit-two" /><div className="auth-quote">READ<br />WITHOUT<br /><em>BARRIERS.</em></div></aside>
    </main>
  );
}
