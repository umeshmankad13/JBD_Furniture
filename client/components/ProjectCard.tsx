import {
  Calendar,
  MapPin,
  User,
  DollarSign,
  Clock,
  CheckCircle,
  Eye,
  ExternalLink,
  Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  status: "completed" | "ongoing" | "planning";
  materials: string[];
  timeline: {
    startDate: string;
    endDate?: string;
    duration: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
  };
  client: {
    name: string;
    type: "residential" | "commercial";
  };
  budget: {
    range: string;
    currency: string;
  };
  features: string[];
  testimonial?: {
    content: string;
    rating: number;
  };
  tags: string[];
}

interface ProjectCardProps {
  project: ProjectData;
  onViewDetails?: (project: ProjectData) => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const [open, setOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-cyan-400/20 text-cyan-200 border-cyan-300/30";
      case "ongoing":
        return "bg-teal-400/20 text-teal-200 border-teal-300/30";
      case "planning":
        return "bg-blue-400/20 text-blue-200 border-blue-300/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      case "ongoing":
        return <Clock className="h-3 w-3" />;
      case "planning":
        return <Calendar className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 group hover:scale-105 hover:shadow-cyan-400/40 hover:ring-4 hover:ring-cyan-200/40 flex flex-col h-full min-h-[480px]">
        {/* Image Gallery (main image only) */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-800/40 via-blue-700/40 to-teal-700/40">
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover rounded-t-2xl group-hover:scale-110 transition-transform duration-500"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-br from-cyan-400/10 to-blue-900/30 opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
        </div>

        <CardContent className="p-6 flex flex-col flex-1">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-blue-900 mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors duration-300">
              {project.title}
            </h3>
          </div>

          {/* Key Features (always visible) */}
          <div className="mb-4">
            <div className="text-sm font-bold text-blue-900 mb-2">Key Features:</div>
            <ul className="list-disc list-inside text-blue-800 text-xs space-y-1">
              {project.features.slice(0, 3).map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
              {project.features.length > 3 && !open && (
                <li>+{project.features.length - 3} more</li>
              )}
            </ul>
          </div>

          {/* Expandable Details */}
          <div className={`transition-all duration-500 overflow-hidden ${open ? 'max-h-[2000px] opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
            {/* Project Details Summary */}
            <table className="mb-6 w-full text-blue-100 text-sm border-separate border-spacing-y-1">
              <tbody>
                <tr>
                  <td className="font-semibold text-cyan-200 pr-2">Client Name:</td>
                  <td>{project.client.name}</td>
                  <td className="font-semibold text-cyan-200 pr-2">Address:</td>
                  <td>{project.location.address}, {project.location.city}, {project.location.state}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-cyan-200 pr-2">Start Date:</td>
                  <td>{project.timeline.startDate}</td>
                  <td className="font-semibold text-cyan-200 pr-2">Time Taken:</td>
                  <td>{project.timeline.duration}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-cyan-200 pr-2">Cost:</td>
                  <td>{project.budget.range} {project.budget.currency}</td>
                  <td className="font-semibold text-cyan-200 pr-2">Key Features:</td>
                  <td>{project.features.join(', ')}</td>
                </tr>
              </tbody>
            </table>

            {/* Description */}
            <p className="text-blue-100 text-sm mb-4">{project.description}</p>

            {/* Image Gallery (all images, vertical stack, full width) */}
            <div className="mt-4 space-y-4">
              {project.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={project.title + ' image ' + (idx + 1)}
                  className="w-full max-w-full h-auto rounded-xl shadow-md border-2 border-white/20 bg-white/10 backdrop-blur-xl mx-auto"
                  loading="lazy"
                />
              ))}
            </div>

            {/* Key Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Location */}
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-cyan-300 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-cyan-100">
                    {project.location.city}
                  </div>
                  <div className="text-blue-100">{project.location.state}</div>
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-start space-x-2">
                <Calendar className="h-4 w-4 text-cyan-300 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-cyan-100">
                    {project.timeline.duration}
                  </div>
                  <div className="text-blue-100">{project.timeline.startDate}</div>
                </div>
              </div>

              {/* Client */}
              <div className="flex items-start space-x-2">
                <User className="h-4 w-4 text-cyan-300 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-cyan-100">
                    {project.client.name}
                  </div>
                  <div className="text-blue-100 capitalize">
                    {project.client.type}
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="flex items-start space-x-2">
                <DollarSign className="h-4 w-4 text-cyan-300 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-cyan-100">
                    {project.budget.range}
                  </div>
                  <div className="text-blue-100">{project.budget.currency}</div>
                </div>
              </div>
            </div>

            {/* Materials */}
            <div className="mb-4">
              <div className="text-sm font-medium text-cyan-200 mb-2">
                Materials Used:
              </div>
              <div className="flex flex-wrap gap-1">
                {project.materials.slice(0, 3).map((material, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs border-cyan-300/30 text-cyan-100"
                  >
                    {material}
                  </Badge>
                ))}
                {project.materials.length > 3 && (
                  <Badge
                    variant="outline"
                    className="text-xs border-cyan-300/30 text-cyan-100"
                  >
                    +{project.materials.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Testimonial */}
            {project.testimonial && (
              <div className="bg-cyan-400/10 rounded-xl p-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(project.testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <div className="text-xs text-cyan-100 italic">
                  "{project.testimonial.content}"
                </div>
              </div>
            )}
          </div>

          {/* Spacer to push button to bottom */}
          <div className="flex-1" />

          {/* View More Button */}
          <button
            onClick={() => setOpen(true)}
            className="w-full mt-4 px-6 py-2 rounded-full bg-cyan-400/90 text-blue-900 font-semibold shadow-lg transition-all duration-300 hover:bg-blue-900 hover:text-blue hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300 z-10"
          >
            View More
          </button>
        </CardContent>
      </Card>

      {/* Modal for full project details */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-screen h-screen max-w-none max-h-none bg-gradient-to-br from-blue-900 via-teal-900 to-blue-800 border-none rounded-none shadow-none p-0 overflow-y-auto flex flex-col">
          <div className="flex flex-col gap-6 p-6 text-blue-800 w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-cyan-200">{project.title}</h2>
            <div className="text-blue-100 text-sm mb-2">{project.description}</div>
            {/* Project Details Table */}
            <table className="w-full mb-4 border-separate border-spacing-y-1 text-blue-100 text-sm">
              <tbody>
                <tr>
                  <td className="font-semibold text-cyan-200 w-40">Client Name:</td>
                  <td>{project.client.name}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-cyan-200">Address:</td>
                  <td>{project.location.address}, {project.location.city}, {project.location.state}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-cyan-200">Start Date:</td>
                  <td>{project.timeline.startDate}</td>
                </tr>
                {project.timeline.endDate && (
                  <tr>
                    <td className="font-semibold text-cyan-200">End Date:</td>
                    <td>{project.timeline.endDate}</td>
                  </tr>
                )}
                <tr>
                  <td className="font-semibold text-cyan-200">Time Taken:</td>
                  <td>{project.timeline.duration}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-cyan-200">Cost:</td>
                  <td>{project.budget.range} {project.budget.currency}</td>
                </tr>
                <tr>
                  <td className="font-semibold text-cyan-200 align-top">Key Features:</td>
                  <td>
                    <ul className="list-disc list-inside text-blue-100 text-xs space-y-1">
                      {project.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
            {/* Testimonial/Client Satisfaction */}
            {project.testimonial && (
              <div className="bg-cyan-400/10 rounded-xl p-3 mt-2">
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(project.testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <div className="text-xs text-cyan-100 italic">
                  "{project.testimonial.content}"
                </div>
              </div>
            )}
            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 rounded-full bg-cyan-400/20 text-cyan-100 text-xs">#{tag}</span>
                ))}
              </div>
            )}
            {/* Image Gallery (all images, vertical stack, full width) */}
            <div className="mt-6 space-y-4">
              {project.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={project.title + ' image ' + (idx + 1)}
                  className="w-full max-w-full h-auto rounded-xl shadow-md border-2 border-white/20 bg-white/10 backdrop-blur-xl mx-auto"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
