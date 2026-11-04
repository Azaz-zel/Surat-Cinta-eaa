'use client';
import { useActionState } from 'react';
import { register, type RegisterState } from '../actions';

export function RegisterForm() {
  const [state, action, pending] = useActionState<RegisterState, FormData>(register, {});
  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="field">
        <label className="label" htmlFor="email">Email</label>
        <input className="input" id="email" name="email" type="email" autoComplete="email" defaultValue={state.email} key={`e-${state.email}`} required />
      </div>
      <div className="field">
        <label className="label" htmlFor="password">Password</label>
        <input className="input" id="password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={72} required />
        <p className="hint">Minimal 8 karakter.</p>
      </div>
      <div className="field">
        <label className="label" htmlFor="confirm">Ulangi password</label>
        <input className="input" id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} maxLength={72} required />
      </div>
      {/* Honeypot: hidden from people and screen readers, filled in only by bots. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      {state.error && <p className="alert alert-error" role="alert">{state.error}</p>}
      <button className="btn btn-primary btn-block" type="submit" disabled={pending}>
        {pending ? 'Membuat akun…' : 'Daftar'}
      </button>
    </form>
  );
}
