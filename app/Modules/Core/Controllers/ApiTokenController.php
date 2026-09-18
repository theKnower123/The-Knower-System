<?php
namespace App\Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use App\Services\Core\ApiTokenService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ApiTokenController extends Controller
{
    protected ApiTokenService $tokenService;

    public function __construct(ApiTokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->tokenService->getTokens($request->user())
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'abilities' => 'nullable|array'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Token created successfully',
            'data' => $this->tokenService->createToken($request->user(), $validated)
        ], 201);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $this->tokenService->revokeToken($request->user(), $id);
        return response()->json(['success' => true, 'message' => 'Token revoked']);
    }
}
