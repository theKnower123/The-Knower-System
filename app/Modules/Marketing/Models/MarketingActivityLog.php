<?php
namespace App\Modules\Marketing\Models;

use Illuminate\Database\Eloquent\Model;

class MarketingActivityLog extends Model
{
    public $timestamps = false;
    protected $fillable = ['actor', 'action', 'target', 'at'];
    protected $casts = ['at' => 'datetime'];

    public static function record(string $actor, string $action, string $target): self
    {
        return static::create(compact('actor', 'action', 'target') + ['at' => now()]);
    }
}
