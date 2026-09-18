<?php

namespace App\Modules\CMS\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CMS\Models\LandingSection;
use App\Modules\CMS\Models\PortfolioEntry;
use App\Modules\CMS\Models\Testimonial;
use App\Modules\Projects\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingBuilderController extends Controller
{
    public function index()
    {
        // Seed default sections if empty
        if (LandingSection::count() === 0) {
            $defaultSections = [
                ['section_key' => 'hero', 'title' => 'Hero Banner', 'sort_order' => 1, 'is_visible' => true],
                ['section_key' => 'services', 'title' => 'Services & Capabilities', 'sort_order' => 2, 'is_visible' => true],
                ['section_key' => 'featured_work', 'title' => 'Featured Portfolio Work', 'sort_order' => 3, 'is_visible' => true],
                ['section_key' => 'testimonials', 'title' => 'Client Testimonials', 'sort_order' => 4, 'is_visible' => true],
                ['section_key' => 'pricing', 'title' => 'Pricing & Plans', 'sort_order' => 5, 'is_visible' => true],
                ['section_key' => 'cta', 'title' => 'Call To Action', 'sort_order' => 6, 'is_visible' => true],
            ];
            foreach ($defaultSections as $sec) {
                LandingSection::create($sec);
            }
        }

        // Seed portfolio entries from projects if empty
        $projects = Project::where('status', 'completed')->orWhere('status', 'in_progress')->get();
        foreach ($projects as $proj) {
            PortfolioEntry::firstOrCreate(
                ['project_id' => $proj->id],
                [
                    'client_approved' => true,
                    'is_visible' => true,
                    'cover_image' => $proj->image ?? null,
                    'description' => $proj->description ?? 'Project showcase entry',
                    'tags' => ['Web', 'System'],
                    'show_client_name' => true,
                ]
            );
        }

        return Inertia::render('Cms/LandingBuilder', [
            'sections' => LandingSection::orderBy('sort_order')->get(),
            'portfolioEntries' => PortfolioEntry::with('project.client')->get(),
            'testimonials' => Testimonial::latest()->get(),
            'projects' => Project::select('id', 'name')->get(),
        ]);
    }

    public function reorderSections(Request $request)
    {
        $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['exists:landing_sections,id'],
        ]);

        foreach ($request->order as $index => $id) {
            LandingSection::whereKey($id)->update([
                'sort_order' => $index + 1,
                'updated_by' => $request->user()->id,
            ]);
        }

        activity()
            ->causedBy($request->user())
            ->log('Reordered landing page sections');

        return back()->with('success', 'Section order updated.');
    }

    public function toggleSection(Request $request, LandingSection $section)
    {
        $section->update([
            'is_visible' => ! $section->is_visible,
            'updated_by' => $request->user()->id,
        ]);

        activity()
            ->causedBy($request->user())
            ->performedOn($section)
            ->log(($section->is_visible ? 'Enabled' : 'Disabled') . " section {$section->section_key}");

        return back()->with('success', 'Section visibility toggled.');
    }

    public function updateShowcaseEntry(Request $request, PortfolioEntry $entry)
    {
        $data = $request->validate([
            'cover_image' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'tags' => ['nullable', 'array'],
            'show_client_name' => ['boolean'],
        ]);

        $entry->update($data);

        activity()
            ->causedBy($request->user())
            ->performedOn($entry)
            ->log("Updated showcase entry for project #{$entry->project_id}");

        return back()->with('success', 'Showcase entry updated.');
    }

    public function toggleVisibility(Request $request, PortfolioEntry $entry)
    {
        if (!$entry->is_visible) {
            // Guard rule: client_approved must be true before entry can be shown
            if (!$entry->client_approved) {
                return back()->withErrors([
                    'client_approved' => 'Client approval is required before displaying this project on the public landing page.'
                ]);
            }
            $entry->update(['is_visible' => true]);
            $msg = 'Shown on public landing page.';
        } else {
            $entry->update(['is_visible' => false]);
            $msg = 'Hidden from public landing page.';
        }

        activity()
            ->causedBy($request->user())
            ->performedOn($entry)
            ->log($msg);

        return back()->with('success', $msg);
    }

    public function toggleClientApproval(Request $request, PortfolioEntry $entry)
    {
        $newApproval = ! $entry->client_approved;
        
        // If client approval is revoked, hide entry automatically
        $data = ['client_approved' => $newApproval];
        if (!$newApproval) {
            $data['is_visible'] = false;
        }

        $entry->update($data);

        activity()
            ->causedBy($request->user())
            ->performedOn($entry)
            ->log("Updated client approval for project #{$entry->project_id} to " . ($newApproval ? 'Approved' : 'Revoked'));

        return back()->with('success', 'Client approval updated.');
    }

    public function storeTestimonial(Request $request)
    {
        $validated = $request->validate([
            'client_name' => ['required', 'string', 'max:255'],
            'quote' => ['required', 'string'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'is_approved' => ['boolean'],
        ]);

        $testimonial = Testimonial::create($validated);

        activity()
            ->causedBy($request->user())
            ->performedOn($testimonial)
            ->log("Created testimonial from {$testimonial->client_name}");

        return back()->with('success', 'Testimonial added successfully.');
    }

    public function toggleTestimonialApproval(Request $request, Testimonial $testimonial)
    {
        $testimonial->update(['is_approved' => ! $testimonial->is_approved]);

        activity()
            ->causedBy($request->user())
            ->performedOn($testimonial)
            ->log(($testimonial->is_approved ? 'Approved' : 'Unapproved') . " testimonial from {$testimonial->client_name}");

        return back()->with('success', 'Testimonial status updated.');
    }
}
