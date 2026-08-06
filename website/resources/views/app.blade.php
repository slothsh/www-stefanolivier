<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        @vite(['resources/js/app.ts'])
        @inertiaHead
        @routes('web')
    </head>
    <body>
        <div id="contour-bg"></div>
        <div id="app-wrapper">
            @inertia
        </div>
    </body>
</html>
