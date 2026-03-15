<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class BlogPost extends Model
{
    use HasFactory;

    protected $table = 'blog_posts';

    protected $fillable = [
        'title',
        'blurb',
        'slug',
        'content',
        'structured_content',
        'tags',
        'read_time',
        'live',
        'posted_at',
        'author',
    ];

    protected $guarded = ['id'];

    protected $casts = [
        'structured_content' => 'object',
        'tags' => 'object',
        'posted_at' => 'datetime',
    ];
}
