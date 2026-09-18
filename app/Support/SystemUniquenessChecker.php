<?php

namespace App\Support;

use App\Modules\Auth\Models\User;
use App\Modules\CRM\Models\Client;
use App\Modules\CRM\Models\Lead;
use App\Modules\HR\Models\Employee;

class SystemUniquenessChecker
{
    public static function checkEmail(?string $email, ?int $ignoreUserId = null): ?string
    {
        if (empty($email)) return null;

        $email = strtolower(trim($email));

        $userExists = User::withTrashed()
            ->where('email', $email)
            ->when($ignoreUserId, fn($q) => $q->where('id', '!=', $ignoreUserId))
            ->exists();

        if ($userExists) return "This email address is already in use.";

        $clientExists = Client::withTrashed()
            ->where('email', $email)
            ->when($ignoreUserId, fn($q) => $q->where('user_id', '!=', $ignoreUserId))
            ->exists();

        if ($clientExists) return "This email address is already in use.";

        $employeeExists = Employee::withTrashed()
            ->where('email', $email)
            ->when($ignoreUserId, fn($q) => $q->where('user_id', '!=', $ignoreUserId))
            ->exists();

        if ($employeeExists) return "This email address is already in use.";

        $leadExists = Lead::withTrashed()
            ->where('email', $email)
            ->exists();

        if ($leadExists) return "This email address is already in use.";

        return null;
    }

    public static function checkPhone(?string $phone, ?int $ignoreUserId = null): ?string
    {
        if (empty($phone)) return null;

        $phone = trim($phone);

        $userExists = User::withTrashed()
            ->where('phone', $phone)
            ->when($ignoreUserId, fn($q) => $q->where('id', '!=', $ignoreUserId))
            ->exists();

        if ($userExists) return "This phone number is already in use.";

        $clientExists = Client::withTrashed()
            ->where('phone', $phone)
            ->when($ignoreUserId, fn($q) => $q->where('user_id', '!=', $ignoreUserId))
            ->exists();

        if ($clientExists) return "This phone number is already in use.";

        $employeeExists = Employee::withTrashed()
            ->where('phone', $phone)
            ->when($ignoreUserId, fn($q) => $q->where('user_id', '!=', $ignoreUserId))
            ->exists();

        if ($employeeExists) return "This phone number is already in use.";

        $leadExists = Lead::withTrashed()
            ->where('phone', $phone)
            ->exists();

        if ($leadExists) return "This phone number is already in use.";

        return null;
    }
}
