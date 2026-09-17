import {
  ArrowRight,
  Star,
  Users,
  Award,
  CheckCircle,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import './IndexHeroTextAnim.css';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import ScrollReveal from 'scrollreveal';
import './SplashCursor.css';

const featuredProjects = [
  {
    id: 1,
    title: "Modern Kitchen Renovation",
    image: "/placeholder.svg",
    description:
      "Complete kitchen transformation with custom cabinets and granite countertops.",
    materials: "Oak, Granite, Stainless Steel",
    duration: "6 weeks",
    client: "The Johnson Family",
  },
  {
    id: 2,
    title: "Executive Office Suite",
    image: "/placeholder.svg",
    description:
      "Luxury office furniture with mahogany finish and leather upholstery.",
    materials: "Mahogany, Leather, Brass",
    duration: "4 weeks",
    client: "Corporate Solutions Inc.",
  },
  {
    id: 3,
    title: "Living Room Makeover",
    image: "/placeholder.svg",
    description:
      "Custom sofa set with matching coffee table and entertainment unit.",
    materials: "Walnut, Fabric, Glass",
    duration: "3 weeks",
    client: "The Smith Residence",
  },
  {
    id: 4,
    title: "Modern Apartment Interior",
    image: "/placeholder.svg",
    description:
      "Sleek and functional apartment interior with custom wardrobes, modular kitchen, and space-saving furniture for urban living.",
    materials: "Birch, Glass, Matte Laminates",
    duration: "5 weeks",
    client: "Skyline Apartments, Apt 1203",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Homeowner",
    content:
      "Absolutely stunning work! They transformed our kitchen beyond our wildest dreams. The attention to detail is incredible.",
    rating: 5,
  },
  {
    name: "Mark Thompson",
    role: "Business Owner",
    content:
      "Professional service from start to finish. Our office furniture is exactly what we envisioned and the quality is outstanding.",
    rating: 5,
  },
  {
    name: "Emma Davis",
    role: "Interior Designer",
    content:
      "I regularly recommend CraftFurniture to my clients. Their craftsmanship and reliability are unmatched in the industry.",
    rating: 5,
  },
  {
    name: "John Lee",
    role: "Architect",
    content:
      "Their custom solutions fit perfectly with my designs. Always a pleasure to work with!",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Homeowner",
    content:
      "The modular kitchen they built for us is both beautiful and functional. Highly recommended!",
    rating: 5,
  },
  {
    name: "Carlos Martinez",
    role: "Restaurant Owner",
    content:
      "Our restaurant's new furniture is a hit with customers. Durable and stylish!",
    rating: 4,
  },
  {
    name: "Linda Kim",
    role: "Office Manager",
    content:
      "The office furniture installation was quick and hassle-free. Great quality!",
    rating: 5,
  },
  {
    name: "Alex Brown",
    role: "Homeowner",
    content:
      "We love our new living room set. The craftsmanship is top-notch.",
    rating: 5,
  },
  {
    name: "Sophie Dubois",
    role: "Boutique Owner",
    content:
      "The custom display units are perfect for our store. Thank you!",
    rating: 5,
  },
  {
    name: "Mohammed Al-Farsi",
    role: "Hotel Manager",
    content:
      "All our suites now have a unique, luxurious feel thanks to their furniture.",
    rating: 5,
  },
  {
    name: "Julia Rossi",
    role: "Designer",
    content:
      "They always deliver on time and exceed expectations. My go-to for custom pieces.",
    rating: 5,
  },
  {
    name: "David Green",
    role: "Contractor",
    content:
      "Reliable, skilled, and creative. I trust them for every project.",
    rating: 5,
  },
];

const stats = [
  { number: "100+", label: "Projects Completed" },
  { number: "98%", label: "Client Satisfaction" },
  { number: "13+", label: "Years Experience" },
  { number: "10+", label: "Awards Won" },
];

const faqs = [
  {
    question: "What materials do you use for your furniture?",
    answer: "We use high-quality solid wood, premium plywood, and eco-friendly finishes to ensure durability and beauty."
  },
  {
    question: "Can I customize the size or finish of a piece?",
    answer: "Absolutely! We offer customization options for size, finish, and design to match your preferences."
  },
  {
    question: "How long does it take to complete a custom order?",
    answer: "Custom orders typically take 3-6 weeks depending on complexity and current workload. We’ll provide a timeline when you place your order."
  },
  {
    question: "Do you offer delivery and installation?",
    answer: "Yes, we offer delivery and professional installation services for all our furniture within our service area."
  },
  {
    question: "How do I care for my wooden furniture?",
    answer: "Dust regularly with a soft cloth, avoid direct sunlight, and use coasters to protect surfaces. We provide care instructions with every purchase."
  },
  {
    question: "What is your return or warranty policy?",
    answer: "We offer a 1-year warranty on craftsmanship and materials. Returns are accepted within 14 days for standard items in unused condition."
  },
  {
    question: "Can I visit your workshop or showroom?",
    answer: "Yes! We welcome visitors by appointment. Please contact us to schedule a tour of our workshop or showroom."
  },
  {
    question: "Do you work with interior designers or architects?",
    answer: "We frequently collaborate with designers and architects on custom projects. Let us know your requirements!"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept cash, credit/debit cards, bank transfers, and UPI payments."
  },
  {
    question: "Can you match an existing piece of furniture or finish?",
    answer: "We do our best to match finishes and styles. Please share photos or samples for the closest match."
  },
  {
    question: "Do you offer bulk or corporate orders?",
    answer: "Yes, we handle bulk and corporate orders for offices, hotels, and institutions. Contact us for special pricing."
  },
  {
    question: "Are your products eco-friendly?",
    answer: "We use sustainably sourced wood and low-VOC finishes to minimize our environmental impact."
  },
  {
    question: "How do I place an order?",
    answer: "You can place an order through our website, by phone, or by visiting our showroom. We’ll guide you through the process."
  },
  {
    question: "Do you repair or restore old furniture?",
    answer: "Yes, we offer repair and restoration services for wooden furniture. Send us photos for a quote."
  },
  {
    question: "What makes your craftsmanship unique?",
    answer: "Our team combines traditional techniques with modern design, ensuring every piece is both beautiful and built to last."
  },
];

const processSteps = [
  { icon: "💬", title: "Consultation", desc: "We discuss your needs, style, and space to understand your vision." },
  { icon: "📝", title: "Design & Quotation", desc: "Our team creates a custom design and provides a detailed quote." },
  { icon: "🌳", title: "Material Selection", desc: "Choose from a curated selection of premium woods and finishes." },
  { icon: "🛠️", title: "Craftsmanship", desc: "Our skilled artisans bring your design to life with precision and care." },
  { icon: "🚚", title: "Delivery & Installation", desc: "We deliver and professionally install your furniture at your location." },
  { icon: "🤝", title: "Aftercare", desc: "We provide care tips and support to keep your furniture looking its best." },
];

const processContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const processItem = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 }
};

const arrowColors = [
  ["#00c6fb", "#005bea"],
  ["#005bea", "#3a7bd5"],
  ["#3a7bd5", "#764ba2"],
  ["#764ba2", "#ff6a88"],
  ["#ff6a88", "#ffb86c"],
  ["#ffb86c", "#f7971e"],
];

export default function Index() {
  // Carousel state for testimonials
  const [testimonialSlide, setTestimonialSlide] = useState(0);
  const testimonialsPerSlide = 4;
  const testimonialGroups = [];
  for (let i = 0; i < testimonials.length; i += testimonialsPerSlide) {
    testimonialGroups.push(testimonials.slice(i, i + testimonialsPerSlide));
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialSlide((prev) => (prev + 1) % testimonialGroups.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonialGroups.length]);

  const navigate = useNavigate();

  // Hero image carousel state
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  useEffect(() => {
    const heroImages = [
      
      "https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg",
          "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
         
    ];
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const heroRef = useScrollAnimation();
  const statsRef = useScrollAnimation();
  const aboutRef = useScrollAnimation();
  const testimonialsRef = useScrollAnimation();
  const ctaRef = useScrollAnimation();

  // Hero text animation state
  const [heroTextAnimate, setHeroTextAnimate] = useState(false);

  useEffect(() => {
    ScrollReveal().reveal('.sr-hero', { origin: 'top', distance: '40px', duration: 900, easing: 'cubic-bezier(0.4,0,0.2,1)', reset: false });
    ScrollReveal().reveal('.sr-stats', { origin: 'left', distance: '40px', duration: 900, delay: 100, reset: false });
    ScrollReveal().reveal('.sr-about', { origin: 'right', distance: '40px', duration: 900, delay: 200, reset: false });
    ScrollReveal().reveal('.sr-testimonials', { origin: 'left', distance: '40px', duration: 900, delay: 400, reset: false });
    ScrollReveal().reveal('.sr-faq', { origin: 'right', distance: '40px', duration: 900, delay: 500, reset: false });
    ScrollReveal().reveal('.sr-cta', { origin: 'bottom', distance: '40px', duration: 900, delay: 600, reset: false });
    ScrollReveal().reveal('.sr-why-jbd', { origin: 'bottom', distance: '40px', duration: 900, delay: 350, reset: false });
    ScrollReveal().reveal('.sr-process', { origin: 'bottom', distance: '40px', duration: 900, delay: 400, reset: false, interval: 120 });
  }, []);

  const splashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const splash = splashRef.current;
      if (!splash) return;
      const size = 120;
      const x = e.clientX - size / 2;
      const y = e.clientY - size / 2;
      splash.style.left = `${x}px`;
      splash.style.top = `${y}px`;
      splash.classList.remove('active');
      // Force reflow to restart animation
      void splash.offsetWidth;
      splash.classList.add('active');
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const processSectionRef = useRef<HTMLDivElement>(null);
  const [processInView, setProcessInView] = useState(false);
  const [activeProcessStep, setActiveProcessStep] = useState(0);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setProcessInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (processSectionRef.current) {
      observer.observe(processSectionRef.current);
    }
    return () => {
      if (processSectionRef.current) observer.unobserve(processSectionRef.current);
    };
  }, []);

  useEffect(() => {
    if (!processInView) return;
    const interval = setInterval(() => {
      setActiveProcessStep((prev) => (prev + 1) % processSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [processInView]);

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-br from-cream-50 to-wood-50 min-h-screen overflow-hidden flex items-center sr-hero"
        data-aos="fade-up"
      >
        {/* Blurred background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <span className="text-[10vw] md:text-[7vw] font-extrabold text-blue-200/30 blur-[6px] tracking-widest uppercase whitespace-nowrap">
            JBD FURNITURE
          </span>
        </div>
        {/* Animated background shapes */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-accent/30 to-wood-200 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-forest-200 to-accent/20 rounded-full blur-2xl opacity-30 animate-pulse" />
        {/* Hero Background Video */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video
            src="/7578547-uhd_2560_1440_30fps.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(1.15)' }}
            onPlay={() => setHeroTextAnimate(true)}
          />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-4xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-2xl font-playfair transition-all duration-700 ${heroTextAnimate ? 'hero-text-animate' : ''}`}>
              <span className="block text-black animate-bounce-slow drop-shadow-2xl">Crafting Dreams into</span>
              <span className="block bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 bg-clip-text text-transparent animate-gradient-x animate-shimmer font-playfair animate-fade-in-up [animation-delay:0.5s]">
                Furniture
              </span>
            </h1>
            <p className={`text-lg md:text-2xl mb-8 max-w-2xl mx-auto font-medium drop-shadow animate-fade-in-up font-poppins text-black transition-all duration-900 ${heroTextAnimate ? 'hero-text-animate' : ''}`}>
              Transform your space with custom furniture that reflects your style and meets your needs.<br />
              Premium craftsmanship, timeless designs, and exceptional service since 1995.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-20">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-blue-900 font-bold px-8 py-4 rounded-full shadow-lg hover:scale-110 hover:shadow-2xl transition-all duration-300 focus:ring-4 focus:ring-yellow-200/60 animate-fade-in-up animate-delay-200 hover:animate-pulse relative z-20 touch-manipulation"
                onClick={() => navigate('/projects')}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  navigate('/projects');
                }}
              >
                Explore Our Work <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white bg-white/10 hover:bg-white/20 hover:text-blue-900 px-8 py-4 rounded-full shadow-md hover:scale-110 transition-all duration-300 focus:ring-4 focus:ring-blue-200/60 animate-fade-in-up animate-delay-300 hover:animate-pulse relative z-20 touch-manipulation"
                onClick={() => navigate('/contact')}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  navigate('/contact');
                }}
              >
                <Phone className="mr-2 h-5 w-5" />
                Call for Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-gradient-to-r from-teal-900 via-green-700 to-teal-900 text-white sr-stats"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center bg-black/40 rounded-2xl p-6 shadow-md hover:scale-105 transition-transform duration-300">
                {/* Add icons for each stat */}
                <div className="mb-2">
                  {index === 0 && <Star className="h-7 w-7 text-accent" />}
                  {index === 1 && <Users className="h-7 w-7 text-accent" />}
                  {index === 2 && <Award className="h-7 w-7 text-accent" />}
                  {index === 3 && <CheckCircle className="h-7 w-7 text-accent" />}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-accent mb-1">
                  {stat.number}
                </div>
                <div className="text-wood-200 text-center text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section ref={aboutRef} className="py-20 bg-white sr-about"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-6">
                Where Tradition Meets Innovation
              </h2>
              <p className="text-black-900 mb-6 text-lg leading-relaxed">
                For over 13 years, we've been creating exceptional furniture
                that stands the test of time. Our master craftsmen combine
                traditional techniques with modern innovation to deliver pieces
                that are both beautiful and functional.
              </p>
              <div className="space-y-4 mb-8">  
                {[
                  "100% Custom Designs",
                  "Premium Materials Only",
                  "Lifetime Craftsmanship Warranty",
                  "Sustainable Practices",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-black-900 flex-shrink-0" />
                    <span className="text-black-600">{feature}</span>
                  </div>
                ))}
              </div>
              <Button className="bg-forest-600 hover:bg-forest-700 text-white" onClick={() => navigate('/about')}>
                Learn More About Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              {/* Decorative background shape */}
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-gradient-to-br from-accent/30 to-wood-100 rounded-3xl blur-2xl z-0" />
              <img
                src="https://furniturenews.s3.amazonaws.com/images/article/2024/01/_mainArticleImage/winner.jpg"
                alt="Master craftsman at work"
                className="rounded-2xl shadow-2xl relative z-10"
              />
              <div className="absolute -top-6 -right-1 bg-accent text-wood-900 p-3 rounded-xl shadow-lg transition-transform duration-300 hover:scale-110 hover:bg-accent/80 z-20">
                <Award className="h-8 w-8 mb-1" />
                <div className="font-bold">Award Winning</div>
                <div className="text-sm">JBDSHIP</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why JBD Furniture Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-100 sr-why-jbd"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Why JBD Furniture?</h2>
            <p className="text-lg text-blue-700 max-w-2xl mx-auto">Discover what sets us apart and why clients trust us for their dream furniture projects.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="flex flex-col items-center bg-white/80 rounded-2xl shadow-xl p-8 hover:scale-105 hover:shadow-2xl transition-all duration-300">
              <div className="mb-4 bg-blue-100 p-4 rounded-full">
                <svg className="h-10 w-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Timely Delivery</h3>
              <p className="text-blue-700 text-center">We value your time and always deliver projects within the promised timeline.</p>
            </div>
            <div className="flex flex-col items-center bg-white/80 rounded-2xl shadow-xl p-8 hover:scale-105 hover:shadow-2xl transition-all duration-300">
              <div className="mb-4 bg-green-100 p-4 rounded-full">
                <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-2">Quality Craftsmanship</h3>
              <p className="text-green-700 text-center">Our skilled artisans use only the best materials and techniques for lasting beauty.</p>
            </div>
            <div className="flex flex-col items-center bg-white/80 rounded-2xl shadow-xl p-8 hover:scale-105 hover:shadow-2xl transition-all duration-300">
              <div className="mb-4 bg-yellow-100 p-4 rounded-full">
                <svg className="h-10 w-10 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20l9-5-9-5-9 5 9 5z"/><path d="M12 12V4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="text-xl font-bold text-yellow-900 mb-2">Custom Solutions</h3>
              <p className="text-yellow-700 text-center">Every piece is tailored to your needs, style, and space for a perfect fit.</p>
            </div>
            <div className="flex flex-col items-center bg-white/80 rounded-2xl shadow-xl p-8 hover:scale-105 hover:shadow-2xl transition-all duration-300">
              <div className="mb-4 bg-pink-100 p-4 rounded-full">
                <svg className="h-10 w-10 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.5 16 21 16 21H12Z"/></svg>
              </div>
              <h3 className="text-xl font-bold text-pink-900 mb-2">Client Satisfaction</h3>
              <p className="text-pink-700 text-center">We go above and beyond to ensure every client is delighted with the result.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section ref={processSectionRef} className="max-w-6xl mx-auto my-12 p-4 md:p-8 bg-white/90 rounded-2xl shadow-lg sr-process"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-blue-900">Our Process</h2>
        <p className="text-center text-blue-700 mb-8">From idea to installation, we make your dream furniture a reality.</p>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {processSteps.map((step, idx) => (
            <div
              key={idx}
              className={`relative min-w-[260px] max-w-xs flex-1 bg-white rounded-2xl shadow-md px-6 pt-14 pb-6 flex flex-col items-center text-center border border-blue-100 overflow-visible transition-all duration-500 ${activeProcessStep === idx ? 'ring-4 ring-blue-300 scale-105 bg-blue-50 z-10' : 'opacity-60'}`}
              style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.06)' }}
            >
              {/* Arrow with Step Number */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center">
                <div
                  className={`flex items-center px-4 py-1 rounded-full text-white font-bold text-base shadow-lg step-arrow step-arrow-${(idx % 6) + 1}`}
                  style={{ background: `linear-gradient(90deg, ${arrowColors[idx % arrowColors.length][0]}, ${arrowColors[idx % arrowColors.length][1]})` }}
                >
                  <span className="mr-2">Step {idx + 1}</span>
                  <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="0,0 24,0 28,10 24,20 0,20" fill="#fff" />
                  </svg>
                </div>
              </div>
              {/* Icon */}
              <span className="mt-8 mb-3 text-5xl">{step.icon}</span>
              {/* Step Title */}
              <h3 className="font-bold text-lg mb-1 text-blue-900">{step.title}</h3>
              {/* Step Description */}
              <p className="text-gray-700 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
        {/* Custom arrow color gradients */}
        <style>{`
          .step-arrow-1 { background: linear-gradient(90deg, #00c6fb, #005bea); }
          .step-arrow-2 { background: linear-gradient(90deg, #005bea, #3a7bd5); }
          .step-arrow-3 { background: linear-gradient(90deg, #3a7bd5, #764ba2); }
          .step-arrow-4 { background: linear-gradient(90deg, #764ba2, #ff6a88); }
          .step-arrow-5 { background: linear-gradient(90deg, #ff6a88, #ffb86c); }
          .step-arrow-6 { background: linear-gradient(90deg, #ffb86c, #f7971e); }
        `}</style>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-20 bg-gradient-to-br from-blue-100 via-white to-blue-200 sr-testimonials"
        data-aos="fade-up"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-blue-700 text-lg">
              Don't just take our word for it - hear from our satisfied
              customers
            </p>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-700" style={{ minHeight: 340 }}>
              {testimonialGroups[testimonialSlide].map((testimonial, index) => (
                <Card
                  key={testimonial.name + index}
                  className="relative p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-transparent hover:scale-105 hover:shadow-2xl hover:border-blue-400 hover:ring-2 hover:ring-blue-200 transition-all duration-300 overflow-hidden group"
                  style={{ opacity: 1, transform: 'translateY(0)' }}
                >
                  {/* Faint quote icon */}
                  <svg className="absolute top-4 right-4 w-16 h-16 text-blue-100 opacity-40 z-0" fill="none" viewBox="0 0 48 48"><text x="0" y="40" fontSize="48" fontFamily="serif">“</text></svg>
                  <CardContent className="relative z-10 p-0 flex flex-col items-center text-center">
                    {/* Avatar with initials */}
                    <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center text-blue-900 font-bold text-2xl mb-4 shadow-md">
                      {testimonial.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                    </div>
                    {/* Star rating */}
                    <div className="flex items-center mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-6 w-6 text-yellow-400 fill-yellow-400 drop-shadow"
                        />
                      ))}
                    </div>
                    <blockquote className="text-blue-900 mb-4 italic font-medium">
                      "{testimonial.content}"
                    </blockquote>
                    <div>
                      <div className="font-semibold text-blue-800">
                        {testimonial.name}
                      </div>
                      <div className="text-blue-600 text-sm">
                        {testimonial.role}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Navigation dots */}
            <div className="flex justify-center mt-8 gap-2">
              {testimonialGroups.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${testimonialSlide === idx ? 'bg-blue-500 scale-125' : 'bg-blue-200'}`}
                  onClick={() => setTestimonialSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

     

      {/* Frequently Asked Questions */}
      <section className="max-w-2xl mx-auto my-12 p-6 bg-white/80 rounded-2xl shadow-lg"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`faq-${idx}`}>
              <AccordionTrigger className="text-lg font-semibold">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-gray-700">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>


    
    
{/* cta section */}
      <section ref={ctaRef} className="py-24 bg-gradient-to-br from-[#181e29] to-[#232a38] flex items-center justify-center sr-cta"
        data-aos="fade-up"
      >
        <div className="max-w-2xl w-full mx-auto px-6">
          <div className="bg-white/8 backdrop-blur-lg rounded-3xl shadow-2xl p-12 flex flex-col items-center text-center border border-blue-200/20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
              Ready to Start Your Project?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Let's bring your furniture dreams to life. Contact us today for a free consultation and see how we can transform your space.
            </p>
            <Button
              size="lg"
              className="bg-yellow-300 hover:bg-yellow-400 text-blue-900 font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
              onClick={() => navigate('/contact')}
            >
              Get Free Consultation
            </Button>
          </div>
        </div>
        
      </section>

    

      <Footer />
      {/* Splash Cursor */}
      <div ref={splashRef} className="splash-cursor" />
    </div>
  );
}
