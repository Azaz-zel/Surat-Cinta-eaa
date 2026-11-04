import type { Metadata } from 'next';
import Link from 'next/link';
import { registrationOpen } from '@/lib/registration';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Masuk · Surat Cinta' };

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const canRegister = registrationOpen();
  return (
    <main className="login-wrap">
      <div className="card login-card">
        <p className="brand">Surat Cinta</p>
        <h1 className="page-title" style={{ fontSize: 22 }}>Masuk</h1>
        <LoginForm />
        {canRegister && (
          <p className="muted" style={{ margin: 0, fontSize: 14, textAlign: 'center' }}>
            Belum punya akun? <Link href="/admin/register">Daftar</Link>
          </p>
        )}
      </div>
    </main>
  );
}
