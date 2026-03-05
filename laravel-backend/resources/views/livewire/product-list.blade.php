<div x-on:scroll-to-catalog.window="document.getElementById('catalog').scrollIntoView({behavior: 'smooth'})">
    @if (request()->routeIs('home'))
        {{-- HOME PAGE LAYOUT (Original) --}}
        <livewire:hero />
        <livewire:promo-banner />

        {{-- Category Section --}}
        <section class="py-10 sm:py-16 px-3 sm:px-4 bg-white">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-8 sm:mb-12">
                    <h2 class="text-[#0a4d8c] mb-2 font-montserrat font-bold text-[clamp(1.2rem,4vw,1.8rem)]">
                        Categorías de Suministros Esenciales
                    </h2>
                    <p class="text-slate-400 text-[14px] sm:text-[16px] font-sans">
                        Acceso rápido a los productos que tu operación necesita cada día
                    </p>
                </div>

                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    @foreach ($categories as $cat)
                        <button wire:click="setCategory('{{ $cat->id }}')"
                            onclick="document.getElementById('catalog').scrollIntoView({behavior: 'smooth'})"
                            class="group flex flex-col items-center gap-2 sm:gap-4 p-5 sm:p-8 rounded-2xl transition-all duration-300 border border-transparent 
                            {{ $selectedCategory === $cat->id ? 'bg-[#0a4d8c] shadow-2xl shadow-[#0a4d8c]/30 scale-[1.02]' : 'bg-[#f5f7fa] hover:bg-slate-200' }}">

                            <div
                                class="{{ $selectedCategory === $cat->id ? 'text-[#00bcd4]' : 'text-[#0a4d8c]' }} transition-colors">
                                @php
                                    $iconName = match (true) {
                                        str_contains(strtolower($cat->name), 'limpieza') => 'sparkles',
                                        str_contains(strtolower($cat->name), 'oficina') => 'penline',
                                        str_contains(strtolower($cat->name), 'seguridad') => 'shield',
                                        str_contains(strtolower($cat->name), 'tecnología') => 'monitor',
                                        str_contains(strtolower($cat->name), 'cafetería') ||
                                            str_contains(strtolower($cat->name), 'alimentos')
                                            => 'coffee',
                                        str_contains(strtolower($cat->name), 'empaque') ||
                                            str_contains(strtolower($cat->name), 'embalaje')
                                            => 'package',
                                        str_contains(strtolower($cat->name), 'herramientas') => 'wrench',
                                        str_contains(strtolower($cat->name), 'sabanillas') => 'clipboard-list',
                                        str_contains(strtolower($cat->name), 'logística') => 'truck',
                                        default => 'package',
                                    };
                                @endphp
                                <x-dynamic-component :component="'icons.' . $iconName" class="w-7 h-7 sm:w-8 sm:h-8" />
                            </div>

                            <span
                                class="text-[13px] sm:text-[15px] text-center font-sans font-semibold transition-colors
                                {{ $selectedCategory === $cat->id ? 'text-white' : 'text-[#1e293b]' }}">
                                {{ $cat->name }}
                            </span>
                        </button>
                    @endforeach
                </div>
            </div>
        </section>

        <section id="catalog" class="py-8 sm:py-12 px-4 bg-[#f8f9fb]">
            <div class="max-w-7xl mx-auto">
                {{-- Section header --}}
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h2 class="text-[#0a4d8c] font-montserrat font-black text-[1.8rem] tracking-tight">
                            Catálogo de Suministros
                        </h2>
                        <p class="text-gray-400 text-[14px] font-sans font-medium mt-1">
                            {{ $products->total() }} productos disponibles
                        </p>
                    </div>

                    <div class="flex items-center gap-3 flex-wrap">
                        {{-- Urgency filter --}}
                        <button wire:click="toggleTodayOnly"
                            class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] transition-all border bg-white {{ $todayOnly ? 'text-[#0a4d8c] border-[#0a4d8c] shadow-lg shadow-blue-500/5' : 'text-gray-500 border-gray-100' }} font-bold font-sans">
                            <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Entrega Hoy mismo
                        </button>

                        {{-- Sort --}}
                        <div class="relative">
                            <select wire:model.live="sortBy"
                                class="appearance-none bg-white border border-gray-100 rounded-xl px-4 py-2.5 pr-10 text-[13px] text-gray-700 focus:outline-none focus:ring-4 focus:ring-[#0a4d8c]/5 focus:border-[#0a4d8c] cursor-pointer font-bold font-sans">
                                <option value="name">Nombre A-Z</option>
                                <option value="price-asc">Precio: Menor a Mayor</option>
                                <option value="price-desc">Precio: Mayor a Menor</option>
                                <option value="stock">Mayor Stock</option>
                            </select>
                            <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {{-- View mode toggle --}}
                        <div
                            class="flex items-center bg-white border border-gray-100 rounded-xl overflow-hidden p-1 shadow-sm">
                            <button wire:click="setViewMode('grid')"
                                class="p-2.5 rounded-lg transition-all {{ $viewMode === 'grid' ? 'bg-[#0a4d8c] text-white shadow-md' : 'text-gray-400 hover:text-[#0a4d8c]' }}">
                                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button wire:click="setViewMode('list')"
                                class="p-2.5 rounded-lg transition-all {{ $viewMode === 'list' ? 'bg-[#0a4d8c] text-white shadow-md' : 'text-gray-400 hover:text-[#0a4d8c]' }}">
                                <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {{-- Category pills --}}
                <div class="flex items-center gap-2.5 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    <button wire:click="setCategory('all')"
                        class="px-6 py-2.5 rounded-full text-[13px] whitespace-nowrap transition-all border {{ $selectedCategory === 'all' ? 'bg-[#0a4d8c] text-white border-[#0a4d8c] shadow-lg shadow-blue-500/20' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0a4d8c]/30' }} font-bold font-sans">
                        Todos
                    </button>
                    @foreach ($categories as $cat)
                        <button wire:click="setCategory('{{ $cat->id }}')"
                            class="px-6 py-2.5 rounded-full text-[13px] whitespace-nowrap transition-all border {{ $selectedCategory === $cat->id ? 'bg-[#0a4d8c] text-white border-[#0a4d8c] shadow-lg shadow-blue-500/20' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0a4d8c]/30' }} font-bold font-sans">
                            {{ $cat->name }}
                        </button>
                    @endforeach
                </div>

                {{-- Products --}}
                @if ($products->isEmpty())
                    <div class="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
                        <img src="https://illustrations.popsy.co/amber/shaking-hands.svg"
                            class="w-48 h-48 mx-auto mb-6 opacity-50" alt="Void">
                        <h3 class="text-[#0a4d8c] font-montserrat font-bold text-xl mb-2">No encontramos resultados</h3>
                        <p class="text-[14px] text-gray-400 font-sans max-w-sm mx-auto">
                            Intenta ajustar tus criterios de búsqueda o explora otras categorías.
                        </p>
                    </div>
                @elseif($viewMode === 'grid')
                    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        @foreach ($products as $product)
                            <div wire:key="product-grid-{{ $product->id }}"
                                class="bg-white rounded-[1.5rem] p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#0a4d8c]/5 transition-all duration-300 group flex flex-col relative"
                                x-data="{ quantity: 1, unit: '{{ $product->price > 0 ? 'box' : 'unit' }}', basePrice: {{ $product->price_with_igv }}, unitPrice: {{ $product->unit_price_with_igv }}, unitLabel: '{{ $product->unit }}', unitPriceLabel: '{{ $product->unitPriceUnit ?? '' }}' }">

                                {{-- Badges Top --}}
                                <div class="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                    @if ($product->stock > 0)
                                        <span
                                            class="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                                            En Stock
                                        </span>
                                    @else
                                        <span
                                            class="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                                            Agotado
                                        </span>
                                    @endif
                                </div>

                                {{-- Image --}}
                                <div wire:click="viewProduct({{ $product->id }})"
                                    class="relative aspect-square mb-4 group-hover:scale-105 transition-transform duration-500 cursor-pointer">
                                    <img src="{{ $product->image }}" alt="{{ $product->name }}"
                                        class="w-full h-full object-contain drop-shadow-md">
                                </div>

                                {{-- Content --}}
                                <div class="flex flex-col flex-1">
                                    <div class="mb-4">
                                        <p
                                            class="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-tighter mb-1">
                                            {{ $product->sku }} · {{ $product->brand }}
                                        </p>
                                        <h3 wire:click="viewProduct({{ $product->id }})"
                                            class="text-[14px] font-bold text-slate-800 leading-tight line-clamp-2 h-[2.2rem] font-sans hover:text-[#0a4d8c] transition-colors cursor-pointer">
                                            {{ $product->name }}
                                        </h3>
                                    </div>

                                    <div class="mt-auto space-y-4">
                                        {{-- Unit Toggle & Technical Sheet --}}
                                        <div class="flex items-center justify-between gap-2 flex-wrap min-h-[32px]">
                                            @if ($product->price > 0 && $product->unitPrice > 0)
                                                <div class="flex bg-slate-100 p-0.5 rounded-lg w-max">
                                                    <button @click="unit = 'unit'"
                                                        :class="unit === 'unit' ? 'bg-white shadow-sm text-[#0a4d8c]' :
                                                            'text-slate-400'"
                                                        class="px-2.5 py-1 rounded-md text-[9px] font-black transition-all">
                                                        {{ $product->unitPriceUnit }}
                                                    </button>
                                                    <button @click="unit = 'box'"
                                                        :class="unit === 'box' ? 'bg-white shadow-sm text-[#0a4d8c]' :
                                                            'text-slate-400'"
                                                        class="px-2.5 py-1 rounded-md text-[9px] font-black transition-all">
                                                        {{ $product->unit }}
                                                    </button>
                                                </div>
                                            @endif

                                            @if ($product->technicalSheet)
                                                <a href="{{ $product->technicalSheet }}" target="_blank"
                                                    class="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-100 text-[#0a4d8c] rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-[#0a4d8c] hover:text-white transition-all shadow-sm group/sheet">
                                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2.5"
                                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <span class="sr-only sm:not-sr-only">Ficha Técnica</span>
                                                </a>
                                            @endif
                                        </div>

                                        <div class="flex flex-col">
                                            <div class="flex items-baseline gap-1">
                                                <span class="text-[12px] font-bold text-gray-400">S/</span>
                                                <span
                                                    class="text-[1.3rem] font-black text-[#0a4d8c] font-montserrat leading-none">
                                                    <span
                                                        x-text="unit === 'unit' ? unitPrice.toFixed(2) : basePrice.toFixed(2)"></span>
                                                </span>
                                                <span class="text-[11px] text-gray-400 font-bold ml-1"
                                                    x-text="'/' + (unit === 'unit' ? unitPriceLabel : unitLabel)"></span>
                                            </div>
                                        </div>

                                        {{-- Qty & Add --}}
                                        <div class="flex flex-col gap-2">
                                            <button wire:click="viewProduct({{ $product->id }})"
                                                class="w-full py-2 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-white hover:shadow-sm transition-all flex items-center justify-center gap-2">
                                                Ver más
                                            </button>
                                            <div class="flex items-center gap-2">
                                                <div
                                                    class="flex items-center bg-gray-50 border border-gray-100 rounded-xl overflow-hidden px-1 shrink-0">
                                                    <button @click="if(quantity > 1) quantity--"
                                                        class="p-1.5 text-gray-400 hover:text-[#0a4d8c] transition-colors">
                                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor"
                                                            viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                stroke-width="2" d="M20 12H4" />
                                                        </svg>
                                                    </button>
                                                    <input type="number" x-model="quantity"
                                                        class="w-8 text-center text-[13px] font-black font-sans bg-transparent border-none p-0 focus:ring-0">
                                                    <button @click="quantity++"
                                                        class="p-1.5 text-gray-400 hover:text-[#0a4d8c] transition-colors">
                                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor"
                                                            viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <button @click="$wire.addToCart({{ $product->id }}, quantity, unit)"
                                                    class="flex-1 bg-[#0a4d8c] text-white py-2.5 rounded-xl font-black text-[12px] uppercase tracking-wider shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 hover:bg-[#083d6f] active:scale-95 transition-all">
                                                    Agregar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                @else
                    <div class="space-y-3">
                        @foreach ($products as $product)
                            <div wire:key="product-list-{{ $product->id }}"
                                class="bg-white rounded-[1.2rem] p-3 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#0a4d8c]/5 transition-all duration-300 flex items-center gap-4 sm:gap-6 group relative"
                                x-data="{ quantity: 1, unit: '{{ $product->price > 0 ? 'box' : 'unit' }}', basePrice: {{ $product->price_with_igv }}, unitPrice: {{ $product->unit_price_with_igv }}, unitLabel: '{{ $product->unit }}', unitPriceLabel: '{{ $product->unitPriceUnit ?? '' }}' }">
                                <div
                                    class="w-20 h-20 sm:w-28 sm:h-28 bg-gray-50 rounded-[1rem] p-3 shrink-0 transition-transform group-hover:scale-105 duration-500">
                                    <img src="{{ $product->image }}" alt="{{ $product->name }}"
                                        class="w-full h-full object-contain">
                                </div>

                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center gap-2 mb-1">
                                        <span
                                            class="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">
                                            En Stock
                                        </span>
                                        <p
                                            class="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-tighter">
                                            {{ $product->sku }} · {{ $product->brand }}
                                        </p>
                                    </div>
                                    <h3
                                        class="text-[16px] font-bold text-slate-800 leading-tight mb-1 font-sans truncate">
                                        {{ $product->name }}
                                    </h3>

                                    <div class="flex items-center gap-4">
                                        <div class="flex items-baseline gap-1">
                                            <span class="text-[12px] font-bold text-gray-400">S/</span>
                                            <div class="flex flex-col gap-3">
                                                <div
                                                    class="flex items-center justify-between gap-2 flex-wrap min-h-[32px]">
                                                    @if ($product->price > 0 && $product->unitPrice > 0)
                                                        <div
                                                            class="flex bg-slate-100 p-0.5 rounded-lg w-max shadow-sm">
                                                            <button @click="unit = 'unit'"
                                                                :class="unit === 'unit' ?
                                                                    'bg-white shadow-sm text-[#0a4d8c]' :
                                                                    'text-slate-400'"
                                                                class="px-3 py-1 rounded-md text-[10px] font-black transition-all">
                                                                {{ $product->unitPriceUnit }}
                                                            </button>
                                                            <button @click="unit = 'box'"
                                                                :class="unit === 'box' ?
                                                                    'bg-white shadow-sm text-[#0a4d8c]' :
                                                                    'text-slate-400'"
                                                                class="px-3 py-1 rounded-md text-[10px] font-black transition-all">
                                                                {{ $product->unit }}
                                                            </button>
                                                        </div>
                                                    @endif

                                                    @if ($product->technicalSheet)
                                                        <a href="{{ $product->technicalSheet }}" target="_blank"
                                                            class="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-100 text-[#0a4d8c] rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-[#0a4d8c] hover:text-white transition-all shadow-sm group/sheet">
                                                            <svg class="w-3.5 h-3.5" fill="none"
                                                                stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2.5"
                                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span class="hidden sm:inline">Ficha Técnica</span>
                                                            <span class="sm:hidden">Ficha</span>
                                                        </a>
                                                    @endif
                                                </div>

                                                <div class="flex items-baseline">
                                                    <span
                                                        class="text-[1.6rem] font-black text-[#0a4d8c] font-montserrat">
                                                        S/ <span
                                                            x-text="unit === 'unit' ? unitPrice.toFixed(2) : basePrice.toFixed(2)"></span>
                                                    </span>
                                                    <span class="text-[12px] text-gray-400 font-bold ml-1 uppercase"
                                                        x-text="'/' + (unit === 'unit' ? unitPriceLabel : unitLabel)"></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                                        <div
                                            class="flex items-center bg-gray-50 border border-gray-100 rounded-xl overflow-hidden px-1">
                                            <button @click="if(quantity > 1) quantity--"
                                                class="p-2 text-gray-400 hover:text-[#0a4d8c] transition-colors">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <input type="number" x-model="quantity"
                                                class="w-10 text-center text-[14px] font-black font-sans bg-transparent border-none p-0 focus:ring-0">
                                            <button @click="quantity++"
                                                class="p-2 text-gray-400 hover:text-[#0a4d8c] transition-colors">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </button>
                                        </div>

                                        <button @click="$wire.addToCart({{ $product->id }}, quantity, unit)"
                                            class="bg-[#0a4d8c] text-white px-6 py-2.5 rounded-xl font-black text-[12px] uppercase tracking-wider shadow-lg shadow-blue-500/10 hover:shadow-blue-500/40 hover:bg-[#083d6f] active:scale-95 transition-all">
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                        @endforeach
                    </div>
                @endif

                <div class="mt-12">
                    {{ $products->links() }}
                </div>
            </div>
        </section>

        {{-- About Section --}}
        <section class="py-10 sm:py-16 px-3 sm:px-4 bg-white" id="about">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-16 sm:mb-24">
                    <div
                        class="inline-flex items-center gap-2 bg-[#f0f7ff] rounded-full px-5 py-2 mb-6 shadow-sm border border-blue-50/50">
                        <span class="w-2.5 h-2.5 bg-[#00bcd4] rounded-full animate-pulse"></span>
                        <span class="text-[#0a4d8c] text-[14px] font-sans font-bold tracking-wide uppercase">Nuestra
                            Empresa</span>
                    </div>
                    <h2
                        class="text-[#0a4d8c] mb-6 font-montserrat font-black text-[clamp(1.8rem,5vw,3rem)] leading-tight tracking-tight">
                        Sobre Nosotros
                    </h2>
                    <p
                        class="text-slate-500 max-w-3xl mx-auto font-sans text-[clamp(15px,2vw,18px)] leading-relaxed font-medium">
                        Somos TMO Suministros, una empresa líder dedicada a proveer insumos esenciales para la industria
                        nacional con eficiencia garantizada.
                    </p>
                </div>

                <div class="grid md:grid-cols-2 gap-6 sm:gap-10 items-center mb-10 sm:mb-14">
                    <div class="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
                        <img src="https://images.unsplash.com/photo-1762232621830-a96c14a5e19d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwc3VwcGx5JTIwY2hhaW4lMjBkZWxpdmVyeSUyMHRydWNrfGVufDF8fHx8MTc3MDY3NDg2MXww&ixlib=rb-4.1.0"
                            alt="Centro de distribución" class="w-full h-full object-cover">
                        <div class="absolute bottom-4 left-4 right-4 p-4 rounded-xl text-white backdrop-blur-md"
                            style="background: linear-gradient(135deg, rgba(10,77,140,0.9) 0%, rgba(0,188,212,0.85) 100%)">
                            <p class="text-[14px] font-montserrat font-bold">Centro de Distribución Lima</p>
                            <p class="text-white/80 text-[12px] mt-0.5 font-sans">Av. Argentina, Cercado de Lima -
                                Despacho a Lima Metropolitana</p>
                        </div>
                    </div>

                    <div>
                        <h3
                            class="text-slate-900 mb-6 font-montserrat font-bold text-[1.6rem] leading-tight tracking-tight">
                            Más de <span class="text-[#0a4d8c]">15 años</span> impulsando el crecimiento de la
                            industria peruana
                        </h3>
                        <div class="space-y-4">
                            <p class="text-slate-500 font-sans text-[15px] leading-relaxed">
                                En TMO entendemos que la continuidad operativa de tu empresa depende de tener los
                                suministros correctos en el momento exacto. Por eso mantenemos un inventario permanente
                                de más de 2,000 productos esenciales.
                            </p>
                            <div class="grid grid-cols-2 gap-4 mt-8">
                                @foreach ([['value' => '+15', 'label' => 'Años experiencia', 'icon' => 'Award'], ['value' => '+2,000', 'label' => 'Productos', 'icon' => 'ShieldCheck'], ['value' => '24h', 'label' => 'Despacho', 'icon' => 'Truck'], ['value' => '+500', 'label' => 'Clientes', 'icon' => 'Users']] as $stat)
                                    <div
                                        class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100/50 hover:bg-white hover:shadow-lg transition-all duration-300">
                                        <div
                                            class="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 bg-[#0a4d8c] shadow-md shadow-[#0a4d8c]/10">
                                            <x-dynamic-component :component="'icons.' . strtolower($stat['icon'])" class="w-6 h-6" />
                                        </div>
                                        <div>
                                            <span
                                                class="text-[#0a4d8c] block font-montserrat font-black text-[1.3rem] leading-none mb-1">{{ $stat['value'] }}</span>
                                            <span
                                                class="text-slate-500 text-[11px] font-sans font-bold uppercase tracking-tight">{{ $stat['label'] }}</span>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    @else
        {{-- PRODUCTS PAGE LAYOUT (Redesigned with Sidebar) --}}
        {{-- Breadcrumb Support --}}
        <div class="bg-gray-50 border-b border-gray-100 py-3">
            <div class="max-w-7xl mx-auto px-4">
                <a href="/"
                    class="text-[#0a4d8c] hover:underline text-[13px] font-bold flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver al Inicio
                </a>
            </div>
        </div>

        {{-- Hero Section Redesigned --}}
        <section class="relative bg-[#0a4d8c] py-16 sm:py-24 overflow-hidden">
            <div class="absolute inset-0 opacity-10">
                <div class="absolute inset-0"
                    style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 30px 30px;">
                </div>
            </div>

            <div class="relative max-w-7xl mx-auto px-4 text-center">
                <div
                    class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-md rounded-2xl mb-6 shadow-xl border border-white/20">
                    <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>

                <h1
                    class="text-white text-[32px] sm:text-[48px] font-montserrat font-black mb-4 tracking-tight leading-tight uppercase">
                    Nuestros Productos
                </h1>
                <p class="text-white/80 text-[14px] sm:text-[16px] max-w-2xl mx-auto font-sans leading-relaxed">
                    Explora nuestro catálogo de suministros industriales y de oficina para Lima Metropolitana y Callao.
                </p>
            </div>
        </section>

        <section id="catalog" class="py-12 px-4 bg-[#f8f9fb]">
            <div class="max-w-7xl mx-auto">
                <div class="flex flex-col lg:flex-row gap-8">
                    {{-- Sidebar --}}
                    <aside class="w-full lg:w-64 shrink-0 space-y-8">
                        <div>
                            <h3
                                class="text-slate-900 font-montserrat font-bold text-[18px] mb-5 flex items-center gap-2">
                                Categorías
                            </h3>
                            <div class="space-y-1">
                                <button wire:click="setCategory('all')"
                                    class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[14px] transition-all font-sans font-bold {{ $selectedCategory === 'all' ? 'bg-[#0a4d8c] text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-100' }}">
                                    <div class="flex items-center gap-3">
                                        <x-icons.box
                                            class="w-5 h-5 {{ $selectedCategory === 'all' ? 'text-white' : 'text-slate-400' }}" />
                                        Todos ({{ $totalProducts }})
                                    </div>
                                </button>

                                @foreach ($categories as $cat)
                                    <button wire:click="setCategory('{{ $cat->id }}')"
                                        class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[14px] transition-all font-sans font-bold {{ $selectedCategory === $cat->id ? 'bg-[#0a4d8c] text-white shadow-lg shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-100' }}">
                                        <div class="flex items-center gap-3">
                                            @php
                                                $iconName = match (true) {
                                                    str_contains(strtolower($cat->name), 'limpieza') => 'sparkles',
                                                    str_contains(strtolower($cat->name), 'oficina') => 'penline',
                                                    str_contains(strtolower($cat->name), 'seguridad') => 'shield',
                                                    str_contains(strtolower($cat->name), 'tecnología') => 'monitor',
                                                    str_contains(strtolower($cat->name), 'cafetería') ||
                                                        str_contains(strtolower($cat->name), 'alimentos')
                                                        => 'coffee',
                                                    str_contains(strtolower($cat->name), 'empaque') ||
                                                        str_contains(strtolower($cat->name), 'embalaje')
                                                        => 'package',
                                                    str_contains(strtolower($cat->name), 'herramientas') => 'wrench',
                                                    str_contains(strtolower($cat->name), 'sabanillas')
                                                        => 'clipboard-list',
                                                    str_contains(strtolower($cat->name), 'logística') => 'truck',
                                                    default => 'package',
                                                };
                                            @endphp
                                            <x-dynamic-component :component="'icons.' . $iconName"
                                                class="w-5 h-5 {{ $selectedCategory === $cat->id ? 'text-white' : 'text-slate-400' }}" />
                                            <span class="truncate">{{ $cat->name }}
                                                ({{ $cat->products_count }})
                                            </span>
                                        </div>
                                    </button>
                                @endforeach
                            </div>
                        </div>

                        {{-- Urgency toggle in sidebar for desktop --}}
                        <div class="hidden lg:block">
                            <h3
                                class="text-slate-900 font-montserrat font-bold text-[14px] mb-4 uppercase tracking-widest opacity-40">
                                Filters</h3>
                            <button wire:click="toggleTodayOnly"
                                class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border {{ $todayOnly ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50' }} font-bold text-[13px]">
                                <svg class="w-5 h-5 {{ $todayOnly ? 'text-emerald-500' : 'text-slate-300' }}"
                                    fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Entrega Hoy mismo
                            </button>
                        </div>
                    </aside>

                    {{-- Products Section --}}
                    <div class="flex-1">
                        {{-- Controls --}}
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div
                                class="flex items-center bg-white border border-slate-100 rounded-2xl overflow-hidden p-1 shadow-sm shrink-0">
                                <button wire:click="setViewMode('grid')"
                                    class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all {{ $viewMode === 'grid' ? 'bg-[#0a4d8c] text-white shadow-md' : 'text-slate-400 hover:text-[#0a4d8c]' }} font-bold text-[13px]">
                                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                    Grid
                                </button>
                                <button wire:click="setViewMode('list')"
                                    class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all {{ $viewMode === 'list' ? 'bg-[#0a4d8c] text-white shadow-md' : 'text-slate-400 hover:text-[#0a4d8c]' }} font-bold text-[13px]">
                                    <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                            d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    List
                                </button>
                            </div>

                            <div class="relative shrink-0 w-full md:w-auto">
                                <select wire:model.live="sortBy"
                                    class="w-full md:w-auto appearance-none bg-white border border-slate-100 rounded-2xl px-5 py-3 pr-10 text-[13px] text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#0a4d8c]/5 focus:border-[#0a4d8c] cursor-pointer font-bold font-sans shadow-sm">
                                    <option value="name">Nombre A-Z</option>
                                    <option value="price-asc">Precio: Menor a Mayor</option>
                                    <option value="price-desc">Precio: Mayor a Menor</option>
                                    <option value="stock">Mayor Stock</option>
                                </select>
                                <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                        d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {{-- Final Product Rendering Loop (New Design) --}}
                        <div
                            class="{{ $viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4' }}">
                            @foreach ($products as $product)
                                @if ($viewMode === 'grid')
                                    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#0a4d8c]/10 transition-all duration-300 flex flex-col group overflow-hidden"
                                        x-data="{ quantity: 1, unit: '{{ $product->price > 0 ? 'box' : 'unit' }}', basePrice: {{ $product->price_with_igv }}, unitPrice: {{ $product->unit_price_with_igv }}, unitLabel: '{{ $product->unit }}', unitPriceLabel: '{{ $product->unitPriceUnit ?? '' }}' }">
                                        <div wire:click="viewProduct({{ $product->id }})"
                                            class="relative aspect-square bg-[#f8fafc] overflow-hidden group-hover:scale-105 transition-transform duration-500 cursor-pointer">
                                            <img src="{{ $product->image }}" alt="{{ $product->name }}"
                                                class="w-full h-full object-contain p-6 drop-shadow-md">
                                            <div class="absolute top-3 left-3 flex flex-col gap-1.5">
                                                @if ($product->stock > 0)
                                                    <span
                                                        class="px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg">En
                                                        Stock</span>
                                                @else
                                                    <span
                                                        class="px-2.5 py-1 bg-red-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg">Agotado</span>
                                                @endif
                                            </div>
                                        </div>
                                        <div class="p-5 flex flex-col flex-1">
                                            <div class="mb-4">
                                                <p
                                                    class="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">
                                                    {{ $product->sku }} · {{ $product->brand }}</p>
                                                <h3 wire:click="viewProduct({{ $product->id }})"
                                                    class="text-[14px] font-bold text-slate-800 leading-snug line-clamp-2 h-[2.5rem] font-sans hover:text-[#0a4d8c] transition-colors cursor-pointer">
                                                    {{ $product->name }}</h3>
                                            </div>
                                            <div class="mt-auto space-y-4">
                                                <div
                                                    class="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Entrega:
                                                    {{ $product->deliveryDays == 1 ? 'Mañana' : $product->deliveryDays . ' días' }}
                                                </div>
                                                <div
                                                    class="flex items-center justify-between gap-2 flex-wrap min-h-[32px]">
                                                    @if ($product->price > 0 && $product->unitPrice > 0)
                                                        <div
                                                            class="flex bg-slate-100 p-0.5 rounded-lg w-max shadow-sm">
                                                            <button @click="unit = 'unit'"
                                                                :class="unit === 'unit' ?
                                                                    'bg-white shadow-sm text-[#0a4d8c]' :
                                                                    'text-slate-400'"
                                                                class="px-3 py-1.5 rounded-md text-[10px] font-black transition-all">{{ $product->unitPriceUnit }}</button>
                                                            <button @click="unit = 'box'"
                                                                :class="unit === 'box' ?
                                                                    'bg-white shadow-sm text-[#0a4d8c]' :
                                                                    'text-slate-400'"
                                                                class="px-3 py-1.5 rounded-md text-[10px] font-black transition-all">{{ $product->unit }}</button>
                                                        </div>
                                                    @endif

                                                    @if ($product->technicalSheet)
                                                        <a href="{{ $product->technicalSheet }}" target="_blank"
                                                            class="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-100 text-[#0a4d8c] rounded-xl text-[9px] font-black uppercase tracking-wider hover:bg-[#0a4d8c] hover:text-white transition-all shadow-sm group/sheet">
                                                            <svg class="w-3.5 h-3.5" fill="none"
                                                                stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2.5"
                                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <span class="hidden sm:inline">Ficha Técnica</span>
                                                            <span class="sm:hidden">Ficha</span>
                                                        </a>
                                                    @endif
                                                </div>
                                                <div class="flex items-baseline gap-1">
                                                    <span
                                                        class="text-[1.4rem] font-black text-[#0a4d8c] font-montserrat">S/
                                                        <span
                                                            x-text="unit === 'unit' ? unitPrice.toFixed(2) : basePrice.toFixed(2)"></span></span>
                                                    <span class="text-[11px] text-slate-400 font-bold uppercase"
                                                        x-text="'/' + (unit === 'unit' ? unitPriceLabel : unitLabel)"></span>
                                                </div>
                                                <div class="flex items-center gap-2">
                                                    <div
                                                        class="flex items-center bg-slate-50 border border-slate-100 rounded-xl overflow-hidden px-1">
                                                        <button @click="if(quantity > 1) quantity--"
                                                            class="p-2 text-slate-400"><svg class="w-4 h-4"
                                                                fill="none" stroke="currentColor"
                                                                viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2.5" d="M20 12H4" />
                                                            </svg></button>
                                                        <input type="number" x-model="quantity"
                                                            class="w-8 text-center text-[14px] font-black bg-transparent border-none p-0 focus:ring-0">
                                                        <button @click="quantity++" class="p-2 text-slate-400"><svg
                                                                class="w-4 h-4" fill="none" stroke="currentColor"
                                                                viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2.5"
                                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg></button>
                                                    </div>
                                                    <div class="flex flex-col gap-2 w-full">
                                                        <button wire:click="viewProduct({{ $product->id }})"
                                                            class="w-full py-2.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl font-black text-[11px] uppercase tracking-wider hover:bg-white hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                                            Ver producto
                                                            <svg class="w-3.5 h-3.5" fill="none"
                                                                stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                                    stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            @click="$wire.addToCart({{ $product->id }}, quantity, unit)"
                                                            class="w-full bg-gradient-to-r from-[#0a4d8c] to-[#00bcd4] text-white py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider shadow-lg hover:opacity-90 transition-all">Agregar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                @else
                                    <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-xl flex items-center gap-6 group"
                                        x-data="{ quantity: 1, unit: '{{ $product->price > 0 ? 'box' : 'unit' }}', basePrice: {{ $product->price_with_igv }}, unitPrice: {{ $product->unit_price_with_igv }}, unitLabel: '{{ $product->unit }}', unitPriceLabel: '{{ $product->unitPriceUnit ?? '' }}' }">
                                        <div wire:click="viewProduct({{ $product->id }})"
                                            class="w-32 h-32 bg-[#f8fafc] rounded-2xl shrink-0 p-4 cursor-pointer hover:scale-105 transition-transform">
                                            <img src="{{ $product->image }}" class="w-full h-full object-contain">
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="flex items-center gap-3 mb-1">
                                                <span
                                                    class="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase">Stock</span>
                                                <p class="text-[11px] font-bold text-slate-300 uppercase">
                                                    {{ $product->sku }} · {{ $product->brand }}</p>
                                            </div>
                                            <h3 wire:click="viewProduct({{ $product->id }})"
                                                class="text-[18px] font-bold text-slate-800 leading-tight mb-2 truncate font-sans cursor-pointer hover:text-[#0a4d8c] transition-colors">
                                                {{ $product->name }}</h3>
                                            <div class="flex items-center gap-5">
                                                <div class="flex items-baseline gap-1">
                                                    <span
                                                        class="text-[1.6rem] font-black text-[#0a4d8c] font-montserrat">S/
                                                        <span
                                                            x-text="unit === 'unit' ? unitPrice.toFixed(2) : basePrice.toFixed(2)"></span></span>
                                                    <span class="text-[13px] text-slate-400 font-bold uppercase"
                                                        x-text="'/' + (unit === 'unit' ? unitPriceLabel : unitLabel)"></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex items-center gap-3 shrink-0">
                                            <div
                                                class="flex items-center bg-slate-50 border border-slate-100 rounded-xl px-1">
                                                <button @click="if(quantity > 1) quantity--"
                                                    class="p-3 text-slate-400"><svg class="w-5 h-5" fill="none"
                                                        stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2.5" d="M20 12H4" />
                                                    </svg></button>
                                                <input type="number" x-model="quantity"
                                                    class="w-12 text-center text-[16px] font-black bg-transparent border-none p-0 focus:ring-0">
                                                <button @click="quantity++" class="p-3 text-slate-400"><svg
                                                        class="w-5 h-5" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg></button>
                                            </div>
                                            <button @click="$wire.addToCart({{ $product->id }}, quantity, unit)"
                                                class="bg-[#0a4d8c] text-white px-8 py-3.5 rounded-xl font-black text-[13px] uppercase tracking-wider shadow-xl">Agregar
                                                al Carrito</button>
                                        </div>
                                    </div>
                                @endif
                            @endforeach
                        </div>
                        <div class="mt-12">
                            {{ $products->links() }}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    @endif

    @if ($selectedProduct)
        <div class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            wire:click.self="closeProductModal">
            <div
                class="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-300">
                {{-- Header Bar --}}
                <div
                    class="sticky top-0 z-20 bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between">
                    <span
                        class="text-[12px] font-bold text-slate-400 font-mono tracking-widest">{{ $selectedProduct->sku }}</span>
                    <button wire:click="closeProductModal"
                        class="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="p-8 md:p-10">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {{-- Image Side --}}
                        <div class="space-y-6" x-data="{ activeImage: '{{ $selectedProduct->image }}' }">
                            <div
                                class="relative aspect-square rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-xl shadow-slate-200/50 flex items-center justify-center group overflow-hidden">
                                <div
                                    class="absolute inset-0 bg-gradient-to-tr from-slate-50 to-transparent opacity-50">
                                </div>
                                <img :src="activeImage" alt="{{ $selectedProduct->name }}"
                                    class="relative z-10 w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700">

                                <div class="absolute top-6 left-6 z-20">
                                    @if ($selectedProduct->stock > 0)
                                        <div
                                            class="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/30">
                                            <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                            <span class="text-[10px] font-black uppercase tracking-widest">En
                                                Stock</span>
                                        </div>
                                    @else
                                        <div
                                            class="px-4 py-2 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/30">
                                            <span
                                                class="text-[10px] font-black uppercase tracking-widest">Agotado</span>
                                        </div>
                                    @endif
                                </div>
                            </div>

                            {{-- Gallery Thumbnails --}}
                            @if ($selectedProduct->gallery && count($selectedProduct->gallery) > 0)
                                <div class="flex items-center gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide">
                                    <button @click="activeImage = '{{ $selectedProduct->image }}'"
                                        class="w-20 h-20 rounded-2xl bg-white border-2 p-2 shrink-0 transition-all duration-300 overflow-hidden shadow-sm"
                                        :class="activeImage === '{{ $selectedProduct->image }}' ?
                                            'border-[#0a4d8c] shadow-lg scale-105' :
                                            'border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-200'">
                                        <img src="{{ $selectedProduct->image }}"
                                            class="w-full h-full object-contain">
                                    </button>
                                    @foreach ($selectedProduct->gallery as $img)
                                        <button @click="activeImage = '{{ $img }}'"
                                            class="w-20 h-20 rounded-2xl bg-white border-2 p-2 shrink-0 transition-all duration-300 overflow-hidden shadow-sm"
                                            :class="activeImage === '{{ $img }}' ?
                                                'border-[#0a4d8c] shadow-lg scale-105' :
                                                'border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-200'">
                                            <img src="{{ $img }}" class="w-full h-full object-contain">
                                        </button>
                                    @endforeach
                                </div>
                            @endif
                        </div>

                        {{-- Info Side --}}
                        <div class="flex flex-col h-full" x-data="{ quantity: {{ $selectedProduct->minOrder ?? 1 }}, unit: '{{ $selectedProduct->price > 0 ? 'box' : 'unit' }}', basePrice: {{ $selectedProduct->price_with_igv }}, unitPrice: {{ $selectedProduct->unit_price_with_igv }}, unitLabel: '{{ $selectedProduct->unit }}', unitPriceLabel: '{{ $selectedProduct->unitPriceUnit ?? '' }}' }">
                            <div class="mb-2">
                                <span
                                    class="bg-[#0a4d8c]/5 text-[#0a4d8c] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] mb-4 inline-block">{{ $selectedProduct->brand }}</span>
                                <h2
                                    class="text-[1.8rem] md:text-[2.4rem] font-black text-slate-900 leading-[1.1] mb-5 font-montserrat">
                                    {{ $selectedProduct->name }}</h2>
                                <div class="w-12 h-1 bg-gradient-to-r from-[#0a4d8c] to-transparent mb-6 rounded-full">
                                </div>
                                <p class="text-slate-500 text-[15px] font-sans leading-relaxed max-w-[440px]">
                                    {{ $selectedProduct->description }}</p>

                                @if (isset($selectedProduct->tags) && is_array($selectedProduct->tags) && count($selectedProduct->tags) > 0)
                                    <div class="flex flex-wrap gap-2 mt-6">
                                        @foreach ($selectedProduct->tags as $tag)
                                            <span
                                                class="px-3 py-1 bg-slate-100 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-wider border border-slate-200/50">{{ $tag }}</span>
                                        @endforeach
                                    </div>
                                @elseif(isset($selectedProduct->tags) && is_string($selectedProduct->tags) && strlen($selectedProduct->tags) > 0)
                                    <div class="flex flex-wrap gap-2 mt-6">
                                        @foreach (explode(',', $selectedProduct->tags) as $tag)
                                            <span
                                                class="px-3 py-1 bg-slate-100 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-wider border border-slate-200/50">{{ trim($tag) }}</span>
                                        @endforeach
                                    </div>
                                @endif

                                @if ($selectedProduct->technicalSheet)
                                    <div class="mt-6">
                                        <a href="{{ $selectedProduct->technicalSheet }}" target="_blank"
                                            class="inline-flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 border border-slate-100 text-[#0a4d8c] rounded-2xl shadow-sm group/sheet hover:bg-[#0a4d8c] hover:text-white hover:border-[#0a4d8c] transition-all duration-300">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span
                                                class="text-[10px] font-black uppercase tracking-widest leading-none">Ficha
                                                Técnica</span>
                                        </a>
                                    </div>
                                @endif
                            </div>

                            {{-- Key Info Grid --}}
                            <div class="grid grid-cols-2 gap-4 mb-4 mt-8">
                                <div
                                    class="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-4 group transition-colors hover:border-[#0a4d8c]/20">
                                    <div
                                        class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#0a4d8c]">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-[9px] uppercase font-black text-slate-400 tracking-[0.1em]">
                                            Entrega estimada</p>
                                        <p class="text-[12px] font-bold text-slate-700 truncate">
                                            {{ $selectedProduct->deliveryDays == 1 ? 'Mañana' : $selectedProduct->deliveryDays . ' Días' }}
                                        </p>
                                    </div>
                                </div>

                                <div
                                    class="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-4 group transition-colors hover:border-[#0a4d8c]/20">
                                    <div
                                        class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-emerald-600">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-[9px] uppercase font-black text-slate-400 tracking-[0.1em]">En
                                            Almacén</p>
                                        <p class="text-[12px] font-bold text-slate-700 truncate">
                                            {{ $selectedProduct->stock }} {{ $selectedProduct->unit ?? 'unid' }}</p>
                                    </div>
                                </div>
                            </div>

                            {{-- Price & Selection Section --}}
                            <div class="bg-slate-50/80 rounded-[2.5rem] p-6 md:p-8 border border-slate-100 mb-8 mt-4">
                                <div class="flex flex-col gap-8">
                                    {{-- Price Display --}}
                                    <div class="space-y-4">
                                        <p
                                            class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none opacity-70">
                                            Precio e Impuestos</p>
                                        <div class="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                                            <div
                                                class="flex items-baseline text-[#0a4d8c] font-montserrat tracking-tight leading-none">
                                                <span class="text-2xl md:text-3xl font-black mr-1 opacity-80">S/</span>
                                                <span class="text-4xl md:text-5xl lg:text-6xl font-black"
                                                    x-text="unit === 'unit' ? unitPrice.toFixed(2) : basePrice.toFixed(2)"></span>
                                            </div>
                                            <span class="text-[15px] text-slate-400 font-bold uppercase tracking-wider"
                                                x-text="'/ ' + (unit === 'unit' ? unitPriceLabel : unitLabel)"></span>
                                        </div>
                                        <div
                                            class="flex items-center gap-2 text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100/50">
                                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                            <span class="text-[10px] font-black uppercase tracking-widest">Incluye IGV
                                                (18%)</span>
                                        </div>
                                    </div>

                                    {{-- Format Selection (Only if both prices exist) --}}
                                    @if ($selectedProduct->price > 0 && $selectedProduct->unitPrice > 0)
                                        <div class="pt-6 border-t border-slate-200/50">
                                            <p
                                                class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                                Seleccionar Formato</p>
                                            <div
                                                class="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-slate-200/50 w-full sm:w-fit">
                                                <button @click="unit = 'unit'"
                                                    :class="unit === 'unit' ?
                                                        'bg-[#0a4d8c] text-white shadow-xl shadow-blue-900/20' :
                                                        'text-slate-400 hover:text-slate-600 hover:bg-slate-50'"
                                                    class="flex-1 sm:flex-none px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300">
                                                    {{ $selectedProduct->unitPriceUnit }}
                                                </button>
                                                <button @click="unit = 'box'"
                                                    :class="unit === 'box' ?
                                                        'bg-[#0a4d8c] text-white shadow-xl shadow-blue-900/20' :
                                                        'text-slate-400 hover:text-slate-600 hover:bg-slate-50'"
                                                    class="flex-1 sm:flex-none px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300">
                                                    {{ $selectedProduct->unit }}
                                                </button>
                                            </div>
                                        </div>
                                    @endif
                                </div>
                            </div>

                            {{-- Actions --}}
                            <div class="mt-auto flex flex-col sm:flex-row items-center gap-4">
                                <div
                                    class="flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden p-1 shadow-sm h-[60px]">
                                    <button
                                        @click="quantity = Math.max({{ $selectedProduct->minOrder ?? 1 }}, quantity - 1)"
                                        class="w-12 h-full flex items-center justify-center text-slate-400 hover:text-[#0a4d8c] hover:bg-slate-50 rounded-xl transition-all">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                                d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <input type="number" x-model.number="quantity"
                                        class="w-16 bg-transparent border-none text-center font-black text-xl focus:ring-0 text-slate-800"
                                        min="{{ $selectedProduct->minOrder ?? 1 }}">
                                    <button @click="quantity = quantity + 1"
                                        class="w-12 h-full flex items-center justify-center text-slate-400 hover:text-[#0a4d8c] hover:bg-slate-50 rounded-xl transition-all">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                                d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                                <button @click="$wire.addToCart({{ $selectedProduct->id }}, quantity, unit)"
                                    class="flex-1 w-full bg-gradient-to-r from-[#0a4d8c] via-[#0288d1] to-[#00bcd4] text-white h-[60px] rounded-2xl font-black text-[13px] uppercase tracking-wider shadow-xl shadow-blue-600/20 hover:shadow-cyan-400/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 px-6">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span class="whitespace-nowrap">Añadir al Carrito</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {{-- Cross Selling --}}
                    @if ($crossSellProducts->count() > 0)
                        <div class="mt-16 pt-10 border-t border-slate-100">
                            <div class="flex items-end justify-between mb-8">
                                <div>
                                    <h3 class="text-slate-900 font-montserrat font-black text-xl mb-1">Insumos
                                        Relacionados</h3>
                                    <p class="text-slate-400 text-[13px]">Completa tu pedido comercial con estos
                                        productos</p>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                @foreach ($crossSellProducts as $p)
                                    <div
                                        class="bg-slate-50/50 p-4 rounded-3xl border border-slate-100 flex flex-col gap-4 group/item">
                                        <div class="flex items-center gap-4">
                                            <div
                                                class="w-16 h-16 bg-white rounded-2xl p-2 border border-slate-100 shrink-0 shadow-sm overflow-hidden">
                                                <img src="{{ $p->image }}" alt="{{ $p->name }}"
                                                    class="w-full h-full object-contain group-hover/item:scale-110 transition-transform duration-500">
                                            </div>
                                            <div class="min-w-0 flex-1">
                                                <span
                                                    class="px-2 py-0.5 bg-[#0a4d8c]/5 text-[#0a4d8c] text-[9px] font-black rounded uppercase tracking-wider mb-1 inline-block">{{ $p->category->name }}</span>
                                                <h4 class="text-[13px] font-bold text-slate-800 truncate mb-1">
                                                    {{ $p->name }}</h4>
                                                <p class="text-[#0a4d8c] font-montserrat font-black text-[14px]">S/
                                                    {{ number_format($p->price > 0 ? $p->price_with_igv : $p->unit_price_with_igv, 2) }}
                                                    <span
                                                        class="text-[10px] text-slate-400 font-bold uppercase ml-1">/{{ $p->price > 0 ? $p->unit : $p->unitPriceUnit }}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <button wire:click="viewProduct({{ $p->id }})"
                                            class="w-full py-2.5 bg-white border border-slate-200 text-[#0a4d8c] rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-[#0a4d8c] hover:text-white hover:border-[#0a4d8c] transition-all flex items-center justify-center gap-2">
                                            Ver producto
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endif
                </div>
            </div>
        </div>
    @endif

    {{-- Notification Toast --}}
    <div x-data="{ show: false, message: '', type: 'success' }"
        x-on:notify.window="show = true; message = $event.detail.message; type = $event.detail.type; setTimeout(() => show = false, 3000)"
        x-show="show" x-transition:enter="transition ease-out duration-300 transform"
        x-transition:enter-start="opacity-0 translate-y-8" x-transition:enter-end="opacity-100 translate-y-0"
        x-transition:leave="transition ease-in duration-200 transform"
        x-transition:leave-start="opacity-100 translate-y-0" x-transition:leave-end="opacity-0 translate-y-8"
        class="fixed bottom-8 right-8 z-[200] pointer-events-none" style="display: none;">
        <div class="px-8 py-5 rounded-[2rem] shadow-2xl border text-white flex items-center gap-4 transition-all"
            :class="{ 'bg-emerald-600 border-emerald-500 shadow-emerald-500/30': type === 'success', 'bg-red-600 border-red-500 shadow-red-500/30': type === 'error' }">
            <template x-if="type === 'success'">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </template>
            <span x-text="message" class="font-black text-[15px] font-sans"></span>
        </div>
    </div>
</div>
