import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Masuk · Surat Cinta' };

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const registrationOpen = Boolean(process.env.REGISTER_INVITE_CODE);
  return (
    <main className="login-wrap">
      <div className="card login-card">
        <p className="brand">Surat Cinta</p>
        <h1 className="page-title" style={{ fontSize: 22 }}>Masuk ke panel admin</h1>
        <LoginForm />
        {registrationOpen && (
          <p className="muted" style={{ margin: 0, fontSize: 14, textAlign: 'center' }}>
            Belum punya akun? <Link href="/admin/register">Daftar</Link>
          </p>
        )}
      </div>
    </main>
  );
}
