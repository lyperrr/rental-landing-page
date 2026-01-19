import { motion } from 'framer-motion';
import { Shield, DollarSign, Play } from 'lucide-react';
import testimonial1 from '@/assets/testimonial-1.jpg';

const AboutSection = () => {
  return (
    <section className="luxury-section bg-background">
      <div className="luxury-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
              About Us
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              Providing{' '}
              <span className="text-primary">Reliable</span>
              <br />
              Car Rentals
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium text-foreground">Safe & Trusted</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium text-foreground">Affordable Price</span>
              </div>
            </div>

            {/* Signature */}
            <div className="flex items-center gap-4">
              <img
                src={testimonial1}
                alt="CEO"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p className="text-sm text-muted-foreground">James Austin</p>
                <p className="font-display text-lg italic text-foreground">Founder & CEO</p>
              </div>
            </div>
          </motion.div>

          {/* Right - Video/Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-muted">
              <img
                src={testimonial1}
                alt="About Us"
                className="w-full h-full object-cover"
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/20">
                <button className="w-20 h-20 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                  <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground ml-1" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
