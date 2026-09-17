import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import ContactSubmission from '../models/ContactSubmission';

const hasSmtpConfiguration = () => Boolean(
  process.env.SMTP_SERVICE && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_RECIPIENT,
);

export const handleContact = async (req: Request, res: Response) => {
  try {
    const { name, email, mobile, message } = req.body;
    if (!name || !email || !mobile || !message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const submission = await ContactSubmission.create({ name, email, mobile, message });

    if (hasSmtpConfiguration()) {
      const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.CONTACT_RECIPIENT,
        subject: 'New Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\nMessage: ${message}`,
        html: `<h2>New Contact Form Submission</h2><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Mobile:</b> ${mobile}</p><p><b>Message:</b> ${message}</p>`,
      });
    }

    res.status(201).json({ success: true, id: submission.id });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ success: false, error: 'Unable to save your message' });
  }
};

export const getContactSubmissions = async (_req: Request, res: Response) => {
  try {
    const submissions = await ContactSubmission.find()
      .select('name email mobile message createdAt')
      .sort({ createdAt: -1 });
    res.json({ success: true, submissions });
  } catch (error) {
    console.error('Contact retrieval error:', error);
    res.status(500).json({ success: false, error: 'Unable to load messages' });
  }
};
