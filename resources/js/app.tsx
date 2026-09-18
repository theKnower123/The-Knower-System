import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import "./styles.css";
import { configureEcho } from '@laravel/echo-react';
import i18n from "@/i18n";
import { I18nextProvider } from "react-i18next";

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'The Knower OS';

import AppLayout from './Layouts/AppLayout';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './mocks/store';
import { Toaster } from 'sonner';
import { I18nBootstrap } from './components/i18n-bootstrap';

import { ThemeProvider } from './components/theme-provider';

const el = document.getElementById('app');
const initialPage = el && el.dataset.page ? JSON.parse(el.dataset.page) : null;

createInertiaApp({
    page: initialPage,
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true }) as Record<string, any>;
        const page = pages[`./Pages/${name}.tsx`];
        if (name !== 'Login' && page && page.default) {
            page.default.layout = page.default.layout || ((page: any) => <AppLayout>{page}</AppLayout>);
        }
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <QueryClientProvider client={queryClient}>
                <I18nextProvider i18n={i18n}>
                    <I18nBootstrap>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                            <App {...props} />
                            <Toaster />
                        </ThemeProvider>
                    </I18nBootstrap>
                </I18nextProvider>
            </QueryClientProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
