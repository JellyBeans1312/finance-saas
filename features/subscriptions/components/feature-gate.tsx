import { AppFeatures } from '@/db/schema';
import { useFeatureAccess } from '@/hooks/use-feature-access';

interface FeatureGateProps {
    feature: AppFeatures;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
    const { hasFeature } = useFeatureAccess();

    if (!hasFeature(feature)) {
        return fallback || null;
    }

    return children;
}