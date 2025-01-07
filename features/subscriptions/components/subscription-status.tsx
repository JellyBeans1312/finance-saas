import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AppFeatures } from '@/db/schema';
import { useFeatureAccess } from '@/hooks/use-feature-access';
import { Subscription } from '../types';

interface SubscriptionStatusProps {
    subscription: Subscription | null;
    className?: string;
};

export const SubscriptionStatus = ({ subscription, className }: SubscriptionStatusProps) => {
    const { hasFeature } = useFeatureAccess();

    return (
        <div className={cn('space-y-1', className)}>
            <p className={cn(
                'text-sm',
                !subscription && 'text-muted-foreground'
            )}>
                {subscription 
                    ? `Subscription ${subscription.status}`
                    : "No Active Subscription"
                }
            </p>
            <div className='flex gap-x-2'>
                {Object.values(AppFeatures).map(feature => (
                    hasFeature(feature) && (
                        <Badge 
                            key={feature}
                            variant="secondary"
                        >
                            {feature.toLowerCase()}
                        </Badge>
                    )
                ))}
            </div>
        </div>
    );
}