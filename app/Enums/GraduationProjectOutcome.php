<?php

namespace App\Enums;

enum GraduationProjectOutcome: string
{
    case PASSED = 'passed';
    case FAILED = 'failed';
    case UNKNOWN = 'unknown';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
