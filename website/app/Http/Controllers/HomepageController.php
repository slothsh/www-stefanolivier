<?php

namespace App\Http\Controllers;

use App\Actions\GenerateContactCardQrCode;
use App\Actions\GenerateCvPdfQrCode;
use App\Models\CvContent;
use App\Models\FeaturedItem;
use App\Models\BlogPost;
use Illuminate\Routing\Controller;
use Inertia\Response;

class HomepageController extends Controller
{
    public function index(GenerateContactCardQrCode $generateContactQrCode, GenerateCvPdfQrCode $generateCvPdfQrCode): Response
    {
        $featuredItems = FeaturedItem::visible()
            ->ordered()
            ->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'sourceType' => $item->source_type,
                'title' => $item->title,
                'description' => $item->description,
                'imageUrl' => $item->image_url,
                'linkUrl' => $item->link_url,
                'linkText' => $item->link_text,
                'metadata' => $item->metadata,
            ]);

        $cvData = CvContent::hasTag('latest')->get();
        $cvDownloadUrl = ! $cvData->isEmpty() ? route('cv.latest.download') : null;

        $hasBlogPosts = BlogPost::query()->exists();

        return inertia('Homepage.svelte', [
            'featuredItems' => $featuredItems,
            'cvDownloadUrl' => $cvDownloadUrl,
            'contactCardQrCode' => $generateContactQrCode(),
            'cvPdfQrCode' => $generateCvPdfQrCode(),
            'showBlogLink' => $hasBlogPosts,
        ]);
    }
}
