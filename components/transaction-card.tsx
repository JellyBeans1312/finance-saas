import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem,
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface TransactionCardProps {
    transaction: any;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onCategoryClick: (id: string, categoryId: string | null) => void;
    onAccountClick: (id: string) => void;
}

export const TransactionCard = ({
    transaction,
    onEdit,
    onDelete,
    onCategoryClick,
    onAccountClick
}: TransactionCardProps) => {
    return (
        <Card className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-4">
                {/* Header - Date and Actions */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                        {format(new Date(transaction.date), "MMM dd, yyyy")}
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(transaction.id)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => onDelete(transaction.id)}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Main Content */}
                <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <p className="font-medium">{transaction.payee}</p>
                            <div 
                                className="text-sm text-muted-foreground hover:underline cursor-pointer"
                                onClick={() => onCategoryClick(transaction.id, transaction.categoryId)}
                            >
                                {transaction.category || "Uncategorized"}
                            </div>
                        </div>
                        <Badge
                            variant={transaction.amount < 0 ? "destructive" : "primary"}
                            className="text-xs font-medium px-3.5 py-2.5"
                        >
                            {formatCurrency(transaction.amount)}
                        </Badge>
                    </div>

                    {/* Account and Notes */}
                    <div className="flex justify-between items-center pt-2 text-sm">
                        <div 
                            className="text-muted-foreground hover:underline cursor-pointer"
                            onClick={() => onAccountClick(transaction.accountId)}
                        >
                            {transaction.account}
                        </div>
                        {transaction.notes && (
                            <span className="text-muted-foreground truncate max-w-[200px]">
                                {transaction.notes}
                            </span>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};