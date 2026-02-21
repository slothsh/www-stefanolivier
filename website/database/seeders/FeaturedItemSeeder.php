<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FeaturedItem;

class FeaturedItemSeeder extends Seeder
{
    public function run(): void
    {
        FeaturedItem::factory()
            ->github()
            ->count(3)
            ->create();

        FeaturedItem::factory()
            ->blog()
            ->count(2)
            ->create();

        FeaturedItem::factory()
            ->count(2)
            ->create();
    }
}
