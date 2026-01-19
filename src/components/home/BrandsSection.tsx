import { motion } from 'framer-motion';

const brands = [
  { name: 'Honda', logo: 'HONDA' },
  { name: 'Jaguar', logo: 'JAGUAR' },
  { name: 'Volvo', logo: 'VOLVO' },
  { name: 'Audi', logo: 'AUDI' },
  { name: 'Acura', logo: 'ACURA' },
  { name: 'Tesla', logo: 'TESLA' },
];

const BrandsSection = () => {
  return (
    <section className="py-12 bg-background border-y border-border">
      <div className="luxury-container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-16"
        >
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-2xl md:text-3xl font-display font-bold text-muted-foreground/40 hover:text-foreground transition-colors cursor-pointer"
            >
              {brand.logo}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandsSection;
