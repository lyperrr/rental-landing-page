import { motion } from 'framer-motion';
import { Star, Users, Fuel, Settings2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { Car } from '@/lib/carData';

interface CarCardProps {
  car: Car;
  index?: number;
}

const CarCard = ({ car, index = 0 }: CarCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group luxury-card overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={car.image}
          alt={`${car.brand} ${car.name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!car.available && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <span className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium">
              Not Available
            </span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            car.category === 'Luxury' 
              ? 'bg-luxury-gold text-foreground' 
              : 'bg-background text-foreground'
          }`}>
            {car.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title & Rating */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              {car.brand} {car.name}
            </h3>
            <p className="text-sm text-muted-foreground">{car.year}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
            <span className="text-sm font-medium">{car.rating}</span>
            <span className="text-xs text-muted-foreground">({car.reviews})</span>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-3 py-4 border-y border-border mb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-xs">{car.seats} Seats</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Fuel className="w-4 h-4" />
            <span className="text-xs">{car.fuel}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Settings2 className="w-4 h-4" />
            <span className="text-xs">{car.transmission}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">${car.pricePerDay}</span>
            <span className="text-sm text-muted-foreground">/day</span>
          </div>
          <Link to={`/car/${car.id}`}>
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90 gap-1 group/btn"
              disabled={!car.available}
            >
              See more
              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CarCard;
