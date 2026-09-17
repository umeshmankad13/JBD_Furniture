import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AdminPassword() {
  const [currentPassword, setCurrentPassword] = useState(''); const [newPassword, setNewPassword] = useState(''); const [message, setMessage] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setLoading(true); setMessage(''); try { const res = await fetch('/api/admin/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('admin_jwt') || ''}` }, body: JSON.stringify({ currentPassword, newPassword }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error); setCurrentPassword(''); setNewPassword(''); setMessage(data.message); } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to change password.'); } finally { setLoading(false); } };
  return <div className="min-h-screen bg-blue-50 p-6"><Card className="mx-auto mt-16 max-w-md"><CardContent className="p-6"><h1 className="mb-5 text-2xl font-bold text-blue-900">Change password</h1><form onSubmit={submit} className="space-y-4"><Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current password" required/><Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password (10+ characters)" minLength={10} required/>{message && <p className={message.includes('successfully') ? 'text-green-700' : 'text-red-700'}>{message}</p>}<Button className="w-full" disabled={loading}>{loading ? 'Updating…' : 'Change password'}</Button></form><Link className="mt-5 block text-center text-sm text-blue-700 hover:underline" to="/admin/content">Back to website content</Link></CardContent></Card></div>;
}
