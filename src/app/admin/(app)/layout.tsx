import Link from 'next/link';
import { signOut } from '../actions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="admin-header">
        <div className="admin-header-inner">
          <Link href="/admin" className="brand">Surat Cinta</Link>
          <form action={signOut}>
            <button className="btn btn-ghost" type="submit">Keluar</button>
          </form>
        </div>
      </header>
      {children}
    </>
  );
}
