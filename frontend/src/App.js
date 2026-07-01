import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

function AppRouter() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner spinner-light" style={{ width: 32, height: 32 }} />
      </div>
    );
  }
  return user ? <Dashboard /> : <AuthPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
