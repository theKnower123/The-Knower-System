<?php

namespace App\Modules\Support\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Support\Models\Conversation;
use App\Modules\Support\Models\Message;
use App\Modules\Support\Services\ConversationRoutingService;

class IngestionController extends Controller
{
    protected $routingService;

    public function __construct(ConversationRoutingService $routingService)
    {
        $this->routingService = $routingService;
    }

    /**
     * Unified endpoint to receive a new message from ANY channel (widget, email, api)
     */
    public function ingest(Request $request)
    {
        $validated = $request->validate([
            'channel' => 'required|string', // website, email, api, etc.
            'body' => 'required|string',
            'sender_id' => 'nullable|exists:users,id',
            'contact_email' => 'nullable|email', // For anonymous/guest users
            'contact_name' => 'nullable|string', // For anonymous/guest users
            'conversation_id' => 'nullable|exists:conversations,id',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $conversationId = $validated['conversation_id'] ?? null;
        $conversation = null;

        if ($conversationId) {
            $conversation = Conversation::find($conversationId);
        }

        // Auto-create contact for guests
        $contactId = $validated['sender_id'] ?? null;
        if (!$contactId && !empty($validated['contact_email'])) {
            $user = \App\Modules\Auth\Models\User::firstOrCreate(
                ['email' => $validated['contact_email']],
                [
                    'name' => $validated['contact_name'] ?? 'Guest User',
                    'role' => 'client',
                    'password' => \Illuminate\Support\Facades\Hash::make(\Illuminate\Support\Str::random(16))
                ]
            );
            $contactId = $user->id;
        }

        // If no existing conversation, create one and route it
        if (!$conversation) {
            $conversation = new Conversation();
            $conversation->channel = $validated['channel'];
            $conversation->department_id = $validated['department_id'] ?? null;
            $conversation->contact_id = $contactId;
            $conversation->status = 'waiting';
            
            // Basic SLA setup (e.g., 2 hours from now for first response)
            $conversation->sla_due_at = now()->addHours(2);
            $conversation->save();

            // Run the routing engine to assign to a department/agent
            $conversation = $this->routingService->routeConversation($conversation);
        }

        // Create the message
        $message = new Message();
        $message->conversation_id = $conversation->id;
        $message->body = $validated['body'];
        $message->sender_type = $contactId ? 'customer' : 'system';
        $message->sender_id = $contactId;
        $message->save();

        // Update conversation last message timestamp
        $conversation->update([
            'last_message_at' => now(),
            'unread' => true,
        ]);

        // Here we would dispatch events to broadcast the new message via WebSockets
        // broadcast(new NewMessageReceived($message))->toOthers();

        return response()->json([
            'message' => 'Message ingested successfully',
            'conversation_id' => $conversation->id,
            'message_id' => $message->id,
            'status' => $conversation->status,
        ], 201);
    }
}
