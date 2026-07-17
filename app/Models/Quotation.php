<?php
namespace App\Models;

use App\Traits\HasWorkspace;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Enums\QuotationStatus;

class Quotation extends Model
{
    use HasWorkspace, SoftDeletes, LogsActivity;

    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    protected $casts = [
        'status' => QuotationStatus::class,
        'issue_date' => 'date',
        'valid_until' => 'date',
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll()->logOnlyDirty();
    }

    public function company(): BelongsTo { return $this->belongsTo(Company::class); }
    public function contact(): BelongsTo { return $this->belongsTo(Contact::class); }
    public function lead(): BelongsTo { return $this->belongsTo(Lead::class); }
    public function creator(): BelongsTo { return $this->belongsTo(User::class, 'created_by'); }
    public function updater(): BelongsTo { return $this->belongsTo(User::class, 'updated_by'); }

    // Versioning logic specified by the user
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Quotation::class, 'parent_id');
    }

    public function historyVersions(): HasMany
    {
        return $this->hasMany(Quotation::class, 'parent_id');
    }
}
