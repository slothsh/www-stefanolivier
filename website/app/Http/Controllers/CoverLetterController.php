<?php

namespace App\Http\Controllers;

use App\Models\CoverLetterContent;
use Carbon\Carbon;
use Illuminate\Routing\Controller;
use Spatie\LaravelPdf\Facades\Pdf;

class CoverLetterController extends Controller {
    public function download($id) {
        try {
            $coverLetterData = CoverLetterContent::findOrFail($id);

            // Process template variables from query params
            $content = $coverLetterData->content;
            if (is_array($content)) {
                // Replace template variables in content if needed
                // This would depend on how template variables are stored in the content
                // For now, we'll pass the content as-is and let the frontend handle variable replacement
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
            // TODO: Log to discord
            abort(404);
        }
    }
}
