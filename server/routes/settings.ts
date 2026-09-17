import { Router } from 'express';
import { Settings } from '../db';

const router = Router();

// Get settings
router.get('/', async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  res.json({ success: true, settings });
});

// Update settings (full update)
router.put('/', async (req, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  const { logo, about, aboutDetails, contact, team, services } = req.body;
  if (logo !== undefined) settings.logo = logo;
  if (about !== undefined) settings.about = about;
  if (aboutDetails !== undefined) settings.aboutDetails = aboutDetails;
  if (contact !== undefined) settings.contact = contact;
  if (team !== undefined) settings.team = team;
  if (services !== undefined) settings.services = services;
  await settings.save();
  res.json({ success: true, settings });
});

export default router; 
