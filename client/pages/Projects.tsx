import { useState, useEffect } from "react";
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjectCard, ProjectData } from "@/components/ProjectCard";
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { ProjectUpload } from '@shared/api';
import ScrollReveal from 'scrollreveal';

// Sample project data (fallback)
const sampleProjects: ProjectData[] = [
  {
    id: "1",
    title: "Luxury Modern Kitchen Renovation",
    description:
      "Complete kitchen transformation with premium materials, custom cabinetry, and state-of-the-art appliances for a contemporary family home.",
    images: [
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80"
    ],
    category: "Kitchen Renovation",
    status: "completed",
    materials: [
      "Quartz Countertops",
      "Oak Cabinets",
      "Stainless Steel",
      "Ceramic Tiles",
    ],
    timeline: {
      startDate: "Jan 2024",
      endDate: "Mar 2024",
      duration: "8 weeks",
    },
    location: {
      address: "456 Maple Street",
      city: "Beverly Hills",
      state: "CA",
    },
    client: {
      name: "The Johnson Family",
      type: "residential",
    },
    budget: {
      range: "$45,000 - $55,000",
      currency: "₹",
    },
    features: [
      "Custom island with breakfast bar",
      "Soft-close cabinet doors",
      "Under-cabinet LED lighting",
      "Built-in wine storage",
      "Smart home integration",
    ],
    testimonial: {
      content:
        "Absolutely stunning work! They transformed our kitchen beyond our wildest dreams. The attention to detail is incredible.",
      rating: 5,
    },
    tags: ["luxury", "modern", "kitchen", "family-home"],
  },
  {
    id: "2",
    title: "Executive Office Suite Design",
    description:
      "Sophisticated office furniture collection featuring handcrafted mahogany desks, leather seating, and custom storage solutions.",
    images: [
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80"
    ],
    category: "Office Furniture",
    status: "completed",
    materials: [
      "Mahogany Wood",
      "Italian Leather",
      "Brass Hardware",
      "Tempered Glass",
    ],
    timeline: {
      startDate: "Feb 2024",
      endDate: "Apr 2024",
      duration: "6 weeks",
    },
    location: {
      address: "789 Business Plaza",
      city: "Manhattan",
      state: "NY",
    },
    client: {
      name: "Corporate Solutions Inc.",
      type: "commercial",
    },
    budget: {
      range: "$25,000 - $35,000",
      currency: "₹",
    },
    features: [
      "Custom executive desk",
      "Matching conference table",
      "Built-in filing system",
      "Premium leather chairs",
      "Integrated cable management",
    ],
    testimonial: {
      content:
        "Professional service from start to finish. Our office furniture is exactly what we envisioned.",
      rating: 5,
    },
    tags: ["executive", "office", "mahogany", "commercial"],
  },
  {
    id: "3",
    title: "Rustic Living Room Makeover",
    description:
      "Cozy living space featuring reclaimed wood furniture, custom built-ins, and artisan-crafted entertainment center.",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80"
    ],
    category: "Living Room",
    status: "ongoing",
    materials: [
      "Reclaimed Barn Wood",
      "Natural Stone",
      "Wrought Iron",
      "Linen Fabric",
    ],
    timeline: {
      startDate: "Mar 2024",
      duration: "5 weeks",
    },
    location: {
      address: "123 Country Lane",
      city: "Austin",
      state: "TX",
    },
    client: {
      name: "The Smith Residence",
      type: "residential",
    },
    budget: {
      range: "$15,000 - $22,000",
      currency: "₹",
    },
    features: [
      "Custom entertainment center",
      "Built-in bookcases",
      "Reclaimed wood coffee table",
      "Artisan light fixtures",
      "Stone accent wall",
    ],
    tags: ["rustic", "living-room", "reclaimed-wood", "cozy"],
  },
  {
    id: "4",
    title: "Boutique Hotel Restaurant Furniture",
    description:
      "Complete dining room furniture package for upscale boutique hotel including custom tables, chairs, and bar setup.",
    images: [
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80"
    ],
    category: "Restaurant Furniture",
    status: "completed",
    materials: [
      "Walnut Wood",
      "Upholstered Fabric",
      "Copper Accents",
      "Marble",
    ],
    timeline: {
      startDate: "Oct 2023",
      endDate: "Dec 2023",
      duration: "10 weeks",
    },
    location: {
      address: "567 Heritage Avenue",
      city: "Charleston",
      state: "SC",
    },
    client: {
      name: "Heritage Boutique Hotel",
      type: "commercial",
    },
    budget: {
      range: "$75,000 - $90,000",
      currency: "₹",
    },
    features: [
      "Custom dining tables for 2-8 guests",
      "Upholstered booth seating",
      "Live-edge bar counter",
      "Custom hostess station",
      "Matching bar stools",
    ],
    testimonial: {
      content:
        "The furniture perfectly captures our hotel's aesthetic. Guests constantly compliment the beautiful craftsmanship.",
      rating: 5,
    },
    tags: ["restaurant", "hospitality", "walnut", "luxury"],
  },
  {
    id: "5",
    title: "Master Bedroom Suite Collection",
    description:
      "Elegant bedroom furniture set including platform bed, matching nightstands, dresser, and custom walk-in closet organization.",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"
    ],
    category: "Bedroom Furniture",
    status: "completed",
    materials: [
      "Cherry Wood",
      "Soft-Close Hardware",
      "Velvet Fabric",
      "Brushed Nickel",
    ],
    timeline: {
      startDate: "Nov 2023",
      endDate: "Jan 2024",
      duration: "7 weeks",
    },
    location: {
      address: "890 Hillside Drive",
      city: "Seattle",
      state: "WA",
    },
    client: {
      name: "The Williams Family",
      type: "residential",
    },
    budget: {
      range: "$18,000 - $25,000",
      currency: "₹",
    },
    features: [
      "Platform bed with integrated nightstands",
      "Custom walk-in closet system",
      "Matching dresser and mirror",
      "Built-in USB charging ports",
      "Soft-close drawers throughout",
    ],
    testimonial: {
      content:
        "Our bedroom has become our sanctuary. The quality and design exceeded our expectations.",
      rating: 5,
    },
    tags: ["bedroom", "cherry-wood", "luxury", "custom-closet"],
  },
  {
    id: "6",
    title: "Antique Furniture Restoration Project",
    description:
      "Careful restoration of 19th-century family heirlooms including dining table, chairs, and china cabinet with period-appropriate techniques.",
    images: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80"
    ],
    category: "Restoration",
    status: "planning",
    materials: [
      "Original Mahogany",
      "Traditional Finishes",
      "Period Hardware",
      "Hand Tools",
    ],
    timeline: {
      startDate: "May 2024",
      duration: "12 weeks",
    },
    location: {
      address: "234 Victorian Lane",
      city: "Boston",
      state: "MA",
    },
    client: {
      name: "The Heritage Foundation",
      type: "residential",
    },
    budget: {
      range: "$8,000 - $12,000",
      currency: "₹",
    },
    features: [
      "Period-accurate restoration methods",
      "Hand-rubbed finish application",
      "Original hardware preservation",
      "Structural reinforcement",
      "Museum-quality documentation",
    ],
    tags: ["restoration", "antique", "mahogany", "heritage"],
  },
];

const categories = [
  "All Categories",
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
];

const statuses = ["All Statuses", "completed", "ongoing", "planning", "pending", "reviewed", "approved", "rejected"];

// Animation utility for staggered fade-in
function useStaggeredAnimation(count, delay = 120) {
  const [visible, setVisible] = useState(Array(count).fill(false));
  useEffect(() => {
    let timeouts = [];
    for (let i = 0; i < count; i++) {
      timeouts.push(setTimeout(() => {
        setVisible(v => {
          const copy = [...v];
          copy[i] = true;
          return copy;
        });
      }, i * delay));
    }
    return () => timeouts.forEach(clearTimeout);
  }, [count, delay]);
  return visible;
}

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showPopup, setShowPopup] = useState(true);
  const [projects, setProjects] = useState<ProjectData[]>(sampleProjects);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch real projects from backend
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          // Map backend ProjectUpload to ProjectData
          const mapped = data.projects.map((p: ProjectUpload) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            images: p.files.map(f => f.url),
            category: p.category,
            status: p.status || 'pending',
            materials: [],
            timeline: {
              startDate: p.timeline || '',
              duration: '',
            },
            location: {
              address: p.location || '',
              city: '',
              state: '',
            },
            client: {
              name: 'JBD Furniture project',
              type: 'portfolio',
            },
            budget: {
              range: p.budget || '',
              currency: '₹',
            },
            features: Array.isArray(p.features)
              ? p.features
              : typeof p.features === 'string'
                ? p.features.split(/,|\n/).map(f => f.trim()).filter(Boolean)
                : [],
            tags: [],
          }));
          setProjects(mapped);
          console.log('Fetched projects:', mapped);
        } else {
          setProjects(sampleProjects);
          console.log('Using sample projects:', sampleProjects);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load projects");
        setProjects(sampleProjects);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    ScrollReveal().reveal('.sr-search', { origin: 'top', distance: '40px', duration: 900, reset: false });
    ScrollReveal().reveal('.sr-projects', { origin: 'bottom', distance: '40px', duration: 900, delay: 200, reset: false });
  }, []);

  // Filter projects based on search and filters
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.tags && project.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      ));

    const matchesCategory =
      selectedCategory === "All Categories" ||
      project.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "All Statuses" || project.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleViewDetails = (project: ProjectData) => {
    // This could open a modal, navigate to a detail page, etc.
    console.log("View details for project:", project.id);
    alert(`Viewing details for: ${project.title}`);
  };

  const visible = filteredProjects.length;
  const handleClosePopup = () => setShowPopup(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-100 to-blue-200">
      <div className="flex-1">
        <section className="py-8 bg-white border-b border-cream-200">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-wood-500" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center text-gray-500 py-12">Loading projects...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-12">{error}</div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center text-gray-500 py-12">No projects found.</div>
            ) : (
              <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-8"}
                data-aos="fade-up"
              >
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onViewDetails={handleViewDetails}
                    data-aos="zoom-in-up"
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
