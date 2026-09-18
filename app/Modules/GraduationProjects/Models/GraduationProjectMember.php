<?php

namespace App\Modules\GraduationProjects\Models;

use Illuminate\Database\Eloquent\Model;

class GraduationProjectMember extends Model
{
    protected $fillable = [
        'graduation_project_id',
        'name',
        'phone',
        'email',
        'role_in_team',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function graduationProject()
    {
        return $this->belongsTo(GraduationProject::class);
    }
}
