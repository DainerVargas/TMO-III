<div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {{-- Page Header --}}
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-montserrat font-bold text-slate-800 tracking-tight">Control de Inventario</h2>
            <p class="text-slate-500 text-[14px] font-sans">Gestión centralizada de stock, entradas y trazabilidad de
                productos.</p>
        </div>
        <button wire:click="$refresh"
            class="flex items-center justify-center gap-2 bg-[#0a4d8c] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-[#083d6e] transition-all shadow-lg shadow-[#0a4d8c]/20">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sincronizar Datos
        </button>
    </div>

    {{-- Stats Cards --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Productos</p>
            <p class="text-2xl font-black text-slate-800">{{ $stats['total'] }}</p>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stock Bajo</p>
            <p class="text-2xl font-black text-amber-500">{{ $stats['low'] }}</p>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sin Existencias</p>
            <p class="text-2xl font-black text-red-500">{{ $stats['out'] }}</p>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Movimientos Hoy</p>
            <p class="text-2xl font-black text-emerald-500">{{ $stats['movementsToday'] }}</p>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {{-- Left: Stock Table --}}
        <div class="lg:col-span-2 space-y-4">
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div class="flex-1 relative group">
                    <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0a4d8c] transition-colors"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input wire:model.live.debounce.300ms="search" type="text"
                        placeholder="Buscar por nombre o SKU..."
                        class="w-full pl-10 pr-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-sans">
                </div>
                <select wire:model.live="filterStatus"
                    class="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0a4d8c]/10 cursor-pointer font-sans">
                    <option value="all">Todos los estados</option>
                    <option value="in-stock">En Stock</option>
                    <option value="low-stock">Stock Bajo</option>
                    <option value="out-of-stock">Sin Stock</option>
                </select>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left font-sans text-[14px]">
                        <thead>
                            <tr
                                class="bg-slate-50 text-[12px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                                <th class="px-6 py-4">Producto</th>
                                <th class="px-6 py-4 text-center">Nivel Stock</th>
                                <th class="px-6 py-4 text-center">Estado</th>
                                <th class="px-6 py-4 text-right">Ajuste Rápido</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            @foreach ($products as $p)
                                <tr class="hover:bg-slate-50/50 transition-colors group">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <img src="{{ $p->image }}"
                                                class="w-10 h-10 rounded-lg border border-slate-100 flex-shrink-0">
                                            <div class="min-w-0">
                                                <p class="font-bold text-slate-700 truncate max-w-[200px]">
                                                    {{ $p->name }}</p>
                                                <p class="text-[11px] text-slate-400">{{ $p->sku }}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-center">
                                        <span
                                            class="text-lg font-black {{ $p->stock <= 0 ? 'text-red-600' : ($p->stock <= 10 ? 'text-amber-600' : 'text-[#0a4d8c]') }}">
                                            {{ $p->stock }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-center">
                                        <span
                                            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase border {{ $p->stock <= 0
                                                ? 'text-red-700 bg-red-50 border-red-100'
                                                : ($p->stock <= 10
                                                    ? 'text-amber-700 bg-amber-50 border-amber-100'
                                                    : 'text-emerald-700 bg-emerald-50 border-emerald-100') }}">
                                            {{ $p->stock <= 0 ? 'Agotado' : ($p->stock <= 10 ? 'Bajo' : 'En Stock') }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <div class="flex items-center justify-end gap-2">
                                            <button
                                                wire:click="adjustStock({{ $p->id }}, 1, 'PURCHASE', 'Ajuste rápido (+1)')"
                                                class="w-8 h-8 flex items-center justify-center hover:bg-emerald-50 text-emerald-600 rounded-lg border border-transparent hover:border-emerald-100 active:scale-90 transition-all">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                            <button
                                                wire:click="adjustStock({{ $p->id }}, -1, 'SALE', 'Ajuste rápido (-1)')"
                                                class="w-8 h-8 flex items-center justify-center hover:bg-red-50 text-red-600 rounded-lg border border-transparent hover:border-red-100 active:scale-90 transition-all {{ $p->stock <= 0 ? 'opacity-30 cursor-not-allowed' : '' }}"
                                                {{ $p->stock <= 0 ? 'disabled' : '' }}>
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="M20 12H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                <div class="px-6 py-4 bg-slate-50 border-t border-slate-100">
                    {{ $products->links() }}
                </div>
            </div>
        </div>

        {{-- Right: Timeline --}}
        <div class="space-y-4">
            <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 class="font-montserrat font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <svg class="w-5 h-5 text-[#0a4d8c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Movimientos Recientes
                </h3>

                <div class="space-y-6 relative">
                    <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100"></div>
                    @forelse($movements as $m)
                        <div class="relative pl-10 pb-2">
                            <div
                                class="absolute left-0 top-1.5 w-8 h-8 rounded-xl flex items-center justify-center {{ $m->quantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600' }} border border-white z-10 shadow-sm">
                                @if ($m->quantity > 0)
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 4v16m8-8H4" />
                                    </svg>
                                @else
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M20 12H4" />
                                    </svg>
                                @endif
                            </div>
                            <div>
                                <div class="flex items-center justify-between gap-2">
                                    <p class="text-[13px] font-bold text-slate-700 truncate">{{ $m->product->name }}
                                    </p>
                                    <span
                                        class="text-[12px] font-black {{ $m->quantity > 0 ? 'text-emerald-600' : 'text-red-600' }}">
                                        {{ $m->quantity > 0 ? '+' : '' }}{{ $m->quantity }}
                                    </span>
                                </div>
                                <div class="flex items-center gap-2 mt-1">
                                    <span
                                        class="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">{{ $m->type }}</span>
                                    <span class="text-[10px] text-slate-400">{{ $m->createdAt->format('H:i') }}</span>
                                </div>
                                @if ($m->reason)
                                    <p class="text-[11px] text-slate-400 mt-2 bg-slate-50 p-2 rounded-lg italic">
                                        {{ $m->reason }}</p>
                                @endif
                            </div>
                        </div>
                    @empty
                        <div class="text-center py-10 text-slate-300 italic text-sm">Sin movimientos hoy.</div>
                    @endforelse
                </div>

                <button
                    class="w-full mt-8 py-3 bg-slate-50 text-[12px] font-bold text-slate-500 rounded-2xl hover:bg-slate-100 transition-all">
                    Ver Historial Completo
                </button>
            </div>
        </div>
    </div>

    {{-- Notification (Shared) --}}
    <div x-data="{ show: false, message: '', type: 'success' }"
        x-on:notify.window="show = true; message = $event.detail.message; type = $event.detail.type; setTimeout(() => show = false, 3000)"
        x-show="show" class="fixed bottom-6 right-6 z-[200]" style="display: none;">
        <div class="px-6 py-3 rounded-xl shadow-2xl border text-white flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300"
            :class="{ 'bg-emerald-600 border-emerald-500': type === 'success', 'bg-red-600 border-red-500': type === 'error' }">
            <span x-text="message" class="font-medium text-[14px]"></span>
        </div>
    </div>
</div>
