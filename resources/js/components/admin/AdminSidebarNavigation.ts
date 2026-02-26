import {
    LayoutDashboard,
    ShoppingCart,
    Calendar,
    CreditCard,
    Wallet,
    Package,
    FolderOpen,
    Image,
    PackageCheck,
    MapPin,
    Truck,
    Milk,
    Megaphone,
    Ticket,
    LayoutGrid,
    Bell,
    BarChart3,
    FileText,
    Award,
    UserPlus,
    Users,
    Building2,
    Heart,
    ListChecks,
    type LucideIcon,
} from 'lucide-react';

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

export interface NavGroup {
    label: string;
    items: NavItem[];
}

export const navGroups: NavGroup[] = [
    {
        label: 'Overview',
        items: [{ label: 'Dashboard', href: '/admin', icon: LayoutDashboard }],
    },
    {
        label: 'Sales',
        items: [
            { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
            { label: 'Subscriptions', href: '/admin/subscriptions', icon: Calendar },
            { label: 'Subscription Plans', href: '/admin/subscription-plans', icon: ListChecks },
            { label: 'Payments', href: '/admin/payments', icon: CreditCard },
            { label: 'Wallets', href: '/admin/wallets', icon: Wallet },
        ],
    },
    {
        label: 'Catalog',
        items: [
            { label: 'Products', href: '/admin/products', icon: Package },
            { label: 'Categories', href: '/admin/categories', icon: FolderOpen },
            { label: 'Collections', href: '/admin/collections', icon: Image },
        ],
    },
    {
        label: 'Logistics',
        items: [
            { label: 'Hubs', href: '/admin/hubs', icon: Building2 },
            { label: 'Routes', href: '/admin/routes', icon: MapPin },
            { label: 'Deliveries', href: '/admin/deliveries', icon: PackageCheck },
            { label: 'Zones', href: '/admin/zones', icon: MapPin },
            { label: 'Drivers', href: '/admin/drivers', icon: Truck },
            { label: 'Bottles', href: '/admin/bottles', icon: Milk },
        ],
    },
    {
        label: 'Marketing',
        items: [
            { label: 'Campaigns', href: '/admin/campaigns', icon: Megaphone },
            { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
            { label: 'Banners', href: '/admin/banners', icon: LayoutGrid },
            { label: 'Notifications', href: '/admin/notifications', icon: Bell },
        ],
    },
    {
        label: 'Growth',
        items: [
            { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
            { label: 'Wishlist Insights', href: '/admin/wishlist-insights', icon: Heart },
            { label: 'Reports', href: '/admin/reports', icon: FileText },
            { label: 'Loyalty', href: '/admin/loyalty', icon: Award },
            { label: 'Referrals', href: '/admin/referrals', icon: UserPlus },
        ],
    },
    {
        label: 'Access & Settings',
        items: [
            { label: 'Users', href: '/admin/users', icon: Users },
            { label: 'Activity Logs', href: '/admin/activity-logs', icon: FileText },
        ],
    },
];
