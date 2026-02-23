<?php

namespace App\Http\Controllers;

use App\Models\CvContent;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\LaravelPdf\Facades\Pdf;

class CvController extends Controller
{
    public function index(): Response
    {
        $cv = CvContent::firstOrFail();

        return inertia('Cv.svelte', [
            'cv' => $cv,
        ]);
    }

    public function download(CvContent $cv)
    {
        try {
            $html = inertia('Cv.svelte', ['cv' => $cv])
                ->rootView('pdf.cv')
                ->toResponse(request())
                ->getContent();

            return Pdf::html($html)
                ->format('a4')
                ->name('cv-' . $cv->id . '.pdf');
        } catch (\Throwable $t) {
            dd($t);
        }
    }
}
