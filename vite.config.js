import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

export default defineConfig({
   
    plugins: [
        TanStackRouterVite({
            routesDirectory: './resources/js/routes',
            generatedRouteTree: './resources/js/routeTree.gen.ts',
        }),
        build: {
        reportCompressedSize: false, // السطر ده هيحل مشكلة الرامات
        chunkSizeWarningLimit: 2000,
    },
        tailwindcss(),
        laravel({
            input: ['resources/js/app.tsx', 'resources/js/public_app.tsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});
