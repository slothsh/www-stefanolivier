<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $table = 'blog_posts';
    protected $guarded = ['id'];

    protected $casts = [
        'content' => 'object',
    ];
}
