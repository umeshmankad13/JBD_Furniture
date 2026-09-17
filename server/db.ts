import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mystic_realm';

let connectionPromise: Promise<typeof mongoose> | undefined;

export function connectDatabase() {
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(MONGODB_URI)
      .then(() => {
        console.log('MongoDB connected');
        return mongoose;
      })
      .catch((err) => {
        connectionPromise = undefined;
        console.error('MongoDB connection error:', err);
        return mongoose;
      });
  }
  return connectionPromise;
}

const TeamMemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  image: String,
  experience: String,
  specialty: String,
}, { _id: false });

const ServiceSchema = new mongoose.Schema({
  title: String,
  desc: String,
  gradient: String,
  img: String,
}, { _id: false });

const SettingsSchema = new mongoose.Schema({
  logo: { type: String, default: '' },
  about: { type: String, default: '' },
  aboutDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
  contact: { type: mongoose.Schema.Types.Mixed, default: {} },
  team: { type: [TeamMemberSchema], default: [] },
  services: { type: [ServiceSchema], default: [] },
}, { timestamps: true });

export interface SettingsDocument extends mongoose.Document {
  logo: string;
  about: string;
  aboutDetails: Record<string, unknown>;
  contact: Record<string, unknown>;
  team: Array<{ name: string; role: string; image: string; experience: string; specialty: string }>;
  services: Array<{ title: string; desc: string; gradient: string; img: string }>;
}

export const Settings: mongoose.Model<SettingsDocument> =
  (mongoose.models.Settings as mongoose.Model<SettingsDocument>) ||
  mongoose.model<SettingsDocument>('Settings', SettingsSchema);

export default mongoose; 
