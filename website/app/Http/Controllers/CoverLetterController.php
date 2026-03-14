<?php

namespace App\Http\Controllers;

use App\Actions\RenderBladeContent;
use App\Models\CoverLetterContent;
use Carbon\Carbon;
use Illuminate\Routing\Controller;
use Spatie\LaravelPdf\Facades\Pdf;

class CoverLetterController extends Controller {
    public function download($id) {
        try {
            $coverLetterData = CoverLetterContent::findOrFail($id);

            $content = $coverLetterData->content;
            if (is_array($content)) {
                $content = (new RenderBladeContent())($content, request()->query());
                $coverLetterData->content = $content;
            }

            $html = inertia('CoverLetter.svelte', ['coverLetter' => $coverLetterData])
                ->rootView('pdf.cover-letter')
                ->withViewData('title', 'Download Cover Letter')
                ->toResponse(request())
                ->getContent();

            $cvName = sprintf('Cover_Letter_%s.pdf', Carbon::today()->format('d_M_Y'));

            return Pdf::html($html)
                ->format('a4')
                ->name($cvName);
        } catch (\Throwable $t) {
            Log::channel('discord')->error($t->getMessage());
            abort(404);
        }
    }
}
