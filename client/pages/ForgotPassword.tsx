import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function ForgotPassword() {
  const [username, setUsername] = useState(''); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setError(''); try { const res = await fetch('/api/admin/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error); setMessage(data.message); } catch (err) { setError(err instanceof Error ? err.message : 'Unable to request a reset link'); } finally { setLoading(false); } };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"><Card className="w-full max-w-md shadow-xl"><CardContent className="p-8"><h1 className="text-2xl font-bold text-center mb-2 text-blue-900">Forgot password?</h1><p className="text-sm text-gray-600 text-center mb-6">We’ll email a secure reset link to the administrator.</p>{message ? <div className="rounded bg-green-100 p-3 text-center text-green-800">{message}</div> : <form onSubmit={submit} className="space-y-4"><Input value={username} onChange={e => setUsername(e.target.value)} placeholder="Admin username" autoComplete="username" required autoFocus />{error && <p className="text-sm text-red-700">{error}</p>}<Button className="w-full bg-blue-700" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</Button></form>}<div className="mt-5 text-center"><Link to="/admin/login" className="text-sm text-blue-700 hover:underline">Back to login</Link></div></CardContent></Card></div>;
}
