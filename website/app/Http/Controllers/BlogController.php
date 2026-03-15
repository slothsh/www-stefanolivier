<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Routing\Controller;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class BlogController extends Controller {
    public function index(): Response {
        $posts = BlogPost::query()
            ->select('title', 'blurb', 'slug', 'posted_at', 'tags', 'read_time', 'author')
            ->orderBy('posted_at', 'desc')
            ->get()
            ->groupBy(function ($post) {
                return $post->posted_at->format('F Y');
            });

        return inertia('Blog.svelte', [
            'posts' => $posts,
        ]);
    }

    public function show(string $slug): Response {
        return inertia('SingleBlogPost.svelte', [
            'post' => BlogPost::query()->select('title', 'body_text', 'structured_content', 'tags', 'posted_at', 'read_time')->where('slug', $slug)->firstOrFail(),
        ]);
    }
}
