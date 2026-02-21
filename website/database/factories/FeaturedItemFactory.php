<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\FeaturedItem;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FeaturedItem>
 */
class FeaturedItemFactory extends Factory
{
    protected $model = FeaturedItem::class;

    public function definition(): array
    {
        $sourceTypes = ['github', 'blog', 'project', 'external'];
        $sourceType = $this->faker->randomElement($sourceTypes);

        return [
            'source_type' => $sourceType,
            'source_id' => $this->faker->slug(2),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->text(200),
            'image_url' => $this->faker->boolean(70) ? "https://picsum.photos/640/360" : null,
            'link_url' => $this->faker->url(),
            'link_text' => $this->faker->randomElement(['View Project', 'Read More', 'Check it out', 'GitHub']),
            'metadata' => $this->faker->boolean() ? ['stars' => $this->faker->numberBetween(1, 1000), 'language' => $this->faker->randomElement(['TypeScript', 'PHP', 'Rust', 'Python'])] : null,
            'sort_order' => $this->faker->numberBetween(0, 100),
            'is_visible' => true,
        ];
    }

    public function github(): static
    {
        return $this->state(fn (array $attributes) => [
            'source_type' => 'github',
            'link_url' => 'https://github.com/slothsh/' . $this->faker->slug(1),
            'link_text' => 'View on GitHub',
        ]);
    }

    public function blog(): static
    {
        return $this->state(fn (array $attributes) => [
            'source_type' => 'blog',
            'link_url' => '/blog/' . $this->faker->slug(2),
            'link_text' => 'Read Article',
        ]);
    }

    public function invisible(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_visible' => false,
        ]);
    }
}
