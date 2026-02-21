<?php

namespace App\Http\Controllers;

use App\Models\FeaturedItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class FeaturedItemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = FeaturedItem::visible()->ordered();

        if ($request->has('source_type')) {
            $query->bySource($request->string('source_type'));
        }

        $items = $query->get()->map(fn ($item) => [
            'id' => $item->id,
            'sourceType' => $item->source_type,
            'title' => $item->title,
            'description' => $item->description,
            'imageUrl' => $item->image_url,
            'linkUrl' => $item->link_url,
            'linkText' => $item->link_text,
            'metadata' => $item->metadata,
        ]);

        return response()->json($items);
    }
}
