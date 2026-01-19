import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroCar from '@/assets/hero-car.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen pt-20 overflow-hidden bg-gradient-to-b from-background to-muted">
      <div className="luxury-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-5rem)]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6"
            >
              <Star className="w-4 h-4 fill-primary" />
              <span className="text-sm font-medium">Premium Car Rental Service</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Your Ultimate{' '}
              <span className="text-primary">Luxury</span>
              <br />
              Drive Awaits
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Experience the thrill of driving premium vehicles. From sports cars to luxury sedans, find your perfect ride for any occasion.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/fleet">
                <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2 group">
                  Explore All Cars
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2">
                <Play className="w-4 h-4" />
                Watch Video
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-muted border-2 border-background"
                    />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-foreground">5,000+</p>
                  <p className="text-xs text-muted-foreground">Happy Customers</p>
                </div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-luxury-gold fill-luxury-gold" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">4.9/5</p>
                  <p className="text-xs text-muted-foreground">Average Rating</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Car Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              <img
                src={heroCar}
                alt="Luxury Car"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">100+ Cars</p>
                    <p className="text-xs text-muted-foreground">Available Now</p>
                  </div>
                </div>
              </motion.div>

              {/* Price Tag */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg"
              >
                <p className="text-xs opacity-80">Starting from</p>
                <p className="text-xl font-bold">$65/day</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
};

export default HeroSection;
