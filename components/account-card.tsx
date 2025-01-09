import { Button } from "./ui/button";
import { 
    Card, 
    CardContent 
} from "./ui/card";
import { 
    ChevronRight, 
    MoreVertical 
} from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "./ui/dropdown-menu";
// TODO: Add Account type
export const AccountCard = ({ account, onEdit, onDelete }: { 
    account: any, 
    onEdit: (id: string) => void,
    onDelete: (id: string) => void 
}) => (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
        <CardContent className="p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div>
                        <p className="font-medium">{account.name}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(account.id)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => onDelete(account.id)}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
            </div>
        </CardContent>
    </Card>
);