import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Offerings", href: "/offerings" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact" },
];

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [logo, setLogo] = useState('');
  const lastScrollY = useRef(typeof window !== 'undefined' ? window.scrollY : 0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY.current && currentScrollY > 64) {
            setShowNavbar(false); // scrolling down
          } else {
            setShowNavbar(true); // scrolling up
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => { fetch('/api/settings').then(r => r.json()).then(data => setLogo(data.settings.logo || '')).catch(() => undefined); }, []);

  const isHome = location.pathname === "/";
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Offerings", path: "/offerings" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={cn(
        isHome
          ? "absolute top-0 left-0 w-full z-30 transition-transform duration-300 animate-fade-in-down bg-transparent border-none"
          : "sticky top-0 z-50 transition-transform duration-300 animate-fade-in-down",
        showNavbar ? "translate-y-0" : "-translate-y-full"
      )}
      style={
        isHome
          ? { background: 'transparent', backdropFilter: 'none', WebkitBackdropFilter: 'none', border: 'none' }
          : {
              background: 'linear-gradient(90deg, rgba(219,234,254,0.75) 0%, rgba(255,255,255,0.65) 50%, rgba(191,219,254,0.75) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: '3px solid',
              borderImage: 'linear-gradient(90deg, #38bdf8 0%, #facc15 100%) 1',
            }
      }
    >
      {/* Top bar with contact info - hidden on mobile */}
      {!isHome && (
        <div className="hidden md:block text-white py-2 border-b border-blue-800/40 bg-transparent">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              {/* Add contact info or social icons here if needed */}
            </div>
          </div>
        </div>
      )}

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src={logo || "/jbd_logo.jpg"} 
                alt="JBD Furniture Logo" 
                className="w-10 h-10 rounded-xl shadow-xl ring-4 ring-blue-300/30 group-hover:ring-yellow-200/60 transition-all duration-300 animate-glow object-cover"
                onError={(e) => {
                  // Fallback to gradient background if image fails to load
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-10 h-10 bg-gradient-to-br from-blue-700 via-teal-400 to-yellow-300 rounded-xl flex items-center justify-center shadow-xl ring-4 ring-blue-300/30 group-hover:ring-yellow-200/60 transition-all duration-300 animate-glow"><span class="text-white font-extrabold text-lg drop-shadow-lg">JBD</span></div>';
                  }
                }}
              />
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-teal-400 to-yellow-300 bg-clip-text text-transparent tracking-wide drop-shadow-lg">
            JBD Furniture
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  `px-4 py-2 rounded-lg font-semibold transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-accent/70
                  bg-white text-blue-700
                  hover:scale-110 hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400 hover:text-white hover:shadow-blue-200/40
                  after:absolute after:left-4 after:right-4 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-teal-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left`,
                  location.pathname === item.href
                    ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-lg after:scale-x-100"
                    : "",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            {/* <Button
              className="bg-gradient-to-r from-blue-700 via-teal-400 to-yellow-300 text-white font-bold shadow-xl px-7 py-2 rounded-xl transition-all duration-300 ring-4 ring-yellow-200/20 hover:scale-110 hover:shadow-2xl hover:ring-pink-300/60 hover:bg-gradient-to-r hover:from-pink-500 hover:via-yellow-400 hover:to-blue-500 hover:text-white focus:ring-4 focus:ring-yellow-200/60 animate-fade-in-up"
              onClick={() => window.location.href = '/contact'}
            >
              
            </Button> */}
          </div>

          {/* Mobile menu button */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white hover:text-blue-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-blue-800/40 bg-gradient-to-br from-blue-900/90 to-blue-800/80 backdrop-blur-xl animate-fade-in-down">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    `px-4 py-2 rounded-lg font-semibold transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-accent/70
                    bg-white text-blue-700
                    hover:scale-110 hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400 hover:text-white hover:shadow-blue-200/40
                    after:absolute after:left-4 after:right-4 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-blue-400 after:to-teal-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left`,
                    location.pathname === item.href
                      ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-lg after:scale-x-100"
                      : "",
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <Button
                className="mx-4 mt-4 bg-gradient-to-r from-blue-700 via-teal-400 to-yellow-300 text-white font-bold shadow-xl px-7 py-2 rounded-xl transition-all duration-300 ring-4 ring-yellow-200/20 hover:scale-110 hover:shadow-2xl hover:ring-pink-300/60 hover:bg-gradient-to-r hover:from-pink-500 hover:via-yellow-400 hover:to-blue-500 hover:text-white focus:ring-4 focus:ring-yellow-200/60 animate-fade-in-up"
                onClick={() => window.location.href = '/contact'}
              >
                Get Quote
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
