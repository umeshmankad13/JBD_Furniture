import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/FileUpload';
import { UploadedFile } from '@shared/api';
import type { ProjectUpload } from '@shared/api';
import { Footer } from '@/components/Footer';
import { features } from 'process';

const categories = [
  "Kitchen Renovation",
  "Modular Kitchen Solutions",
  "Office Furniture",
  "Office Furniture & Corporate Solutions",
  "Living Room",
  "Bedroom Furniture",
  "Restaurant Furniture",
  "Furniture Refurbishing & Restoration",
  "Interior Design Consultation",
  "Material Selection & Sourcing",
  "Restoration",
  "Other"
];

// This file will be moved to the admin panel. Remove any public export or usage.
// (No code change needed here yet, just a note for the next step.)

export default function ProjectUpload({ initialData, isEditMode, onClose }: {
  initialData?: Partial<ProjectUpload>;
  isEditMode?: boolean;
  onClose?: () => void;
}) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(initialData?.files || []);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    clientName: initialData?.clientName || '',
    clientEmail: initialData?.clientEmail || '',
    clientPhone: initialData?.clientPhone || '',
    budget: initialData?.budget || '',
    timeline: initialData?.timeline || '',
    location: initialData?.location || '',
    features: Array.isArray(initialData?.features) ? initialData.features.join(', ') : (initialData?.features || ''),
    status: initialData?.status || 'pending',
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || '',
        clientName: initialData.clientName || '',
        clientEmail: initialData.clientEmail || '',
        clientPhone: initialData.clientPhone || '',
        budget: initialData.budget || '',
        timeline: initialData.timeline || '',
        location: initialData.location || '',
        features: Array.isArray(initialData.features) ? initialData.features.join(', ') : (initialData.features || ''),
        status: initialData.status || 'pending',
      });
      setUploadedFiles(initialData.files || []);
    }
  }, [initialData, isEditMode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFilesUploaded = (files: UploadedFile[]) => {
    console.log('Files uploaded:', files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFileSelection = (files: File[]) => {
    console.log('Files selected:', files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveExistingFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleRemoveSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      console.log('Form is already submitting, ignoring duplicate submission');
      return;
    }
    
    if (!formData.title || !formData.description || !formData.clientName || !formData.clientEmail) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && initialData?.id) {
        // Edit mode: handle new file uploads first, then update project
        let allFiles = [...uploadedFiles];
        
        // Upload new files if any are selected
        if (selectedFiles.length > 0) {
          const formDataForUpload = new FormData();
          selectedFiles.forEach(file => {
            formDataForUpload.append('files', file);
          });

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formDataForUpload,
          });

          const uploadResult = await uploadResponse.json();
          if (uploadResult.success) {
            allFiles = [...allFiles, ...uploadResult.files];
          } else {
            alert(uploadResult.error || 'Failed to upload new files');
            setIsSubmitting(false);
            return;
          }
        }

        // Update project with all files (existing + new)
        const token = localStorage.getItem('admin_jwt');
        const response = await fetch(`/api/projects/${initialData.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            ...formData, 
            budget: Number(formData.budget) || 0, 
            files: allFiles,
            features: formData.features ? 
              (Array.isArray(formData.features) ? formData.features : 
               formData.features.split(/,|\n/).map((f: string) => f.trim()).filter(Boolean)) : []
          }),
        });
        const result = await response.json();
        if (result.success) {
          setIsSubmitted(true);
          if (onClose) onClose();
          return;
        } else {
          alert(result.error || 'Update failed');
          setIsSubmitting(false);
          return;
        }
      } else {
        // New project: upload with files
        const submitFormData = new FormData();
        
        // Add form fields
        Object.entries(formData).forEach(([key, value]) => {
          if (key === 'features' && value) {
            // Handle features array properly
            const featuresArray = Array.isArray(value) ? value : 
              value.split(/,|\n/).map((f: string) => f.trim()).filter(Boolean);
            submitFormData.append(key, JSON.stringify(featuresArray));
          } else {
            submitFormData.append(key, value);
          }
        });

        // Add existing uploaded files (these are already uploaded and have URLs)
        if (uploadedFiles.length > 0) {
          console.log('Adding existing files to form:', uploadedFiles);
          // Send all existing files as a single JSON array
          submitFormData.append('existingFiles', JSON.stringify(uploadedFiles));
        }

        // Add newly selected files
        if (selectedFiles.length > 0) {
          console.log('Adding selected files to form:', selectedFiles);
          selectedFiles.forEach(file => {
            submitFormData.append('files', file);
          });
        }

        const token = localStorage.getItem('admin_jwt');
        const response = await fetch('/api/projects/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: submitFormData,
        });

        const result = await response.json();
        console.log('Project upload response:', result);

        if (result.success) {
          console.log('Project created successfully:', result.project);
          setIsSubmitted(true);
          // Reset form
          setFormData({
            title: '',
            description: '',
            category: '',
            clientName: '',
            clientEmail: '',
            clientPhone: '',
            budget: '',
            timeline: '',
            location: '',
            features: '',
            status: 'pending',
          });
          setUploadedFiles([]);
          setSelectedFiles([]);
        } else {
          console.error('Project creation failed:', result.error);
          alert(result.error || 'Submission failed');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // After successful submit, call onClose if provided
  if (isSubmitted) {
    if (onClose) {
      onClose();
      return null;
    }
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="max-w-md w-full mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Submitted!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for submitting your project. We'll review your files and get back to you within 24-48 hours.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    navigate('/projects');
                  }}
                  className="w-full"
                >
                  View All Projects
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSubmitted(false);
                    navigate('/contact');
                  }}
                  className="w-full"
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Submit Your Project
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Share your project details and upload images, videos, or documents to help us understand your vision.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Project Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Modern Kitchen Renovation"
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description *
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your project requirements, style preferences, and any specific details..."
                    rows={4}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Category
                  </label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget
                  </label>
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d*$/.test(val)) handleInputChange('budget', val);
                    }}
                    placeholder="e.g., 15000"
                  />
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <Input
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    placeholder="e.g., 6-8 weeks"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Location
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Beverly Hills, CA"
                  />
                </div>
              </div>

              {/* Key Features */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Features
                </label>
                <Textarea
                  value={formData.features}
                  onChange={(e) => handleInputChange('features', e.target.value)}
                  placeholder="List key features, separated by commas or new lines"
                  rows={2}
                />
              </div>
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Status
                </label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Client Information */}
              <div className="border-t pt-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Client Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      value={formData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      value={formData.clientPhone}
                      onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {isEditMode && uploadedFiles.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Files</label>
                  <div className="flex flex-wrap gap-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="relative flex flex-col items-center">
                        {file.mimetype.startsWith('image/') ? (
                          <img src={file.url} alt={file.originalName} className="h-20 w-20 object-cover rounded border mb-1" />
                        ) : (
                          <span className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded border mb-1 text-xs">{file.originalName}</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingFile(file.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                          title="Remove file"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* File Upload */}
              <div className="border-t pt-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  {isEditMode ? 'Add More Files' : 'Project Files'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {isEditMode 
                    ? 'Select additional images, videos, or documents to add to this project.'
                    : 'Upload images, videos, or documents that showcase your project requirements, inspiration, or existing space.'
                  }
                </p>
                <FileUpload
                  onFilesUploaded={handleFilesUploaded}
                  onFilesSelected={handleFileSelection}
                  multiple={true}
                  maxFiles={10}
                  maxSize={50}
                  acceptedTypes={['image/*', 'video/*', 'application/pdf', 'application/msword']}
                  uploadImmediately={false}
                />
                
                {/* Show selected files that will be uploaded */}
                {isEditMode && selectedFiles.length > 0 && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Files to Add</label>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 flex items-center justify-center bg-blue-100 rounded">
                              {file.type.startsWith('image/') ? (
                                <span className="text-blue-600 text-xs">IMG</span>
                              ) : file.type.startsWith('video/') ? (
                                <span className="text-blue-600 text-xs">VID</span>
                              ) : (
                                <span className="text-blue-600 text-xs">DOC</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-700 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSelectedFile(index)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove file"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="border-t pt-8">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {isEditMode ? 'Updating...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {isEditMode ? 'Update Project' : 'Submit Project'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 