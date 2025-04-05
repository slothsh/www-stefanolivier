<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use Illuminate\Routing\Controller;
use Inertia\Response;

class BlogController extends Controller {
    public function index(): Response {
        return inertia('Blog.svelte', [
            'posts' => BlogPost::all()->pluck('content'),
        ]);
    }
}
