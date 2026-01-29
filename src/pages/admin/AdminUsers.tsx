import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowLeft, Search, ChevronLeft, ChevronRight,
  Shield, User, UserCog
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

const ITEMS_PER_PAGE = 10;

interface UserWithRoles {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  user_roles: { role: AppRole }[];
}

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [newRole, setNewRole] = useState<AppRole | ''>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['admin-users', searchQuery, currentPage],
    queryFn: async () => {
      // First get profiles
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data: profiles, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Then get roles for these users
      const userIds = profiles?.map(p => p.id) || [];
      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      // Combine profiles with roles
      const usersWithRoles: UserWithRoles[] = (profiles || []).map(profile => ({
        ...profile,
        user_roles: (roles || [])
          .filter(r => r.user_id === profile.id)
          .map(r => ({ role: r.role }))
      }));

      return { users: usersWithRoles, total: count || 0 };
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      // First, delete existing roles for this user
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      
      if (deleteError) throw deleteError;

      // Then insert the new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });
      
      if (insertError) throw insertError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated successfully');
      setIsDialogOpen(false);
      setSelectedUser(null);
      setNewRole('');
    },
    onError: (error) => {
      toast.error('Failed to update role: ' + error.message);
    },
  });

  const getUserRole = (user: UserWithRoles): AppRole => {
    if (user.user_roles?.some(r => r.role === 'admin')) return 'admin';
    if (user.user_roles?.some(r => r.role === 'staff')) return 'staff';
    return 'user';
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive text-destructive-foreground';
      case 'staff':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-5 h-5 text-destructive" />;
      case 'staff':
        return <UserCog className="w-5 h-5 text-primary" />;
      default:
        return <User className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const handleEditRole = (user: UserWithRoles) => {
    setSelectedUser(user);
    setNewRole(getUserRole(user));
    setIsDialogOpen(true);
  };

  const handleSaveRole = () => {
    if (selectedUser && newRole) {
      updateRoleMutation.mutate({ userId: selectedUser.id, role: newRole });
    }
  };

  const totalPages = Math.ceil((usersData?.total || 0) / ITEMS_PER_PAGE);

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
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage user accounts and assign roles
            </p>
          </div>
        </div>

        {/* Role Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Badge className="bg-destructive text-destructive-foreground">Admin</Badge>
            <span className="text-muted-foreground">Full access to all features</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Badge className="bg-primary text-primary-foreground">Staff</Badge>
            <span className="text-muted-foreground">Manage bookings, cars, messages</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Badge className="bg-secondary text-secondary-foreground">User</Badge>
            <span className="text-muted-foreground">Regular customer</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground">User</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Phone</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Joined</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        Loading users...
                      </td>
                    </tr>
                  ) : usersData?.users?.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    usersData?.users?.map((user) => {
                      const role = getUserRole(user);
                      return (
                        <tr key={user.id} className="border-t border-border hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                {getRoleIcon(role)}
                              </div>
                              <p className="font-medium text-foreground">
                                {user.full_name || 'No name'}
                              </p>
                            </div>
                          </td>
                          <td className="p-4 text-muted-foreground">{user.email}</td>
                          <td className="p-4 text-muted-foreground">{user.phone || '-'}</td>
                          <td className="p-4 text-muted-foreground">
                            {format(new Date(user.created_at), 'MMM d, yyyy')}
                          </td>
                          <td className="p-4">
                            <Badge className={getRoleBadgeVariant(role)}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-end">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditRole(user)}
                              >
                                Change Role
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
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

      {/* Edit Role Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.full_name || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Select Role</label>
            <Select value={newRole} onValueChange={(value) => setNewRole(value as AppRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>User</span>
                    <span className="text-muted-foreground text-xs">- Regular customer</span>
                  </div>
                </SelectItem>
                <SelectItem value="staff">
                  <div className="flex items-center gap-2">
                    <UserCog className="w-4 h-4" />
                    <span>Staff</span>
                    <span className="text-muted-foreground text-xs">- Manage operations</span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                    <span className="text-muted-foreground text-xs">- Full access</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveRole} 
              disabled={!newRole || updateRoleMutation.isPending}
            >
              {updateRoleMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
