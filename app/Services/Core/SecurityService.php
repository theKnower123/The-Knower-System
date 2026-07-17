<?php
namespace App\Services\Core;

use Illuminate\Support\Facades\DB;
use PragmaRX\Google2FA\Google2FA;

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
