import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const useFavorites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('favorites')
        .select('car_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data?.map(f => f.car_id) || [];
    },
    enabled: !!user?.id,
  });

  const { data: favoritesCars = [], isLoading: isLoadingCars } = useQuery({
    queryKey: ['favorites-cars', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          car_id,
          created_at,
          cars (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const addFavorite = useMutation({
    mutationFn: async (carId: string) => {
      if (!user?.id) throw new Error('Must be logged in');
      
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, car_id: carId });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favorites-cars'] });
      toast.success('Added to wishlist');
    },
    onError: (error: any) => {
      if (error.message?.includes('duplicate')) {
        toast.info('Already in wishlist');
      } else {
        toast.error('Failed to add to wishlist');
      }
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (carId: string) => {
      if (!user?.id) throw new Error('Must be logged in');
      
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('car_id', carId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favorites-cars'] });
      toast.success('Removed from wishlist');
    },
    onError: () => {
      toast.error('Failed to remove from wishlist');
    },
  });

  const toggleFavorite = (carId: string) => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    
    if (favorites.includes(carId)) {
      removeFavorite.mutate(carId);
    } else {
      addFavorite.mutate(carId);
    }
  };

  const isFavorite = (carId: string) => favorites.includes(carId);

  return {
    favorites,
    favoritesCars,
    isLoading,
    isLoadingCars,
    toggleFavorite,
    isFavorite,
    addFavorite: addFavorite.mutate,
    removeFavorite: removeFavorite.mutate,
    isPending: addFavorite.isPending || removeFavorite.isPending,
  };
};
