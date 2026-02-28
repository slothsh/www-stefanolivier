<?php

namespace App\Http\Controllers;

use App\Models\CvContent;
use Carbon\Carbon;
use Illuminate\Routing\Controller;
use Spatie\LaravelPdf\Facades\Pdf;

class CvController extends Controller {
    public function downloadLatest() {
        try {
            $cvData = CvContent::hasTag('latest')->get();

            if ($cvData->isEmpty()) {
                abort(404);
            }

            $html = inertia('Cv.svelte', ['cv' => $cvData->last()])
                ->rootView('pdf.cv')
                ->withViewData('title', 'Download')
                ->toResponse(request())
                ->getContent();

            $cvName = sprintf('Stefan Olivier CV - %s.pdf', Carbon::today()->format('d M Y'));

            return Pdf::html($html)
                ->format('a4')
                ->name($cvName);
        } catch (\Throwable $t) {
            // TODO: Log to discord
            abort(404);
        }
    }
}
