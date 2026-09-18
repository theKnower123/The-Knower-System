<?php
namespace App\Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use App\Services\Core\SecurityService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SecurityController extends Controller
{
    protected SecurityService $securityService;

    public function __construct(SecurityService $securityService)
    {
        $this->securityService = $securityService;
    }

    public function sessions(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->securityService->getActiveSessions($request->user())
        ]);
    }

    public function revokeSession(Request $request, $id): JsonResponse
    {
        $this->securityService->revokeSession($request->user(), $id);
        return response()->json(['success' => true, 'message' => 'Session revoked']);
    }

    public function generate2FA(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->securityService->generate2FASecret($request->user())
        ]);
    }

    public function enable2FA(Request $request): JsonResponse
    {
        $request->validate(['code' => 'required|string']);
        
        $success = $this->securityService->enable2FA($request->user(), $request->code);

        if (!$success) {
            return response()->json(['success' => false, 'message' => 'Invalid code'], 400);
        }

        return response()->json(['success' => true, 'message' => '2FA enabled successfully']);
    }

    public function disable2FA(Request $request): JsonResponse
    {
        $this->securityService->disable2FA($request->user());
        return response()->json(['success' => true, 'message' => '2FA disabled successfully']);
    }
}
