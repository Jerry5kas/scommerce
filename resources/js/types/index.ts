export type * from './auth';

import type { Auth } from './auth';

export type BusinessVertical = 'daily_fresh' | 'society_fresh' | 'both';

export type AppTheme = {
    primary_1: string;
    primary_2: string;
    secondary: string;
    tertiary: string;
};

export type Zone = {
    id: number;
    name: string;
    code: string;
};

export type SharedData = {
    name: string;
    auth: Auth;
    theme: AppTheme;
    csrf_token?: string;
    zone?: Zone | null;
    [key: string]: unknown;
};
