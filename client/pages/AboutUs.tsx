import { Award, Users, Target, Heart, Wrench, Leaf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from '@/components/Footer';
import ScrollReveal from 'scrollreveal';
import { useEffect, useState } from "react";

const teamMembers = [
  {
    name: "Babulal Suthar",
    role: "Master Craftsman & Founder",
    image: "/babulal.jpg",
    experience: "25+ years",
    specialty: "Traditional Woodworking",
  },
  {
    name: "Dilip Suthar",
    role: " Director",
    image: "dilip.jpg",
    experience: "13+ years",
    specialty: "Modern Interior Design",
  },
  {
    name: "Umesh Suthar",
    role: "Technical Expert",
    image: "/profile-pic.jpg",
    experience: "2+ years",
    specialty: "Client Handle",
  },
  {
    name: "Ashok Suthar",
    role: "Designer",
    image: "/ashok.jpg",
    experience: "4+ years",
    specialty: "Custom Installations",
  }
  
];

const values = [
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive for perfection in every piece we create, ensuring the highest quality standards.",
  },
  {
    icon: Heart,
    title: "Passion",
    description:
      "Our love for woodworking and design drives us to create furniture that tells a story.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "We work closely with our clients to bring their unique vision to life.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "We're committed to using responsibly sourced materials and eco-friendly practices.",
  },
];

const milestones = [
  { year: "2012", event: "Company founded by Babulal Suthar" },
  { year: "2013", event: "First major commercial house project completed" },
  { year: "2016", event: "Expanded to luxury residential market" },
  { year: "2020", event: "Opened  workshop facility" },
  { year: "2022", event: "Launched sustainable materials initiative" },
  { year: "2024", event: "100th project milestone achieved" },
];

export default function AboutUs() {
  const [managedAbout, setManagedAbout] = useState('');
  const [managedTeam, setManagedTeam] = useState(teamMembers);
  const [details, setDetails] = useState<{ mission?: string; vision?: string }>({});
  useEffect(() => { fetch('/api/settings').then(r => r.json()).then(data => { if (data.settings.about) setManagedAbout(data.settings.about); if (data.settings.team?.length) setManagedTeam(data.settings.team); setDetails(data.settings.aboutDetails || {}); }).catch(() => undefined); }, []);
  useEffect(() => {
    ScrollReveal().reveal('.sr-hero', { origin: 'top', distance: '40px', duration: 900, reset: false });
    ScrollReveal().reveal('.sr-mission', { origin: 'left', distance: '40px', duration: 900, delay: 100, reset: false });
    ScrollReveal().reveal('.sr-values', { origin: 'right', distance: '40px', duration: 900, delay: 200, reset: false });
    ScrollReveal().reveal('.sr-team', { origin: 'bottom', distance: '40px', duration: 900, delay: 300, reset: false });
    ScrollReveal().reveal('.sr-milestones', { origin: 'left', distance: '40px', duration: 900, delay: 400, reset: false });
    ScrollReveal().reveal('.sr-craft', { origin: 'right', distance: '40px', duration: 900, delay: 500, reset: false });
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-200 via-blue-100 to-white flex items-center justify-center sr-hero"
        data-aos="fade-up"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-300/30 to-blue-100 rounded-full blur-3xl opacity-40 animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-200 to-blue-100 rounded-full blur-2xl opacity-30 animate-pulse" />
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 mb-6 relative inline-block">
              Our Story
              <span className="block h-1 w-24 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full mx-auto mt-4 animate-pulse" />
            </h1>
            <p className="text-xl text-blue-800 leading-relaxed">
              {managedAbout || "Three decades of passion, craftsmanship, and dedication to creating furniture that becomes a cherished part of your family's story."}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white/60 backdrop-blur-md sr-mission">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white/80 rounded-2xl shadow-lg p-8 flex flex-col items-start hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <Target className="h-10 w-10 text-blue-500 mr-3" />
                <h2 className="text-3xl font-bold text-blue-900">Our Mission</h2>
              </div>
              <p className="text-blue-800 text-lg leading-relaxed">
                {details.mission || 'To create exceptional custom furniture that enhances the way people live and work, using time-honored craftsmanship techniques combined with innovative design solutions. We believe that quality furniture should be built to last generations.'}
              </p>
            </div>
            <div className="bg-white/80 rounded-2xl shadow-lg p-8 flex flex-col items-start hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <Heart className="h-10 w-10 text-pink-500 mr-3" />
                <h2 className="text-3xl font-bold text-blue-900">Our Vision</h2>
              </div>
              <p className="text-blue-800 text-lg leading-relaxed">
                {details.vision || 'To be recognized as the premier custom furniture maker, known for our unwavering commitment to quality, sustainability, and customer satisfaction. We envision a world where handcrafted furniture is valued for its artistry and longevity.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-br from-blue-100 via-white to-blue-200 sr-values">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Our Values
            </h2>
            <p className="text-blue-700 text-lg">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const valueColors = [
                'bg-gradient-to-br from-blue-200 to-blue-400',
                'bg-gradient-to-br from-green-200 to-teal-300',
                'bg-gradient-to-br from-pink-200 to-pink-400',
                'bg-gradient-to-br from-yellow-100 to-yellow-300',
              ];
              return (
                <Card
                  key={index}
                  className={`text-center p-8 ${valueColors[index % valueColors.length]} bg-opacity-80 backdrop-blur-md rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 group`}
                >
                  <CardContent className="p-0 flex flex-col items-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/60 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 rounded-full mb-4 shadow-md">
                      <value.icon className="h-8 w-8 text-blue-700" />
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-blue-700">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white/60 backdrop-blur-md sr-team">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-blue-700 text-lg">
              The skilled artisans and professionals behind every masterpiece
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {managedTeam.map((member, index) => {
              const teamColors = [
                'bg-gradient-to-br from-blue-100 to-blue-300',
                'bg-gradient-to-br from-teal-100 to-teal-300',
                'bg-gradient-to-br from-purple-100 to-indigo-200',
                'bg-gradient-to-br from-yellow-100 to-orange-200',
              ];
              return (
                <Card
                  key={index}
                  className={`overflow-hidden ${teamColors[index % teamColors.length]} bg-opacity-80 backdrop-blur-md rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 group`}
                >
                  <div className="aspect-square bg-white/60 relative overflow-hidden flex items-center justify-center">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg group-hover:scale-110 transition-all duration-300"
                    />
                  </div>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-semibold text-blue-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-blue-500 font-medium mb-2">{member.role}</p>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>
                        <strong>Experience:</strong> {member.experience}
                      </div>
                      <div>
                        <strong>Specialty:</strong> {member.specialty}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-gradient-to-br from-blue-100 via-white to-blue-200 relative overflow-hidden sr-milestones"
        data-aos="fade-up"
      >
        {/* Decorative blurred SVG/gradient background */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-300/40 to-blue-100/30 rounded-full blur-3xl opacity-50 z-0 pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-200/40 to-blue-100/30 rounded-full blur-2xl opacity-40 z-0 pointer-events-none animate-pulse" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Our Journey</h2>
            <p className="text-blue-700 text-lg">Key milestones in our company's history</p>
          </div>
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600 rounded-full z-0" style={{transform: 'translateX(-50%)'}} />
            <div className="flex flex-col space-y-16 md:space-y-0 md:gap-0">
              {milestones.map((milestone, index) => {
                const stepColors = [
                  'from-blue-400 to-blue-600',
                  'from-teal-400 to-green-500',
                  'from-pink-400 to-pink-600',
                  'from-yellow-300 to-yellow-500',
                  'from-purple-400 to-indigo-600',
                  'from-orange-400 to-orange-600',
                ];
                const icons = [Award, Users, Target, Heart, Wrench, Leaf];
                const Icon = icons[index % icons.length];
                const isLeft = index % 2 === 0;
                return (
                  <div key={index} className="relative flex md:items-center md:min-h-[160px]">
                    {/* Connector dot */}
                    <div className="hidden md:flex flex-col items-center absolute left-1/2 z-10" style={{transform: 'translateX(-50%)'}}>
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-200 to-blue-500 border-4 border-white shadow-lg animate-pulse" />
                      {index !== milestones.length - 1 && (
                        <span className="w-1 h-16 bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600" />
                      )}
                    </div>
                    {/* Card */}
                    <div className={`relative md:w-1/2 w-full ${isLeft ? 'md:pr-16 md:justify-end' : 'md:pl-16 md:justify-start'} flex ${isLeft ? 'md:flex-row-reverse' : ''} md:items-center`}> 
                      <div className={`bg-gradient-to-br ${stepColors[index % stepColors.length]} bg-clip-padding backdrop-blur-xl bg-opacity-80 border border-white/30 rounded-2xl shadow-2xl px-6 py-8 text-center text-white transition-transform duration-300 hover:scale-105 hover:shadow-blue-400/40 hover:ring-4 hover:ring-blue-200/40 mx-auto md:mx-0 md:max-w-xs`}>
                        <div className="flex items-center justify-center mb-4">
                          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/30 backdrop-blur-md shadow-lg mb-2 border-2 border-white/40">
                            <Icon className="h-8 w-8 text-white drop-shadow" />
                          </span>
                        </div>
                        <div className="text-2xl font-bold mb-2 tracking-wide drop-shadow-lg">{milestone.year}</div>
                        <div className="text-lg font-medium opacity-90 drop-shadow">{milestone.event}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-teal-900 to-blue-800 relative overflow-hidden sr-craft"
        data-aos="fade-up"
      >
        {/* Decorative SVG wave at the top */}
        <div className="absolute top-0 left-0 w-full z-0 pointer-events-none">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24">
            <path fill="url(#waveGradient)" d="M0,80 C360,120 1080,0 1440,80 L1440,0 L0,0 Z" />
            <defs>
              <linearGradient id="waveGradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="1" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {/* Blurred overlays for depth */}
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-blue-400/30 to-teal-300/20 rounded-full blur-3xl opacity-40 z-0 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-gradient-to-tr from-blue-300/30 to-blue-100/20 rounded-full blur-2xl opacity-30 z-0 animate-pulse" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Glassmorphic Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 md:p-12 relative overflow-hidden">
              <div className="flex items-center mb-8">
                <Wrench className="h-10 w-10 text-cyan-400 animate-spin-slow mr-4 drop-shadow" />
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">
                  Our <span className="text-cyan-300">Craftsmanship</span>
                </h2>
              </div>
              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                Every piece we create is a testament to traditional woodworking techniques passed down through generations. Our master craftsmen take pride in every detail, from the selection of premium materials to the final finishing touches.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg animate-bounce-slow">
                    <Leaf className="h-7 w-7 text-white" />
                  </span>
                  <div>
                    <h4 className="font-semibold text-cyan-200 text-lg mb-1">Hand-Selected Materials</h4>
                    <p className="text-blue-100">We source only the finest woods and materials from sustainable suppliers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-blue-600 shadow-lg animate-pulse">
                    <Wrench className="h-7 w-7 text-white" />
                  </span>
                  <div>
                    <h4 className="font-semibold text-teal-200 text-lg mb-1">Traditional Techniques</h4>
                    <p className="text-blue-100">Time-honored methods ensure structural integrity and lasting beauty.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg animate-fade-in">
                    <Award className="h-7 w-7 text-white" />
                  </span>
                  <div>
                    <h4 className="font-semibold text-blue-200 text-lg mb-1">Quality Assurance</h4>
                    <p className="text-blue-100">Every piece undergoes rigorous quality checks before delivery.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Animated/Glassy Images */}
            <div className="grid grid-cols-2 gap-6">
              <div className="relative group">
                <img src="/pic1.jpg" alt="Craftsman working on wood" className="rounded-2xl shadow-2xl border-2 border-cyan-200/30 group-hover:scale-105 transition-transform duration-300 backdrop-blur-xl bg-white/10" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/10 to-blue-500/10 opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
              </div>
              <div className="relative group mt-8">
                <img src="/maindoor.jpg" alt="Hand tools and materials" className="rounded-2xl shadow-2xl border-2 border-blue-200/30 group-hover:scale-105 transition-transform duration-300 backdrop-blur-xl bg-white/10" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/10 to-cyan-500/10 opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
              </div>
              <div className="relative group -mt-8">
                <img src="/pic3.jpg" alt="Finished furniture detail" className="rounded-2xl shadow-2xl border-2 border-teal-200/30 group-hover:scale-105 transition-transform duration-300 backdrop-blur-xl bg-white/10" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400/10 to-blue-500/10 opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
              </div>
              <div className="relative group">
                <img src="/study-table.jpg" alt="Workshop interior" className="rounded-2xl shadow-2xl border-2 border-cyan-200/30 group-hover:scale-105 transition-transform duration-300 backdrop-blur-xl bg-white/10" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/10 to-blue-500/10 opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
