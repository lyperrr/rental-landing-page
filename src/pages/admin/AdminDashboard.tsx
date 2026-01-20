import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { 
  Car, Users, Calendar, DollarSign, TrendingUp, ArrowUpRight,
  ArrowDownRight, BarChart3, Settings, LogOut, Menu, X
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [carsRes, bookingsRes, usersRes] = await Promise.all([
        supabase.from('cars').select('*', { count: 'exact' }),
        supabase.from('bookings').select('*'),
        supabase.from('profiles').select('*', { count: 'exact' }),
      ]);

      const totalRevenue = bookingsRes.data?.reduce((sum, b) => sum + Number(b.total_price), 0) || 0;
      const completedBookings = bookingsRes.data?.filter(b => b.status === 'completed').length || 0;
      const pendingBookings = bookingsRes.data?.filter(b => b.status === 'pending').length || 0;

      return {
        totalCars: carsRes.count || 0,
        totalBookings: bookingsRes.data?.length || 0,
        totalUsers: usersRes.count || 0,
        totalRevenue,
        completedBookings,
        pendingBookings,
      };
    },
  });

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: BarChart3 },
    { name: 'Cars', path: '/admin/cars', icon: Car },
    { name: 'Bookings', path: '/admin/bookings', icon: Calendar },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  // If we're on a sub-route, render the outlet
  if (location.pathname !== '/admin') {
    return <Outlet />;
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      trend: '+12.5%',
      trendUp: true,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: Calendar,
      trend: '+8.2%',
      trendUp: true,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      title: 'Fleet Size',
      value: stats?.totalCars || 0,
      icon: Car,
      trend: '+3',
      trendUp: true,
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      trend: '+24',
      trendUp: true,
      color: 'bg-accent/20 text-accent-foreground',
    },
  ];

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Car className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold">
                Luxe<span className="text-primary">Rent</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
            >
              <Settings className="w-5 h-5" />
              User Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 w-full transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-display font-semibold">Admin Dashboard</span>
          <div className="w-6" />
        </header>

        {/* Content */}
        <main className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your business.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {stat.trend}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/cars')}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">Manage Fleet</h3>
                <p className="text-sm text-muted-foreground mb-4">Add, edit, or remove vehicles from your fleet</p>
                <Button variant="outline" size="sm">
                  View Cars
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/bookings')}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">Pending Bookings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {stats?.pendingBookings || 0} bookings waiting for confirmation
                </p>
                <Button variant="outline" size="sm">
                  View Bookings
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/users')}>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-2">User Management</h3>
                <p className="text-sm text-muted-foreground mb-4">View and manage user accounts</p>
                <Button variant="outline" size="sm">
                  View Users
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
