<?php

namespace App\Modules\Marketing\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Marketing\Models\SocialAccount;
use App\Modules\Marketing\Requests\StoreSocialAccountRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SocialAccountController extends Controller
{
    public function index()
    {
        $accounts = SocialAccount::with(['connectedBy', 'assignedUsers'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Marketing/Accounts', [
            'accounts' => $accounts,
        ]);
    }

    public function store(StoreSocialAccountRequest $request)
    {
        $account = SocialAccount::create([
            ...$request->validated(),
            'connected_by' => $request->user()->id,
        ]);

        activity()->causedBy($request->user())->performedOn($account)->log('connected social account');

        return back()->with('success', 'Account connected.');
    }

    public function assignUser(Request $request, SocialAccount $account)
    {
        $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'role_on_account' => ['nullable', 'string', 'max:100'],
        ]);

        $account->assignedUsers()->syncWithoutDetaching([
            $request->user_id => ['role_on_account' => $request->role_on_account],
        ]);

        return back()->with('success', 'Team member assigned.');
    }

    public function disconnect(SocialAccount $account)
    {
        $account->update(['status' => 'disconnected', 'access_token_encrypted' => null]);

        return back()->with('success', 'Account disconnected.');
    }
}
