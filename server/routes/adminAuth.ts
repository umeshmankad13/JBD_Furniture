import crypto from 'crypto';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

const router = express.Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '2d';

const hasAuthConfiguration = () => Boolean(ADMIN_USERNAME && ADMIN_PASSWORD && JWT_SECRET);
const hasMailConfiguration = () => Boolean(ADMIN_EMAIL && process.env.SMTP_SERVICE && process.env.SMTP_USER && process.env.SMTP_PASS);
const AdminCredential: mongoose.Model<{ username: string; passwordHash: string }> =
  (mongoose.models.AdminCredential as mongoose.Model<{ username: string; passwordHash: string }> | undefined) ||
  mongoose.model<{ username: string; passwordHash: string }>('AdminCredential', new mongoose.Schema({ username: { type: String, required: true, unique: true }, passwordHash: { type: String, required: true } }));

const hashPassword = (password: string) => new Promise<string>((resolve, reject) => {
  const salt = crypto.randomBytes(16).toString('hex');
  crypto.scrypt(password, salt, 64, (error, hash) => error ? reject(error) : resolve(`${salt}:${hash.toString('hex')}`));
});
const passwordMatches = (password: string, stored: string) => new Promise<boolean>((resolve, reject) => {
  const [salt, expected] = stored.split(':');
  if (!salt || !expected) return resolve(false);
  crypto.scrypt(password, salt, 64, (error, hash) => {
    if (error) return reject(error);
    const expectedBuffer = Buffer.from(expected, 'hex');
    resolve(expectedBuffer.length === hash.length && crypto.timingSafeEqual(expectedBuffer, hash));
  });
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!hasAuthConfiguration()) {
    return res.status(503).json({ success: false, error: 'Admin authentication is not configured' });
  }
  try {
    const saved = await AdminCredential.findOne({ username }).lean();
    const matches = saved ? await passwordMatches(password, saved.passwordHash) : username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    if (matches) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    // Set both cookie and return token for localStorage
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
    });
    return res.json({ success: true, token });
    }
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, error: 'Unable to sign in' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const success = { success: true, message: 'If that administrator account exists, a reset link has been sent.' };
  if (!hasAuthConfiguration() || !hasMailConfiguration()) return res.status(503).json({ success: false, error: 'Password reset email is not configured' });
  if (req.body.username !== ADMIN_USERNAME) return res.json(success);
  try {
    const token = jwt.sign({ username: ADMIN_USERNAME, purpose: 'password-reset' }, JWT_SECRET!, { expiresIn: '20m' });
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const resetUrl = `${baseUrl}/admin/reset-password?token=${encodeURIComponent(token)}`;
    const transporter = nodemailer.createTransport({ service: process.env.SMTP_SERVICE, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
    await transporter.sendMail({ from: process.env.SMTP_USER, to: ADMIN_EMAIL, subject: 'Reset your admin password', text: `Use this link within 20 minutes to reset your password: ${resetUrl}`, html: `<p>Use this link within 20 minutes to reset your admin password:</p><p><a href="${resetUrl}">Reset password</a></p>` });
    return res.json(success);
  } catch (error) {
    console.error('Password reset email error:', error);
    return res.status(500).json({ success: false, error: 'Unable to send reset email. Please try again later.' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!JWT_SECRET) return res.status(503).json({ success: false, error: 'Admin authentication is not configured' });
  if (typeof password !== 'string' || password.length < 10) return res.status(400).json({ success: false, error: 'Password must be at least 10 characters long' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username?: string; purpose?: string };
    if (decoded.purpose !== 'password-reset' || decoded.username !== ADMIN_USERNAME) throw new Error('Invalid reset token');
    await AdminCredential.findOneAndUpdate({ username: ADMIN_USERNAME }, { passwordHash: await hashPassword(password) }, { upsert: true, new: true, setDefaultsOnInsert: true });
    res.clearCookie('admin_token');
    return res.json({ success: true, message: 'Password updated. You can now sign in.' });
  } catch {
    return res.status(400).json({ success: false, error: 'This reset link is invalid or has expired. Request a new one.' });
  }
});

router.post('/change-password', async (req, res) => {
  const token = req.cookies.admin_token || req.headers.authorization?.split(' ')[1];
  const { currentPassword, newPassword } = req.body;
  if (!token || !JWT_SECRET) return res.status(401).json({ success: false, error: 'Not authenticated' });
  if (typeof newPassword !== 'string' || newPassword.length < 10) return res.status(400).json({ success: false, error: 'New password must be at least 10 characters long' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username?: string };
    if (!decoded.username || typeof currentPassword !== 'string') throw new Error('Invalid credentials');
    const saved = await AdminCredential.findOne({ username: decoded.username }).lean();
    const valid = saved ? await passwordMatches(currentPassword, saved.passwordHash) : decoded.username === ADMIN_USERNAME && currentPassword === ADMIN_PASSWORD;
    if (!valid) return res.status(400).json({ success: false, error: 'Current password is incorrect' });
    await AdminCredential.findOneAndUpdate({ username: decoded.username }, { passwordHash: await hashPassword(newPassword) }, { upsert: true, new: true, setDefaultsOnInsert: true });
    return res.json({ success: true, message: 'Password changed successfully.' });
  } catch {
    return res.status(401).json({ success: false, error: 'Your session has expired. Please sign in again.' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true });
});

// Check authentication status
router.get('/check', (req, res) => {
  if (!hasAuthConfiguration()) {
    return res.status(503).json({ success: false, authenticated: false });
  }
  const token = req.cookies.admin_token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, authenticated: false });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, authenticated: true, user: decoded });
  } catch (err) {
    res.status(401).json({ success: false, authenticated: false });
  }
});

// Middleware to protect admin routes
export function requireAdminAuth(req, res, next) {
  if (!hasAuthConfiguration()) {
    return res.status(503).json({ success: false, error: 'Admin authentication is not configured' });
  }
  const token = req.cookies.admin_token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

export default router; 
