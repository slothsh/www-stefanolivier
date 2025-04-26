<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Routing\Controller;
use Inertia\Response;

class BlogController extends Controller {
    public function index(): Response {
        return inertia('Blog.svelte', [
            'posts' => BlogPost::query()
                ->select('title', 'blurb', 'slug', 'posted_at', 'tags', 'read_time')
                ->get(),
        ]);
    }

    public function show(string $slug): Response {
        return inertia('SingleBlogPost.svelte', [
            'post' => BlogPost::query()->select('title', 'body_text', 'body_structured', 'tags', 'posted_at', 'read_time')->where('slug', $slug)->firstOrFail(),
        ]);
    }
}
