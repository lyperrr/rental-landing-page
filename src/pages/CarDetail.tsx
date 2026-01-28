import { useState, useMemo } from 'react';
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
  Clock,
  Plus,
  Minus,
  Info,
  Shield,
  Baby,
  Navigation,
  Wifi,
  Smartphone,
  Snowflake,
  Umbrella,
  HeartPulse,
  Video,
  UserRound,
  Armchair,
  ChevronRight,
  Share2,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cars } from '@/lib/carData';
import { addOns, type AddOn } from '@/lib/addOns';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, differenceInDays, setHours, setMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import CarReviews from '@/components/reviews/CarReviews';
import FavoriteButton from '@/components/ui/FavoriteButton';
import { toast } from 'sonner';

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

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00',
];

const pickupLocations = [
  { id: 'airport', name: 'Airport Terminal', address: 'International Airport, Terminal 1' },
  { id: 'downtown', name: 'Downtown Office', address: '123 Main Street, City Center' },
  { id: 'mall', name: 'Grand Mall', address: 'Grand Mall, Level B1 Parking' },
  { id: 'hotel', name: 'Hotel Delivery', address: 'We deliver to your hotel (extra fee may apply)' },
];

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = cars.find((c) => c.id === id);

  const [pickupDate, setPickupDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnTime, setReturnTime] = useState('10:00');
  const [pickupLocation, setPickupLocation] = useState('airport');
  const [returnLocation, setReturnLocation] = useState('airport');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const rentalDays =
    pickupDate && returnDate ? differenceInDays(returnDate, pickupDate) : 0;
  
  const addOnsTotal = useMemo(() => {
    return selectedAddOns.reduce((sum, addonId) => {
      const addon = addOns.find(a => a.id === addonId);
      return sum + (addon ? addon.pricePerDay * rentalDays : 0);
    }, 0);
  }, [selectedAddOns, rentalDays]);

  const groupedAddOns = useMemo(() => {
    const groups: Record<string, AddOn[]> = {
      driver: [],
      safety: [],
      comfort: [],
      convenience: [],
    };
    addOns.forEach(addon => {
      groups[addon.category].push(addon);
    });
    return groups;
  }, []);

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

  const carTotal = rentalDays > 0 ? rentalDays * car.pricePerDay : 0;
  const totalPrice = carTotal + addOnsTotal;

  const toggleAddOn = (addonId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleBooking = () => {
    if (pickupDate && returnDate && rentalDays > 0) {
      navigate(`/booking/${car.id}`, {
        state: { 
          pickupDate, 
          returnDate, 
          pickupTime,
          returnTime,
          pickupLocation,
          returnLocation,
          selectedAddOns,
          addOnsTotal,
          carTotal,
          totalPrice, 
          rentalDays 
        },
      });
    }
  };

  const getAddOnIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-5 h-5" /> : <Plus className="w-5 h-5" />;
  };

  // groupedAddOns is defined above before the early return

  // Mock additional images
  const carImages = [car.image, car.image, car.image];

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
              <span className="text-foreground font-medium">{car.brand} {car.name}</span>
            </div>
          </div>
        </div>

        {/* Car Details */}
        <section className="luxury-section">
          <div className="luxury-container">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left - Images & Details (3 columns) */}
              <div className="lg:col-span-3 space-y-8">
                {/* Main Image */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="rounded-2xl overflow-hidden bg-muted relative">
                    <img
                      src={carImages[activeImageIndex]}
                      alt={`${car.brand} ${car.name}`}
                      className="w-full h-auto aspect-[16/10] object-cover"
                    />
                    {!car.available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-semibold text-lg">
                          Currently Unavailable
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  <div className="flex gap-3 mt-4">
                    {carImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={cn(
                          "w-20 h-16 rounded-lg overflow-hidden border-2 transition-all",
                          activeImageIndex === idx ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                        )}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Car Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {car.category}
                    </span>
                    {car.available ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Available
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        Not Available
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                      {car.brand} {car.name}
                    </h1>
                    <div className="flex items-center gap-2">
                      <FavoriteButton carId={car.id} variant="button" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success('Link copied to clipboard');
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

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

                  <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                    {car.description}
                  </p>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-muted rounded-xl mb-8">
                    <div className="text-center p-4">
                      <Users className="w-8 h-8 mx-auto mb-3 text-primary" />
                      <p className="text-sm text-muted-foreground">Seats</p>
                      <p className="font-semibold text-lg">{car.seats}</p>
                    </div>
                    <div className="text-center p-4">
                      <Fuel className="w-8 h-8 mx-auto mb-3 text-primary" />
                      <p className="text-sm text-muted-foreground">Fuel Type</p>
                      <p className="font-semibold text-lg">{car.fuel}</p>
                    </div>
                    <div className="text-center p-4">
                      <Settings2 className="w-8 h-8 mx-auto mb-3 text-primary" />
                      <p className="text-sm text-muted-foreground">Transmission</p>
                      <p className="font-semibold text-lg">{car.transmission}</p>
                    </div>
                    <div className="text-center p-4">
                      <Calendar className="w-8 h-8 mx-auto mb-3 text-primary" />
                      <p className="text-sm text-muted-foreground">Year</p>
                      <p className="font-semibold text-lg">{car.year}</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8">
                    <h3 className="font-display text-xl font-semibold mb-4">
                      Features & Amenities
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {car.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                        >
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Add-ons Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <h3 className="font-display text-xl font-semibold mb-2">
                    Enhance Your Rental
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Add extras to make your journey more comfortable and convenient
                  </p>

                  <Tabs defaultValue="driver" className="w-full">
                    <TabsList className="grid grid-cols-4 mb-6">
                      <TabsTrigger value="driver" className="text-xs sm:text-sm">Driver</TabsTrigger>
                      <TabsTrigger value="safety" className="text-xs sm:text-sm">Safety</TabsTrigger>
                      <TabsTrigger value="comfort" className="text-xs sm:text-sm">Comfort</TabsTrigger>
                      <TabsTrigger value="convenience" className="text-xs sm:text-sm">Tech</TabsTrigger>
                    </TabsList>

                    {Object.entries(groupedAddOns).map(([category, categoryAddOns]) => (
                      <TabsContent key={category} value={category} className="space-y-3">
                        {categoryAddOns.map((addon) => (
                          <div
                            key={addon.id}
                            onClick={() => toggleAddOn(addon.id)}
                            className={cn(
                              "flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all",
                              selectedAddOns.includes(addon.id)
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-12 h-12 rounded-lg flex items-center justify-center",
                                selectedAddOns.includes(addon.id)
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              )}>
                                {getAddOnIcon(addon.icon)}
                              </div>
                              <div>
                                <p className="font-medium">{addon.name}</p>
                                <p className="text-sm text-muted-foreground">{addon.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-primary">${addon.pricePerDay}</p>
                              <p className="text-xs text-muted-foreground">/day</p>
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                    ))}
                  </Tabs>
                </motion.div>
              </div>

              {/* Right - Booking Widget (2 columns) */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="sticky top-28 bg-card rounded-xl border border-border p-6 shadow-lg">
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-bold text-primary">
                      ${car.pricePerDay}
                    </span>
                    <span className="text-muted-foreground">/day</span>
                  </div>

                  {/* Pickup Location */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">
                      Pickup Location
                    </label>
                    <Select value={pickupLocation} onValueChange={setPickupLocation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pickupLocations.map(loc => (
                          <SelectItem key={loc.id} value={loc.id}>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {loc.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pickup Date & Time */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
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
                              format(pickupDate, 'MMM dd')
                            ) : (
                              <span className="text-muted-foreground">Select</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={pickupDate}
                            onSelect={setPickupDate}
                            disabled={(date) => date < new Date()}
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Pickup Time
                      </label>
                      <Select value={pickupTime} onValueChange={setPickupTime}>
                        <SelectTrigger>
                          <Clock className="mr-2 h-4 w-4" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Return Location */}
                  <div className="mb-4">
                    <label className="text-sm font-medium mb-2 block">
                      Return Location
                    </label>
                    <Select value={returnLocation} onValueChange={setReturnLocation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {pickupLocations.map(loc => (
                          <SelectItem key={loc.id} value={loc.id}>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {loc.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Return Date & Time */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
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
                              format(returnDate, 'MMM dd')
                            ) : (
                              <span className="text-muted-foreground">Select</span>
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
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Return Time
                      </label>
                      <Select value={returnTime} onValueChange={setReturnTime}>
                        <SelectTrigger>
                          <Clock className="mr-2 h-4 w-4" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  {rentalDays > 0 && (
                    <div className="space-y-3 py-4 border-t border-border mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Car rental ({rentalDays} days × ${car.pricePerDay})
                        </span>
                        <span className="font-medium">${carTotal}</span>
                      </div>
                      
                      {selectedAddOns.length > 0 && (
                        <>
                          <div className="text-sm text-muted-foreground font-medium pt-2">
                            Add-ons:
                          </div>
                          {selectedAddOns.map(addonId => {
                            const addon = addOns.find(a => a.id === addonId);
                            if (!addon) return null;
                            return (
                              <div key={addonId} className="flex justify-between text-sm pl-4">
                                <span className="text-muted-foreground">
                                  {addon.name} ({rentalDays}d × ${addon.pricePerDay})
                                </span>
                                <span>${addon.pricePerDay * rentalDays}</span>
                              </div>
                            );
                          })}
                        </>
                      )}

                      <div className="flex justify-between pt-3 border-t border-border">
                        <span className="font-semibold">Total</span>
                        <span className="text-2xl font-bold text-primary">
                          ${totalPrice}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                    disabled={!car.available || rentalDays <= 0}
                    onClick={handleBooking}
                  >
                    {car.available ? 'Continue to Booking' : 'Not Available'}
                  </Button>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-border space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Shield className="w-5 h-5 text-primary" />
                      <span>Full insurance coverage included</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Check className="w-5 h-5 text-primary" />
                      <span>Free cancellation up to 24 hours</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Clock className="w-5 h-5 text-primary" />
                      <span>24/7 roadside assistance</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="luxury-section bg-muted/30">
          <div className="luxury-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Customer Reviews
                </h2>
              </div>
              <CarReviews carId={car.id} />
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CarDetail;