import carPorsche from '@/assets/car-porsche.jpg';
import carMaserati from '@/assets/car-maserati.jpg';
import carBentley from '@/assets/car-bentley.jpg';
import carJaguar from '@/assets/car-jaguar.jpg';
import carMazda from '@/assets/car-mazda.jpg';
import carHyundai from '@/assets/car-hyundai.jpg';

export interface Car {
  id: string;
  name: string;
  brand: string;
  year: number;
  image: string;
  pricePerDay: number;
  rating: number;
  reviews: number;
  transmission: 'Automatic' | 'Manual';
  fuel: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  seats: number;
  category: 'Luxury' | 'SUV' | 'Sedan' | 'Sports' | 'Economy';
  available: boolean;
  features: string[];
  description: string;
}

export const cars: Car[] = [
  {
    id: '1',
    name: 'Cayenne Turbo',
    brand: 'Porsche',
    year: 2024,
    image: carPorsche,
    pricePerDay: 450,
    rating: 4.9,
    reviews: 128,
    transmission: 'Automatic',
    fuel: 'Petrol',
    seats: 5,
    category: 'SUV',
    available: true,
    features: ['GPS Navigation', 'Leather Seats', 'Sunroof', 'Bluetooth', 'Backup Camera', 'Heated Seats'],
    description: 'Experience unmatched luxury and performance with the Porsche Cayenne Turbo. This premium SUV combines sports car dynamics with everyday practicality.'
  },
  {
    id: '2',
    name: 'Levante S',
    brand: 'Maserati',
    year: 2024,
    image: carMaserati,
    pricePerDay: 520,
    rating: 4.8,
    reviews: 96,
    transmission: 'Automatic',
    fuel: 'Petrol',
    seats: 5,
    category: 'Luxury',
    available: true,
    features: ['GPS Navigation', 'Premium Sound', 'Leather Interior', 'Climate Control', 'Parking Sensors'],
    description: 'The Maserati Levante S offers Italian luxury at its finest. With its distinctive design and powerful engine, every journey becomes extraordinary.'
  },
  {
    id: '3',
    name: 'Flying Spur',
    brand: 'Bentley',
    year: 2024,
    image: carBentley,
    pricePerDay: 780,
    rating: 5.0,
    reviews: 64,
    transmission: 'Automatic',
    fuel: 'Petrol',
    seats: 4,
    category: 'Luxury',
    available: true,
    features: ['Handcrafted Interior', 'Massage Seats', 'Champagne Cooler', 'Rear Entertainment', 'Diamond Quilting'],
    description: 'The ultimate in automotive luxury. The Bentley Flying Spur represents the pinnacle of craftsmanship and refinement.'
  },
  {
    id: '4',
    name: 'XE P300',
    brand: 'Jaguar',
    year: 2024,
    image: carJaguar,
    pricePerDay: 320,
    rating: 4.7,
    reviews: 156,
    transmission: 'Automatic',
    fuel: 'Petrol',
    seats: 5,
    category: 'Sedan',
    available: true,
    features: ['Touch Pro Duo', 'Meridian Sound', 'Adaptive Cruise', 'Lane Keep Assist', 'Emergency Braking'],
    description: 'British elegance meets sporting performance. The Jaguar XE delivers a refined driving experience with cutting-edge technology.'
  },
  {
    id: '5',
    name: 'CX-5 Signature',
    brand: 'Mazda',
    year: 2024,
    image: carMazda,
    pricePerDay: 85,
    rating: 4.6,
    reviews: 234,
    transmission: 'Automatic',
    fuel: 'Petrol',
    seats: 5,
    category: 'SUV',
    available: false,
    features: ['Apple CarPlay', 'Android Auto', 'Bose Audio', 'Head-Up Display', 'Smart Brake Support'],
    description: 'Premium features at an exceptional value. The Mazda CX-5 combines style, comfort, and efficiency in one perfect package.'
  },
  {
    id: '6',
    name: 'Elantra N',
    brand: 'Hyundai',
    year: 2024,
    image: carHyundai,
    pricePerDay: 65,
    rating: 4.5,
    reviews: 312,
    transmission: 'Manual',
    fuel: 'Petrol',
    seats: 5,
    category: 'Sedan',
    available: true,
    features: ['Digital Cluster', 'Wireless Charging', 'Smart Cruise', 'Lane Following', 'Remote Start'],
    description: 'Performance meets practicality. The Hyundai Elantra N delivers thrilling drives without compromising everyday usability.'
  }
];

export const brands = ['Porsche', 'Maserati', 'Bentley', 'Jaguar', 'Mazda', 'Hyundai', 'Honda', 'Audi', 'Volvo', 'Tesla', 'Acura'];

export const categories = ['All', 'Luxury', 'SUV', 'Sedan', 'Sports', 'Economy'];

export const transmissions = ['All', 'Automatic', 'Manual'];

export const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $100/day', min: 0, max: 100 },
  { label: '$100 - $300/day', min: 100, max: 300 },
  { label: '$300 - $500/day', min: 300, max: 500 },
  { label: 'Over $500/day', min: 500, max: Infinity },
];
