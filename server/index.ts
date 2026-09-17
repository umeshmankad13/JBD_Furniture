import "./env";
import express from "express";
import cors from "cors";
import path from "path";
import { handleDemo } from "./routes/demo";
import { handleFileUpload, handleProjectUpload, getProjects, updateProject, deleteProject } from "./routes/upload";
import { handleContact, getContactSubmissions } from './routes/contact';
import settingsRouter from './routes/settings';
import blogsRouter from './routes/blogs';
import adminAuthRouter, { requireAdminAuth } from './routes/adminAuth';
import cookieParser from 'cookie-parser';
import { connectDatabase } from './db';

export function createServer() {
  const app = express();
  // Vitest loads the Vite configuration, which also imports this factory. Avoid
  // opening a real database connection for client-only test runs.
  if (!process.env.VITEST) {
    void connectDatabase();
  }

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // File upload routes
  app.post("/api/upload", requireAdminAuth, handleFileUpload);
  
  // Contact form routes
  app.post("/api/contact", handleContact);
  app.get("/api/contact", requireAdminAuth, getContactSubmissions);

  // Settings route
  app.use("/api/settings", (req, res, next) => {
    if (req.method === 'GET') return next();
    return requireAdminAuth(req, res, next);
  }, settingsRouter);
  app.use('/api/admin', adminAuthRouter);
  
  // Protect admin APIs (but not the login endpoint)
  app.use('/api/projects', (req, res, next) => {
    // Allow public GET for projects only if it's not an admin request
    if (req.method === 'GET' && !req.headers.authorization) {
      return next(); // Allow public GET for projects
    }
    return requireAdminAuth(req, res, next);
  });
  
  app.use('/api/blogs', (req, res, next) => {
    if (req.method === 'GET') return next(); // Allow public GET
    return requireAdminAuth(req, res, next);
  }, blogsRouter);

  // Admin-specific project routes (always protected)
  app.post("/api/projects/upload", requireAdminAuth, handleProjectUpload);
  app.put("/api/projects/:id", requireAdminAuth, updateProject);
  app.delete("/api/projects/:id", requireAdminAuth, deleteProject);
  
  // Public project routes
  app.get("/api/projects", getProjects);

  return app;
}
