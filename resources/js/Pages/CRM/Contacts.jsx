import React from 'react';
import { Head } from '@inertiajs/react';

export default function Contacts() {
    return (
        <div className="bg-obsidian-base min-h-screen text-on-background">
            <Head title="Contacts - CRM" />
            <div className="p-8">
                <h1 className="text-display-lg text-primary mb-4">Contacts Directory</h1>
                <p className="text-on-surface-variant">B2B Contacts tied to specific Enterprise Companies. Reusable across Meetings, Quotations, and Projects.</p>
                {/* Table implementation connected to /api/v1/contacts */}
            </div>
        </div>
    );
}
