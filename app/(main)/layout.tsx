import { SidebarProvider } from "@/components/ui/sidebar";
import { NavigationSidebar } from "@/components/layout/navigation-sidebar";
import { QueryProvider } from "@/providers/QueryProvider";
import { SheetProvider } from "@/providers/SheetProvider";
import { Toaster } from "@/components/ui/sonner";
import { MobileNav } from "@/components/mobile-nav";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <div className="hidden md:block w-64 flex-shrink-0 h-full">
          <NavigationSidebar />
        </div>
        <main className="flex-1 w-full h-full overflow-auto">
          <QueryProvider>
            <SheetProvider />
            <Toaster />
            <div className="min-h-screen w-full pb-16 md:pb-0">
              {children}
            </div>
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
              <MobileNav />
            </div>
          </QueryProvider>
        </main>
      </div>
    </SidebarProvider>
  );
} 