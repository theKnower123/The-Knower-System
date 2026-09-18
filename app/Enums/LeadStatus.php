<?php

namespace App\Enums;

enum LeadStatus: string
{
    case NEW = 'new';
    case CONTACTED = 'contacted';
    case QUALIFIED = 'qualified';
    case LOST = 'lost';
    case CONVERTED = 'converted';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
