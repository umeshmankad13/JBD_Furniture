import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Sample project data - in a real app, this would come from an API
const featuredProjects = [
  {
    id: 1,
    title: "Modern Kitchen Renovation",
    description: "A complete kitchen transformation with modern appliances and elegant design.",
    image: "/Kitchen-Furniture-Design-12.webp",
    materials: "Premium wood, stainless steel",
    duration: "4-6 weeks",
    client: "Private Residence"
  },
  {
    id: 2,
    title: "Office Furniture Setup",
    description: "Complete office furniture solution for a growing tech company.",
    image: "/Kitchen-Furniture-Design-15.webp",
    materials: "Engineered wood, fabric",
    duration: "2-3 weeks",
    client: "TechCorp Inc."
  },
  {
    id: 3,
    title: "Living Room Makeover",
    description: "Elegant living room furniture and interior design consultation.",
    image: "/Kitchen-Furniture-Design-17.webp",
    materials: "Solid wood, premium fabric",
    duration: "3-4 weeks",
    client: "Private Residence"
  }
];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Find the project by id (convert id to number)
  const project = featuredProjects.find(p => p.id === Number(id));

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 relative">
        <button
          className="absolute left-6 top-6 flex items-center text-blue-900 hover:text-blue-600 font-medium"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Back
        </button>
        <div className="mt-8">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-72 object-cover rounded-xl mb-6 shadow-lg"
          />
          <h1 className="text-3xl font-bold text-blue-900 mb-2">{project.title}</h1>
          <p className="text-lg text-gray-700 mb-4">{project.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <span className="block text-xs text-blue-700 font-semibold mb-1">Materials</span>
              <span className="text-gray-800">{project.materials}</span>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <span className="block text-xs text-blue-700 font-semibold mb-1">Duration</span>
              <span className="text-gray-800">{project.duration}</span>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <span className="block text-xs text-blue-700 font-semibold mb-1">Client</span>
              <span className="text-gray-800">{project.client}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 