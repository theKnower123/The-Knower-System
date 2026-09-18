<?php

namespace App\Modules\Support\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Support\Models\Conversation;
use App\Modules\Support\Models\Message;
use Illuminate\Support\Str;

class PublicSupportController extends Controller
{
    public function startChat(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'subject' => 'nullable|string|max:255',
            'department' => 'nullable|string|max:255',
            'initial_message' => 'required|string'
        ]);

        // PHASE 4: Automation - Keyword Routing
        $contentLower = strtolower($request->initial_message);
        $department = $request->department ?? 'General Inquiry';

        // Override department based on message contents
        if (Str::contains($contentLower, ['price', 'pricing', 'quote', 'cost', 'buy'])) {
            $department = 'Sales';
        } elseif (Str::contains($contentLower, ['bug', 'error', 'crash', 'not working', 'issue'])) {
            $department = 'Technical Support';
        } elseif (Str::contains($contentLower, ['invoice', 'bill', 'receipt', 'payment', 'card'])) {
            $department = 'Billing & Finance';
        } elseif (Str::contains($contentLower, ['domain', 'hosting', 'server', 'ssl', 'cpanel'])) {
            $department = 'Technical Support'; // Or a dedicated 'Hosting' team
        }

        // Create a conversation for the public user (no customer_id since they are a guest)
        $conversation = Conversation::create([
            'channel' => 'chat',
            'status' => 'open',
            'subject' => $request->subject ?: 'Live Chat from ' . $request->name,
            'metadata' => [
                'guest_name' => $request->name,
                'guest_email' => $request->email,
                'guest_phone' => $request->phone,
                'guest_company' => $request->company,
                'department' => $department, // Updated department
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ],
            'last_message_at' => now()
        ]);

        // PHASE 2 & 4: Intelligent Routing
        $router = new \App\Modules\Support\Services\SupportRouter();
        $bestAgent = $router->findBestAgent($department);
        
        if ($bestAgent) {
            $conversation->update(['assigned_to' => $bestAgent->id]);
        }

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'content' => $request->initial_message,
            'type' => 'message'
        ]);

        $queueStatus = $router->getQueueStatus($conversation);

        return response()->json([
            'conversation_id' => $conversation->id,
            'message' => $message,
            'queue' => $queueStatus
        ]);
    }

    public function submitForm(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'company' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'message' => 'required|string'
        ]);

        $conversation = Conversation::create([
            'channel' => 'form',
            'status' => 'open',
            'subject' => 'Contact Form: ' . $request->name . ($request->company ? " ({$request->company})" : ""),
            'metadata' => [
                'guest_name' => $request->name,
                'guest_email' => $request->email,
                'guest_phone' => $request->phone,
                'guest_company' => $request->company,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ],
            'last_message_at' => now()
        ]);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'content' => $request->message,
            'type' => 'message'
        ]);

        return response()->json(['success' => true]);
    }

    public function sendMessage(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $conversation = Conversation::findOrFail($id);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'content' => $request->content,
            'type' => 'message'
        ]);

        $conversation->update(['last_message_at' => now()]);

        // Phase 5: 3-Level Live Chat Routing (only if not already assigned to a human)
        if (is_null($conversation->assigned_to)) {
            $contentLower = strtolower($request->content);
            $wantsHuman = \Illuminate\Support\Str::contains($contentLower, ['human', 'agent', 'person', 'support', 'talk to']);

            if ($wantsHuman) {
                // LEVEL 3: Human Escelation
                Message::create([
                    'conversation_id' => $conversation->id,
                    'content' => "I understand you want to speak to a human. I am keeping you in the queue for the next available agent.",
                    'user_id' => -1, // AI/System
                    'type' => 'message'
                ]);
            } else {
                // LEVEL 1: Knowledge Base Search
                // Mock KB match for 'password' or 'login'
                if (\Illuminate\Support\Str::contains($contentLower, ['password', 'login', 'account'])) {
                    Message::create([
                        'conversation_id' => $conversation->id,
                        'content' => "It looks like you're asking about your account. You can reset your password at /password/reset. Did this help?",
                        'user_id' => -1, // System
                        'type' => 'message'
                    ]);
                } else {
                    // LEVEL 2: AI Layer
                    try {
                        $aiManager = new \App\Modules\AI\Services\AiManager();
                        // Register providers (in a real app, this happens in a ServiceProvider)
                        $aiManager->registerProvider(new \App\Modules\AI\Providers\GeminiProvider());
                        $aiManager->registerProvider(new \App\Modules\AI\Providers\DeepSeekProvider());
                        $aiManager->registerProvider(new \App\Modules\AI\Providers\OllamaProvider());

                        $aiResponse = $aiManager->chat($request->content, [
                            'guest_name' => $conversation->metadata['guest_name'] ?? 'Guest'
                        ]);

                        Message::create([
                            'conversation_id' => $conversation->id,
                            'content' => $aiResponse,
                            'user_id' => -1, // AI
                            'type' => 'message'
                        ]);
                    } catch (\Exception $e) {
                        \Illuminate\Support\Facades\Log::error('AI Layer Error: ' . $e->getMessage());
                    }
                }
            }
        }

        return response()->json(['message' => $message]);
    }

    public function getMessages($id)
    {
        $conversation = Conversation::findOrFail($id);
        $messages = Message::with('sender')
            ->where('conversation_id', $id)
            ->where('type', 'message') // Exclude internal notes
            ->orderBy('created_at', 'asc')
            ->get();

        $router = new \App\Modules\Support\Services\SupportRouter();
        $queueStatus = $router->getQueueStatus($conversation);

        return response()->json([
            'messages' => $messages,
            'queue' => $queueStatus,
            'is_assigned' => $conversation->assigned_to !== null
        ]);
    }
}
