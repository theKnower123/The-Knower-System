<?php

namespace App\Modules\HR\Models;

use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = [
        'name', 'head', 'employee_count',
    ];
}
