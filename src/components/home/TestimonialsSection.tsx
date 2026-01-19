import { motion } from 'framer-motion';
import { Quote, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import testimonial1 from '@/assets/testimonial-1.jpg';
import testimonial2 from '@/assets/testimonial-2.jpg';

const testimonials = [
  {
    id: 1,
    name: 'James Austin',
    role: 'Business Executive',
    image: testimonial1,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
  },
  {
    id: 2,
    name: 'Sarah Mitchell',
    role: 'Travel Blogger',
    image: testimonial2,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="luxury-section bg-background">
      <div className="luxury-container">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Testimonials
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Reviewed by Our Clients
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              Discover More
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Right - Testimonial Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="luxury-card p-6"
              >
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
