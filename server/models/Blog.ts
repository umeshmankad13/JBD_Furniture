import mongoose, { Document, Model } from 'mongoose';

export interface BlogDocument extends Document {
  title: string;
  summary: string;
  content: string;
  date: Date;
  tags: string[];
  image: string;
}

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  tags: { type: [String], default: [] },
  image: { type: String, default: '' },
}, { timestamps: true });

const Blog: Model<BlogDocument> =
  (mongoose.models.Blog as Model<BlogDocument>) || mongoose.model<BlogDocument>('Blog', BlogSchema);

export default Blog;
