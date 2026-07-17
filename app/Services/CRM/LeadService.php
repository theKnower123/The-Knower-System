<?php

namespace App\Services\CRM;

use App\Models\Lead;
use Illuminate\Database\Eloquent\Collection;

class LeadService
{
    /**
     * Get all leads with their assignees.
     *
     * @return Collection
     */
    public function getAllLeads(): Collection
    {
        return Lead::with('assignee')->latest()->get();
    }

    /**
     * Create a new lead.
     *
     * @param array $data
     * @return Lead
     */
    public function createLead(array $data): Lead
    {
        return Lead::create($data);
    }

    /**
     * Update an existing lead.
     *
     * @param Lead $lead
     * @param array $data
     * @return Lead
     */
    public function updateLead(Lead $lead, array $data): Lead
    {
        $lead->update($data);
        return $lead;
    }

    /**
     * Delete a lead.
     *
     * @param Lead $lead
     * @return bool|null
     */
    public function deleteLead(Lead $lead): ?bool
    {
        return $lead->delete();
    }
}
