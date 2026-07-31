<?php
namespace App\Modules\Marketing\Models;

use App\Modules\CRM\Models\Lead;
use Illuminate\Database\Eloquent\Model;

class LeadAttribution extends Model
{
    protected $fillable = ['lead_id', 'source', 'utm_source', 'utm_campaign', 'utm_medium'];

    public function lead() { return $this->belongsTo(Lead::class); }
}
