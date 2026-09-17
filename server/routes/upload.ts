import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { UploadResponse, ProjectUploadResponse, ProjectUpload } from "../../shared/api";
import Project from '../models/Project';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow images, videos, and documents
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, videos, and documents are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10 // Max 10 files per upload
  }
});

// --- CRUD ROUTES USING MONGODB ---

export const handleFileUpload = async (req: Request, res: Response) => {
  try {
    upload.array('files', 10)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          files: [],
          error: err.message
        } as UploadResponse);
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          files: [],
          error: "No files uploaded"
        } as UploadResponse);
      }

      const uploadedFiles = (req.files as Express.Multer.File[]).map(file => ({
        id: uuidv4(),
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
        uploadedAt: new Date().toISOString()
      }));

      res.json({
        success: true,
        files: uploadedFiles,
        message: `Successfully uploaded ${uploadedFiles.length} file(s)`
      } as UploadResponse);
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      files: [],
      error: "Internal server error"
    } as UploadResponse);
  }
};

// CREATE project
export const handleProjectUpload = async (req: Request, res: Response) => {
  try {
    upload.array('files', 10)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          project: null as any,
          error: err.message
        } as ProjectUploadResponse);
      }

      console.log('Project upload request body:', req.body);
      console.log('Project upload files:', req.files);

      const {
        title,
        description,
        category,
        clientName,
        clientEmail,
        clientPhone,
        budget,
        timeline,
        location,
        features,
        existingFiles
      } = req.body;

      // Validate required fields
      if (!title || !description || !clientName || !clientEmail) {
        return res.status(400).json({
          success: false,
          project: null as any,
          error: "Missing required fields"
        } as ProjectUploadResponse);
      }

      // Handle newly uploaded files
      const newFiles = req.files ? (req.files as Express.Multer.File[]).map(file => ({
        id: uuidv4(),
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
        uploadedAt: new Date().toISOString()
      })) : [];

      // Handle existing files (from edit mode)
      let existingFilesArray: any[] = [];
      if (existingFiles) {
        try {
          // existingFiles comes as a JSON string containing an array of files
          existingFilesArray = JSON.parse(existingFiles);
          console.log('Parsed existing files:', existingFilesArray);
        } catch (e) {
          console.error('Error parsing existing files:', e);
        }
      }

      // Combine all files
      const allFiles = [...existingFilesArray, ...newFiles];

      // Parse features properly
      let featuresArray: string[] = [];
      if (features) {
        try {
          if (Array.isArray(features)) {
            featuresArray = features;
          } else if (typeof features === 'string') {
            if (features.startsWith('[')) {
              featuresArray = JSON.parse(features);
            } else {
              featuresArray = features.split(/,|\n/).map((f: string) => f.trim()).filter(Boolean);
            }
          }
        } catch (e) {
          console.error('Error parsing features:', e);
          featuresArray = features.split(/,|\n/).map((f: string) => f.trim()).filter(Boolean);
        }
      }

      const project = new Project({
        title,
        description,
        category: category || 'General',
        clientName,
        clientEmail,
        clientPhone: clientPhone || '',
        budget: budget || '',
        timeline: timeline || '',
        location: location || '',
        files: allFiles,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        features: featuresArray
      });

      await project.save();
      console.log('Project saved successfully:', project._id);

      res.json({
        success: true,
        project: {
          ...project.toObject(),
          createdAt: project.createdAt.toISOString(),
          updatedAt: project.updatedAt.toISOString(),
        },
        message: "Project uploaded successfully"
      } as ProjectUploadResponse);
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      project: null as any,
      error: "Internal server error"
    } as ProjectUploadResponse);
  }
};

// READ all projects
export const getProjects = async (req: Request, res: Response) => {
  try {
    const isAdminRequest = Boolean(req.headers.authorization || req.cookies?.admin_token);
    const projects = isAdminRequest
      ? await Project.find().sort({ updatedAt: -1 })
      : await Project.find({ status: 'completed' })
        .select('title description category files status timeline features createdAt updatedAt')
        .sort({ updatedAt: -1 });

    // Public visitors should see only completed portfolio work and image assets.
    // Customer-provided documents and all contact/budget data remain admin-only.
    const responseProjects = isAdminRequest
      ? projects
      : projects.map((project) => {
        const item = project.toObject();
        return {
          ...item,
          files: (item.files || [])
            .filter((file: any) => file.mimetype?.startsWith('image/'))
            .map((file: any) => ({ id: file.id, url: file.url, mimetype: file.mimetype })),
        };
      });
    res.json({
      success: true,
      projects: responseProjects,
      message: `Found ${responseProjects.length} projects`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      projects: [],
      error: "Internal server error"
    });
  }
};

// UPDATE project
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    console.log('Updating project with ID:', id, 'Fields:', updatedFields);
    updatedFields.updatedAt = new Date();
    
    // Handle features array properly
    if (updatedFields.features) {
      if (Array.isArray(updatedFields.features)) {
        // Already an array, keep as is
      } else if (typeof updatedFields.features === 'string') {
        updatedFields.features = updatedFields.features.split(/,|\n/).map((f: string) => f.trim()).filter(Boolean);
      }
    }
    
    // Handle files array properly
    if (updatedFields.files) {
      if (Array.isArray(updatedFields.files)) {
        // Already an array, keep as is
      } else if (typeof updatedFields.files === 'string') {
        try {
          updatedFields.files = JSON.parse(updatedFields.files);
        } catch (e) {
          console.error('Error parsing files:', e);
        }
      }
    }
    
    const project = await Project.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!project) {
      console.log('Project not found for update:', id);
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    console.log('Project updated successfully:', id);
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// DELETE project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete project with ID:', id);
    
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      console.log('Project not found for deletion:', id);
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    console.log('Project deleted successfully:', id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}; 
