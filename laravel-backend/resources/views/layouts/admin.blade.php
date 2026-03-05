<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin - {{ config('app.name', 'ComercioGuajiro') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('build/assets/app.css') }}">

    <!-- Styles / Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
</head>

<body class="font-sans antialiased bg-[#f8f9fb] text-slate-900" x-data="{ sidebarOpen: false }">
    <div class="flex h-screen overflow-hidden">
        {{-- Mobile Sidebar Overlay --}}
        <div x-show="sidebarOpen" x-transition:enter="transition-opacity ease-linear duration-300"
            x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100"
            x-transition:leave="transition-opacity ease-linear duration-300" x-transition:leave-start="opacity-100"
            x-transition:leave-end="opacity-0" @click="sidebarOpen = false"
            class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"></div>

        {{-- Sidebar --}}
        <aside :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
            class="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#f1f5f9] transform transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto">
            <div class="flex flex-col h-full">
                <div class="p-6 flex items-center gap-3">
                    <div
                        class="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0a4d8c] shadow-lg shadow-blue-500/10">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <h1 class="text-[#0a4d8c] font-montserrat font-black text-[18px] tracking-tight">Admin TMO</h1>
                </div>

                <nav class="flex-1 px-4 space-y-2 mt-2">
                    @php
                        $menu = [
                            ['label' => 'Dashboard', 'icon' => 'home', 'route' => 'admin.dashboard'],
                            ['label' => 'Categorías', 'icon' => 'tag', 'route' => 'admin.categories'],
                            ['label' => 'Productos', 'icon' => 'package', 'route' => 'admin.products'],
                            ['label' => 'Pedidos', 'icon' => 'shopping-cart', 'route' => 'admin.orders'],
                            ['label' => 'Usuarios', 'icon' => 'users', 'route' => 'admin.users'],
                            ['label' => 'Inventario', 'icon' => 'archive', 'route' => 'admin.inventory'],
                            ['label' => 'Logs/Auditoría', 'icon' => 'shieldcheck', 'route' => 'admin.audit'],
                            ['label' => 'Mi Perfil', 'icon' => 'user', 'route' => 'admin.profile'],
                            ['label' => 'Configuración', 'icon' => 'settings', 'route' => 'admin.settings'],
                        ];
                    @endphp

                    @foreach ($menu as $item)
                        @php
                            $user = auth()->user();
                            $section = str_replace('admin.', '', $item['route']);
                            $role = strtoupper($user->role ?? '');

                            // Everyone can see Profile
                            if ($section === 'profile') {
                                $hasAccess = true;
                            } elseif ($role === 'ADMIN') {
                                $hasAccess = true;
                            } elseif ($role === 'MANAGER') {
                                $hasAccess = in_array($section, (array) ($user->permissions ?? []));
                            } else {
                                $hasAccess = false;
                            }
                        @endphp

                        @if ($hasAccess)
                            <a href="{{ route($item['route']) }}"
                                class="flex items-center gap-3 px-4 py-2 rounded-xl text-[14px] transition-all font-sans {{ request()->routeIs($item['route']) ? 'bg-[#f0f7ff] text-[#0a4d8c]' : 'text-slate-400 hover:bg-[#f8f9fb] hover:text-[#0a4d8c]' }}">
                                @include('components.icons.' . $item['icon'], [
                                    'class' =>
                                        'w-5 h-5 ' .
                                        (request()->routeIs($item['route']) ? 'text-[#0a4d8c]' : 'text-slate-300'),
                                ])
                                <span class="truncate">{{ $item['label'] }}</span>
                            </a>
                        @endif
                    @endforeach
                </nav>

                <div class="p-4 space-y-1 border-t border-slate-50">
                    <a href="/"
                        class="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[14px] text-slate-400 hover:bg-[#f8f9fb] hover:text-[#0a4d8c] transition-all font-sans">
                        @include('components.icons.external-link', ['class' => 'w-5 h-5'])
                        Ver Tienda
                    </a>
                    <form action="{{ route('logout') }}" method="POST">
                        @csrf
                        <button type="submit"
                            class="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[14px] text-red-500 hover:bg-red-50 transition-all text-left font-sans">
                            @include('components.icons.log-out', ['class' => 'w-5 h-5'])
                            Cerrar Sesión
                        </button>
                    </form>
                </div>
            </div>
        </aside>

        <div class="flex-1 flex flex-col h-full overflow-hidden">
            {{-- Admin Header --}}
            <header
                class="h-20 bg-white border-b border-[#f1f5f9] flex items-center justify-between px-8 shrink-0 z-30 transition-all">
                <div class="flex items-center gap-6 flex-1">
                    <button class="lg:hidden p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
                        @click="sidebarOpen = true">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {{-- Global Search --}}
                    @livewire('admin.global-search')
                </div>

                <div class="flex items-center gap-6">
                    {{-- Profile Link --}}
                    <a href="{{ route('admin.profile') }}"
                        class="p-2.5 rounded-xl hover:bg-slate-50 text-slate-300 hover:text-[#0a4d8c] transition-all {{ request()->routeIs('admin.profile') ? 'text-[#0a4d8c] bg-slate-50' : '' }}">
                        @include('components.icons.user', ['class' => 'w-6 h-6'])
                    </a>

                    {{-- Notifications --}}
                    @livewire('admin.notifications')

                    <div class="flex items-center gap-3 pl-6 border-l border-[#f1f5f9]">
                        <div class="text-right hidden sm:block">
                            <p class="text-[14px] font-black text-slate-800 leading-none mb-1">
                                {{ auth()->user()->name }}</p>
                            <p class="text-[11px] text-slate-300 font-black uppercase tracking-widest">
                                {{ auth()->user()->role }}</p>
                        </div>
                        <div
                            class="w-10 h-10 rounded-full bg-[#0a4d8c] text-white flex items-center justify-center font-black text-[16px] shadow-lg shadow-blue-500/20 border-2 border-white overflow-hidden shrink-0">
                            {{ substr(auth()->user()->name, 0, 1) }}
                        </div>
                    </div>
                </div>
            </header>

            {{-- Page Content --}}
            <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div class="max-w-7xl mx-auto">
                    {{ $slot }}
                </div>
            </main>
        </div>
    </div>

    @livewireScripts
</body>

</html>
