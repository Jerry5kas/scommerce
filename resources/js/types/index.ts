export type * from './auth';

import type { Auth } from './auth';

export type AppTheme = {
    primary_1: string;
    primary_2: string;
    secondary: string;
    tertiary: string;
};

export type SharedData = {
    name: string;
    auth: Auth;
    theme: AppTheme;
    [key: string]: unknown;
};
