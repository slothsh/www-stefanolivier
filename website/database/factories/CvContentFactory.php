<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\CvContent;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CvContent>
 */
class CvContentFactory extends Factory
{
    protected $model = CvContent::class;

    public function definition(): array
    {
        $experienceCount = $this->faker->numberBetween(2, 4);
        $educationCount = $this->faker->numberBetween(1, 2);

        $content = [
            'name' => $this->faker->name(),
            'title' => $this->faker->randomElement(['Software Developer', 'Full-Stack Developer', 'Senior Engineer', 'Tech Lead']),
            'email' => $this->faker->safeEmail(),
            'location' => $this->faker->country(),
            'summary' => $this->faker->paragraph(),
            'experience' => collect(range(1, $experienceCount))->map(fn ($i) => $this->experienceEntry($i))->toArray(),
            'education' => collect(range(1, $educationCount))->map(fn () => $this->educationEntry())->toArray(),
            'skills' => $this->faker->randomElements(
                ['PHP', 'Laravel', 'TypeScript', 'Svelte', 'Vue.js', 'React', 'Tailwind CSS', 'PostgreSQL', 'Redis', 'Docker', 'Git', 'Node.js', 'Python', 'AWS'],
                $this->faker->numberBetween(5, 10)
            ),
        ];

        return [
            'content' => $content,
            'tags' => collect($content['skills'])->take(5)->all(),
        ];
    }

    protected function experienceEntry(int $index): array
    {
        $startDate = $this->faker->dateTimeBetween('-10 years', '-1 year');
        $isCurrent = $index === 1;
        $endDate = $isCurrent ? null : $this->faker->dateTimeBetween($startDate, 'now');

        return [
            'company' => $this->faker->company(),
            'position' => $this->faker->randomElement(['Software Developer', 'Senior Developer', 'Full-Stack Developer', 'Tech Lead', 'Engineering Manager']),
            'startDate' => $startDate->format('Y-m'),
            'endDate' => $endDate?->format('Y-m'),
            'description' => $this->faker->sentence(),
            'highlights' => collect(range(1, $this->faker->numberBetween(2, 4)))->map(fn () => $this->faker->sentence())->toArray(),
        ];
    }

    protected function educationEntry(): array
    {
        $startDate = $this->faker->dateTimeBetween('-10 years', '-4 years');
        $endDate = $this->faker->dateTimeBetween($startDate, '+4 years');

        return [
            'institution' => $this->faker->company() . ' University',
            'degree' => $this->faker->randomElement(['Bachelor of Computer Science', 'Bachelor of Software Engineering', 'Master of Computer Science', 'Bachelor of IT']),
            'startDate' => $startDate->format('Y-m'),
            'endDate' => $endDate->format('Y-m'),
            'description' => $this->faker->sentence(),
        ];
    }
}
