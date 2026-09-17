import express from 'express';
import multer from 'multer';
import Blog from '../models/Blog';

const router = express.Router();
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) {
      callback(new Error('Only image uploads are allowed'));
      return;
    }
    callback(null, true);
  },
});

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ date: -1 });
    res.json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch blogs' });
  }
});

// Add a new blog
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, summary, content, date, tags } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const blog = new Blog({
      title,
      summary,
      content,
      date,
      tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
      image,
    });
    await blog.save();
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to add blog' });
  }
});

// Edit a blog
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, summary, content, date, tags } = req.body;
    const update: any = { title, summary, content, date, tags: tags ? tags.split(',').map((t: string) => t.trim()) : [] };
    if (req.file) update.image = `/uploads/${req.file.filename}`;
    const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update blog' });
  }
});

// Delete a blog
router.delete('/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete blog' });
  }
});

export default router; 
