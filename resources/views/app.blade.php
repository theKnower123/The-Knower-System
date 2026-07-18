<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>The Knower OS</title>
        <meta name="description" content="The Knower OS: unified ERP, CRM, projects, hosting, HR and support platform for software houses.">
        
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
        
        @inertiaHead
        @viteReactRefresh
        @vite('resources/js/app.tsx')
    </head>
    <body class="bg-background text-foreground antialiased">
        @inertia
    </body>
</html>
