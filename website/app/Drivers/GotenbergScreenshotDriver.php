<?php

namespace App\Drivers;

use Illuminate\Support\Facades\Http;
use Spatie\LaravelScreenshot\Drivers\ScreenshotDriver;
use Spatie\LaravelScreenshot\ScreenshotOptions;

class GotenbergScreenshotDriver implements ScreenshotDriver {
    public const string HTML_SCREENSHOT_PATH = '/forms/chromium/screenshot/html';

    public function __construct(protected array $config = []) {}

    public function generateScreenshot(
        string $input,
        bool $isHtml,
        ScreenshotOptions $options
    ): string {
        if ($isHtml) {
            $request = Http::gotenberg()
                ->asMultipart()
                ->post(self::HTML_SCREENSHOT_PATH, [
                    ['name' => 'files',  'contents' => $input, 'filename' => 'index.html'],
                    ['name' => 'width',  'contents' => $options->width],
                    ['name' => 'height', 'contents' => $options->height],
                ]);

            return $request->body();
        } else {
            throw new \Exception('TODO: not implemented');
        }
    }

    public function saveScreenshot(
        string $input,
        bool $isHtml,
        ScreenshotOptions $options,
        string $path
    ): void {
        throw new \Exception('TODO: not implemented');
    }
}
