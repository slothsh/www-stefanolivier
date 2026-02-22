<?php

namespace App\Http\Controllers;

use App\Models\CvContent;
use Illuminate\Routing\Controller;
use Inertia\Response;
use Spatie\LaravelPdf\Facades\Pdf;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CvController extends Controller
{
    public function index(): Response
    {
        $cv = CvContent::firstOrFail();

        return inertia('Cv.svelte', [
            'cv' => $cv,
        ]);
    }

    public function download(CvContent $cv): StreamedResponse
    {
        return Pdf::view('pdf.cv', ['cv' => $cv])
            ->format('a4')
            ->driver('weasyprint')
            ->name('cv-' . $cv->id . '.pdf');
    }
}
