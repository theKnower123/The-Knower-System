<?php

namespace App\Modules\Support\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Support\Models\Conversation;
use App\Modules\Support\Models\Message;

class ConversationController extends Controller
{
    public function index(Request $request)
    {
        $conversations = Conversation::with(['department', 'assignedAgent', 'contact'])
            ->orderBy('last_message_at', 'desc')
            ->get()
            ->map(function ($conv) {
                return [
                    'id' => (string) $conv->id,
                    'channel' => $conv->channel,
                    'status' => $conv->status,
                    'department' => $conv->department ? $conv->department->name : 'Support',
                    'assignedAgentId' => $conv->assigned_agent_id ? (string) $conv->assigned_agent_id : null,
                    'contactId' => $conv->contact_id ? (string) $conv->contact_id : null,
                    'tags' => $conv->tags ? explode(',', $conv->tags) : [],
                    'priority' => $conv->priority,
                    'slaDueAt' => $conv->sla_due_at,
                    'createdAt' => $conv->created_at,
                    'lastMessageAt' => $conv->last_message_at,
                    'unread' => $conv->unread,
                    // If we have contact we'd use their name, otherwise guest
                    'customerName' => $conv->contact ? $conv->contact->name : 'Guest User',
                    'customerEmail' => $conv->contact ? $conv->contact->email : 'guest@example.com',
                ];
            });

        return response()->json(['data' => $conversations]);
    }

    public function messages($id)
    {
        $messages = Message::where('conversation_id', $id)
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($msg) {
                return [
                    'id' => (string) $msg->id,
                    'conversationId' => (string) $msg->conversation_id,
                    'sender' => $msg->sender_type,
                    'senderId' => $msg->sender_id ? (string) $msg->sender_id : null,
                    'body' => $msg->body,
                    'attachments' => $msg->attachments,
                    'createdAt' => $msg->created_at,
                    'internal' => $msg->internal_flag,
                ];
            });

        return response()->json(['data' => $messages]);
    }
}
