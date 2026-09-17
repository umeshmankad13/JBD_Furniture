/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * File upload types
 */
export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface ProjectUpload {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  category: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  budget: string;
  timeline: string;
  location: string;
  files: UploadedFile[];
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  features?: string | string[];
}

export interface UploadResponse {
  success: boolean;
  files: UploadedFile[];
  message?: string;
  error?: string;
}

export interface ProjectUploadResponse {
  success: boolean;
  project: ProjectUpload;
  message?: string;
  error?: string;
}

