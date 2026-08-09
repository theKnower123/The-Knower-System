<?php

namespace App\Modules\CMS\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CMS\Models\MarketingPlan;
use App\Modules\CMS\Models\SocialLink;
use App\Modules\CMS\Models\Testimonial;
use App\Modules\CMS\Models\Faq;
use App\Modules\CMS\Models\BlogPost;
use App\Modules\CMS\Models\TeamMember;
use App\Modules\CMS\Models\Service;
use App\Modules\Projects\Models\Project;
use App\Modules\HR\Models\JobPosting;
use App\Modules\CRM\Models\Contact;
use App\Modules\CRM\Models\Lead;
use Illuminate\Http\Request;

class PublicApiController extends Controller
{
    public function portfolio()
    {
        return response()->json([
            'projects' => Project::where('is_public', true)->get()
        ]);
    }

    public function pricing()
    {
        return response()->json([
            'plans' => MarketingPlan::where('is_active', true)->get(),
        ]);
    }

    public function socialLinks()
    {
        return response()->json([
            'links' => SocialLink::orderBy('sort_order')->where('is_active', true)->get(),
        ]);
    }

    public function testimonials()
    {
        return response()->json([
            'testimonials' => Testimonial::where('is_published', true)->get()
        ]);
    }

    public function faqs()
    {
        return response()->json([
            'faqs' => Faq::orderBy('sort_order')->get()
        ]);
    }

    public function blog()
    {
        return response()->json([
            'posts' => BlogPost::where('is_published', true)->orderBy('published_at', 'desc')->get()
        ]);
    }

    public function blogDetail($slug)
    {
        $post = BlogPost::where('slug', $slug)
            ->orWhere('id', $slug)
            ->where('is_published', true)
            ->first();

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        return response()->json([
            'post' => $post
        ]);
    }

    public function team()
    {
        return response()->json([
            'team' => TeamMember::where('is_published', true)->orderBy('sort_order')->get()
        ]);
    }

    public function services()
    {
        return response()->json([
            'services' => Service::where('is_published', true)->orderBy('sort_order')->get()
        ]);
    }

    public function serviceDetail($slug)
    {
        $service = Service::where('slug', $slug)
            ->orWhere('id', $slug)
            ->where('is_published', true)
            ->first();

        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        return response()->json([
            'service' => $service
        ]);
    }

    public function careers()
    {
        if (class_exists(JobPosting::class)) {
            return response()->json([
                'jobs' => JobPosting::where('status', 'open')->get()
            ]);
        }
        return response()->json(['jobs' => []]);
    }

    /**
     * Public "Send us a message" form on /contact.
     * Creates a real Contact + Lead so it shows up in CRM > Leads.
     */
    public function submitContact(Request $request)
    {
        $data = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'company'          => ['nullable', 'string', 'max:255'],
            'email'            => ['required', 'email', 'max:255'],
            'phone'            => ['nullable', 'string', 'max:50'],
            'whatsapp_number'  => ['nullable', 'string', 'max:50'],
            'message'          => ['required', 'string'],
            'plan'             => ['nullable', 'string', 'max:100'],
            'inquiry_type'     => ['nullable', 'string', 'in:pricing_plan,demo_request,business,general'],
        ]);

        [$firstName, $lastName] = $this->splitName($data['name']);

        // Determine inquiry type
        $inquiryType = $data['inquiry_type'] ?? ($data['plan'] ? 'pricing_plan' : 'general');

        // Prepend plan context to message if provided
        $messageBody = $data['message'];
        if (!empty($data['plan'])) {
            $messageBody = "[Interested in plan: {$data['plan']}]\n\n" . $messageBody;
        }
        if (!empty($data['whatsapp_number'])) {
            $messageBody = "[WhatsApp: {$data['whatsapp_number']}]\n" . $messageBody;
        }

        $contactData = [
            'workspace_id' => 1,
            'first_name'   => $firstName,
            'last_name'    => $lastName,
            'email'        => $data['email'],
            'phone'        => $data['phone'] ?? null,
            'notes'        => $messageBody,
        ];
        // whatsapp_number column added via migration
        if (!empty($data['whatsapp_number'])) {
            $contactData['whatsapp_number'] = $data['whatsapp_number'];
        }

        $contact = Contact::create($contactData);

        // Build a clear lead title
        $inquiryLabels = [
            'pricing_plan'  => 'Pricing Inquiry',
            'demo_request'  => 'Demo Request',
            'business'      => 'Business Inquiry',
            'general'       => 'Contact Form',
        ];
        $typeLabel = $inquiryLabels[$inquiryType] ?? 'Contact Form';

        $leadTitle = "[{$typeLabel}] " . $data['name'];
        if (!empty($data['plan'])) $leadTitle .= ' — Plan: ' . $data['plan'];
        if (!empty($data['company'])) $leadTitle .= ' (' . $data['company'] . ')';

        Lead::create([
            'workspace_id'   => 1,
            'title'          => $leadTitle,
            'contact_id'     => $contact->id,
            'pipeline_stage' => 'new',
            'lead_source'    => 'website',
            'inquiry_type'   => $inquiryType,
            'interested_plan' => $data['plan'] ?? null,
        ]);

        return response()->json(['success' => true, 'message' => "Thanks! We'll reply within a business hour."]);
    }

    /**
     * "Book a demo" card on /contact. Creates a Lead tagged as a demo
     * request so Sales can see it in the pipeline. There is no real
     * calendar/scheduling system wired up yet -- this just captures the
     * request; a human still needs to follow up to actually pick a time.
     */
    public function submitDemoRequest(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
        ]);

        [$firstName, $lastName] = $this->splitName($data['name']);

        $contact = Contact::create([
            'workspace_id' => 1,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $data['email'],
        ]);

        Lead::create([
            'workspace_id' => 1,
            'title' => 'Demo request: '.$data['name'],
            'contact_id' => $contact->id,
            'pipeline_stage' => 'new',
            'lead_source' => 'website',
        ]);

        return response()->json(['success' => true, 'message' => 'Demo request received -- our team will email you to pick a time.']);
    }

    private function splitName(string $name): array
    {
        $parts = preg_split('/\s+/', trim($name), 2);
        return [$parts[0], $parts[1] ?? null];
    }
}
