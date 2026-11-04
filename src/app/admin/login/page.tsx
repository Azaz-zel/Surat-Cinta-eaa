import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Masuk · Surat Cinta' };

export default function LoginPage() {
  return (
    <main className="login-wrap">
      <div className="card login-card">
        <p className="brand">Surat Cinta</p>
        <h1 className="page-title" style={{ fontSize: 22 }}>Masuk ke panel admin</h1>
        <LoginForm />
      </div>
    </main>
  );
}
