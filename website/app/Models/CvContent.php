<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CvContent extends Model
{
    use HasFactory;

    protected $table = 'cv_content';

    protected $guarded = ['id'];

    protected $casts = [
        'content' => 'object',
        'tags' => \App\Models\CommaListToArray::class,
    ];
}
