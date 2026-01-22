import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Check, CreditCard, User, Mail, Phone, MapPin, 
  Calendar, Clock, Shield, ChevronRight, Baby, Navigation, Wifi, 
  Smartphone, Snowflake, Umbrella, HeartPulse, Video, UserRound, Armchair,
  Car, AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cars } from '@/lib/carData';
import { addOns } from '@/lib/addOns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'user-round': UserRound,
  'baby': Baby,
  'armchair': Armchair,
  'navigation': Navigation,
  'wifi': Wifi,
  'smartphone': Smartphone,
  'snowflake': Snowflake,
  'umbrella': Umbrella,
  'heart-pulse': HeartPulse,
  'video': Video,
};

const pickupLocations: Record<string, { name: string; address: string }> = {
  airport: { name: 'Airport Terminal', address: 'International Airport, Terminal 1' },
  downtown: { name: 'Downtown Office', address: '123 Main Street, City Center' },
  mall: { name: 'Grand Mall', address: 'Grand Mall, Level B1 Parking' },
  hotel: { name: 'Hotel Delivery', address: 'We deliver to your hotel' },
};

const Booking = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const car = cars.find((c) => c.id === id);

  const { 
    pickupDate, 
    returnDate, 
    pickupTime = '10:00',
    returnTime = '10:00',
    pickupLocation = 'airport',
    returnLocation = 'airport',
    selectedAddOns = [],
    addOnsTotal = 0,
    carTotal = 0,
    totalPrice, 
    rentalDays 
  } = location.state || {};

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    driverLicense: '',
    specialRequests: '',
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!car || !pickupDate || !returnDate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Invalid Booking</h1>
          <p className="text-muted-foreground mb-6">
            Please select your dates from the car detail page
          </p>
          <Link to="/fleet">
            <Button>Browse Fleet</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getAddOnIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    if (!user) {
      toast.error('Please login to complete your booking');
      navigate('/login', { state: { from: location } });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get car from database
      const { data: dbCar } = await supabase
        .from('cars')
        .select('id')
        .eq('name', car.name)
        .eq('brand', car.brand)
        .single();

      if (!dbCar) {
        throw new Error('Car not found in database');
      }

      // Create booking
      const { error } = await supabase.from('bookings').insert({
        user_id: user.id,
        car_id: dbCar.id,
        pickup_date: format(new Date(pickupDate), 'yyyy-MM-dd'),
        return_date: format(new Date(returnDate), 'yyyy-MM-dd'),
        total_days: rentalDays,
        total_price: totalPrice,
        status: 'pending',
        payment_status: 'pending',
      });

      if (error) throw error;

      toast.success('Booking submitted successfully! We will confirm your reservation shortly.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Failed to create booking: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-muted border-b border-border">
          <div className="luxury-container py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link to="/fleet" className="text-muted-foreground hover:text-foreground transition-colors">
                Fleet
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <Link to={`/car/${car.id}`} className="text-muted-foreground hover:text-foreground transition-colors">
                {car.brand} {car.name}
              </Link>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium">Booking</span>
            </div>
          </div>
        </div>

        <section className="luxury-section">
          <div className="luxury-container">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Select Car</span>
              </div>
              <div className="w-12 h-px bg-primary" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                  2
                </div>
                <span className="text-sm font-medium">Your Details</span>
              </div>
              <div className="w-12 h-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold text-sm">
                  3
                </div>
                <span className="text-sm text-muted-foreground">Confirmation</span>
              </div>
            </div>

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
                className="lg:col-span-2 space-y-6"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="luxury-card p-6">
                    <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Personal Information
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          className="mt-2"
                          required
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          className="mt-2"
                          required
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                        />
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
                      <div className="md:col-span-2">
                        <Label htmlFor="driverLicense">Driver's License Number</Label>
                        <Input
                          id="driverLicense"
                          placeholder="Enter your driver's license number"
                          className="mt-2"
                          required
                          value={formData.driverLicense}
                          onChange={(e) =>
                            setFormData({ ...formData, driverLicense: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rental Details */}
                  <div className="luxury-card p-6">
                    <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                      <Car className="w-5 h-5 text-primary" />
                      Rental Details
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 text-sm font-medium mb-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          Pickup
                        </div>
                        <p className="font-semibold">{pickupLocations[pickupLocation]?.name}</p>
                        <p className="text-sm text-muted-foreground">{pickupLocations[pickupLocation]?.address}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(pickupDate), 'MMM dd, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {pickupTime}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 text-sm font-medium mb-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          Return
                        </div>
                        <p className="font-semibold">{pickupLocations[returnLocation]?.name}</p>
                        <p className="text-sm text-muted-foreground">{pickupLocations[returnLocation]?.address}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(returnDate), 'MMM dd, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {returnTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="luxury-card p-6">
                    <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      Payment Information
                    </h2>
                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg mb-4">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Payment will be processed securely. Your card will be charged upon confirmation.
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a confirmation email with payment instructions after submitting your booking.
                    </p>
                  </div>

                  {/* Terms */}
                  <div className="luxury-card p-6">
                    <div className="flex items-start space-x-3">
                      <Checkbox 
                        id="terms" 
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="terms" className="text-sm font-medium leading-relaxed cursor-pointer">
                          I agree to the{' '}
                          <Link to="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          By checking this box, you confirm that you are at least 21 years old and hold a valid driver's license.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isSubmitting || !agreedToTerms}
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
                  <p className="text-sm text-muted-foreground mb-4">{car.year} • {car.transmission}</p>

                  <div className="space-y-3 text-sm border-t border-border pt-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{rentalDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Car rental</span>
                      <span className="font-medium">${carTotal}</span>
                    </div>

                    {selectedAddOns.length > 0 && (
                      <>
                        <div className="pt-2 border-t border-border">
                          <p className="text-muted-foreground font-medium mb-2">Add-ons:</p>
                          {selectedAddOns.map((addonId: string) => {
                            const addon = addOns.find(a => a.id === addonId);
                            if (!addon) return null;
                            return (
                              <div key={addonId} className="flex justify-between items-center py-1">
                                <span className="flex items-center gap-2 text-muted-foreground">
                                  {getAddOnIcon(addon.icon)}
                                  {addon.name}
                                </span>
                                <span>${addon.pricePerDay * rentalDays}</span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 mt-4 border-t border-border">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ${totalPrice}
                    </span>
                  </div>

                  <div className="mt-6 space-y-2">
                    {['Free cancellation up to 24h', 'Full insurance included', '24/7 Roadside assistance'].map(
                      (item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
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