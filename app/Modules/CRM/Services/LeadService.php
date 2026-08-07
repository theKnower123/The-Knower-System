<?php
namespace App\Modules\CRM\Services;

use App\Modules\CRM\Models\Lead;
use Illuminate\Support\Facades\Auth;

class LeadService
{
    public function getAll(array $filters = [])
    {
        $query = Lead::trashMode()->with(['assignee', 'contact'])->latest();

        if (!empty($filters['inquiry_type']) && $filters['inquiry_type'] !== 'all') {
            $query->where('inquiry_type', $filters['inquiry_type']);
        }
        if (!empty($filters['source'])) {
            $query->where('lead_source', $filters['source']);
        }
        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $query->where(function ($q) use ($s) {
                $q->where('title', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%")
                  ->orWhere('name', 'like', "%{$s}%");
            });
        }

        return $query->paginate(25);
    }

    public function create(array $data): Lead
    {
        $data['created_by'] = Auth::id();

        $data['lead_value'] = $data['budget'] ?? $data['lead_value'] ?? 0;
        $data['pipeline_stage'] = strtolower($data['status'] ?? 'new');
        $data['lead_source'] = strtolower($data['source'] ?? 'website');
        if (empty($data['title']) && !empty($data['name'])) {
            $data['title'] = $data['name'];
        }

        return Lead::create($data);
    }

    public function update(Lead $lead, array $data): Lead
    {
        $data['updated_by'] = Auth::id();
        $lead->update($data);
        return $lead;
    }

    public function delete(Lead $lead): bool
    {
        return $lead->delete();
    }
}
