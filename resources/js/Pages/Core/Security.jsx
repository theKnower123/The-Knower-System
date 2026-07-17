import React from 'react';
import { Head } from '@inertiajs/react';

export default function Security() {
    return (
        <div>
            <Head title="Security Settings" />
            <h1>Security & 2FA Management</h1>
            {/* Connected to /api/v1/security/2fa */}
        </div>
    );
}
