<?php

namespace App\Http\Controllers;

use App\Actions\GenerateContactCardQrCode;
use App\Models\CvContent;
use App\Models\FeaturedItem;
use Illuminate\Routing\Controller;
use Inertia\Response;

class HomepageController extends Controller
{
    public function index(GenerateContactCardQrCode $generateQrCode): Response
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

        return inertia('Homepage.svelte', [
            'featuredItems' => $featuredItems,
            'cvDownloadUrl' => $cvDownloadUrl,
            'contactCardQrCode' => $generateQrCode(),
        ]);
    }
}
