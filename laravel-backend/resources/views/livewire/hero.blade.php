<section class="relative bg-gradient-to-br from-[#0a4d8c] via-[#0d5ea8] to-[#0288d1] overflow-hidden">
    {{-- Background cover image --}}
    <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1606824722920-4c652a70f348?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXBlcm1hcmtldCUyMGFpc2xlJTIwcHJvZHVjdHMlMjBzaGVsdmVzfGVufDF8fHx8MTc3MTU0MjE0N3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="TMO Suministros - Productos de Primera Necesidad" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-r from-[#0a4d8c]/85 via-[#0a4d8c]/60 to-transparent"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-3 sm:px-4 py-10 sm:py-16 md:py-24">
        <div class="max-w-3xl">
            {{-- Badge --}}
            <div
                class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-6">
                <span class="w-2 h-2 bg-[#00bcd4] rounded-full animate-pulse"></span>
                <span class="text-white/90 text-[11px] sm:text-[13px] font-sans">
                    Stock disponible ahora mismo
                </span>
            </div>

            {{-- Title --}}
            <h1 class="text-white mb-4 font-montserrat font-extrabold leading-[1.15] tracking-[-0.02em]"
                style="font-size: clamp(22px, 5vw, 42px);">
                PRODUCTOS DE PRIMERA NECESIDAD PARA TU EMPRESA
            </h1>

            {{-- Subtitle --}}
            <p class="text-white/85 mb-5 sm:mb-8 max-w-xl font-sans leading-relaxed"
                style="font-size: clamp(0.8rem, 2vw, 1.05rem);">
                TMO: Garantizando que el flujo de tu empresa nunca se detenga con productos esenciales siempre en stock.
                Despacho en 24h en Lima Metropolitana.
            </p>

            {{-- CTAs --}}
            <div class="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-10">
                <button onclick="document.getElementById('catalog').scrollIntoView({behavior: 'smooth'})"
                    class="flex items-center gap-2 bg-[#00bcd4] hover:bg-[#00a5bb] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-[#00bcd4]/25 font-montserrat font-bold text-[clamp(12px,2vw,14px)]">
                    <span class="hidden sm:inline">Abastecimiento Inmediato</span>
                    <span class="sm:hidden">Ver Productos</span>
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </button>
                <a href="#"
                    class="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-white/30 transition-all backdrop-blur-sm font-montserrat font-semibold text-[clamp(12px,2vw,14px)]">
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span class="hidden sm:inline">Descargar Catálogo de Esenciales</span>
                    <span class="sm:hidden">Catálogo</span>
                </a>
            </div>

            {{-- Trust indicators --}}
            <div class="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2">
                @foreach (['Despacho en 24h en Lima', '+2,000 productos en stock', 'Atención personalizada'] as $item)
                    <div class="flex items-center gap-1.5">
                        <svg class="w-4 h-4 text-[#00bcd4]" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-white/80 text-[13px] font-sans">
                            {{ $item }}
                        </span>
                    </div>
                @endforeach
            </div>
        </div>
    </div>
</section>
