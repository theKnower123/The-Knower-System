<?php

namespace App\Modules\AI\Services;

use App\Modules\AI\Models\AiConversation;
use App\Modules\AI\Models\AiSuggestion;
use App\Modules\AI\Models\LeadScore;
use Illuminate\Support\Facades\Http;

/**
 * Central AI service. Every module (Support, CRM, CMS, Projects) calls into
 * this service instead of talking to the LLM API directly. This is what
 * turns Ai.tsx from an isolated page into a layer other modules can use.
 *
 * IMPORTANT RULE: nothing generated here reaches a client or gets published
 * automatically. Every output is stored as a pending AiSuggestion and must
 * be explicitly accepted by a human (see AiSuggestion::accept()).
 */
class AiAssistantService
{
    protected string $apiKey;
    protected string $model = 'claude-sonnet-4-6';

    public function __construct()
    {
        $this->apiKey = config('services.anthropic.key');
    }

    /**
     * Support ticket triage: read a new ticket, try to answer from the
     * Knowledge Base, or produce a handoff summary for a human agent.
     */
    public function triageTicket(string $ticketBody, array $kbContext = []): array
    {
        $prompt = "You are a support triage assistant. Ticket: {$ticketBody}\n"
            ."Known KB articles: ".json_encode($kbContext)."\n"
            .'Respond ONLY as JSON: {"can_answer": bool, "reply": string, "suggested_category": string, "suggested_priority": string}';

        $response = $this->callClaude($prompt);
        $parsed = json_decode($response, true) ?? [];

        AiSuggestion::create([
            'target_table' => 'tickets',
            'target_id' => 0, // set by caller once the ticket exists
            'suggestion_type' => 'reply',
            'content' => $response,
            'status' => 'pending',
        ]);

        return $parsed;
    }

    /**
     * CRM lead scoring: rate a lead's likelihood to convert.
     */
    public function scoreLead(int $leadId, array $leadData): LeadScore
    {
        $prompt = 'Score this lead 0-100 for likelihood to convert based on: '
            .json_encode($leadData)
            .'. Respond ONLY as JSON: {"score": number, "factors": {"positive": [], "negative": []}}';

        $response = $this->callClaude($prompt);
        $parsed = json_decode($response, true) ?? ['score' => 0, 'factors' => []];

        return LeadScore::create([
            'lead_id' => $leadId,
            'score' => $parsed['score'],
            'factors_json' => $parsed['factors'],
            'calculated_at' => now(),
        ]);
    }

    /**
     * CMS: draft 2-3 social caption variants for a topic. Always pending
     * approval before Marketing's PostController can schedule it.
     */
    public function draftSocialCaptions(string $topic, string $platform): AiSuggestion
    {
        $prompt = "Write 3 short social captions for {$platform} about: {$topic}. Return as a JSON array of strings.";
        $response = $this->callClaude($prompt);

        return AiSuggestion::create([
            'target_table' => 'posts',
            'target_id' => 0,
            'suggestion_type' => 'caption',
            'content' => $response,
            'status' => 'pending',
        ]);
    }

    /**
     * Projects: weekly digest of task activity, sent to the client via the portal.
     */
    public function summarizeProjectWeek(int $projectId, array $recentActivity): AiSuggestion
    {
        $prompt = 'Summarize this week\'s project activity for a client update, in plain, friendly language: '
            .json_encode($recentActivity);

        $response = $this->callClaude($prompt);

        return AiSuggestion::create([
            'target_table' => 'projects',
            'target_id' => $projectId,
            'suggestion_type' => 'summary',
            'content' => $response,
            'status' => 'pending',
        ]);
    }

    public function logConversation(string $sourceType, ?int $sourceId, string $role, string $message): void
    {
        AiConversation::create([
            'source_type' => $sourceType,
            'source_id' => $sourceId,
            'role' => $role,
            'message' => $message,
        ]);
    }

    protected function callClaude(string $prompt): string
    {
        $response = Http::withHeaders([
            'x-api-key' => $this->apiKey,
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ])->post('https://api.anthropic.com/v1/messages', [
            'model' => $this->model,
            'max_tokens' => 1024,
            'messages' => [
                ['role' => 'user', 'content' => $prompt],
            ],
        ]);

        $text = $response->json('content.0.text', '');

        return trim(str_replace(['```json', '```'], '', $text));
    }
}
