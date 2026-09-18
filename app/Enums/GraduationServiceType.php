<?php

namespace App\Enums;

enum GraduationServiceType: string
{
    case CONSULTATION = 'consultation';
    case PARTIAL_EXECUTION = 'partial_execution';
    case FULL_EXECUTION = 'full_execution';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
