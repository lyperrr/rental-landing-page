import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Car, Calendar, User, LogOut, Settings, History, Heart,
  CreditCard, Bell, ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: bookings } = useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          cars (*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-600';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600';
      case 'active': return 'bg-blue-500/10 text-blue-600';
      case 'completed': return 'bg-gray-500/10 text-gray-600';
      case 'cancelled': return 'bg-red-500/10 text-red-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <Header />
      <main className="pt-24 pb-20">
        <div className="luxury-container">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <User className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold">
                      {profile?.full_name || 'User'}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    {isAdmin && (
                      <Badge className="mt-2 bg-primary">Admin</Badge>
                    )}
                  </div>
                  
                  <nav className="space-y-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium"
                    >
                      <Calendar className="w-5 h-5" />
                      My Bookings
                    </Link>
                    <Link
                      to="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      Settings
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <Car className="w-5 h-5" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 w-full transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Stats */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Bookings</p>
                        <p className="text-2xl font-bold">{bookings?.length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <History className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Active Rentals</p>
                        <p className="text-2xl font-bold">
                          {bookings?.filter(b => b.status === 'active').length || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                        <p className="text-2xl font-bold">
                          ${bookings?.reduce((sum, b) => sum + Number(b.total_price), 0).toFixed(0) || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bookings List */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings && bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking: any) => (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-4 p-4 bg-muted rounded-lg"
                        >
                          <div className="w-16 h-16 rounded-lg bg-muted-foreground/10 overflow-hidden flex-shrink-0">
                            {booking.cars?.image_url ? (
                              <img 
                                src={booking.cars.image_url} 
                                alt={booking.cars.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Car className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground truncate">
                              {booking.cars?.brand} {booking.cars?.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(booking.pickup_date), 'MMM d')} - {format(new Date(booking.return_date), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                            <p className="text-sm font-semibold mt-1">${booking.total_price}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">No bookings yet</h3>
                      <p className="text-muted-foreground mb-4">Start exploring our fleet to make your first booking</p>
                      <Link to="/fleet">
                        <Button>Browse Fleet</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
