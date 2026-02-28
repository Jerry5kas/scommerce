import { router, Head, usePage } from '@inertiajs/react';
import UserLayout from '@/layouts/UserLayout';
import LocationModal from '@/components/user/LocationModal';
import { useEffect } from 'react';

export default function LocationSelect() {
    const { zone } = usePage().props as unknown as { zone?: { id: number } | null };

    useEffect(() => {
        // If user selects a zone, redirect to home
        if (zone) {
            router.visit('/');
        }
    }, [zone]);

    return (
        <UserLayout>
            <Head title="Select Location" />
            <LocationModal 
                isOpen={true} 
                onClose={() => {
                    // If user closes modal without selecting, maybe redirect to home or stay here?
                    // For now, if they close it and have no zone, they are stuck here or go home (which will re-open modal)
                    router.visit('/');
                }} 
            />
        </UserLayout>
    );
}
