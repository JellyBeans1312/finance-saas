'use client'
import { Suspense } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useNewCategory } from '@/features/categories/hooks/use-new-category';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useBulkDeleteCategories } from '@/features/categories/api/use-bulk-delete-categories';
import CategoriesPageSkeleton from './loading';

import { 
    Card,
    CardContent,
    CardHeader, 
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from '@/components/DataTable';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryCard } from '@/components/category-card';

import { useMediaQuery } from '@/hooks/use-media-query';

const LoadingSkeleton = () => (
    <div className='space-y-4'>
        {[1,2,3].map((i) => (
            <Card key={i}>
                <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[120px]" />
                                <Skeleton className="h-3 w-[80px]" />
                            </div>
                        </div>
                        <Skeleton className="h-6 w-[80px]" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

const CategoriesPage = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const newCategory = useNewCategory();
    const deleteCategories = useBulkDeleteCategories()
    const categoriesQuery = useGetCategories();
    const categories = categoriesQuery.data || [];

    const isDisabled = 
    categoriesQuery.isLoading ||
    deleteCategories.isPending;

    return (
        <Suspense fallback={<CategoriesPageSkeleton />}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24"
            >
                <Card className="border-none drop-shadow-sm">
                    <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                        <div className="flex items-center justify-between w-full">
                            <CardTitle className='text-xl line-clamp-1'>
                                Categories
                            </CardTitle>
                            <Button 
                                size={isMobile ? 'icon' : 'sm'} 
                                onClick={newCategory.onOpen}
                            >
                                <Plus className='size-4' />
                                {!isMobile && <span className="ml-2">Add New</span>}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <AnimatePresence mode="wait">
                            {isMobile ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4"
                                >
                                    {categories.map((category: any) => (
                                        <CategoryCard 
                                            key={category.id} 
                                            category={category}
                                            onEdit={() => {}}
                                            onDelete={(id) => deleteCategories.mutate({ ids: [id] })}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <DataTable 
                                        columns={columns} 
                                        data={categories} 
                                        filterKey='name'
                                        onDelete={(row) => {
                                            const ids = row.map((r) => r.original.id)
                                            deleteCategories.mutate({ ids }) 
                                        }}
                                        disabled={isDisabled}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </motion.div>
        </Suspense>
    );
};

export default CategoriesPage