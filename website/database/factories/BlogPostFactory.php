<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\BlogPost;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BlogPost>
 */
class BlogPostFactory extends Factory
{
    protected $model = BlogPost::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->text(32),
            'blurb' => $this->faker->text(512),
            'slug' => $this->faker->text(128),
            'content' => $this->faker->text(2048),
            'structured_content' => '',
            'tags' => $this->faker->randomElements(['tag1', 'tag2', 'tag3', 'tag4', 'tag5'], $this->faker->numberBetween(1, 5)),
            'read_time' => $this->faker->numberBetween(120, 60),
            'live' => true,
            'posted_at' => $this->faker->dateTime(),
        ];
    }
}
