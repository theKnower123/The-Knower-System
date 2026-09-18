<?php

namespace App\Enums;

enum GraduationProjectStatus: string
{
    case PENDING_REVIEW = 'pending_review';
    case QUOTED = 'quoted';
    case IN_PROGRESS = 'in_progress';
    case DELIVERED = 'delivered';
    case CANCELLED = 'cancelled';
    case REJECTED = 'rejected';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
