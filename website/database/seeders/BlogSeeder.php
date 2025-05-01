<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BlogPost;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        BlogPost::factory()
            ->count(50)
            ->create();
    }
}
