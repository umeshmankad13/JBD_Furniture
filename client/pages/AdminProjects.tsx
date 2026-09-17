import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Download, CheckCircle, XCircle, Clock, Plus, Pencil, Trash2, LogOut, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectUpload as ProjectUploadType } from '@shared/api';
import { Footer } from '@/components/Footer';
import ProjectUpload from './ProjectUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export default function AdminProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectUploadType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [editProject, setEditProject] = useState<ProjectUploadType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showRevenueModal, setShowRevenueModal] = useState(false);


  // Unique categories from projects
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];
  const statuses = ['All', 'pending', 'reviewed', 'approved', 'rejected'];

  // Filtered projects
  const filteredProjects = projects.filter(project => {
    const matchesTitle = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || project.category === categoryFilter;
    return matchesTitle && matchesStatus && matchesCategory;
  });

  // Dashboard analytics (reuse logic from AdminDashboard)
  const totalProjects = filteredProjects.length;
  const statusCounts = filteredProjects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const categoryCounts = filteredProjects.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const totalRevenue = filteredProjects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
  const recentProjects = [...filteredProjects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Prepare data for charts
  const statusData = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
  const categoryData = Object.entries(categoryCounts).map(([category, count]) => ({ category, count }));
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#D65DB1', '#FF6F91'];
  // Status bar colors
  const getStatusBarColor = (status: string) => {
    switch (status) {
      case 'pending': return '#EF4444'; // red
      case 'reviewed': return '#3B82F6'; // blue
      case 'completed': return '#22C55E'; // green
      case 'approved': return '#F59E42'; // orange
      default: return '#A1A1AA'; // gray
    }
  };

  // Sample blog data for admin UI
  const sampleBlogs = [
    {
      id: 1,
      title: '5 Essential Furniture Care Tips',
      summary: 'Keep your furniture looking new with these easy maintenance tips for wood, fabric, and more.',
      date: '2024-06-01',
      tags: ['Care', 'Tips'],
      image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 2,
      title: '2024 Interior Design Trends',
      summary: 'Discover the latest trends in furniture and interior design for modern homes.',
      date: '2024-05-20',
      tags: ['Trends', 'Design'],
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 3,
      title: 'Material Guide: Wood, Laminates, and More',
      summary: 'Learn about different furniture materials, their pros and cons, and how to choose the right one.',
      date: '2024-05-10',
      tags: ['Materials', 'Guide'],
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState('');
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    id: null,
    title: '',
    summary: '',
    date: '',
    tags: '',
    image: '',
    content: '',
  });
  const [blogImageFile, setBlogImageFile] = useState(null);

  const fetchBlogs = async () => {
    setBlogsLoading(true);
    setBlogsError('');
    try {
      const token = localStorage.getItem('admin_jwt');
      const res = await fetch('/api/blogs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) setBlogs(data.blogs);
      else setBlogsError(data.error || 'Failed to fetch blogs');
    } catch (err) {
      setBlogsError('Failed to fetch blogs');
    } finally {
      setBlogsLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleOpenAddBlog = () => {
    setEditBlog(null);
    setBlogForm({ id: null, title: '', summary: '', date: '', tags: '', image: '', content: '' });
    setBlogImageFile(null);
    setShowBlogModal(true);
  };
  const handleOpenEditBlog = (blog) => {
    setEditBlog(blog);
    setBlogForm({
      id: blog._id,
      title: blog.title,
      summary: blog.summary,
      date: blog.date ? blog.date.slice(0, 10) : '',
      tags: blog.tags.join(', '),
      image: blog.image,
      content: blog.content || '',
    });
    setBlogImageFile(null);
    setShowBlogModal(true);
  };
  const handleDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      const token = localStorage.getItem('admin_jwt');
      await fetch(`/api/blogs/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchBlogs();
    }
  };
  const handleBlogFormChange = (field, value) => {
    setBlogForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleBlogImageChange = (e) => {
    const file = e.target.files[0];
    setBlogImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setBlogForm((prev) => ({ ...prev, image: ev.target.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleBlogFormSubmit = async (e) => {
    e.preventDefault();
    const tagsArr = blogForm.tags.split(',').map((t) => t.trim()).filter(Boolean);
    const formData = new FormData();
    formData.append('title', blogForm.title);
    formData.append('summary', blogForm.summary);
    formData.append('date', blogForm.date);
    formData.append('tags', tagsArr.join(','));
    formData.append('content', blogForm.content || '');
    if (blogImageFile) formData.append('image', blogImageFile);
    
    const token = localStorage.getItem('admin_jwt');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    
    if (editBlog) {
      await fetch(`/api/blogs/${blogForm.id}`, { 
        method: 'PUT', 
        headers,
        body: formData 
      });
    } else {
      await fetch('/api/blogs', { 
        method: 'POST', 
        headers,
        body: formData 
      });
    }
    setShowBlogModal(false);
    fetchBlogs();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('admin_jwt');
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (result.success) {
        console.log('Fetched projects:', result.projects);
        setProjects(result.projects);
      } else {
        setError(result.error || 'Failed to fetch projects');
      }
    } catch (error) {
      console.error('Fetch projects error:', error);
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'reviewed':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Reviewed</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const token = localStorage.getItem('admin_jwt');
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Remove from frontend list after successful server deletion
        setProjects((prev) => prev.filter((p) => p._id !== projectId && p.id !== projectId));
        alert('Project deleted successfully');
      } else {
        alert(result.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete project. Please try again.');
    }
  };

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('admin_jwt');
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        setProjects((prev) => prev.map((p) =>
          (p._id === projectId || p.id === projectId)
            ? { ...p, status: newStatus as 'pending' | 'reviewed' | 'approved' | 'rejected' }
            : p
        ));
      } else {
        alert(result.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update status. Please try again.');
    }
  };



  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('admin_jwt');
      await fetch('/api/admin/logout', { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('admin_jwt');
      navigate('/admin/login', { replace: true });
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex-1 py-4 sm:py-12">
        <div className="container mx-auto px-2 sm:px-4">
          {/* Project management UI only */}
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 sm:mb-6 text-base sm:text-lg"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div className="flex justify-between items-center mb-4 sm:mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                Project Submissions
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                Review and manage client project submissions
              </p>
            </div>
            <div className="hidden sm:flex gap-2">
              <Button onClick={() => navigate('/admin/content')} variant="outline">
                Website Content
              </Button>
              <Button onClick={() => navigate('/admin/change-password')} variant="outline">
                Change Password
              </Button>
              <Button onClick={() => navigate('/admin/quotation')} variant="outline">
                Create Quotation
              </Button>
              <Button
                onClick={() => setShowUpload(true)}
                className="bg-blue-600 text-white flex items-center gap-2 mb-20 md:mb-0"
              >
                <Plus className="h-4 w-4" /> Add Project
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
          {showUpload && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl p-2 sm:p-8 max-w-2xl w-full text-center relative animate-fade-in-up overflow-y-auto max-h-[90vh] sm:rounded-2xl sm:max-w-2xl sm:p-8 w-screen h-screen max-h-screen p-2 rounded-none text-left">
                <button
                  onClick={() => setShowUpload(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold z-10"
                  aria-label="Close"
                >
                  &times;
                </button>
                <div className="max-w-xl mx-auto w-full">
                  <ProjectUpload onClose={() => {
                    setShowUpload(false);
                    fetchProjects(); // Refresh projects list after adding
                  }} />
                </div>
              </div>
            </div>
          )}
          {editProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl p-2 sm:p-8 max-w-2xl w-full text-center relative animate-fade-in-up overflow-y-auto max-h-[95vh] sm:rounded-2xl sm:max-w-2xl sm:p-8 w-screen h-screen max-h-screen p-2 rounded-none text-left">
                <button
                  onClick={() => setEditProject(null)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold z-10"
                  aria-label="Close"
                >
                  &times;
                </button>
                <div className="max-w-xl mx-auto w-full">
                  <ProjectUpload 
                    initialData={editProject} 
                    isEditMode 
                    onClose={() => {
                      setEditProject(null);
                      fetchProjects(); // Refresh projects list after edit
                    }} 
                  />
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}
          {/* Dashboard Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Bar Chart: Projects by Status */}
            <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Projects by Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={statusData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="status" stroke="#8884d8" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}
                    >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-status-${index}`} fill={getStatusBarColor(entry.status)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Bar Chart: Projects by Category */}
            <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Projects by Category</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="category" stroke="#00C49F" interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#00C49F" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Dashboard Analytics */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 mb-8">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="text-sm text-gray-500 mb-1">Total Projects</div>
                <div className="text-3xl font-bold text-blue-900">{totalProjects}</div>
              </CardContent>
            </Card>
            <Card className="bg-white cursor-pointer hover:bg-green-50 transition" onClick={() => setShowRevenueModal(true)}>
              <CardContent className="p-6">
                <div className="text-sm text-gray-500 mb-1">Total Revenue Collected</div>
                <div className="text-3xl font-bold text-green-700">₹{totalRevenue.toLocaleString()}</div>
                <div className="text-xs text-gray-400 mt-1">Click to view project-wise collection</div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="text-sm text-gray-500 mb-1">Top Categories</div>
                <ul className="text-blue-900 font-semibold text-lg space-y-1">
                  {topCategories.map(([cat, count]) => (
                    <li key={cat}>{cat} <span className="text-xs text-gray-500 font-normal">({count})</span></li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="text-sm text-gray-500 mb-1">Projects by Status</div>
                <ul className="space-y-1">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <li key={status} className="flex items-center gap-2">
                      <Badge>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
                      <span className="text-blue-900 font-semibold">{count}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-8 overflow-x-auto">
            <h2 className="text-xl font-bold text-blue-900 mb-4">Recent Activity</h2>
            {recentProjects.length === 0 ? (
              <div className="text-gray-500">No recent activity.</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {recentProjects.map(p => (
                  <li key={p.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="font-semibold text-blue-900">{p.title}</span>
                      <span className="ml-2 text-xs text-gray-500">({p.category})</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 sm:mt-0">
                      Updated: {new Date(p.updatedAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 items-center w-full">
            <Input
              type="text"
              placeholder="Search by project title..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="p-8 text-center">
                <p className="text-gray-500 text-lg">No projects found.</p>
                <p className="text-gray-400">Try adjusting your search or filters.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {filteredProjects.map((project) => {
                const projectId = project._id || project.id;
                const expanded = expandedProjectId === projectId;
                return (
                  <Card key={projectId} className="bg-white shadow-lg">
                    <CardHeader
                      className="cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-6 gap-2 sm:gap-0"
                      onClick={() => setExpandedProjectId(expanded ? null : projectId)}
                    >
                      <div className="flex-1">
                        <CardTitle className="text-lg sm:text-xl mb-1 sm:mb-2">{project.title}</CardTitle>
                        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <span>Category: {project.category}</span>
                          <span>•</span>
                          <span>Submitted: {formatDate(project.createdAt)}</span>
                          <span>•</span>
                          <span>Last Updated: {formatDate(project.updatedAt)}</span>
                          <span>•</span>
                          {getStatusBadge(project.status)}
                        </div>
                      </div>
                      <span className="ml-2 text-blue-600 font-bold text-xl">{expanded ? '-' : '+'}</span>
                    </CardHeader>
                    {expanded && (
                      <CardContent className="p-2 sm:p-6">
                        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                          {/* Project Details */}
                          <div className="space-y-2 sm:space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-base sm:text-lg">Description</h4>
                              <p className="text-gray-700 text-sm sm:text-base">{project.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Budget</h4>
                                <p className="text-gray-700 text-xs sm:text-base">{project.budget || 'Not specified'}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Timeline</h4>
                                <p className="text-gray-700 text-xs sm:text-base">{project.timeline || 'Not specified'}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Location</h4>
                                <p className="text-gray-700 text-xs sm:text-base">{project.location || 'Not specified'}</p>
                              </div>
                            </div>
                            {/* Key Features */}
                            {project.features && project.features.length > 0 && (
                              <div className="mt-2">
                                <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Key Features</h4>
                                <ul className="list-disc list-inside text-gray-700 text-xs sm:text-base space-y-1">
                                  {Array.isArray(project.features)
                                    ? project.features.map((feature, idx) => (
                                        <li key={idx}>{feature}</li>
                                      ))
                                    : typeof project.features === 'string'
                                      ? project.features.split(/,|\n/).map((f, idx) => <li key={idx}>{f.trim()}</li>)
                                      : null}
                                </ul>
                              </div>
                            )}
                          </div>
                          {/* Client Information */}
                          <div className="space-y-2 sm:space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-base sm:text-lg">Client Information</h4>
                              <div className="space-y-1 sm:space-y-2">
                                <p className="text-xs sm:text-base"><span className="font-medium">Name:</span> {project.clientName}</p>
                                <p className="text-xs sm:text-base"><span className="font-medium">Email:</span> {project.clientEmail}</p>
                                {project.clientPhone && (
                                  <p className="text-xs sm:text-base"><span className="font-medium">Phone:</span> {project.clientPhone}</p>
                                )}
                              </div>
                            </div>
                            {/* Files */}
                            {project.files.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-base sm:text-lg">Uploaded Files ({project.files.length})</h4>
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                  {project.files.map((file) => (
                                    <div key={file.id} className="border rounded-lg p-3 bg-gray-50">
                                      {/* Image Preview */}
                                      {file.mimetype && file.mimetype.startsWith('image/') ? (
                                        <div className="mb-2">
                                          <img 
                                            src={file.url} 
                                            alt={file.originalName}
                                            className="w-full h-32 object-cover rounded border"
                                            onError={(e) => {
                                              e.currentTarget.style.display = 'none';
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        <div className="mb-2 flex items-center justify-center h-32 bg-gray-100 rounded border">
                                          <div className="text-center">
                                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                                            <p className="text-xs text-gray-500">{file.originalName}</p>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {/* File Info */}
                                      <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs sm:text-sm text-gray-700 truncate font-medium">
                                            {file.originalName}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                          </p>
                                        </div>
                                        <div className="flex gap-1">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => window.open(file.url, '_blank')}
                                            className="h-8 w-8 p-0"
                                          >
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                              const link = document.createElement('a');
                                              link.href = file.url;
                                              link.download = file.originalName;
                                              link.click();
                                            }}
                                            className="h-8 w-8 p-0"
                                          >
                                            <Download className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Dates Section */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mt-6 text-xs text-gray-500">
                          <div>Submitted: <span className="font-medium text-gray-700">{formatDate(project.createdAt)}</span></div>
                          <div>Last Updated: <span className="font-medium text-gray-700">{formatDate(project.updatedAt)}</span></div>
                        </div>
                        <div className="flex items-center gap-2 mb-4 mt-4">
                          <label className="font-medium text-sm">Status:</label>
                          <Select value={project.status} onValueChange={(value) => handleStatusChange(projectId, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2 mb-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditProject({ ...project, id: projectId })}
                            className="flex items-center gap-1 px-3 py-2 text-base sm:text-sm"
                          >
                            <Pencil className="h-5 w-5 sm:h-4 sm:w-4" /> Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(projectId)}
                            className="flex items-center gap-1 px-3 py-2 text-base sm:text-sm"
                          >
                            <Trash2 className="h-5 w-5 sm:h-4 sm:w-4" /> Delete
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {/* Blog Management Section */}
          <div className="mt-16">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-1">Blog Management</h2>
                <p className="text-base text-blue-700">Add, edit, or delete blog posts for your website blog.</p>
              </div>
              <Button className="bg-green-600 text-white flex items-center gap-2 mb-20 md:mb-0" onClick={handleOpenAddBlog}>
                <Plus className="h-4 w-4" /> Add Blog
              </Button>
            </div>
            {blogsLoading ? (
              <div className="text-center text-blue-500 py-8">Loading blogs...</div>
            ) : blogsError ? (
              <div className="text-center text-red-500 py-8">{blogsError}</div>
            ) : blogs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No blogs found.</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map(blog => (
                  <div key={blog._id} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-2 border border-blue-100 relative group hover:shadow-blue-300/40 transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-2">
                      <img src={blog.image} alt={blog.title} className="w-16 h-16 object-cover rounded-xl border-2 border-blue-200 shadow" />
                      <div>
                        <h3 className="text-lg font-bold text-blue-900 mb-1">{blog.title}</h3>
                        <div className="text-xs text-blue-400">{new Date(blog.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="text-blue-700 text-sm mb-2 line-clamp-2">{blog.summary}</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {blog.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">#{tag}</span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={() => handleOpenEditBlog(blog)}>
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                      <Button size="sm" variant="destructive" className="flex items-center gap-1" onClick={() => handleDeleteBlog(blog._id)}>
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Blog Add/Edit Modal */}
            <Dialog open={showBlogModal} onOpenChange={setShowBlogModal}>
              <DialogContent className="max-w-lg w-full">
                <form onSubmit={handleBlogFormSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{editBlog ? 'Edit Blog' : 'Add Blog'}</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input value={blogForm.title} onChange={e => handleBlogFormChange('title', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Summary</label>
                    <Textarea value={blogForm.summary} onChange={e => handleBlogFormChange('summary', e.target.value)} required rows={2} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <Input type="date" value={blogForm.date} onChange={e => handleBlogFormChange('date', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                    <Input value={blogForm.tags} onChange={e => handleBlogFormChange('tags', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Content</label>
                    <Textarea value={blogForm.content} onChange={e => handleBlogFormChange('content', e.target.value)} rows={4} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Profile Image</label>
                    <Input type="file" accept="image/*" onChange={handleBlogImageChange} />
                    {blogForm.image && <img src={blogForm.image} alt="Preview" className="w-20 h-20 object-cover rounded-lg mt-2 border" />}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowBlogModal(false)}>Cancel</Button>
                    <Button type="submit" className="bg-blue-700 text-white">{editBlog ? 'Update' : 'Add'}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

        </div>
      </div>
      <Footer />
      {/* Sticky Add Project Button for Mobile */}
      <div className="sm:hidden">
        <button
          onClick={() => setShowUpload(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
          aria-label="Add Project"
        >
          <Plus className="h-7 w-7" />
        </button>
      </div>
      {/* Revenue Modal */}
      {showRevenueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-2xl w-full text-center relative animate-fade-in-up overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowRevenueModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold z-10"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-green-700 mb-4">Project-wise Collection</h2>
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-700 text-sm">
                  <th className="pb-2">Project Title</th>
                  <th className="pb-2">Budget (₹)</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Category</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="bg-gray-50 hover:bg-green-50">
                    <td className="font-medium text-blue-900 py-1 px-2">{p.title}</td>
                    <td className="text-green-700 py-1 px-2">{Number(p.budget).toLocaleString()}</td>
                    <td className="text-xs text-gray-600 py-1 px-2">{p.status}</td>
                    <td className="text-xs text-gray-600 py-1 px-2">{p.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 
