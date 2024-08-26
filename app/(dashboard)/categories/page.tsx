'use client'
import { useNewCategory } from '@/features/categories/hooks/use-new-category';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useBulkDeleteCategories } from '@/features/categories/api/use-bulk-delete-categories';


import { 
    Card,
    CardContent,
    CardHeader, 
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { columns } from './columns';
import { DataTable } from '@/components/DataTable';
import { Skeleton } from '@/components/ui/skeleton';

const CategoriesPage = () => {
    const newCategory = useNewCategory();
    const deleteCategories = useBulkDeleteCategories()
    const categoriesQuery = useGetCategories();
    const categories = categoriesQuery.data || [];

    const isDisabled = 
    categoriesQuery.isLoading ||
    deleteCategories.isPending;

    if(categoriesQuery.isLoading) {
        return (
            <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
                <Card className='border-none drop-shadow-sm'>
                    <CardHeader>
                        <Skeleton className='h-8 w-48'/>
                            <CardContent>
                                <div className="h-[500px] w-full flex items-center justify-center">
                                    <Loader2  className='size-8 text-slate-300 animate-spin'/>
                                </div>
                            </CardContent>
                    </CardHeader>
                </Card>
            </div>
        )
    }    
    return ( 
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>
                        Categories Page
                    </CardTitle>
                        <Button size='sm' onClick={newCategory.onOpen}>
                            <Plus className='size-4 mr-2'/>
                            Add New
                        </Button>
                </CardHeader>
                <CardContent>
                    <DataTable 
                        columns={columns} 
                        data={categories} 
                        filterKey={'name'}
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id)
                            deleteCategories.mutate({ ids }) 
                        }} 
                        disabled={isDisabled} /> 
                </CardContent>
            </Card>
        </div>
    );
};

export default CategoriesPage