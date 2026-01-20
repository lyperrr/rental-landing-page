import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { 
  Calendar, ArrowLeft, Search, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 10;

const AdminBookings = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ['admin-bookings', statusFilter, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          cars (*),
          profiles (*)
        `, { count: 'exact' });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled');
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { bookings: data, total: count || 0 };
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Booking status updated');
    },
    onError: (error) => {
      toast.error('Failed to update booking: ' + error.message);
    },
  });

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

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/10 text-green-600';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600';
      case 'failed': return 'bg-red-500/10 text-red-600';
      case 'refunded': return 'bg-gray-500/10 text-gray-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  const totalPages = Math.ceil((bookingsData?.total || 0) / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-muted">
      <div className="p-6 lg:p-8">
        <Link to="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Booking Management
            </h1>
            <p className="text-muted-foreground">
              View and manage all reservations
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <Select value={statusFilter} onValueChange={(v) => {
            setStatusFilter(v);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Car</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Dates</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Total</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Payment</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingsData?.bookings?.map((booking: any) => (
                    <tr key={booking.id} className="border-t border-border hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {booking.profiles?.full_name || 'Unknown'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.profiles?.email}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-foreground">
                          {booking.cars?.brand} {booking.cars?.name}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-foreground">
                          {format(new Date(booking.pickup_date), 'MMM d')} - {format(new Date(booking.return_date), 'MMM d, yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground">{booking.total_days} days</p>
                      </td>
                      <td className="p-4 font-semibold">${booking.total_price}</td>
                      <td className="p-4">
                        <Badge className={getPaymentColor(booking.payment_status)}>
                          {booking.payment_status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          {booking.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => updateStatusMutation.mutate({ id: booking.id, status: 'confirmed' })}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => updateStatusMutation.mutate({ id: booking.id, status: 'cancelled' })}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateStatusMutation.mutate({ id: booking.id, status: 'active' })}
                            >
                              Start Rental
                            </Button>
                          )}
                          {booking.status === 'active' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateStatusMutation.mutate({ id: booking.id, status: 'completed' })}
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminBookings;
