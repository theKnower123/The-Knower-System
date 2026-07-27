<?php

namespace App\Modules\CMS\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CMS\Models\LandingSection;
use App\Modules\CMS\Models\PortfolioEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingBuilderController extends Controller
{
    public function index()
    {
        return Inertia::render('Cms/LandingBuilder', [
            'sections' => LandingSection::orderBy('sort_order')->get(),
            'portfolioEntries' => PortfolioEntry::with('project')->get(),
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
                'sort_order' => $index,
                'updated_by' => $request->user()->id,
            ]);
        }

        return back()->with('success', 'Section order updated.');
    }

    public function toggleSection(Request $request, LandingSection $section)
    {
        $section->update([
            'is_visible' => ! $section->is_visible,
            'updated_by' => $request->user()->id,
        ]);

        return back();
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

        return back()->with('success', 'Showcase entry updated.');
    }

    public function toggleVisibility(PortfolioEntry $entry)
    {
        if ($entry->is_visible) {
            $entry->update(['is_visible' => false]);

            return back()->with('success', 'Hidden from landing page.');
        }

        // makeVisible() enforces client_approved before allowing this
        $entry->makeVisible();

        return back()->with('success', 'Now visible on landing page.');
    }
}
