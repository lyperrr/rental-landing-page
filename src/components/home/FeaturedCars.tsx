import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cars } from '@/lib/carData';
import CarCard from '@/components/ui/CarCard';

const FeaturedCars = () => {
  const rentCars = cars.slice(0, 6);

  return (
    <section className="luxury-section bg-muted">
      <div className="luxury-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            All Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our premium selection of vehicles available for rent or purchase
          </p>
        </motion.div>

        {/* Rent Cars Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display text-2xl font-semibold text-foreground">
              Rent Car
            </h3>
            <Link 
              to="/fleet" 
              className="flex items-center gap-2 text-primary hover:underline text-sm font-medium"
            >
              See all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentCars.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
