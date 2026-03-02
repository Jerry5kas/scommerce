import Modal from '@/components/ui/Modal';
import LocationPicker from './LocationPicker';

interface Location {
    address_line_1: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
}

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialLocation?: Location | null;
}

export default function LocationModal({ isOpen, onClose, initialLocation }: LocationModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Select Location" fullScreen>
            <div className="w-full">
                <LocationPicker onSuccess={onClose} onCancel={onClose} initialLocation={initialLocation} className="pb-4" />
            </div>
        </Modal>
    );
}
