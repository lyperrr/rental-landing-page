import { Star, User } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    title: string | null;
    comment: string | null;
    created_at: string;
    profiles?: {
      full_name: string | null;
      avatar_url: string | null;
    } | null;
  };
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {review.profiles?.avatar_url ? (
              <img
                src={review.profiles.avatar_url}
                alt={review.profiles.full_name || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-foreground truncate">
                {review.profiles?.full_name || 'Anonymous User'}
              </h4>
              <span className="text-xs text-muted-foreground">
                {format(new Date(review.created_at), 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating
                      ? 'text-luxury-gold fill-luxury-gold'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            {review.title && (
              <h5 className="font-medium text-foreground mb-2">{review.title}</h5>
            )}
            {review.comment && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {review.comment}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
