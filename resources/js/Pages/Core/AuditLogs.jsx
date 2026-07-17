import React from 'react';
import { Head } from '@inertiajs/react';

export default function AuditLogs() {
    return (
        <div>
            <Head title="System Audit Logs" />
            <h1>Activity Monitoring</h1>
            {/* Connected to /api/v1/audit-logs */}
        </div>
    );
}
