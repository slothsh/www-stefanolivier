<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class FeaturedItem extends Model
{
    use HasFactory;

    protected $table = 'featured_items';

    protected $guarded = ['id'];

    protected $casts = [
        'metadata' => 'object',
        'is_visible' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::updating(function (self $item) {
            self::clearCoverImageCache($item->id);
        });

        static::creating(function (self $item) {
            if ($item->cover_image_content) {
                self::clearCoverImageCache($item->id);
            }
        });
    }

    private static function clearCoverImageCache(int $id): void
    {
        $sizes = [
            [400, 300],
            [800, 600],
            [1200, 900],
        ];

        foreach ($sizes as [$width, $height]) {
            Cache::forget("cover_image_{$id}_{$width}_{$height}");
        }
    }

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
