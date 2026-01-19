import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, CreditCard, User, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cars } from '@/lib/carData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Booking = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const car = cars.find((c) => c.id === id);

  const { pickupDate, returnDate, totalPrice, rentalDays } = location.state || {};

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!car || !pickupDate || !returnDate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid booking</h1>
          <Link to="/fleet" className="text-primary hover:underline">
            Back to Fleet
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate booking submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success('Booking confirmed! Check your email for details.');
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-muted border-b border-border">
          <div className="luxury-container py-4">
            <Link
              to={`/car/${car.id}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Car Details
            </Link>
          </div>
        </div>

        <section className="luxury-section">
          <div className="luxury-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Complete Your Booking
              </h1>
              <p className="text-muted-foreground">
                Fill in your details to confirm your reservation
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Booking Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="luxury-card p-6">
                    <h2 className="font-display text-xl font-semibold mb-6">
                      Personal Information
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative mt-2">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="firstName"
                            placeholder="John"
                            className="pl-10"
                            required
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({ ...formData, firstName: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <div className="relative mt-2">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            className="pl-10"
                            required
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({ ...formData, lastName: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <div className="relative mt-2">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            className="pl-10"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <div className="relative mt-2">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            placeholder="+64 21 234 5678"
                            className="pl-10"
                            required
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="relative mt-2">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="address"
                            placeholder="123 Main Street, Auckland"
                            className="pl-10"
                            required
                            value={formData.address}
                            onChange={(e) =>
                              setFormData({ ...formData, address: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="luxury-card p-6">
                    <h2 className="font-display text-xl font-semibold mb-6">
                      Payment Information
                    </h2>
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg mb-4">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Payment will be processed securely via our payment gateway
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You'll be redirected to complete payment after confirming your booking.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : `Confirm Booking - $${totalPrice}`}
                  </Button>
                </form>
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="luxury-card p-6 sticky top-28">
                  <h2 className="font-display text-xl font-semibold mb-6">
                    Booking Summary
                  </h2>

                  <div className="aspect-[4/3] rounded-lg overflow-hidden mb-4">
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {car.brand} {car.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">{car.year}</p>

                  <div className="space-y-3 text-sm border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pickup Date</span>
                      <span className="font-medium">
                        {format(new Date(pickupDate), 'PPP')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Return Date</span>
                      <span className="font-medium">
                        {format(new Date(returnDate), 'PPP')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{rentalDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rate per day</span>
                      <span className="font-medium">${car.pricePerDay}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 mt-4 border-t border-border">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ${totalPrice}
                    </span>
                  </div>

                  <div className="mt-6 space-y-2">
                    {['Free cancellation up to 24h', 'Insurance included', '24/7 Support'].map(
                      (item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-primary" />
                          {item}
                        </div>
                      )
                    )}
                  </div>
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

export default Booking;
