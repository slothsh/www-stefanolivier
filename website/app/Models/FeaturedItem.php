<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FeaturedItem extends Model
{
    use HasFactory;

    protected $table = 'featured_items';

    protected $guarded = ['id'];

    protected $casts = [
        'metadata' => 'object',
        'is_visible' => 'boolean',
    ];

    public function scopeVisible($query)
    {
        return $query->where('is_visible', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    public function scopeBySource($query, string $sourceType)
    {
        return $query->where('source_type', $sourceType);
    }
}
