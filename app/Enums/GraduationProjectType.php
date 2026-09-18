<?php

namespace App\Enums;

enum GraduationProjectType: string
{
    case HARDWARE = 'hardware';
    case SOFTWARE = 'software';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
