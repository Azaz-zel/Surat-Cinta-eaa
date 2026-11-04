'use client';
import { useActionState } from 'react';
import { signIn, type LoginState } from '../actions';

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});
  return (
    <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="field">
        <label className="label" htmlFor="email">Email</label>
        <input className="input" id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label className="label" htmlFor="password">Password</label>
        <input className="input" id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {state.error && <p className="alert alert-error" role="alert">{state.error}</p>}
      <button className="btn btn-primary btn-block" type="submit" disabled={pending}>
        {pending ? 'Masuk…' : 'Masuk'}
      </button>
    </form>
  );
}
