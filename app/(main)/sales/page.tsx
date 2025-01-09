import { Suspense } from 'react';
import { SalesView } from '@/components/sales/sales-view';
import SalesPageSkeleton from './loading';

const SalesPage = () => {
  return (
    <Suspense fallback={<SalesPageSkeleton />}>
      <SalesView />
    </Suspense>
  );
};

export default SalesPage;