import React from 'react';
import { Head } from '@inertiajs/react';

export default function Quotations() {
    return (
        <div className="bg-obsidian-base min-h-screen text-on-background">
            <Head title="Quotations - CRM" />
            <div className="p-8">
                <h1 className="text-display-lg text-primary mb-4">Quotations</h1>
                <p className="text-on-surface-variant">Manage and version multi-currency enterprise quotations linked to opportunities.</p>
                {/* Table implementation connected to /api/v1/quotations */}
            </div>
        </div>
    );
}
