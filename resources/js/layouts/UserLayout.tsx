import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { SharedData } from '@/types';
import Footer from '@/components/user/Footer';
import Header from '@/components/user/Header';
import TopBanner from '@/components/user/TopBanner';

interface UserLayoutProps {
    children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
    const { theme } = (usePage().props as unknown as SharedData) ?? {};
    const [showMarquee, setShowMarquee] = useState(true);
    const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

    useEffect(() => {
        if (theme) {
            document.documentElement.style.setProperty('--theme-primary-1', theme.primary_1);
            document.documentElement.style.setProperty('--theme-primary-2', theme.primary_2);
            document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
            document.documentElement.style.setProperty('--theme-tertiary', theme.tertiary);
            document.documentElement.style.setProperty('--theme-primary-1-dark', '#3a9a85');
        }
    }, [theme]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsHeaderScrolled(scrollY > 50);
            setShowMarquee(scrollY < 10);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <TopBanner visible={showMarquee} />
            <Header showMarquee={showMarquee} isScrolled={isHeaderScrolled} />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
