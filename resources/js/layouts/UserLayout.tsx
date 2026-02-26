import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Footer from '@/components/user/Footer';
import Header from '@/components/user/Header';
import TopBanner from '@/components/user/TopBanner';
import type { SharedData } from '@/types';

interface UserLayoutProps {
    children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
    const { theme } = (usePage().props as unknown as SharedData) ?? {};
    const [showTopBanner, setShowTopBanner] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [navigating, setNavigating] = useState(false);

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
            setShowTopBanner(scrollY < 10);
            setIsScrolled(scrollY >= 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const startHandler = router.on('start', () => setNavigating(true));
        const finishHandler = router.on('finish', () => setNavigating(false));
        return () => {
            startHandler();
            finishHandler();
        };
    }, []);

    return (
        <div className={`min-h-screen bg-white${navigating ? ' cursor-wait' : ''}`}>
            <TopBanner visible={showTopBanner} />
            <Header showTopBanner={showTopBanner} isScrolled={isScrolled} />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
