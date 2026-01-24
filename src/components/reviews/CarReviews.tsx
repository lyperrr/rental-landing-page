import { useQuery } from '@tanstack/react-query';
import { Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import ReviewCard from './ReviewCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ReviewWithProfile {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
  user_id: string;
  car_id: string;
  booking_id: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface CarReviewsProps {
  carId: string;
}

const CarReviews = ({ carId }: CarReviewsProps) => {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['car-reviews', carId],
    queryFn: async () => {
      // First fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('car_id', carId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (reviewsError) throw reviewsError;
      if (!reviewsData) return [];

      // Then fetch profiles for these reviews
      const userIds = [...new Set(reviewsData.map(r => r.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      // Map profiles to reviews
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      
      return reviewsData.map(review => ({
        ...review,
        profiles: profilesMap.get(review.user_id) || null
      })) as ReviewWithProfile[];
    },
  });

  const averageRating = reviews?.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const ratingDistribution = reviews?.length
    ? [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: reviews.filter((r) => r.rating === rating).length,
        percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100,
      }))
    : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-20 h-20 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!reviews?.length) {
    return (
      <div className="text-center py-12 bg-muted/50 rounded-xl">
        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display text-lg font-semibold mb-2">No Reviews Yet</h3>
        <p className="text-muted-foreground">
          Be the first to review this car after your rental!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="flex flex-col sm:flex-row gap-8 p-6 bg-muted/50 rounded-xl">
        <div className="text-center sm:text-left">
          <div className="text-5xl font-bold text-foreground mb-2">{averageRating}</div>
          <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(Number(averageRating))
                    ? 'text-luxury-gold fill-luxury-gold'
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex-1 space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="w-3 text-sm text-muted-foreground">{rating}</span>
              <Star className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, delay: 0.1 * rating }}
                  className="h-full bg-luxury-gold rounded-full"
                />
              </div>
              <span className="w-8 text-sm text-muted-foreground text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid gap-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <ReviewCard review={review} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CarReviews;
