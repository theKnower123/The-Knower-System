<?php
namespace App\Enums;

enum ContactType: string
{
    case PRIMARY = 'primary';
    case TECHNICAL = 'technical';
    case BILLING = 'billing';
    case STANDARD = 'standard';
}
