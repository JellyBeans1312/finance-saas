import { SidebarProvider } from "@/components/ui/sidebar";
import { NavigationSidebar } from "@/components/layout/navigation-sidebar";
import { QueryProvider } from "@/providers/QueryProvider";
import { SheetProvider } from "@/providers/SheetProvider";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <NavigationSidebar />
        <div className="flex-1 overflow-auto">
          <QueryProvider>
            <SheetProvider />
            <Toaster />
            {children}
          </QueryProvider>
        </div>
      </div>
    </SidebarProvider>
  );
} 