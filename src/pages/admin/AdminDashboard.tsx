import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { 
  Car, Users, Calendar, DollarSign, TrendingUp, ArrowUpRight,
  ArrowDownRight, BarChart3, Settings, LogOut, Menu, X, Activity, Clock
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const AdminDashboard = () => {
  const { signOut, isAdmin, isStaff, userRole } = useAuth();
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
      const activeBookings = bookingsRes.data?.filter(b => b.status === 'active').length || 0;
      const confirmedBookings = bookingsRes.data?.filter(b => b.status === 'confirmed').length || 0;
      const cancelledBookings = bookingsRes.data?.filter(b => b.status === 'cancelled').length || 0;
      const paidBookings = bookingsRes.data?.filter(b => b.payment_status === 'paid').length || 0;

      // Generate revenue data for the last 7 days
      const revenueData = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayRevenue = bookingsRes.data?.filter(b => 
          format(new Date(b.created_at), 'yyyy-MM-dd') === dateStr
        ).reduce((sum, b) => sum + Number(b.total_price), 0) || 0;
        
        revenueData.push({
          date: format(date, 'EEE'),
          revenue: dayRevenue,
          bookings: bookingsRes.data?.filter(b => 
            format(new Date(b.created_at), 'yyyy-MM-dd') === dateStr
          ).length || 0,
        });
      }

      // Booking status distribution
      const bookingStatusData = [
        { name: 'Pending', value: pendingBookings, color: '#f59e0b' },
        { name: 'Confirmed', value: confirmedBookings, color: '#3b82f6' },
        { name: 'Active', value: activeBookings, color: '#10b981' },
        { name: 'Completed', value: completedBookings, color: '#6b7280' },
        { name: 'Cancelled', value: cancelledBookings, color: '#ef4444' },
      ].filter(item => item.value > 0);

      // Car categories distribution
      const categories = carsRes.data?.reduce((acc, car) => {
        acc[car.category] = (acc[car.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const categoryData = Object.entries(categories).map(([name, value]) => ({
        name,
        value,
      }));

      return {
        totalCars: carsRes.count || 0,
        totalBookings: bookingsRes.data?.length || 0,
        totalUsers: usersRes.count || 0,
        totalRevenue,
        completedBookings,
        pendingBookings,
        activeBookings,
        paidBookings,
        revenueData,
        bookingStatusData,
        categoryData,
        availableCars: carsRes.data?.filter(c => c.available).length || 0,
      };
    },
  });

  const { data: recentBookings } = useQuery({
    queryKey: ['recent-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          cars (brand, name),
          profiles (full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  // Navigation items - staff has limited access
  const navItems = [
    { name: 'Overview', path: '/admin', icon: BarChart3, adminOnly: false },
    { name: 'Cars', path: '/admin/cars', icon: Car, adminOnly: false },
    { name: 'Bookings', path: '/admin/bookings', icon: Calendar, adminOnly: false },
    { name: 'Users', path: '/admin/users', icon: Users, adminOnly: true },
    { name: 'Messages', path: '/admin/messages', icon: Activity, adminOnly: false },
  ].filter(item => !item.adminOnly || isAdmin);

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
      subtitle: `${stats?.availableCars || 0} available`,
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

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#6b7280', '#ef4444'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-600';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600';
      case 'active': return 'bg-blue-500/10 text-blue-600';
      case 'completed': return 'bg-muted text-muted-foreground';
      case 'cancelled': return 'bg-red-500/10 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

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
            <div className="mt-3">
              <Badge variant={isAdmin ? 'default' : 'secondary'} className="text-xs">
                {userRole === 'admin' ? 'Administrator' : 'Staff'}
              </Badge>
            </div>
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
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-40">
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
              {isAdmin ? 'Admin Dashboard' : 'Staff Dashboard'}
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
                    {stat.subtitle && (
                      <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Revenue & Bookings (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.revenueData || []}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" className="text-muted-foreground" fontSize={12} />
                      <YAxis className="text-muted-foreground" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number, name: string) => [
                          name === 'revenue' ? `$${value}` : value,
                          name === 'revenue' ? 'Revenue' : 'Bookings'
                        ]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--primary))" 
                        fill="url(#colorRevenue)" 
                        strokeWidth={2}
                      />
                      <Bar dataKey="bookings" fill="hsl(var(--accent))" opacity={0.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Booking Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Booking Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats?.bookingStatusData || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {(stats?.bookingStatusData || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second Row - Fleet Distribution & Recent Bookings */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Fleet Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" />
                  Fleet by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.categoryData || []} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" fontSize={12} />
                      <YAxis dataKey="name" type="category" fontSize={12} width={80} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Bookings */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Bookings
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate('/admin/bookings')}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings?.map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {booking.cars?.brand} {booking.cars?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.profiles?.full_name || booking.profiles?.email || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${booking.total_price}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {!recentBookings?.length && (
                    <p className="text-center text-muted-foreground py-8">No bookings yet</p>
                  )}
                </div>
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