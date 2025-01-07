import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureListProps {
    features: string[];
    variant?: "check" | "chevron";
    className?: string;
}

export const FeatureList = ({ features, variant = 'check', className }: FeatureListProps) => {
    const Icon = variant === 'check' ? CheckCircle2 : ChevronRight;
    const iconClass = variant === 'check' ? 'fill-primary text-white' : 'text-primary';

    return (
        <ul className={cn('space-y-2', className)}>
            {features.map((feature, index) => (
                <li key={index} className="text-sm flex items-center gap-x-2">
                    <Icon className={cn('size-4', iconClass)} />
                    <span className="text-muted-foreground">{feature}</span>
                </li>
            ))}
        </ul>
    );
};