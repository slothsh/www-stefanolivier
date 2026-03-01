<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />

        <style type="text/css">
            body {
                width: {{ $width }}px;
                height: {{ $height }}px;
            }
        </style>

        <style type="text/css">{!! getCssFromManifest('resources/js/appImage.ts') !!}</style>
        @vite(['resources/js/appImage.ts'])
    </head>

    <body>
        @inertia
    </body>
</html>
