<?php
namespace App\Models;

use App\Traits\HasWorkspace;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Enums\ContactStatus;
use App\Enums\ContactType;

class Contact extends Model
{
    use HasWorkspace, SoftDeletes, LogsActivity;

    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    protected $casts = [
        'status' => ContactStatus::class,
        'type' => ContactType::class,
        'is_primary' => 'boolean',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function updater(): BelongsTo { return $this->belongsTo(User::class, 'updated_by'); }

    // Placholders for reusability across ecosystems
    public function meetings(): HasMany { return $this->hasMany(Meeting::class); }
    public function quotations(): HasMany { return $this->hasMany(Quotation::class); }
    public function contracts(): HasMany { return $this->hasMany(Contract::class); }
    public function tickets(): HasMany { return $this->hasMany(Ticket::class); }
}
