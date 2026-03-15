<?php

namespace App\Http\Controllers;

use App\Actions\GenerateContactCardQrCode;
use App\Actions\GenerateCvPdfQrCode;
use App\Models\BlogPost;
use App\Models\CvContent;
use Illuminate\Routing\Controller;
use Inertia\Response;

class BlogController extends Controller {
    public function index(GenerateContactCardQrCode $generateContactQrCode, GenerateCvPdfQrCode $generateCvPdfQrCode): Response {
        $posts = BlogPost::query()
            ->select('title', 'blurb', 'slug', 'posted_at', 'tags', 'read_time', 'author')
            ->orderBy('posted_at', 'desc')
            ->get()
            ->groupBy(function ($post) {
                return $post->posted_at->format('F Y');
            });

        $cvData = CvContent::hasTag('latest')->get();
        $cvDownloadUrl = ! $cvData->isEmpty() ? route('cv.latest.download') : null;

        return inertia('Blog.svelte', [
            'posts' => $posts,
            'cvDownloadUrl' => $cvDownloadUrl,
            'contactCardQrCode' => $generateContactQrCode(),
            'cvPdfQrCode' => $cvDownloadUrl ? $generateCvPdfQrCode() : null,
        ]);
    }

    public function show(string $slug, GenerateContactCardQrCode $generateContactQrCode, GenerateCvPdfQrCode $generateCvPdfQrCode): Response {
        $cvData = CvContent::hasTag('latest')->get();
        $cvDownloadUrl = ! $cvData->isEmpty() ? route('cv.latest.download') : null;

        return inertia('SingleBlogPost.svelte', [
            'post' => BlogPost::query()->select('title', 'content', 'structured_content', 'tags', 'posted_at', 'read_time', 'author')->where('slug', $slug)->firstOrFail(),
            'cvDownloadUrl' => $cvDownloadUrl,
            'contactCardQrCode' => $generateContactQrCode(),
            'cvPdfQrCode' => $cvDownloadUrl ? $generateCvPdfQrCode() : null,
        ]);
    }
}
