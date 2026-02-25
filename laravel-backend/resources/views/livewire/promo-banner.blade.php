<section class="bg-[#f5f7fa]">
    {{-- Static Image Banner --}}
    <div class="max-w-3xl mx-auto px-3 sm:px-6 pt-6 sm:pt-10">
        <div class="flex flex-col items-center gap-4">
            <div class="rounded-2xl overflow-hidden shadow-xl shadow-black/10 group">
                <img src="http://imagenes.tmo.com.pe/imagenes/portada/descuento%202.png"
                    alt="Promociones en productos de limpieza e higiene"
                    class="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]" />
            </div>

            <button onclick="document.getElementById('catalog').scrollIntoView({behavior: 'smooth'})"
                class="flex items-center gap-2.5 sm:gap-3 bg-[#00bcd4] hover:bg-[#00a5bb] text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-[#00bcd4]/40 active:scale-[0.97] font-montserrat font-bold text-[clamp(13px,2.5vw,18px)]">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Aprovechar Descuento
            </button>
        </div>
    </div>

    {{-- Stats Bar --}}
    <div class="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        <div class="bg-white rounded-xl p-4 sm:p-5 shadow-md shadow-black/5 border border-[#e3f2fd]">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                @foreach ([['icon' => 'ShieldCheck', 'value' => '+2,000', 'label' => 'Productos'], ['icon' => 'Truck', 'value' => '24h', 'label' => 'Despacho Lima'], ['icon' => 'Clock', 'value' => '8+', 'label' => 'Años de experiencia'], ['icon' => 'Zap', 'value' => '100%', 'label' => 'Stock garantizado']] as $stat)
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 sm:w-11 h-11 rounded-xl bg-gradient-to-br from-[#0a4d8c] to-[#0288d1] flex items-center justify-center shrink-0 shadow-md shadow-[#0a4d8c]/15">
                            @php
                                $icon = match ($stat['icon']) {
                                    'ShieldCheck' => 'ShieldCheck',
                                    'Truck' => 'Truck',
                                    'Clock' => 'Clock',
                                    'Zap' => 'Zap',
                                    default => 'Package',
                                };
                            @endphp
                            <x-dynamic-component :component="'icons.' . strtolower($icon)" class="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span
                                class="block text-[#0a4d8c] font-montserrat font-extrabold text-[clamp(1rem,2.5vw,1.3rem)]">
                                {{ $stat['value'] }}
                            </span>
                            <span class="text-[#64748b] text-[10px] sm:text-[12px] font-sans">
                                {{ $stat['label'] }}
                            </span>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    </div>
</section>
