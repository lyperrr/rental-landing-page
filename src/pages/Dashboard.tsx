import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Car, Calendar, User, LogOut, Settings, History, Star,
  CreditCard, MapPin, ChevronRight, Clock, Phone, Mail,
  Edit2, Camera, CheckCircle, AlertCircle, MessageSquare
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { format } from 'date-fns';
import ReviewForm from '@/components/reviews/ReviewForm';

const Dashboard = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('bookings');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone: '',
    address: '',
  });

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (error) throw error;
      setProfileForm({
        full_name: data.full_name || '',
        phone: data.phone || '',
        address: data.address || '',
      });
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: bookings, refetch: refetchBookings } = useQuery({
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

  const { data: userReviews } = useQuery({
    queryKey: ['user-reviews', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('booking_id')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      return data?.map(r => r.booking_id) || [];
    },
    enabled: !!user?.id,
  });

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const handleUpdateProfile = async () => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profileForm.full_name,
        phone: profileForm.phone,
        address: profileForm.address,
      })
      .eq('id', user.id);

    if (error) {
      toast.error('Failed to update profile');
      return;
    }

    toast.success('Profile updated successfully');
    setIsEditingProfile(false);
    refetchProfile();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'active': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'completed': return 'bg-muted text-muted-foreground';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': 
      case 'completed': 
        return <CheckCircle className="w-4 h-4" />;
      case 'pending': 
        return <Clock className="w-4 h-4" />;
      case 'cancelled': 
        return <AlertCircle className="w-4 h-4" />;
      default: 
        return null;
    }
  };

  const stats = {
    totalBookings: bookings?.length || 0,
    activeRentals: bookings?.filter(b => b.status === 'active').length || 0,
    completedRentals: bookings?.filter(b => b.status === 'completed').length || 0,
    totalSpent: bookings?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0,
  };

  const canReview = (booking: any) => {
    return booking.status === 'completed' && !userReviews?.includes(booking.id);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="pt-24 pb-20">
        <div className="luxury-container">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-muted-foreground">
              Manage your rentals and profile from your personal dashboard.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="relative inline-block mb-4">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {profile?.avatar_url ? (
                          <img 
                            src={profile.avatar_url} 
                            alt={profile.full_name || 'User'} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-primary" />
                        )}
                      </div>
                    </div>
                    <h3 className="font-display text-xl font-semibold">
                      {profile?.full_name || 'User'}
                    </h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    {isAdmin && (
                      <Badge className="mt-2 bg-primary text-primary-foreground">Admin</Badge>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-foreground">{stats.totalBookings}</p>
                      <p className="text-xs text-muted-foreground">Total Trips</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-foreground">${stats.totalSpent.toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                    </div>
                  </div>
                  
                  <nav className="space-y-1">
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-colors ${
                        activeTab === 'bookings' 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Calendar className="w-5 h-5" />
                      My Bookings
                    </button>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-colors ${
                        activeTab === 'profile' 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Settings className="w-5 h-5" />
                      Profile Settings
                    </button>
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
              {/* Stats Cards */}
              <div className="grid sm:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">{stats.totalBookings}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Car className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Active</p>
                        <p className="text-2xl font-bold">{stats.activeRentals}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-2xl font-bold">{stats.completedRentals}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Spent</p>
                        <p className="text-2xl font-bold">${stats.totalSpent.toFixed(0)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>My Bookings</CardTitle>
                      <CardDescription>
                        View and manage all your car rentals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {bookings && bookings.length > 0 ? (
                        <div className="space-y-4">
                          {bookings.map((booking: any, index: number) => (
                            <motion.div
                              key={booking.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                            >
                              <div className="w-full sm:w-24 h-20 rounded-lg bg-background overflow-hidden flex-shrink-0">
                                {booking.cars?.image_url ? (
                                  <img 
                                    src={booking.cars.image_url} 
                                    alt={booking.cars.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Car className="w-8 h-8 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-semibold text-foreground">
                                    {booking.cars?.brand} {booking.cars?.name}
                                  </h4>
                                  <Badge className={getStatusColor(booking.status)}>
                                    <span className="flex items-center gap-1">
                                      {getStatusIcon(booking.status)}
                                      {booking.status}
                                    </span>
                                  </Badge>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {format(new Date(booking.pickup_date), 'MMM d')} - {format(new Date(booking.return_date), 'MMM d, yyyy')}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{booking.total_days} days</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-lg text-primary">
                                    ${Number(booking.total_price).toFixed(0)}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {canReview(booking) && (
                                      <ReviewForm
                                        bookingId={booking.id}
                                        carId={booking.car_id}
                                        userId={user?.id || ''}
                                        onSuccess={() => {
                                          queryClient.invalidateQueries({ queryKey: ['user-reviews'] });
                                        }}
                                        trigger={
                                          <Button variant="outline" size="sm" className="gap-1">
                                            <Star className="w-4 h-4" />
                                            Review
                                          </Button>
                                        }
                                      />
                                    )}
                                    {userReviews?.includes(booking.id) && (
                                      <Badge variant="secondary" className="gap-1">
                                        <MessageSquare className="w-3 h-3" />
                                        Reviewed
                                      </Badge>
                                    )}
                                    <Link to={`/car/${booking.car_id}`}>
                                      <Button variant="ghost" size="sm">
                                        <ChevronRight className="w-4 h-4" />
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                            No bookings yet
                          </h3>
                          <p className="text-muted-foreground mb-6">
                            Start exploring our premium fleet and book your first luxury car
                          </p>
                          <Link to="/fleet">
                            <Button size="lg">Browse Fleet</Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Profile Information</CardTitle>
                          <CardDescription>
                            Update your personal details
                          </CardDescription>
                        </div>
                        {!isEditingProfile && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setIsEditingProfile(true)}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                              Full Name
                            </label>
                            {isEditingProfile ? (
                              <Input
                                value={profileForm.full_name}
                                onChange={(e) => setProfileForm(prev => ({ 
                                  ...prev, 
                                  full_name: e.target.value 
                                }))}
                                placeholder="Enter your full name"
                              />
                            ) : (
                              <p className="text-foreground font-medium">
                                {profile?.full_name || 'Not set'}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                              Email
                            </label>
                            <p className="text-foreground font-medium flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              {user?.email}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                              Phone Number
                            </label>
                            {isEditingProfile ? (
                              <Input
                                value={profileForm.phone}
                                onChange={(e) => setProfileForm(prev => ({ 
                                  ...prev, 
                                  phone: e.target.value 
                                }))}
                                placeholder="Enter your phone number"
                              />
                            ) : (
                              <p className="text-foreground font-medium flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                {profile?.phone || 'Not set'}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                              Address
                            </label>
                            {isEditingProfile ? (
                              <Input
                                value={profileForm.address}
                                onChange={(e) => setProfileForm(prev => ({ 
                                  ...prev, 
                                  address: e.target.value 
                                }))}
                                placeholder="Enter your address"
                              />
                            ) : (
                              <p className="text-foreground font-medium flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                {profile?.address || 'Not set'}
                              </p>
                            )}
                          </div>
                        </div>

                        {isEditingProfile && (
                          <div className="flex gap-3 justify-end pt-4 border-t">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsEditingProfile(false);
                                setProfileForm({
                                  full_name: profile?.full_name || '',
                                  phone: profile?.phone || '',
                                  address: profile?.address || '',
                                });
                              }}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleUpdateProfile}>
                              Save Changes
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Account Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Information</CardTitle>
                      <CardDescription>
                        Your account details and membership
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Member Since
                          </label>
                          <p className="text-foreground font-medium">
                            {profile?.created_at 
                              ? format(new Date(profile.created_at), 'MMMM d, yyyy')
                              : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Account Type
                          </label>
                          <Badge variant={isAdmin ? "default" : "secondary"}>
                            {isAdmin ? 'Administrator' : 'Standard Member'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
