<?php

namespace App\Modules\Support\Services;

use App\Modules\Support\Models\Conversation;
use App\Modules\Auth\Models\User;
use Illuminate\Support\Facades\DB;

class ConversationRoutingService
{
    /**
     * Route a new conversation to the appropriate department and agent based on least-load logic.
     */
    public function routeConversation(Conversation $conversation)
    {
        // 1. Determine Department (for now, use the conversation's department_id if set, else find default 'Support')
        $departmentId = $conversation->department_id;
        if (!$departmentId) {
            // Find default Support department
            $defaultDept = DB::table('departments')->where('name', 'Support')->first();
            $departmentId = $defaultDept ? $defaultDept->id : null;
            $conversation->department_id = $departmentId;
        }

        // 2. Find online agents for this department
        $agents = User::where('role', 'support') // Assuming 'support' role or we check permissions
            // In a real app we would check `agent_status`='online' and link to department
            ->withCount(['assignedConversations' => function ($query) {
                $query->whereIn('status', ['assigned', 'in_progress']);
            }])
            ->orderBy('assigned_conversations_count', 'asc')
            ->get();

        // If we have an online agent with least load, assign them
        if ($agents->isNotEmpty()) {
            $bestAgent = $agents->first();
            $conversation->assigned_agent_id = $bestAgent->id;
            $conversation->status = 'assigned';
        } else {
            // No agents available, put in waiting queue
            $conversation->status = 'waiting';
        }

        $conversation->save();

        return $conversation;
    }
}
