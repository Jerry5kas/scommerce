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
        <Modal isOpen={isOpen} onClose={onClose} title="Select Delivery Location" maxWidth="2xl">
            <LocationPicker onSuccess={onClose} onCancel={onClose} initialLocation={initialLocation} />
        </Modal>
    );
}
