import { Link } from 'react-router-dom';
import { Car, MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-luxury-dark text-white">
      <div className="luxury-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Car className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-semibold">
                Luxe<span className="text-primary">Rent</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Experience luxury on the road. Premium car rentals for the discerning traveler.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Fleet', 'Services', 'Pricing', 'Contact'].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase() === 'home' ? '' : link.toLowerCase()}`}
                    className="text-white/70 hover:text-primary transition-colors text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Working Hours</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <span>Mon - Fri: 08:00 - 20:00</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <span>Sat: 09:00 - 18:00</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <span>Sun: 10:00 - 16:00</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Quick Contact</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>42 Marine Parade, Auckland, New Zealand</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span>+64 21 234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span>hello@luxerent.co.nz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © 2024 LuxeRent. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/50">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
