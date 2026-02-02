import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    ChevronLeft,
    ChevronRight,
    LogOut,
    MapPin,
    Truck,
    Users,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Zones', href: '/admin/zones', icon: MapPin },
    { label: 'Drivers', href: '/admin/drivers', icon: Truck },
];

interface AdminSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
    mobileOpen: boolean;
    onMobileClose: () => void;
}

export default function AdminSidebar({
    collapsed,
    onToggle,
    mobileOpen,
    onMobileClose,
}: AdminSidebarProps) {
    const { url } = usePage();

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close menu"
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onMobileClose}
                />
            )}

            <aside
                className={cn(
                    'fixed left-0 top-0 z-50 flex h-screen flex-col bg-[var(--admin-dark-primary)] text-white transition-all duration-300 ease-in-out',
                    'lg:z-30',
                    collapsed ? 'w-[72px] lg:w-[72px]' : 'w-64 lg:w-64',
                    mobileOpen
                        ? 'translate-x-0 shadow-xl'
                        : '-translate-x-full lg:translate-x-0',
                )}
            >
                {/* Logo / brand */}
                <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-white/10 px-3">
                    {!collapsed && (
                        <span className="truncate text-lg font-semibold">
                            Admin
                        </span>
                    )}
                    <div className="flex shrink-0 items-center gap-1">
                        <button
                            type="button"
                            onClick={onToggle}
                            className="hidden rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)] lg:block"
                            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {collapsed ? (
                                <ChevronRight className="h-5 w-5" />
                            ) : (
                                <ChevronLeft className="h-5 w-5" />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onMobileClose}
                            className="rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white focus:outline-none lg:hidden"
                            aria-label="Close menu"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                    {navItems.map((item) => {
                        const isActive =
                            url === item.href ||
                            (item.href !== '/admin' && url.startsWith(item.href));
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onMobileClose}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-white/15 text-white'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white',
                                )}
                            >
                                <Icon
                                    className="h-5 w-5 shrink-0"
                                    aria-hidden
                                />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="shrink-0 border-t border-white/10 p-3">
                    <Link
                        href="/admin/logout"
                        method="post"
                        as="button"
                        onClick={onMobileClose}
                        className={cn(
                            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white',
                        )}
                    >
                        <LogOut className="h-5 w-5 shrink-0" aria-hidden />
                        {!collapsed && <span>Log out</span>}
                    </Link>
                </div>
            </aside>
        </>
    );
}
