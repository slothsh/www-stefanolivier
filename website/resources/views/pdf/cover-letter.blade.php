<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />

        <title>{{ $title ?? 'Cover Letter' }}</title>

        <style>
            @page {
                size: A4;
                margin: 12mm;
            }
        </style>

        <style type="text/css">{!! getCssFromManifest('resources/js/appPdf.ts') !!}</style>

        @vite(['resources/js/appPdf.ts'])
    </head>

    <body>
        @inertia
    </body>
</html>
