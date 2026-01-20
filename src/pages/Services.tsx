import { motion } from 'framer-motion';
import { MapPin, Shield, UserCheck, Building2, Clock, Phone, CheckCircle2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: MapPin,
    title: 'Pickup & Dropoff Locations',
    description: 'Convenient pickup and dropoff at major airports, hotels, and city centers across the country.',
    features: [
      'Airport pickup with meet & greet service',
      'Hotel delivery at no extra charge',
      'City center pickup points',
      'One-way rentals available',
      'After-hours pickup/dropoff options',
    ],
  },
  {
    icon: Shield,
    title: 'Insurance Options',
    description: 'Comprehensive insurance packages to give you peace of mind during your rental.',
    features: [
      'Collision Damage Waiver (CDW)',
      'Theft Protection (TP)',
      'Personal Accident Insurance',
      'Supplemental Liability Insurance',
      'Premium coverage with zero excess',
    ],
  },
  {
    icon: UserCheck,
    title: 'Driver Services',
    description: 'Professional chauffeur services for business, events, or leisure travel.',
    features: [
      'Licensed professional drivers',
      'Multi-lingual chauffeurs available',
      'Airport transfers',
      'Full-day hire options',
      'Wedding & event services',
    ],
  },
  {
    icon: Building2,
    title: 'Corporate Rentals',
    description: 'Tailored solutions for businesses with flexible terms and dedicated support.',
    features: [
      'Fleet management solutions',
      'Monthly billing options',
      'Priority booking access',
      'Dedicated account manager',
      'Volume discounts available',
    ],
  },
];

const additionalServices = [
  { icon: Clock, title: '24/7 Support', description: 'Round-the-clock roadside assistance' },
  { icon: Phone, title: 'Easy Booking', description: 'Book online or via phone in minutes' },
];

const Services = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-luxury-dark text-white py-24">
          <div className="luxury-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Our Premium Services
              </h1>
              <p className="text-white/70 text-lg">
                Experience luxury car rental with comprehensive services designed for your comfort and convenience
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="luxury-section">
          <div className="luxury-container">
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="luxury-card p-8"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-16 bg-muted">
          <div className="luxury-container">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Always There for You
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Additional services to ensure your rental experience is seamless
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {additionalServices.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 bg-background p-6 rounded-xl border border-border"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{service.title}</h4>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="luxury-section bg-luxury-dark text-white">
          <div className="luxury-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to Experience Luxury?
              </h2>
              <p className="text-white/70 max-w-xl mx-auto mb-8">
                Browse our premium fleet and book your perfect vehicle today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/fleet">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    View Our Fleet
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
