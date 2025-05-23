<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CommaListToArray implements CastsAttributes
{
    public function get(Model $model, string $key, mixed $value, array $attributes): Collection
    {
        return collect(explode(',', $value))->map(fn ($tag) => trim($tag));
    }

    public function set(Model $model, string $key, mixed $value, array $attributes): string
    {
        return implode(',', $value);
    }
}

class BlogPost extends Model
{
    use HasFactory;

    protected $table = 'blog_posts';

    protected $guarded = ['id'];

    protected $casts = [
        'structured_content' => 'object',
        'tags' => CommaListToArray::class,
    ];
}
