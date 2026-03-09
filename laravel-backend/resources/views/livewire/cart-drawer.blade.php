<div x-data="{ isOpen: @entangle('isOpen') }">
    {{-- Backdrop --}}
    <div x-show="isOpen" x-transition:enter="transition-opacity duration-300" x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100" x-transition:leave="transition-opacity duration-300"
        x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0"
        class="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm" @click="isOpen = false">
    </div>

    {{-- Drawer --}}
    <div x-show="isOpen" x-transition:enter="transition-transform duration-300 ease-out"
        x-transition:enter-start="translate-x-full" x-transition:enter-end="translate-x-0"
        x-transition:leave="transition-transform duration-300 ease-in" x-transition:leave-start="translate-x-0"
        x-transition:leave-end="translate-x-full"
        class="fixed top-0 right-0 z-[160] h-full w-full sm:max-w-md bg-white shadow-2xl flex flex-col"
        style="display: none;">

        {{-- Header --}}
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
            <div class="flex items-center gap-2.5">
                <div
                    class="w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#0a4d8c] to-[#00bcd4]">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <div>
                    <h2 class="text-slate-900 font-montserrat font-bold text-[16px]">Mi Carrito</h2>
                    <p class="text-[11px] text-slate-400 font-sans font-medium uppercase tracking-wider">
                        {{ $totalItems }} {{ $totalItems === 1 ? 'producto' : 'productos' }}
                    </p>
                </div>
            </div>
            <button @click="isOpen = false" class="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {{-- Content --}}
        <div class="flex-1 overflow-y-auto px-5 py-4">
            @if (empty($items))
                <div class="h-full flex flex-col items-center justify-center text-center">
                    <div
                        class="w-24 h-24 rounded-[2rem] flex items-center justify-center bg-slate-50 mb-6 border border-slate-100">
                        <svg class="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h3 class="text-slate-900 font-montserrat font-bold text-lg mb-2">Tu carrito está vacío</h3>
                    <p class="text-slate-400 text-[13px] font-sans max-w-[240px] leading-relaxed">
                        Agrega suministros esenciales a tu carrito para realizar tu pedido con despacho en 24h.
                    </p>
                    <button @click="isOpen = false"
                        class="mt-8 px-8 py-3 bg-[#0a4d8c] text-white rounded-xl font-bold text-[13px] uppercase tracking-wider shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all">
                        Explorar catálogo
                    </button>
                </div>
            @else
                <div class="space-y-4">
                    @foreach ($items as $cartId => $item)
                        <div
                            class="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-transparent hover:border-[#0a4d8c]/10 transition-all group relative">
                            {{-- Image --}}
                            <div
                                class="w-20 h-20 bg-white rounded-xl shrink-0 border border-slate-100 p-2 overflow-hidden">
                                <img src="{{ $item['image'] }}" alt="{{ $item['name'] }}"
                                    class="w-full h-full object-contain">
                            </div>

                            {{-- Details --}}
                            <div class="flex-1 min-w-0">
                                <div class="flex items-start justify-between gap-2">
                                    <div class="min-w-0">
                                        <h4 class="text-[13px] font-bold text-slate-800 leading-tight mb-1 truncate">
                                            {{ $item['name'] }}</h4>
                                        <div class="flex items-center gap-2">
                                            <span
                                                class="px-2 py-0.5 bg-[#0a4d8c]/5 text-[#0a4d8c] text-[9px] font-black rounded uppercase tracking-wider">
                                                x {{ $item['unit'] }}
                                            </span>
                                        </div>
                                    </div>
                                    <button wire:click="removeItem('{{ $cartId }}')"
                                        class="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>

                                <div class="flex items-center justify-between mt-3">
                                    <div
                                        class="flex items-center bg-white border border-slate-100 rounded-lg overflow-hidden">
                                        <button
                                            wire:click="updateQuantity('{{ $cartId }}', {{ $item['quantity'] - 1 }})"
                                            class="px-2 py-1 text-slate-400 hover:text-[#0a4d8c] transition-colors">
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                                    d="M20 12H4" />
                                            </svg>
                                        </button>
                                        <span
                                            class="w-8 text-center text-[12px] font-black border-x border-slate-50 py-1">{{ $item['quantity'] }}</span>
                                        <button
                                            wire:click="updateQuantity('{{ $cartId }}', {{ $item['quantity'] + 1 }})"
                                            class="px-2 py-1 text-slate-400 hover:text-[#0a4d8c] transition-colors">
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-[#0a4d8c] font-montserrat font-black text-[14px]">S/
                                            {{ number_format($item['price'] * $item['quantity'], 2) }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>

        {{-- Footer --}}
        @if (!empty($items))
            <div class="border-t border-slate-100 bg-white p-6 space-y-4">
                <div class="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-3">
                    <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-[11px] text-emerald-700 font-sans font-bold uppercase tracking-wider">
                        Envío gratis en pedidos mayores a S/ 150.00 en Lima
                    </p>
                </div>

                <div class="space-y-2">
                    <div class="flex items-center justify-between text-[13px] font-sans">
                        <span class="text-slate-400">Subtotal ({{ $totalItems }}
                            {{ $totalItems === 1 ? 'producto' : 'productos' }})</span>
                        <span class="text-slate-700 font-bold">S/ {{ number_format($subtotal, 2) }}</span>
                    </div>
                    <div class="flex items-center justify-between text-[13px] font-sans">
                        <span class="text-slate-400">IGV (18%)</span>
                        <span class="text-slate-700 font-bold">S/ {{ number_format($igv, 2) }}</span>
                    </div>
                    <div class="flex items-center justify-between text-[13px] font-sans">
                        <span class="text-slate-400">Envío</span>
                        <span class="text-slate-700 font-bold">
                            @if ($shipping > 0)
                                S/ {{ number_format($shipping, 2) }}
                            @else
                                <span class="text-emerald-600 uppercase">Gratis</span>
                            @endif
                        </span>
                    </div>
                    <div class="flex items-center justify-between pt-3 border-t border-slate-50">
                        <span
                            class="text-slate-900 font-montserrat font-black text-[15px] uppercase tracking-wider">Total</span>
                        <span class="text-[#0a4d8c] font-montserrat font-black text-[22px]">S/
                            {{ number_format($total, 2) }}</span>
                    </div>
                </div>

                <div class="pt-2 flex flex-col gap-3">
                    <button @click="isOpen = false; $dispatch('openCheckout')"
                        class="w-full bg-gradient-to-r from-[#0a4d8c] to-[#00bcd4] text-white py-4 rounded-2xl font-montserrat font-black text-[14px] uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:shadow-cyan-500/30 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Solicitar Cotización
                    </button>
                    <button wire:click="clearCart"
                        class="text-[12px] text-slate-400 hover:text-red-500 font-bold uppercase tracking-widest transition-colors py-1">
                        Vaciar carrito
                    </button>
                </div>
            </div>
        @endif
    </div>
</div>
