<?php

function getCssFromManifest(string $entry, string $buildPath = 'build'): string {
    $manifest = json_decode(file_get_contents(public_path("{$buildPath}/manifest.json")), true);

    $cssFiles = [];

    $collectCss = function (string $key) use (&$collectCss, $manifest, &$cssFiles) {
        $chunk = $manifest[$key] ?? null;
        if (!$chunk) return;

        foreach ($chunk['css'] ?? [] as $cssFile) {
            $cssFiles[] = $cssFile;
        }

        foreach ($chunk['imports'] ?? [] as $import) {
            $collectCss($import);
        }
    };

    $collectCss($entry);

    return collect(array_unique($cssFiles))
        ->map(fn($file) => file_get_contents(public_path("{$buildPath}/{$file}")))
        ->implode("\n");
}
