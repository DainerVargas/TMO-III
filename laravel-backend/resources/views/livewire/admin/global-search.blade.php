<div class="relative flex-1 max-w-lg" x-data="{ open: false }">
    <div
        class="flex items-center gap-3 bg-[#f8fafc] px-4 py-2.5 rounded-2xl border border-[#f1f5f9] w-full group focus-within:bg-white focus-within:border-[#0a4d8c] transition-all">
        <svg class="w-5 h-5 text-slate-300 group-focus-within:text-[#0a4d8c] transition-colors" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" wire:model.live.debounce.300ms="search" @focus="open = true" @click.away="open = false"
            placeholder="Buscar productos, pedidos, categorías..."
            class="bg-transparent border-none outline-none text-[14px] w-full text-slate-600 placeholder:text-slate-300 font-sans font-medium p-0 focus:ring-0">

        <div wire:loading wire:target="search"
            class="animate-spin h-4 w-4 border-2 border-[#0a4d8c] border-t-transparent rounded-full"></div>
    </div>

    {{-- Search Results Dropdown --}}
    @if (!empty($results) && !empty($search))
        <div x-show="open" x-transition:enter="transition ease-out duration-200"
            x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0"
            class="absolute mt-2 w-full bg-white rounded-2xl border border-slate-100 shadow-2xl z-[100] overflow-hidden">

            <div class="max-h-[480px] overflow-y-auto p-2">
                @foreach ($results as $result)
                    <a href="{{ $result['route'] }}"
                        class="flex items-center gap-4 p-3 rounded-xl hover:bg-[#f0f7ff] transition-all group">
                        <div
                            class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-[#0a4d8c] transition-colors shadow-sm">
                            @if ($result['icon'] == 'package')
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            @elseif($result['icon'] == 'tag')
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            @elseif($result['icon'] == 'shopping-cart')
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            @elseif($result['icon'] == 'users')
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            @endif
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between">
                                <p class="text-[14px] font-bold text-slate-800 truncate">{{ $result['title'] }}</p>
                                <span
                                    class="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-slate-100 text-slate-400 group-hover:bg-[#0a4d8c] group-hover:text-white transition-colors">{{ $result['type'] }}</span>
                            </div>
                            <p class="text-[12px] text-slate-400 font-medium truncate mt-0.5">{{ $result['subtitle'] }}
                            </p>
                        </div>
                    </a>
                @endforeach
            </div>

            <div class="p-3 bg-slate-50/50 border-t border-slate-50 text-center">
                <p class="text-[11px] font-bold text-slate-400">Presiona ESC para cerrar</p>
            </div>
        </div>
    @elseif(!empty($search) && strlen($search) >= 2)
        <div x-show="open"
            class="absolute mt-2 w-full bg-white rounded-2xl border border-slate-100 shadow-2xl z-[100] p-8 text-center">
            <p class="text-[14px] font-bold text-slate-400">No se encontraron resultados para "{{ $search }}"</p>
        </div>
    @endif
</div>
