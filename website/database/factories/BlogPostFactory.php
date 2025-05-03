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

    public function section(): array {
        return [
            'kind' => 'section',
            'content' => $this->faker->text(32),
            'children' => $this->subSection($this->faker->numberBetween(4, 8)),
        ];
    }

    public function subSection(int $totalChildren): array {
        return [
            [
                'kind' => 'heading',
                'content' => $this->faker->text(32),
            ],
            ...collect(range(0, $totalChildren))->map(fn () => $this->randomChild()),
            [
                'kind' => 'divider',
            ],
        ];
    }

    public function randomChild(): array {
        $kind = $this->faker->randomElement(['paragraph', 'code', 'image', 'callout']);

        $randomHeight = $this->faker->numberBetween(250, 500);

        return match ($kind) {
            'paragraph' => [
                'kind' => $kind,
                'content' => $this->faker->text(256),
            ],
            'code' => [
                'kind' => 'code',
                'content' => $this->faker->text(64),
                'language' => 'typescript',
            ],
            'image' => [
                'kind' => 'image',
                'source' => "https://picsum.photos/$randomHeight/$randomHeight",
                'height' => $randomHeight,
                'caption' => $this->faker->text(16),
            ],
            'callout' => [
                'kind' => 'callout',
                'content' => $this->faker->text(32),
                'icon' => $this->faker->randomElement(['question', 'warning', 'hint', 'error', 'info']),
                'children' => [
                    ...collect(range(0, $this->faker->numberBetween(1, 3)))->map(fn () => ['kind' => 'paragraph', 'content' => $this->faker->text(128)]),
                ],
            ],
        };
    }

    public function definition(): array
    {
        $structutedContent = collect(range(0, $this->faker->numberBetween(5, 10)))->map(fn () => self::section());

        return [
            'title' => $this->faker->text(32),
            'blurb' => $this->faker->text(512),
            'slug' => $this->faker->slug(8),
            'content' => $this->faker->text(2048),
            'structured_content' => $structutedContent,
            'tags' => $this->faker->randomElements(['tag1', 'tag2', 'tag3', 'tag4', 'tag5'], $this->faker->numberBetween(1, 5)),
            'read_time' => $this->faker->numberBetween(120, 60),
            'live' => true,
            'posted_at' => $this->faker->dateTime(),
        ];
    }
}
