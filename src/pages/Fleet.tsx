import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, SlidersHorizontal, X, ChevronDown, Star } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CarCard from '@/components/ui/CarCard';
import { cars, categories, transmissions, priceRanges } from '@/lib/carData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const seatOptions = [2, 4, 5, 7, 8];
const sortOptions = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'name-asc', label: 'Name: A-Z' },
];

const Fleet = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState('price-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    transmission: true,
    fuel: true,
    seats: false,
    rating: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleTransmission = (trans: string) => {
    setSelectedTransmissions(prev =>
      prev.includes(trans) ? prev.filter(t => t !== trans) : [...prev, trans]
    );
  };

  const toggleFuelType = (fuel: string) => {
    setSelectedFuelTypes(prev =>
      prev.includes(fuel) ? prev.filter(f => f !== fuel) : [...prev, fuel]
    );
  };

  const toggleSeats = (seats: number) => {
    setSelectedSeats(prev =>
      prev.includes(seats) ? prev.filter(s => s !== seats) : [...prev, seats]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedTransmissions([]);
    setSelectedFuelTypes([]);
    setSelectedSeats([]);
    setPriceRange([0, 1000]);
    setMinRating(0);
    setOnlyAvailable(false);
    setSearchQuery('');
  };

  const activeFiltersCount = 
    selectedCategories.length + 
    selectedTransmissions.length + 
    selectedFuelTypes.length + 
    selectedSeats.length +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (onlyAvailable ? 1 : 0);

  const filteredCars = useMemo(() => {
    let result = cars.filter((car) => {
      // Search filter
      const matchesSearch =
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.brand.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(car.category);

      // Transmission filter
      const matchesTransmission =
        selectedTransmissions.length === 0 || selectedTransmissions.includes(car.transmission);

      // Fuel type filter
      const matchesFuel =
        selectedFuelTypes.length === 0 || selectedFuelTypes.includes(car.fuel);

      // Seats filter
      const matchesSeats =
        selectedSeats.length === 0 || selectedSeats.includes(car.seats);

      // Price filter
      const matchesPrice =
        car.pricePerDay >= priceRange[0] && car.pricePerDay <= priceRange[1];

      // Rating filter
      const matchesRating = car.rating >= minRating;

      // Availability filter
      const matchesAvailability = !onlyAvailable || car.available;

      return matchesSearch && matchesCategory && matchesTransmission && matchesFuel && matchesSeats && matchesPrice && matchesRating && matchesAvailability;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.pricePerDay - b.pricePerDay;
        case 'price-desc':
          return b.pricePerDay - a.pricePerDay;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'name-asc':
          return `${a.brand} ${a.name}`.localeCompare(`${b.brand} ${b.name}`);
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, selectedCategories, selectedTransmissions, selectedFuelTypes, selectedSeats, priceRange, minRating, onlyAvailable, sortBy]);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Availability Toggle */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="available"
          checked={onlyAvailable}
          onCheckedChange={(checked) => setOnlyAvailable(checked === true)}
        />
        <Label htmlFor="available" className="text-sm font-medium cursor-pointer">
          Only show available cars
        </Label>
      </div>

      {/* Category Filter */}
      <Collapsible open={openSections.category} onOpenChange={() => toggleSection('category')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold text-foreground">
          Category
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.category ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {categories.filter(c => c !== 'All').map((cat) => (
            <div key={cat} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${cat}`}
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
              />
              <Label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">
                {cat}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range */}
      <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold text-foreground">
          Price Range
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.price ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}+</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Transmission Filter */}
      <Collapsible open={openSections.transmission} onOpenChange={() => toggleSection('transmission')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold text-foreground">
          Transmission
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.transmission ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {transmissions.filter(t => t !== 'All').map((trans) => (
            <div key={trans} className="flex items-center space-x-2">
              <Checkbox
                id={`trans-${trans}`}
                checked={selectedTransmissions.includes(trans)}
                onCheckedChange={() => toggleTransmission(trans)}
              />
              <Label htmlFor={`trans-${trans}`} className="text-sm cursor-pointer">
                {trans}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Fuel Type Filter */}
      <Collapsible open={openSections.fuel} onOpenChange={() => toggleSection('fuel')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold text-foreground">
          Fuel Type
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.fuel ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {fuelTypes.map((fuel) => (
            <div key={fuel} className="flex items-center space-x-2">
              <Checkbox
                id={`fuel-${fuel}`}
                checked={selectedFuelTypes.includes(fuel)}
                onCheckedChange={() => toggleFuelType(fuel)}
              />
              <Label htmlFor={`fuel-${fuel}`} className="text-sm cursor-pointer">
                {fuel}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Seats Filter */}
      <Collapsible open={openSections.seats} onOpenChange={() => toggleSection('seats')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold text-foreground">
          Seats
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.seats ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {seatOptions.map((seats) => (
            <div key={seats} className="flex items-center space-x-2">
              <Checkbox
                id={`seats-${seats}`}
                checked={selectedSeats.includes(seats)}
                onCheckedChange={() => toggleSeats(seats)}
              />
              <Label htmlFor={`seats-${seats}`} className="text-sm cursor-pointer">
                {seats} Seats
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Rating Filter */}
      <Collapsible open={openSections.rating} onOpenChange={() => toggleSection('rating')}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-semibold text-foreground">
          Minimum Rating
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.rating ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={minRating === rating}
                onCheckedChange={() => setMinRating(minRating === rating ? 0 : rating)}
              />
              <Label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center gap-1">
                <Star className="w-3 h-3 fill-luxury-gold text-luxury-gold" />
                {rating}+
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearAllFilters}>
          <X className="w-4 h-4 mr-2" />
          Clear All Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-luxury-dark text-white py-20">
          <div className="luxury-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Our Premium Fleet
              </h1>
              <p className="text-white/70 max-w-2xl mx-auto">
                Choose from our extensive collection of luxury and premium vehicles
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="luxury-section">
          <div className="luxury-container">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content Area */}
              <div className="flex-1 order-2 lg:order-1">
                {/* Top Bar - Search, Sort, View Toggle */}
                <div className="flex flex-wrap gap-4 items-center mb-8">
                  {/* Search */}
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by brand or model..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden gap-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                            {activeFiltersCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* View Toggle */}
                  <div className="flex gap-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{filteredCars.length}</span> of {cars.length} vehicles
                  </p>
                </div>

                {/* Cars Grid */}
                {filteredCars.length > 0 ? (
                  <div
                    className={`grid gap-6 ${
                      viewMode === 'grid'
                        ? 'md:grid-cols-2 xl:grid-cols-3'
                        : 'grid-cols-1'
                    }`}
                  >
                    {filteredCars.map((car, index) => (
                      <CarCard key={car.id} car={car} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      No cars found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters to find what you're looking for
                    </p>
                    <Button variant="outline" onClick={clearAllFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>

              {/* Desktop Sidebar Filters */}
              <aside className="hidden lg:block w-72 order-1 lg:order-2">
                <div className="sticky top-28 bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5" />
                      Filters
                    </h3>
                    {activeFiltersCount > 0 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                        {activeFiltersCount}
                      </span>
                    )}
                  </div>
                  <FilterContent />
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Fleet;