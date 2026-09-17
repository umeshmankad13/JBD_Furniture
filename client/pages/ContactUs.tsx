import { Footer } from '@/components/Footer';
import { useState, useEffect } from 'react';
import ScrollReveal from 'scrollreveal';

export default function ContactUs() {
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ScrollReveal().reveal('.sr-contact', { origin: 'bottom', distance: '40px', duration: 900, reset: false });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormStatus('idle');
    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      mobile: (form.elements.namedItem('mobile') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormStatus('success');
        form.reset();
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-teal-900 to-blue-800 relative overflow-hidden">
      <div className="flex-1 flex items-center justify-center py-12">
        {/* Decorative blurred overlays */}
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-gradient-to-br from-blue-400/30 to-teal-300/20 rounded-full blur-3xl opacity-40 z-0 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-gradient-to-tr from-blue-300/30 to-blue-100/20 rounded-full blur-2xl opacity-30 z-0 animate-pulse" />
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center w-full">
          <div className="max-w-3xl w-full mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col items-center sr-contact">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg text-center">Contact Us</h1>
            <p className="text-xl text-blue-100 mb-8 text-center max-w-xl">We'd love to hear from you! Reach out for project inquiries, collaborations, or just to say hello.</p>
            <div className="grid md:grid-cols-2 gap-10 w-full">
              {/* Contact Info */}
              <div className="space-y-6 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-400/20 text-cyan-200"><svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h2.28a2 2 0 011.7 1.06l1.1 2.21a2 2 0 01-.45 2.45l-.9.9a16.001 16.001 0 006.586 6.586l.9-.9a2 2 0 012.45-.45l2.21 1.1A2 2 0 0121 18.72V21a2 2 0 01-2 2h-1C9.163 23 1 14.837 1 5V4a2 2 0 012-2z' /></svg></span>
                  <span className="text-blue-100 text-lg">+91 6377 763 522  <br></br> +91 9552494132</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-400/20 text-cyan-200"><svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v1a4 4 0 01-8 0v-1m8 0V7a4 4 0 00-8 0v5' /></svg></span>
                  <span className="text-blue-100 text-lg">info@craftfurniture.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-400/20 text-cyan-200"><svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 12.414a2 2 0 00-2.828 0l-4.243 4.243A8 8 0 1116.657 7.343z' /></svg></span>
                  <span className="text-blue-100 text-lg">Plot no.34 sr no. 41/4 jay vishwakarma society, pune 411014</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-400/20 text-cyan-200 mt-1"><svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10m-7 4h4m-9 4h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' /></svg></span>
                  <span className="text-blue-100 text-lg">Everyday: 8:00 AM - 10:00 PM<br /></span>
                </div>
              </div>
              {/* Contact Form */}
              <form className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6 flex flex-col gap-6 sr-contact" onSubmit={handleSubmit}>
                <div className="relative">
                  <input type="text" id="name" name="name" required className="peer w-full bg-transparent border-b-2 border-cyan-400/40 text-white placeholder-transparent focus:outline-none focus:border-cyan-400 transition-all py-2" placeholder=" " />
                  <label htmlFor="name" className="absolute left-0 top-2 text-blue-200 text-base transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-xs peer-focus:text-cyan-300">Your Name</label>
                </div>
                <div className="relative">
                  <input type="email" id="email" name="email" required className="peer w-full bg-transparent border-b-2 border-cyan-400/40 text-white placeholder-transparent focus:outline-none focus:border-cyan-400 transition-all py-2" placeholder=" " />
                  <label htmlFor="email" className="absolute left-0 top-2 text-blue-200 text-base transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-xs peer-focus:text-cyan-300">Your Email</label>
                </div>
                <div className="relative">
                  <input type="tel" id="mobile" name="mobile" required pattern="[0-9]{10,15}" className="peer w-full bg-transparent border-b-2 border-cyan-400/40 text-white placeholder-transparent focus:outline-none focus:border-cyan-400 transition-all py-2" placeholder=" " />
                  <label htmlFor="mobile" className="absolute left-0 top-2 text-blue-200 text-base transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-xs peer-focus:text-cyan-300">Your Mobile Number</label>
                </div>
                <div className="relative">
                  <textarea id="message" name="message" required rows={4} className="peer w-full bg-transparent border-b-2 border-cyan-400/40 text-white placeholder-transparent focus:outline-none focus:border-cyan-400 transition-all py-2 resize-none" placeholder=" " />
                  <label htmlFor="message" className="absolute left-0 top-2 text-blue-200 text-base transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-xs peer-focus:text-cyan-300">Your Message</label>
                </div>
                <button type="submit" className="mt-2 px-8 py-3 rounded-full bg-cyan-400/90 text-blue-900 font-bold shadow-lg transition-all duration-300 hover:bg-blue-900 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-300" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</button>
                {formStatus === 'success' && <div className="text-green-400 mt-2">Message sent! We will get back to you soon.</div>}
                {formStatus === 'error' && <div className="text-red-400 mt-2">Failed to send message. Please try again.</div>}
              </form>
            </div>
            {/* Decorative Map Section */}
            <div className="w-full mt-12 rounded-2xl overflow-hidden shadow-xl border border-white/10">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1250.6312508454432!2d73.92201415307086!3d18.55350302056478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1752681586409!5m2!1sen!2sin"
                width="100%"
                height="260"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
