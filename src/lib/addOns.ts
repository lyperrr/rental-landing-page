export interface AddOn {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  icon: string;
  category: 'driver' | 'safety' | 'comfort' | 'convenience';
}

export const addOns: AddOn[] = [
  {
    id: 'driver',
    name: 'Professional Driver',
    description: 'Experienced and licensed professional driver for your journey',
    pricePerDay: 75,
    icon: 'user-round',
    category: 'driver',
  },
  {
    id: 'baby-seat',
    name: 'Baby Car Seat',
    description: 'Safe and comfortable car seat for infants (0-12 months)',
    pricePerDay: 15,
    icon: 'baby',
    category: 'safety',
  },
  {
    id: 'child-seat',
    name: 'Child Booster Seat',
    description: 'Booster seat for children (1-6 years)',
    pricePerDay: 12,
    icon: 'armchair',
    category: 'safety',
  },
  {
    id: 'gps',
    name: 'GPS Navigation',
    description: 'Premium GPS device with offline maps and real-time traffic',
    pricePerDay: 10,
    icon: 'navigation',
    category: 'convenience',
  },
  {
    id: 'wifi',
    name: 'Mobile WiFi Hotspot',
    description: 'High-speed 4G LTE WiFi hotspot for up to 5 devices',
    pricePerDay: 8,
    icon: 'wifi',
    category: 'convenience',
  },
  {
    id: 'phone-mount',
    name: 'Phone Mount & Charger',
    description: 'Universal phone mount with fast wireless charging',
    pricePerDay: 5,
    icon: 'smartphone',
    category: 'convenience',
  },
  {
    id: 'cooler',
    name: 'Travel Cooler Box',
    description: 'Electric cooler to keep drinks and snacks cool',
    pricePerDay: 10,
    icon: 'snowflake',
    category: 'comfort',
  },
  {
    id: 'umbrella',
    name: 'Premium Umbrella Set',
    description: 'Set of 2 premium umbrellas for unexpected weather',
    pricePerDay: 5,
    icon: 'umbrella',
    category: 'comfort',
  },
  {
    id: 'first-aid',
    name: 'Enhanced First Aid Kit',
    description: 'Comprehensive first aid kit with additional medical supplies',
    pricePerDay: 8,
    icon: 'heart-pulse',
    category: 'safety',
  },
  {
    id: 'dash-cam',
    name: 'Dash Camera',
    description: 'HD dash camera for recording your journey',
    pricePerDay: 12,
    icon: 'video',
    category: 'safety',
  },
];

export const addOnCategories = [
  { id: 'driver', name: 'Driver Services' },
  { id: 'safety', name: 'Safety Equipment' },
  { id: 'comfort', name: 'Comfort & Convenience' },
  { id: 'convenience', name: 'Tech & Gadgets' },
];