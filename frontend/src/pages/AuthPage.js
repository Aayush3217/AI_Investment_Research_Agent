import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: 40, height: 40,
              background: 'linear-gradient(135deg, var(--accent), #0080FF)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px'
            }}>📊</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700 }}>
              AlphaLens
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            AI-powered investment research agent
          </p>
        </div>

        <div className="card">
          {/* Tab toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', padding: '4px', marginBottom: '24px' }}>
            {['login', 'register'].map((m) => (
              <button
                key={m}
                className="btn"
                onClick={() => { setMode(m); setError(''); }}
                style={{
                  flex: 1, justifyContent: 'center', padding: '8px',
                  background: mode === m ? 'var(--bg-card)' : 'transparent',
                  color: mode === m ? 'var(--text)' : 'var(--text-muted)',
                  border: mode === m ? '1px solid var(--border)' : 'none',
                  fontSize: '13px',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'register' && (
              <div>
                <label className="label">Full Name</label>
                <input className="input-field" placeholder="John Doe" value={form.name} onChange={set('name')} required />
              </div>
            )}
            <div>
              <label className="label">Email</label>
              <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required minLength={6} />
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}>
              {loading && <div className="spinner" />}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', marginTop: '24px' }}>
          
        </p>
      </div>
    </div>
  );
}
