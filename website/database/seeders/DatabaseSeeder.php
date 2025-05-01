<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\BlogSeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            BlogSeeder::class,
        ]);
    }
}
