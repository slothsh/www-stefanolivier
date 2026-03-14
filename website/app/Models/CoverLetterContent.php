<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class CoverLetterContent extends Model
{
    use HasFactory;

    protected $table = 'cover_letter_content';

    protected $guarded = ['id'];

    protected $casts = [
        'content' => 'object',
        'tags' => \App\Models\CommaListToArray::class,
    ];

    public function scopeHasTag(Builder $query, string $tag): Builder {
        return $query->where(function ($q) use ($tag) {
            $q->where('tags', $tag)
                ->orWhere('tags', 'like', $tag . ',%')
                ->orWhere('tags', 'like', '%,' . $tag)
                ->orWhere('tags', 'like', '%,' . $tag . ',%');
        });
    }
}
