import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import OurOfferings from "./pages/OurOfferings";
import Projects from "./pages/Projects";
import AdminProjects from "./pages/AdminProjects";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminContent from "./pages/AdminContent";
import AdminPassword from "./pages/AdminPassword";
import AdminQuotation from "./pages/AdminQuotation";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import ProjectDetail from './pages/ProjectDetail';
import React from "react";
import Blog from "./pages/Blog";

const queryClient = new QueryClient();

function WhatsAppChatButton() {
  return (
    <a
      href="https://wa.me/916377763522"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed z-50 bottom-6 right-6 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300"
      style={{ boxShadow: '0 4px 24px 0 rgba(37, 211, 102, 0.3)' }}
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#25D366" />
        <path d="M23.5 17.5c-.3-.2-1.8-.9-2.1-1-..." fill="#fff" />
        <path d="M16 6C10.5 6 6 10.5 6 16c0 2.1.7 4.1 2 5.8L6 26l4.3-1.1C12.1 25.3 14 26 16 26c5.5 0 10-4.5 10-10S21.5 6 16 6zm0 18c-1.8 0-3.5-.5-5-1.4l-.4-.2-2.5.7.7-2.4-.2-.4C7.5 19.5 7 17.8 7 16c0-5 4-9 9-9s9 4 9 9-4 9-9 9z" fill="#fff" />
      </svg>
    </a>
  );
}

function MainAppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/offerings" element={<OurOfferings />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        <Route path="/admin/content" element={<ProtectedRoute><AdminContent /></ProtectedRoute>} />
        <Route path="/admin/change-password" element={<ProtectedRoute><AdminPassword /></ProtectedRoute>} />
        <Route path="/admin/quotation" element={<ProtectedRoute><AdminQuotation /></ProtectedRoute>} />
        <Route path="/admin/projects" element={
          <ProtectedRoute>
            <AdminProjects />
          </ProtectedRoute>
        } />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <WhatsAppChatButton />}
    </>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200">
          <BrowserRouter>
            <MainAppContent />
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
