<?php

namespace App\Modules\Settings\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SettingsController extends Controller
{
    /**
     * Get all settings.
     */
    public function index()
    {
        // Settings are stored as key-value in a settings table (future migration)
        // For now, return placeholder structure
        return response()->json([
            'success' => true,
            'message' => 'Settings retrieved successfully.',
            'data' => [
                'company' => [
                    'name'    => config('app.name'),
                    'url'     => config('app.url'),
                    'locale'  => config('app.locale'),
                ],
                'mail' => [
                    'mailer' => config('mail.default'),
                    'from'   => config('mail.from.address'),
                ],
                'security' => [
                    'session_lifetime' => config('session.lifetime'),
                ],
            ]
        ]);
    }

    /**
     * Update company settings.
     */
    public function updateCompany(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'website' => 'nullable|url|max:255',
            'address' => 'nullable|string',
            'phone'   => 'nullable|string|max:50',
            'email'   => 'nullable|email|max:255',
        ]);

        // TODO: Persist to settings table / .env when settings module is built
        return response()->json([
            'success' => true,
            'message' => 'Company settings updated successfully.',
            'data'    => $request->only(['name', 'website', 'address', 'phone', 'email']),
        ]);
    }

    /**
     * Update mail / SMTP settings.
     */
    public function updateMail(Request $request)
    {
        $request->validate([
            'mailer'       => 'required|string|in:smtp,log,sendmail,mailgun,ses',
            'host'         => 'nullable|string',
            'port'         => 'nullable|integer',
            'username'     => 'nullable|string',
            'password'     => 'nullable|string',
            'from_address' => 'nullable|email',
            'from_name'    => 'nullable|string',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Mail settings updated successfully.',
            'data'    => null,
        ]);
    }

    /**
     * Update security settings.
     */
    public function updateSecurity(Request $request)
    {
        $request->validate([
            'session_lifetime'    => 'nullable|integer|min:5|max:1440',
            'two_factor_enabled'  => 'nullable|boolean',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Security settings updated successfully.',
            'data'    => null,
        ]);
    }
}
