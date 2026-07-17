import os

# --- API TOKEN SERVICE ---
token_service = """<?php
namespace App\\Services\\Core;

use Illuminate\\Support\\Str;

class ApiTokenService
{
    public function getTokens($user)
    {
        return $user->tokens()->get();
    }

    public function createToken($user, array $data)
    {
        $abilities = $data['abilities'] ?? ['*'];
        $name = $data['name'];

        $token = $user->createToken($name, $abilities);

        return [
            'accessToken' => $token->plainTextToken,
            'token' => $token->accessToken,
        ];
    }

    public function revokeToken($user, $tokenId)
    {
        return $user->tokens()->where('id', $tokenId)->delete();
    }
}
"""

os.makedirs('app/Services/Core', exist_ok=True)
with open('app/Services/Core/ApiTokenService.php', 'w') as f:
    f.write(token_service)

# --- API TOKEN CONTROLLER ---
token_controller = """<?php
namespace App\\Http\\Controllers\\Core;

use App\\Http\\Controllers\\Controller;
use App\\Services\\Core\\ApiTokenService;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;

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
"""

os.makedirs('app/Http/Controllers/Core', exist_ok=True)
with open('app/Http/Controllers/Core/ApiTokenController.php', 'w') as f:
    f.write(token_controller)

print("Step 2 (API Platform) Scaffolded")
