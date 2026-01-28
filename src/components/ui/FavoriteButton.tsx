import { Heart, Loader2 } from 'lucide-react';
import { Button } from './button';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  carId: string;
  variant?: 'icon' | 'button';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const FavoriteButton = ({ 
  carId, 
  variant = 'icon', 
  size = 'md',
  className 
}: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite, isPending } = useFavorites();
  const isActive = isFavorite(carId);

  if (variant === 'button') {
    return (
      <Button
        variant={isActive ? 'default' : 'outline'}
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(carId);
        }}
        disabled={isPending}
        className={cn('gap-2', className)}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Heart className={cn('w-4 h-4', isActive && 'fill-current')} />
        )}
        {isActive ? 'Saved' : 'Save'}
      </Button>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(carId);
      }}
      disabled={isPending}
      className={cn(
        sizeClasses[size],
        'rounded-full flex items-center justify-center transition-all duration-200',
        isActive 
          ? 'bg-primary text-primary-foreground shadow-lg' 
          : 'bg-background/80 backdrop-blur-sm text-muted-foreground hover:bg-background hover:text-primary shadow-md',
        isPending && 'opacity-50 cursor-not-allowed',
        className
      )}
      title={isActive ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isPending ? (
        <Loader2 className={cn(iconSizes[size], 'animate-spin')} />
      ) : (
        <Heart className={cn(iconSizes[size], isActive && 'fill-current')} />
      )}
    </button>
  );
};

export default FavoriteButton;
