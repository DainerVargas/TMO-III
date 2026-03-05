<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SSI Suministros - Soluciones Industriales</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700;800;900&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('build/assets/app.css') }}">

    <!-- Styles / Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
</head>

<body class="font-sans antialiased bg-[#f8f9fb]">
    <div class="min-h-screen flex flex-col">
        <livewire:navigation />

        <!-- Page Content -->
        <main class="flex-1">
            {{ $slot }}
        </main>

        <livewire:cart-drawer />
        <livewire:order-checkout />
        <x-footer />
    </div>

    @livewireScripts
</body>

</html>
