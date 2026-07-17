import os
import datetime

# --- SECURITY SERVICE ---
security_service = """<?php
namespace App\\Services\\Core;

use Illuminate\\Support\\Facades\\DB;
use PragmaRX\\Google2FA\\Google2FA;

class SecurityService
{
    protected Google2FA $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    public function getActiveSessions($user)
    {
        return DB::table('sessions')
            ->where('user_id', $user->id)
            ->orderBy('last_activity', 'desc')
            ->get();
    }

    public function revokeSession($user, $sessionId)
    {
        return DB::table('sessions')
            ->where('user_id', $user->id)
            ->where('id', $sessionId)
            ->delete();
    }

    public function generate2FASecret($user)
    {
        $secret = $this->google2fa->generateSecretKey();
        
        $user->google2fa_secret = $secret;
        $user->save();

        $qrCodeUrl = $this->google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        return [
            'secret' => $secret,
            'qr_code_url' => $qrCodeUrl
        ];
    }

    public function enable2FA($user, $code)
    {
        $valid = $this->google2fa->verifyKey($user->google2fa_secret, $code);

        if ($valid) {
            $user->google2fa_enabled = true;
            $user->save();
            return true;
        }

        return false;
    }

    public function disable2FA($user)
    {
        $user->google2fa_enabled = false;
        $user->google2fa_secret = null;
        $user->save();
        return true;
    }
}
"""

os.makedirs('app/Services/Core', exist_ok=True)
with open('app/Services/Core/SecurityService.php', 'w') as f:
    f.write(security_service)

# --- SECURITY CONTROLLER ---
security_controller = """<?php
namespace App\\Http\\Controllers\\Core;

use App\\Http\\Controllers\\Controller;
use App\\Services\\Core\\SecurityService;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;

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
"""

os.makedirs('app/Http/Controllers/Core', exist_ok=True)
with open('app/Http/Controllers/Core/SecurityController.php', 'w') as f:
    f.write(security_controller)

# --- MIGRATION FOR 2FA ---
migration = """<?php
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('google2fa_secret')->nullable();
            $table->boolean('google2fa_enabled')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['google2fa_secret', 'google2fa_enabled']);
        });
    }
};
"""
date_str = datetime.datetime.now().strftime("%Y_%m_%d_%H%M%S")
with open(f'database/migrations/{date_str}_add_2fa_to_users_table.php', 'w') as f:
    f.write(migration)

print("Step 1 (Security) Scaffolded")
