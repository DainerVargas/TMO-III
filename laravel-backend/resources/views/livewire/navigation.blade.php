<div class="sticky top-0 z-[100] w-full shadow-2xl shadow-blue-900/10" x-data="{ mobileMenuOpen: @entangle('mobileMenuOpen'), scrolled: false }"
    @scroll.window="scrolled = (window.pageYOffset > 20)">
    {{-- Top Info Bar --}}
    <div class="bg-grad-top text-white py-2 px-4 shadow-sm" x-show="!scrolled" x-transition>
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-6">
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 011 1v2a1 1 0 01-1 1m-1-4h.01m-4 0h.01m4-10V4a1 1 0 00-1-1h-1m4 10V9a1 1 0 00-1-1h-1m4 10h1m0 0a2 2 0 002-2v-4a2 2 0 00-2-2h-1m-4-6V4a1 1 0 00-1-1h-1" />
                    </svg>
                    <span class="text-[12.5px] font-bold tracking-tight">Suministros Esenciales: Stock Garantizado y
                        Despacho en 24h en Lima</span>
                </div>
            </div>
            <div class="hidden lg:flex items-center gap-6">
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-[12px] font-bold">Lun-Vie 8:00-18:00</span>
                </div>
                <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span class="text-[12px] font-bold">Garantía Total en Productos</span>
                </div>
            </div>
        </div>
    </div>

    <header class="bg-white border-b border-gray-100 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-8">
            {{-- Logo --}}
            <a href="/" class="shrink-0 relative group">
                <div
                    class="absolute -inset-2 bg-grad-primary/10 rounded-2xl blur-lg group-hover:bg-grad-primary/20 transition-all">
                </div>
                <img src="http://imagenes.tmo.com.pe/imagenes/logotipo/SSI%20logo.png" alt="Smart Services"
                    class="h-10 sm:h-12 w-auto relative drop-shadow-sm">
            </a>

            {{-- Search --}}
            <div class="flex-1 max-w-2xl relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input type="text" placeholder="Buscar productos..." wire:model.live="searchQuery"
                    class="w-full pl-12 pr-4 py-3 bg-[#f8f9fb] border-none rounded-2xl text-[14.5px] placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-[#0a4d8c]/5 focus:bg-white transition-all font-sans font-medium">
            </div>

            {{-- Right Actions --}}
            <div class="flex items-center gap-5">
                <a href="{{ Auth::check() ? '/admin/dashboard' : '/login' }}"
                    class="hidden md:flex items-center gap-1 text-slate-700 hover:text-[#0a4d8c] font-black text-[14.5px] group">
                    <svg class="w-6 h-6 text-slate-400 group-hover:text-[#0a4d8c] transition-colors" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    @if (Auth::check())
                        {{ Auth::user()->name }} {{ Auth::user()->lastName }}
                    @else
                        Iniciar Sesión
                    @endif
                </a>

                <button wire:click="openCart"
                    class="bg-grad-primary hover:brightness-110 text-white px-6 py-3 rounded-2xl flex items-center gap-3 font-black text-[15px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Carrito
                    @if ($cartCount > 0)
                        <span
                            class="bg-[#00bcd4] px-1.5 py-0.5 rounded-md text-[11px] min-w-[20px] text-center">{{ $cartCount }}</span>
                    @endif
                </button>
            </div>
        </div>

        {{-- Nav --}}
        <nav class="bg-grad-accent">
            <div class="max-w-7xl mx-auto flex items-center justify-center">
                @foreach (['Inicio' => '/', 'Nuestra empresa' => '/empresa', 'Productos' => '/productos', 'Contáctanos' => '/contactanos'] as $label => $path)
                    <a href="{{ $path }}"
                        class="px-8 py-3 text-white font-black text-[14.5px] hover:bg-white/10 transition-all font-sans {{ Request::is(trim($path, '/')) || (Request::is('/') && $path === '/') ? 'bg-white/20' : '' }}">
                        {{ $label }}
                        @if ($label === 'Productos')
                            <svg class="inline-block w-4 h-4 ml-1 opacity-60" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        @endif
                    </a>
                @endforeach
            </div>
        </nav>
    </header>

    {{-- Mobile Menu --}}
    <div x-show="mobileMenuOpen" x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0 -translate-y-4" x-transition:enter-end="opacity-100 translate-y-0"
        class="md:hidden border-t border-white/10 px-4 py-4 space-y-2 shadow-2xl bg-grad-primary">
        @foreach (['Inicio' => '/', 'Nuestra empresa' => '/empresa', 'Productos' => '/productos', 'Contáctanos' => '/contactanos'] as $label => $path)
            <a href="{{ $path }}"
                class="w-full flex items-center justify-between px-5 py-4 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-all font-sans font-bold text-[1rem] border border-white/5">
                {{ $label }}
                <svg class="w-5 h-5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </a>
        @endforeach
    </div>
    </header>
</div>
