import { useState } from 'react';
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

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed((prev) => !prev)}
                mobileOpen={sidebarMobileOpen}
                onMobileClose={() => setSidebarMobileOpen(false)}
            />

            {/* Main content */}
            <div
                className={cn(
                    'min-h-screen transition-[margin] duration-300 ease-in-out',
                    sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64',
                )}
            >
                {/* Top bar: mobile menu + optional title */}
                <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:px-6">
                    <button
                        type="button"
                        onClick={() => setSidebarMobileOpen(true)}
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--admin-dark-primary)] lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    {title && (
                        <h1 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h1>
                    )}
                </header>

                <main className="p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}
