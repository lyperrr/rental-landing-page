import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import BrandsSection from '@/components/home/BrandsSection';
import AboutSection from '@/components/home/AboutSection';
import FeaturedCars from '@/components/home/FeaturedCars';
import TestimonialsSection from '@/components/home/TestimonialsSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <BrandsSection />
        <AboutSection />
        <FeaturedCars />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
