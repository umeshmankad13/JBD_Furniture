import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import ScrollReveal from 'scrollreveal';

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

export default function OurOfferings() {
  const navigate = useNavigate();
  const offerings = [
    {
      title: 'Custom Furniture Design & Creation',
      desc: 'Bespoke furniture tailored to your style, space, and needs. Crafted with precision and passion.',
      gradient: 'from-blue-400 to-blue-600',
      img: 'https://madscreations.in/wp-content/uploads/2023/03/luxury-1.png',
    },
    {
      title: 'Modular Kitchen Solutions',
      desc: 'Modern, functional, and beautiful modular kitchens designed for your lifestyle.',
      gradient: 'from-teal-400 to-green-500',
      img: '/Kitchen-Furniture-Design-15.webp',
    },
    {
      title: 'Office Furniture & Corporate Solutions',
      desc: 'Ergonomic and stylish office furniture for productive, inspiring workspaces.',
      gradient: 'from-purple-400 to-indigo-600',
      img: 'https://images.squarespace-cdn.com/content/v1/5cda2bcc797f74490a461c35/1566257943189-TMQBB14CMAIR52HZBOJF/cubicles.jpg',
    },
    {
      title: 'Furniture Refurbishing & Restoration',
      desc: 'Give your cherished pieces a new life with expert restoration and refinishing.',
      gradient: 'from-orange-400 to-yellow-400',
      img: 'https://www.artsyanfurniture.com/wp-content/uploads/2023/05/worker-using-drill-build-kitchen-furniture_475667-541.jpg',
    },
    {
      title: 'Interior Design Consultation',
      desc: 'Professional guidance to transform your space into a true reflection of you.',
      gradient: 'from-pink-400 to-pink-600',
      img: 'https://cornfordandcross.com/wp-content/uploads/2024/08/how-to-do-an-interior-design-consultation.jpg',
    },
    {
      title: 'Material Selection & Sourcing',
      desc: 'Access to premium, sustainable materials for every project and budget.',
      gradient: 'from-cyan-400 to-blue-500',
      img: 'https://www.nevers.com/wp-content/uploads/2021/08/Wilsonart-Laminate-Designs-1B.jpg',
    },
  ];
  const visible = useStaggeredAnimation(offerings.length);

  useEffect(() => {
    ScrollReveal().reveal('.sr-hero', { origin: 'top', distance: '40px', duration: 900, reset: false });
    ScrollReveal().reveal('.sr-offerings', { origin: 'bottom', distance: '40px', duration: 900, delay: 200, reset: false });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-blue-900 mb-4 drop-shadow-lg sr-hero">Our Offerings</h1>
          <p className="text-xl text-blue-700 mb-8 max-w-2xl mx-auto sr-hero">Discover our full suite of services, designed to elevate your spaces with craftsmanship, innovation, and style.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 sr-offerings"
          data-aos="fade-up"
        >
          {offerings.map((offering, idx) => (
            <div
              key={offering.title}
              className={`relative bg-gradient-to-br ${offering.gradient} bg-clip-padding backdrop-blur-xl bg-opacity-80 border border-white/30 rounded-3xl shadow-2xl p-8 flex flex-col items-start transition-all duration-300 group overflow-hidden
                ${visible[idx] ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}
                hover:scale-[1.06] hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-400/40 hover:ring-4 hover:ring-blue-200/40
              `}
              data-aos="zoom-in-up"
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              {/* Decorative blurred shape */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl opacity-40 z-0" />
              {/* Card Image */}
              <div className="w-full mb-4 relative z-10 overflow-hidden">
                <img
                  src={offering.img}
                  alt={offering.title}
                  className="w-full h-40 object-cover rounded-2xl shadow-lg border-2 border-white/30 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500 bg-white/10 backdrop-blur-xl"
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-black/10 opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 drop-shadow-lg z-10 group-hover:-translate-y-1 transition-transform duration-300">{offering.title}</h2>
              <p className="text-white/90 mb-6 z-10 group-hover:-translate-y-1 transition-transform duration-300">{offering.desc}</p>
              <button
                className="mt-auto px-6 py-2 rounded-full bg-white/80 text-blue-900 font-semibold shadow-lg transition-all duration-300 hover:bg-blue-900 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 z-10"
                onClick={() => navigate('/contact')}
              >
                Get Estimate
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Custom animation classes
// Add these to your global.css or tailwind config if not present
/*
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(32px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes bounce-on-hover {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px) scale(1.08); }
}
.animate-bounce-on-hover:hover {
  animation: bounce-on-hover 0.5s;
}
*/
