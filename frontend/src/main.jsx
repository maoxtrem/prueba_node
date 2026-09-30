import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import './style.css';

const apiUrl = window.location.hostname === 'app.localhost'
  ? 'https://api.localhost'
  : 'https://api-dev.localhost';

function App() {
  const [mode, setMode] = React.useState('login');
  const [form, setForm] = React.useState({ name: '', email: '', password: '' });
  const [user, setUser] = React.useState(null);
  const [message, setMessage] = React.useState('');

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) return setMessage(data.error || 'Ocurrió un error');
    setUser(data.user);
    setMessage('Sesión iniciada correctamente');
  };

  const logout = async () => {
    await fetch(`${apiUrl}/auth/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
    setMessage('Sesión cerrada');
  };

  if (user) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-slate-900">Bienvenido, {user.name}</h1>
        <p className="mt-2 text-slate-500">{user.email}</p>
        <Button className="mt-6 w-full" onClick={logout}>Cerrar sesión</Button>
        {message && <p className="mt-4 text-center text-sm text-slate-600">{message}</p>}
      </Card>
    </main>;
  }

  return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
    <Card className="w-full max-w-md">
      <div className="mb-6 text-center">
        <p className="mb-2 text-sm font-medium text-slate-500">Prueba Node</p>
        <h1 className="text-2xl font-semibold text-slate-900">{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h1>
        <p className="mt-2 text-sm text-slate-500">Accede a tu cuenta para continuar</p>
      </div>
      <form className="space-y-4" onSubmit={submit}>
        {mode === 'register' && <div className="space-y-2"><Label htmlFor="name">Nombre</Label><Input id="name" placeholder="Tu nombre" value={form.name} onChange={update('name')} required /></div>}
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="tu@email.com" value={form.email} onChange={update('email')} required /></div>
        <div className="space-y-2"><Label htmlFor="password">Contraseña</Label><Input id="password" type="password" placeholder="Mínimo 8 caracteres" value={form.password} onChange={update('password')} minLength="8" required /></div>
        <Button className="w-full" type="submit">{mode === 'login' ? 'Entrar' : 'Registrarme'}</Button>
    </form>
    {message && <p className="mt-4 text-center text-sm text-slate-600">{message}</p>}
    <button className="mt-6 w-full text-sm text-blue-600 hover:underline" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage(''); }}>
      {mode === 'login' ? 'Crear una cuenta' : 'Ya tengo una cuenta'}
    </button>
    </Card>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
