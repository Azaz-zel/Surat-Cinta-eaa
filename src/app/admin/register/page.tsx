import type { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from './RegisterForm';

export const metadata: Metadata = { title: 'Daftar · Surat Cinta' };
export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  const open = Boolean(process.env.REGISTER_INVITE_CODE);
  return (
    <main className="login-wrap">
      <div className="card login-card">
        <p className="brand">Surat Cinta</p>
        <h1 className="page-title" style={{ fontSize: 22 }}>Buat akun</h1>
        {open ? (
          <>
            <p className="muted" style={{ margin: 0, fontSize: 14 }}>
              Kamu butuh kode undangan dari pemilik web ini. Surat yang kamu buat hanya bisa dilihat dan diedit dari akunmu.
            </p>
            <RegisterForm />
          </>
        ) : (
          <p className="alert alert-error" role="status">Pendaftaran sedang ditutup.</p>
        )}
        <p className="muted" style={{ margin: 0, fontSize: 14, textAlign: 'center' }}>
          Sudah punya akun? <Link href="/admin/login">Masuk</Link>
        </p>
      </div>
    </main>
  );
}
