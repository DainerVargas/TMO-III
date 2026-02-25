<div class="bg-white min-h-screen">
    {{-- Back link --}}
    <div class="max-w-7xl mx-auto px-4 py-3">
        <a href="/"
            class="inline-flex items-center gap-2 text-[#0a4d8c] hover:text-[#00bcd4] transition-colors font-sans font-bold text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Inicio
        </a>
    </div>

    {{-- Hero Section --}}
    <section class="relative py-14 px-4 overflow-hidden"
        style="background: linear-gradient(135deg, #0a4d8c 0%, #00bcd4 100%);">
        {{-- Decorative overlay pattern --}}
        <div class="absolute inset-0 opacity-10"
            style="background-image: url('https://www.transparenttextures.com/patterns/carbon-fibre.png');"></div>

        <div class="max-w-7xl mx-auto relative z-10 text-center text-white">
            <img src="{{ asset('storage/logos/logo-footer.png') }}"
                class="h-16 sm:h-20 mx-auto mb-6 filter brightness-0 invert" alt="SSI">
            <h1 class="font-montserrat font-black text-[1.8rem] sm:text-[2.8rem] leading-tight mb-4">
                Somos TMO Suministros Industriales
            </h1>
            <p class="max-w-2xl mx-auto font-sans text-base sm:text-lg font-medium leading-relaxed opacity-90">
                Tu aliado estratégico en suministros esenciales para empresas en Lima Metropolitana y Callao.
                Abastecemos tu operación con calidad, rapidez y los mejores precios.
            </p>
        </div>
    </section>

    {{-- Mision & Vision --}}
    <section class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid md:grid-cols-2 gap-6 lg:gap-8">
            {{-- Mision Card --}}
            <div
                class="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row gap-5 items-start">
                <div
                    class="w-12 h-12 rounded-2xl bg-[#0a4d8c] flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-900/20">
                    <x-icons.target class="w-6 h-6" />
                </div>
                <div>
                    <h2 class="text-[#0a4d8c] font-montserrat font-black text-xl mb-3 text-left">Misión</h2>
                    <p class="text-slate-600 font-sans leading-relaxed text-[14px]">
                        Proveer suministros industriales y de oficina de alta calidad a empresas de Lima Metropolitana y
                        Callao, garantizando entregas rápidas, precios competitivos y un servicio personalizado que
                        impulse la productividad de nuestros clientes.
                    </p>
                </div>
            </div>

            {{-- Vision Card --}}
            <div class="p-8 rounded-3xl text-white flex flex-col sm:flex-row gap-5 items-start shadow-xl"
                style="background: linear-gradient(135deg, #0a4d8c 0%, #00bcd4 100%);">
                <div
                    class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </div>
                <div>
                    <h2 class="font-montserrat font-black text-xl mb-3 text-left">Visión</h2>
                    <p class="font-sans leading-relaxed text-[14px] opacity-90 text-left">
                        Ser reconocidos como el proveedor líder en soluciones de abastecimiento empresarial en Lima,
                        destacándonos por nuestra rapidez, eficiencia y compromiso con la calidad. Convertirnos en un
                        ecosistema integral que facilite la gestión y optimización de los recursos corporativos.
                    </p>
                </div>
            </div>
        </div>
    </section>

    {{-- Values --}}
    <section class="bg-white py-12 px-4">
        <div class="max-w-7xl mx-auto text-center mb-10">
            <h2 class="text-[#0a4d8c] font-montserrat font-black text-3xl mb-3">Nuestros Valores</h2>
            <p class="text-slate-500 font-sans text-base">Los pilares que guían cada entrega y cada relación con
                nuestros
                clientes</p>
        </div>

        <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                {{-- Compromiso --}}
                <div class="p-8 rounded-3xl text-white text-center flex flex-col items-center justify-center transition-transform hover:-translate-y-1 shadow-lg"
                    style="background: #1868b0;">
                    <x-icons.handshake class="w-8 h-8 mb-4 opacity-70" />
                    <h3 class="font-montserrat font-black text-base uppercase tracking-widest mb-3">Compromiso</h3>
                    <p class="font-sans text-xs opacity-90 leading-relaxed">Nos comprometemos con cada cliente,
                        cumpliendo lo que prometemos y superando expectativas.</p>
                </div>
                {{-- Confianza --}}
                <div class="p-8 rounded-3xl text-white text-center flex flex-col items-center justify-center transition-transform hover:-translate-y-1 shadow-lg"
                    style="background: #0db5d6;">
                    <x-icons.shield class="w-8 h-8 mb-4 opacity-70" />
                    <h3 class="font-montserrat font-black text-base uppercase tracking-widest mb-3">Confianza</h3>
                    <p class="font-sans text-xs opacity-90 leading-relaxed">Construimos relaciones duraderas basadas en
                        la transparencia y la honestidad.</p>
                </div>
                {{-- Responsabilidad --}}
                <div class="p-8 rounded-3xl text-white text-center flex flex-col items-center justify-center transition-transform hover:-translate-y-1 shadow-lg"
                    style="background: #0ebedc;">
                    <x-icons.heart class="w-8 h-8 mb-4 opacity-70" />
                    <h3 class="font-montserrat font-black text-base uppercase tracking-widest mb-3">Responsabilidad</h3>
                    <p class="font-sans text-xs opacity-90 leading-relaxed">Cada pedido es importante. Cuidamos cada
                        detalle para garantizar tu satisfacción.</p>
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
                {{-- Innovacion --}}
                <div class="p-8 rounded-3xl text-white text-center flex flex-col items-center justify-center transition-transform hover:-translate-y-1 shadow-lg"
                    style="background: #1868b0;">
                    <x-icons.lightbulb class="w-8 h-8 mb-4 opacity-70" />
                    <h3 class="font-montserrat font-black text-base uppercase tracking-widest mb-3">Innovación</h3>
                    <p class="font-sans text-xs opacity-90 leading-relaxed">Incorporamos soluciones modernas para
                        optimizar el abastecimiento de tu empresa.</p>
                </div>
                {{-- Puntualidad --}}
                <div class="p-8 rounded-3xl text-white text-center flex flex-col items-center justify-center transition-transform hover:-translate-y-1 shadow-lg"
                    style="background: #0ebedc;">
                    <x-icons.clock class="w-8 h-8 mb-4 opacity-70" />
                    <h3 class="font-montserrat font-black text-base uppercase tracking-widest mb-3">Puntualidad</h3>
                    <p class="font-sans text-xs opacity-90 leading-relaxed">Entregamos a tiempo, porque sabemos que tu
                        operación no puede detenerse.</p>
                </div>
            </div>
        </div>
    </section>

    {{-- Why us? --}}
    <section class="max-w-7xl mx-auto px-4 py-12">
        <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
            <h2 class="text-[#0a4d8c] font-montserrat font-black text-2xl text-center mb-10">¿Por qué elegirnos?</h2>

            <div class="grid md:grid-cols-2 gap-x-10 gap-y-8">
                @foreach ([['icon' => 'truck', 'title' => 'Entrega Rápida', 'desc' => 'Despacho en 24-48h en Lima Metropolitana y Callao. Opción express disponible.'], ['icon' => 'award', 'title' => 'Productos de Calidad', 'desc' => 'Trabajamos con marcas reconocidas: Faber-Castell, Report, Millenium y más.'], ['icon' => 'shieldcheck', 'title' => 'Precios Competitivos', 'desc' => 'Precios mayoristas accesibles con opción de compra por unidad o por caja.'], ['icon' => 'users', 'title' => 'Atención Personalizada', 'desc' => 'Pedidos por WhatsApp con asesoría directa. Tu pedido, a un mensaje de distancia.']] as $feature)
                    <div class="flex gap-4 items-start px-2">
                        <div
                            class="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#0a4d8c] shrink-0 border border-blue-100 shadow-sm">
                            <x-dynamic-component :component="'icons.' . $feature['icon']" class="w-5 h-5" />
                        </div>
                        <div>
                            <h4 class="text-[#0a4d8c] font-bold text-base mb-1.5">{{ $feature['title'] }}</h4>
                            <p class="text-slate-500 font-sans text-xs leading-relaxed">{{ $feature['desc'] }}</p>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </section>
</div>
