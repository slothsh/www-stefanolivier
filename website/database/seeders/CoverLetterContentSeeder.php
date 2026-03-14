<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CoverLetterContent;

class CoverLetterContentSeeder extends Seeder
{
    public function run(): void
    {
        CoverLetterContent::factory()->create([
            'content' => [
                'date' => 'March 14, 2026',
                'recipient_name' => 'Hiring Manager',
                'recipient_title' => 'Hiring Manager',
                'recipient_company' => 'Tech Company',
                'recipient_address' => '123 Tech Street, Innovation City',
                'paragraphs' => [
                    'I am writing to express my interest in the Software Developer position at your company. With my extensive experience in full-stack development and passion for creating elegant solutions, I believe I would be a valuable addition to your team.',
                    'In my previous role as a Senior Software Developer at Tech Company, I led the development of web applications using Laravel and modern frontend frameworks. I architected and implemented RESTful APIs serving 100K+ daily requests and led migration from legacy jQuery to Svelte, improving performance by 40%.',
                    'I am particularly drawn to your company because of its commitment to innovation and quality. My experience in building scalable applications and my strong problem-solving skills align well with your team\'s goals.',
                    'I would welcome the opportunity to discuss how my background, skills, and enthusiasm can contribute to your team\'s success. Thank you for considering my application.'
                ],
                'closing' => 'Sincerely',
                'sender_name' => 'Stefan Olivier',
                'sender_title' => 'Software Developer',
                'sender_phone' => '+31 6 12345678',
                'sender_email' => 'hello@stefanolivier.com'
            ],
            'tags' => ['software-developer', 'application', 'cover-letter']
        ]);
    }
}
