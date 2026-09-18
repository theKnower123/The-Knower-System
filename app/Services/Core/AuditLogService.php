<?php
namespace App\Services\Core;

use Spatie\Activitylog\Models\Activity;

class AuditLogService
{
    public function getLogs(array $filters = [])
    {
        $query = Activity::with('causer', 'subject')->orderBy('created_at', 'desc');
        
        if (isset($filters['event'])) {
            $query->where('event', $filters['event']);
        }

        if (isset($filters['causer_id'])) {
            $query->where('causer_id', $filters['causer_id']);
        }

        return $query->paginate(50);
    }
}
