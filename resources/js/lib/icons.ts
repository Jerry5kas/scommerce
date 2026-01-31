/**
 * Global icon configuration.
 * - Lucide React: import { IconName } from 'lucide-react' in components.
 * - Font Awesome: when installed, import this file to register icons; use <FontAwesomeIcon icon={iconName} /> in components.
 */
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faEnvelope,
    faMapMarkerAlt,
    faPhone,
    faChevronRight,
    faCheck,
    faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

library.add(
    faEnvelope,
    faMapMarkerAlt,
    faPhone,
    faChevronRight,
    faCheck,
    faHeart,
    faHeartRegular,
);
