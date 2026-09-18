<?php
namespace App\Enums;

enum LeadSource: string
{
    case WEBSITE = 'website';
    case REFERRAL = 'referral';
    case LINKEDIN = 'linkedin';
    case COLD_CALL = 'cold_call';
    case EVENT = 'event';
    case OTHER = 'other';
}
