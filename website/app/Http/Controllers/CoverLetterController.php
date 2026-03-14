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
                $templateVars = request()->query(); // Get all query parameters
                
                // Recursively replace template variables in the content array
                $content = $this->replaceTemplateVariables($content, $templateVars);
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
    
    /**
     * Recursively replace template variables in an array or string
     */
    private function replaceTemplateVariables($data, array $templateVars) {
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                $data[$key] = $this->replaceTemplateVariables($value, $templateVars);
            }
            return $data;
        }
        
        if (is_string($data)) {
            // Replace template variables like {variable_name} with actual values
            foreach ($templateVars as $varName => $varValue) {
                $placeholder = '{' . $varName . '}';
                if (strpos($data, $placeholder) !== false) {
                    $data = str_replace($placeholder, $varValue, $data);
                }
            }
            return $data;
        }
        
        return $data;
    }
}
