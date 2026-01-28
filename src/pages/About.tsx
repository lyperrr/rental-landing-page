import { motion } from 'framer-motion';
import { 
  Target, Heart, Users, Award, Shield, Clock, 
  CheckCircle, Star, Building, Car, Sparkles
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import testimonial1 from '@/assets/testimonial-1.jpg';
import testimonial2 from '@/assets/testimonial-2.jpg';

const teamMembers = [
  {
    name: 'James Austin',
    role: 'Founder & CEO',
    image: testimonial1,
    bio: 'With over 20 years in the automotive industry, James founded LuxeRent with a vision to redefine luxury car rentals.',
  },
  {
    name: 'Sarah Mitchell',
    role: 'Operations Director',
    image: testimonial2,
    bio: 'Sarah ensures seamless operations and exceptional customer experiences across all our locations.',
  },
  {
    name: 'Michael Chen',
    role: 'Fleet Manager',
    image: testimonial1,
    bio: 'Michael curates our premium fleet, ensuring every vehicle meets our exacting standards of excellence.',
  },
  {
    name: 'Emma Thompson',
    role: 'Customer Success Lead',
    image: testimonial2,
    bio: 'Emma leads our dedicated team in delivering personalized service to every client.',
  },
];

const values = [
  {
    icon: Shield,
    title: 'Trust & Safety',
    description: 'Every vehicle undergoes rigorous safety inspections. Your safety is our top priority.',
  },
  {
    icon: Star,
    title: 'Excellence',
    description: 'We strive for excellence in every interaction, from booking to return.',
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Our customers are at the heart of everything we do. Your satisfaction drives us.',
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    description: 'We continuously innovate to provide the best rental experience possible.',
  },
];

const milestones = [
  { year: '2010', title: 'Founded', description: 'LuxeRent was established with just 5 premium vehicles.' },
  { year: '2014', title: 'Expansion', description: 'Opened our second location and grew fleet to 50 cars.' },
  { year: '2018', title: 'National Reach', description: 'Expanded to 5 cities with over 200 vehicles.' },
  { year: '2022', title: 'Digital First', description: 'Launched our modern booking platform.' },
  { year: '2024', title: 'Industry Leader', description: 'Recognized as the premier luxury car rental service.' },
];

const stats = [
  { value: '15K+', label: 'Happy Customers' },
  { value: '500+', label: 'Premium Vehicles' },
  { value: '10+', label: 'Years Experience' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
          <div className="luxury-container relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                About Us
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Driving <span className="text-primary">Excellence</span> Since 2010
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At LuxeRent, we believe that every journey should be extraordinary. 
                We've been providing premium car rental experiences for over a decade, 
                combining luxury vehicles with exceptional service.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="luxury-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20">
          <div className="luxury-container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
                  Our Story
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  A Journey of Passion & Excellence
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    LuxeRent began with a simple vision: to provide an unparalleled luxury car rental 
                    experience that combines premium vehicles with exceptional service. Founded in 2010 
                    by automotive enthusiast James Austin, we started with just five carefully selected 
                    luxury vehicles.
                  </p>
                  <p>
                    What sets us apart is our unwavering commitment to quality. Every vehicle in our 
                    fleet is meticulously maintained and regularly updated to ensure you experience 
                    the latest in automotive excellence. Our team of dedicated professionals works 
                    tirelessly to make every rental seamless and memorable.
                  </p>
                  <p>
                    Today, with over 500 premium vehicles across multiple locations, we continue to 
                    uphold the same standards that defined us from day one. Whether you're looking 
                    for a sophisticated sedan for business or an exotic sports car for a special 
                    occasion, LuxeRent delivers an experience beyond compare.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden">
                  <img
                    src={testimonial1}
                    alt="Our Story"
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3 text-white">
                      <Building className="w-6 h-6" />
                      <span className="font-display text-lg font-semibold">
                        Headquarters - Auckland, NZ
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-2xl -z-10" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/5 rounded-full -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-muted/30">
          <div className="luxury-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
                Our Journey
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Milestones & Achievements
              </h2>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative md:w-1/2 ${
                      index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'
                    }`}
                  >
                    <div className="hidden md:block absolute top-2 w-4 h-4 rounded-full bg-primary border-4 border-background" 
                      style={{ [index % 2 === 0 ? 'right' : 'left']: '-8px' }} 
                    />
                    <Card className="bg-background">
                      <CardContent className="p-6">
                        <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                        <h3 className="font-display text-xl font-semibold text-foreground mt-2 mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="luxury-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
                Our Values
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                What Drives Us Forward
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our core values guide every decision we make and every interaction we have.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full bg-background hover:shadow-lg transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <value.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/30">
          <div className="luxury-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
                Our Team
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet the People Behind LuxeRent
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our passionate team is dedicated to making your rental experience exceptional.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden bg-background group">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6 text-center">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                        {member.name}
                      </h3>
                      <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {member.bio}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="luxury-container">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-primary text-primary-foreground">
                  <CardContent className="p-10">
                    <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mb-6">
                      <Target className="w-8 h-8" />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-4">Our Mission</h3>
                    <p className="opacity-90 leading-relaxed">
                      To provide an unparalleled luxury car rental experience that exceeds 
                      expectations at every touchpoint. We are committed to delivering 
                      exceptional vehicles, personalized service, and seamless convenience 
                      to discerning travelers worldwide.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card className="h-full bg-foreground text-background">
                  <CardContent className="p-10">
                    <div className="w-16 h-16 rounded-2xl bg-background/10 flex items-center justify-center mb-6">
                      <Award className="w-8 h-8" />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-4">Our Vision</h3>
                    <p className="opacity-90 leading-relaxed">
                      To be the world's most trusted and innovative luxury car rental 
                      service, setting new standards in the industry for quality, 
                      sustainability, and customer satisfaction. We envision a future 
                      where every journey is an unforgettable experience.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
          <div className="luxury-container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Car className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Experience Luxury?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Browse our premium fleet and book your next unforgettable journey with LuxeRent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/fleet"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Explore Fleet
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-foreground text-foreground font-semibold rounded-lg hover:bg-foreground hover:text-background transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
