<?php

namespace App\Http\Controllers;

use App\Models\FeaturedItem;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Spatie\LaravelScreenshot\Facades\Screenshot;

class CoverImageController extends Controller {
    public function download(FeaturedItem $featuredItem, int $width, int $height) {
        try {
            $cacheKey = "cover_image_{$featuredItem->id}_{$width}_{$height}";

            $imageData = Cache::remember($cacheKey, now()->addMonth(), function () use ($featuredItem, $width, $height) {
                $html = inertia('CoverImage.svelte', [
                    'html' => $featuredItem->cover_image_content,
                    'width' => $width,
                    'height' => $height,
                ])
                    ->rootView('images.cover-image')
                    ->withViewData([
                        'width' => $width,
                        'height' => $height,
                    ])
                    ->toResponse(request())
                    ->getContent();

                return Screenshot::driver('gotenberg')
                    ->html($html)
                    ->width($width)
                    ->height($height)
                    ->base64();
            });

            return response(base64_decode($imageData), 200)->header('Content-Type', 'image/png');
        } catch (\Throwable $t) {
            Log::channel('discord')->error($t->getMessage());
            abort(404);
        }
    }
}
