import mongoose, { Document, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  category: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  budget: string;
  timeline: string;
  location: string;
  files: any[];
  status: string;
  features: any[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new mongoose.Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'General' },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, default: '' },
  budget: { type: String, default: '' },
  timeline: { type: String, default: '' },
  location: { type: String, default: '' },
  files: [{ type: mongoose.Schema.Types.Mixed }],
  status: { type: String, default: 'pending' },
  features: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
export default Project; 