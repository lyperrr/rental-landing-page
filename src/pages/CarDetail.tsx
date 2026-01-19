import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Users,
  Fuel,
  Settings2,
  Check,
  Calendar,
  MapPin,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cars } from '@/lib/carData';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, differenceInDays } from 'date-fns';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = cars.find((c) => c.id === id);

  const [pickupDate, setPickupDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Car not found</h1>
          <Link to="/fleet" className="text-primary hover:underline">
            Back to Fleet
          </Link>
        </div>
      </div>
    );
  }

  const rentalDays =
    pickupDate && returnDate ? differenceInDays(returnDate, pickupDate) : 0;
  const totalPrice = rentalDays > 0 ? rentalDays * car.pricePerDay : 0;

  const handleBooking = () => {
    if (pickupDate && returnDate && rentalDays > 0) {
      navigate(`/booking/${car.id}`, {
        state: { pickupDate, returnDate, totalPrice, rentalDays },
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-muted border-b border-border">
          <div className="luxury-container py-4">
            <Link
              to="/fleet"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Fleet
            </Link>
          </div>
        </div>

        {/* Car Details */}
        <section className="luxury-section">
          <div className="luxury-container">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left - Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="rounded-2xl overflow-hidden bg-muted">
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.name}`}
                    className="w-full h-auto aspect-[4/3] object-cover"
                  />
                </div>
              </motion.div>

              {/* Right - Details */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {car.category}
                  </span>
                  {car.available ? (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Available
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Not Available
                    </span>
                  )}
                </div>

                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {car.brand} {car.name}
                </h1>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-luxury-gold fill-luxury-gold" />
                    <span className="font-semibold">{car.rating}</span>
                    <span className="text-muted-foreground">
                      ({car.reviews} reviews)
                    </span>
                  </div>
                  <span className="text-muted-foreground">• {car.year}</span>
                </div>

                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {car.description}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-xl mb-8">
                  <div className="text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">{car.seats} Seats</p>
                  </div>
                  <div className="text-center">
                    <Fuel className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">{car.fuel}</p>
                  </div>
                  <div className="text-center">
                    <Settings2 className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">{car.transmission}</p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h3 className="font-display text-lg font-semibold mb-4">
                    Features
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {car.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="w-4 h-4 text-primary" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Section */}
                <div className="p-6 bg-muted rounded-xl">
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-bold text-primary">
                      ${car.pricePerDay}
                    </span>
                    <span className="text-muted-foreground">/day</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Pickup Date */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Pickup Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {pickupDate ? (
                              format(pickupDate, 'PPP')
                            ) : (
                              <span>Select date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={pickupDate}
                            onSelect={setPickupDate}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Return Date */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Return Date
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {returnDate ? (
                              format(returnDate, 'PPP')
                            ) : (
                              <span>Select date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={returnDate}
                            onSelect={setReturnDate}
                            disabled={(date) =>
                              date < new Date() ||
                              (pickupDate ? date <= pickupDate : false)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Total */}
                  {rentalDays > 0 && (
                    <div className="flex items-center justify-between py-4 border-t border-border mb-6">
                      <span className="text-muted-foreground">
                        {rentalDays} days × ${car.pricePerDay}
                      </span>
                      <span className="text-2xl font-bold text-foreground">
                        ${totalPrice}
                      </span>
                    </div>
                  )}

                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={!car.available || rentalDays <= 0}
                    onClick={handleBooking}
                  >
                    {car.available ? 'Book Now' : 'Not Available'}
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CarDetail;
