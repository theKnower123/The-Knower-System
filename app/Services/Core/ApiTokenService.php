<?php
namespace App\Services\Core;

use Illuminate\Support\Str;

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
