import Link from 'next/link';

export default function AuthErrorPage() {
  return <main className="auth-error-page"><div><p className="eyebrow">AUTHENTICATION ERROR</p><h1>That sign-in link didn't work.</h1><p>It may have expired or already been used.</p><Link className="button button-dark" href="/login">Try again</Link></div></main>;
}
