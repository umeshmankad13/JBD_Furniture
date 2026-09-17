import mongoose, { Document, Model } from 'mongoose';

export interface ContactSubmissionDocument extends Document {
  name: string;
  email: string;
  mobile: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSubmissionSchema = new mongoose.Schema<ContactSubmissionDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, maxlength: 320 },
    mobile: { type: String, required: true, trim: true, maxlength: 32 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
  },
  { timestamps: true },
);

const ContactSubmission: Model<ContactSubmissionDocument> =
  (mongoose.models.ContactSubmission as Model<ContactSubmissionDocument>) ||
  mongoose.model<ContactSubmissionDocument>('ContactSubmission', ContactSubmissionSchema);

export default ContactSubmission;
