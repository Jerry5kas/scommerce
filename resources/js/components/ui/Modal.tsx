import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    fullScreenOnMobile?: boolean;
    fullScreen?: boolean;
}

export default function Modal({ isOpen, onClose, children, title, maxWidth = 'md', fullScreenOnMobile = false, fullScreen = false }: ModalProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isMounted) return null;

    if (!isOpen) return null;

    const maxWidthClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        full: 'max-w-full m-4',
    }[maxWidth];

    const responsiveMaxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        full: 'sm:max-w-full sm:m-4',
    }[maxWidth];

    const overlayClass = fullScreen
        ? 'fixed inset-0 z-9999 flex items-stretch justify-stretch overflow-hidden bg-black/50 transition-all'
        : fullScreenOnMobile
        ? 'fixed inset-0 z-9999 flex items-end justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-0 backdrop-blur-sm transition-all sm:items-center sm:p-4'
        : 'fixed inset-0 z-9999 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 p-4 backdrop-blur-sm transition-all';

    const panelClass = fullScreen
        ? 'relative h-dvh w-dvw rounded-none bg-white shadow-2xl transition-all'
        : fullScreenOnMobile
        ? `relative h-dvh w-full rounded-none bg-white shadow-2xl transition-all sm:h-auto sm:w-full ${responsiveMaxWidthClass} sm:rounded-xl`
        : `relative w-full ${maxWidthClass} rounded-xl bg-white shadow-2xl transition-all`;

    const bodyClass = fullScreen ? 'h-[calc(100dvh-73px)] overflow-y-auto p-4 sm:p-6' : fullScreenOnMobile ? 'h-[calc(100dvh-73px)] overflow-y-auto p-4 sm:h-auto' : 'p-4';

    return createPortal(
        <div className={overlayClass}>
            <div className={panelClass}>
                <div className="flex items-center justify-between border-b border-gray-100 p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className={bodyClass}>{children}</div>
            </div>
        </div>,
        document.body,
    );
}
