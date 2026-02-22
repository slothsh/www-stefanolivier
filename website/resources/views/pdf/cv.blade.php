<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>CV - {{ $cv->content->name ?? 'CV' }}</title>
        <style>
            @page {
                size: A4;
                margin: 15mm;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                font-size: 11pt;
                line-height: 1.4;
                color: #1a1a1a;
                margin: 0;
                padding: 0;
            }
            a {
                color: inherit;
                text-decoration: none;
            }
        </style>
        @vite(['resources/js/app.ts'])
    </head>
    <body>
        @inertia
    </body>
</html>
