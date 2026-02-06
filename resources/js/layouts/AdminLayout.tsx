import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
    children: React.ReactNode;
    /** Optional header title for the main content area */
    title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

    // Close mobile sidebar on route change or resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarMobileOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex min-h-screen w-full bg-gray-50">
            <AdminSidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed((prev) => !prev)}
                mobileOpen={sidebarMobileOpen}
                onMobileClose={() => setSidebarMobileOpen(false)}
            />

            {/* Main content wrapper */}
            <div
                className={cn(
                    'flex min-h-screen w-full min-w-0 flex-1 flex-col transition-[margin] duration-300 ease-in-out',
                    sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64',
                )}
            >
                {/* Top bar: mobile menu + optional title */}
                <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-3 shadow-sm sm:h-16 sm:gap-4 sm:px-4 lg:px-6">
                    <button
                        type="button"
                        onClick={() => setSidebarMobileOpen(true)}
                        className="shrink-0 rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--admin-dark-primary)] sm:p-2 lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                    {title && (
                        <h1 className="min-w-0 truncate text-base font-semibold text-gray-900 sm:text-lg">
                            {title}
                        </h1>
                    )}
                </header>

                <main className="min-w-0 flex-1 overflow-x-auto p-3 sm:p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}
