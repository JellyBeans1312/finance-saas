'use client'

import { 
    Card, 
    CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Plus } from 'lucide-react';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const CategoryCard = ({ category, onEdit, onDelete }: { 
    category: any, 
    onEdit: (id: string) => void,
    onDelete: (id: string) => void 
}) => {
    const getTypeColor = (type: string) => {
        return type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500';
    };

    const IconComponent = category.icon || Plus;

    return (
        <Card className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getTypeColor(category.type)}`}>
                            <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {category.description}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Badge 
                            variant="outline" 
                            className={getTypeColor(category.type)}
                        >
                            {category.type}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 ml-2">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onEdit(category.id)}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => onDelete(category.id)}
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};