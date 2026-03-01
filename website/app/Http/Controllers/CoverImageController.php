<?php

namespace App\Http\Controllers;

use App\Models\FeaturedItem;
use Illuminate\Routing\Controller;
use Spatie\LaravelScreenshot\Facades\Screenshot;

class CoverImageController extends Controller {
    public function download(FeaturedItem $featuredItem, int $width, int $height) {
        try {
            $html = inertia('CoverImage.svelte', [
                'html' => $featuredItem->cover_image_content,
                'width' => $width,
                'height' => $height
            ])
                ->rootView('images.cover-image')
                ->withViewData([
                    'width' => $width,
                    'height' => $height,
                ])
                ->toResponse(request())
                ->getContent();

            $imageData = Screenshot::driver('gotenberg')
                ->html($html)
                ->width($width)
                ->height($height)
                ->base64();

            return response(base64_decode($imageData), 200)->header('Content-Type', 'image/png');
        } catch (\Throwable $t) {
            // TODO: Log to discord
            abort(404);
        }
    }
}
