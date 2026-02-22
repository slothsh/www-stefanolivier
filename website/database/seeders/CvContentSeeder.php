<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CvContent;

class CvContentSeeder extends Seeder
{
    public function run(): void
    {
        CvContent::factory()->create([
            'content' => [
                'name' => 'Stefan Olivier',
                'title' => 'Software Developer',
                'email' => 'hello@stefanolivier.com',
                'location' => 'Netherlands',
                'summary' => 'Full-stack software developer with expertise in modern web technologies. Passionate about building elegant solutions and delivering high-quality user experiences. Experienced in Laravel, TypeScript, and Svelte.',
                'experience' => [
                    [
                        'company' => 'Tech Company',
                        'position' => 'Senior Software Developer',
                        'startDate' => '2022-01',
                        'endDate' => null,
                        'description' => 'Leading development of web applications using Laravel and modern frontend frameworks.',
                        'highlights' => [
                            'Architected and implemented RESTful APIs serving 100K+ daily requests',
                            'Led migration from legacy jQuery to Svelte, improving performance by 40%',
                            'Mentored junior developers and established code review practices',
                        ],
                    ],
                    [
                        'company' => 'Digital Agency',
                        'position' => 'Full-Stack Developer',
                        'startDate' => '2019-06',
                        'endDate' => '2021-12',
                        'description' => 'Developed custom web solutions for diverse clients across multiple industries.',
                        'highlights' => [
                            'Built 15+ client projects using Laravel and Vue.js',
                            'Implemented CI/CD pipelines reducing deployment time by 60%',
                            'Integrated third-party APIs including payment gateways and CRM systems',
                        ],
                    ],
                ],
                'education' => [
                    [
                        'institution' => 'University of Technology',
                        'degree' => 'Bachelor of Computer Science',
                        'startDate' => '2015-09',
                        'endDate' => '2019-06',
                        'description' => 'Specialized in software engineering and web development',
                    ],
                ],
                'skills' => [
                    'PHP',
                    'Laravel',
                    'TypeScript',
                    'Svelte',
                    'Vue.js',
                    'Tailwind CSS',
                    'PostgreSQL',
                    'Redis',
                    'Docker',
                    'Git',
                ],
            ],
            'tags' => ['software-development', 'laravel', 'full-stack', 'typescript', 'svelte'],
        ]);
    }
}
