<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\CoverLetterContent;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CoverLetterContent>
 */
class CoverLetterContentFactory extends Factory
{
    protected $model = CoverLetterContent::class;

    public function definition(): array
    {
        $paragraphCount = $this->faker->numberBetween(3, 5);
        
        $content = [
            'date' => $this->faker->date('F d, Y'),
            'recipient_name' => $this->faker->name(),
            'recipient_title' => $this->faker->randomElement(['Hiring Manager', 'HR Manager', 'Recruiter', 'Talent Acquisition Specialist']),
            'recipient_company' => $this->faker->company(),
            'recipient_address' => $this->faker->optional()->address(),
            'paragraphs' => collect(range(1, $paragraphCount))->map(fn () => $this->faker->paragraph())->toArray(),
            'closing' => $this->faker->randomElement(['Sincerely', 'Best regards', 'Kind regards', 'Yours faithfully', 'Respectfully']),
            'sender_name' => $this->faker->name(),
            'sender_title' => $this->faker->optional()->randomElement(['Software Developer', 'Full-Stack Developer', 'Senior Engineer', 'Tech Lead']),
            'sender_phone' => $this->faker->optional()->phoneNumber(),
            'sender_email' => $this->faker->optional()->safeEmail(),
        ];

        return [
            'content' => $content,
            'tags' => collect(['software-developer', 'application', 'cover-letter', 'job-application', 'career'])->random(3)->all(),
        ];
    }
}
