<?php

namespace App\Modules\CMS\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\CMS\Models\SocialLink;
use Illuminate\Http\Request;

class SocialLinksController extends Controller
{
    public function index()
    {
        return response()->json([
            'links' => SocialLink::orderBy('sort_order')->get(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'links'              => ['required', 'array'],
            'links.*.platform'   => ['required', 'string'],
            'links.*.url'        => ['nullable', 'string', 'max:500'],
            'links.*.label'      => ['nullable', 'string', 'max:100'],
            'links.*.is_active'  => ['boolean'],
        ]);

        foreach ($validated['links'] as $item) {
            SocialLink::updateOrCreate(
                ['platform' => $item['platform']],
                [
                    'url'       => $item['url'] ?? null,
                    'label'     => $item['label'] ?? $item['platform'],
                    'is_active' => $item['is_active'] ?? true,
                ]
            );
        }

        return response()->json(['success' => true, 'message' => 'Social links updated.']);
    }
}
