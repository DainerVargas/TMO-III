<div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {{-- Page Header --}}
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-montserrat font-bold text-slate-800 tracking-tight">Facturación y Pedidos</h2>
            <p class="text-slate-500 text-[14px] font-sans">Gestiona las solicitudes de cotización y pedidos en curso.
            </p>
        </div>
        <button
            class="flex items-center justify-center gap-2 bg-white text-slate-700 px-5 py-2.5 rounded-xl font-bold text-[14px] border border-slate-200 shadow-sm hover:bg-slate-50 transition-all font-sans">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Reporte Mensual
        </button>
    </div>

    {{-- Filters --}}
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative group">
            <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0a4d8c] transition-colors"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input wire:model.live.debounce.300ms="search" type="text"
                placeholder="Buscar por ID, Cliente o Documento..."
                class="w-full pl-10 pr-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-sans">
        </div>
        <select wire:model.live="status"
            class="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0a4d8c]/10 cursor-pointer font-sans">
            <option value="all">Todos los estados</option>
            <option value="pending">PENDIENTES</option>
            <option value="confirmed">CONFIRMADOS</option>
            <option value="shipped">ENVIADOS</option>
            <option value="cancelled">CANCELADOS</option>
        </select>
    </div>

    {{-- Table --}}
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left font-sans">
                <thead>
                    <tr
                        class="bg-slate-50 text-[12px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                        <th class="px-6 py-4">ID Pedido / Fecha</th>
                        <th class="px-6 py-4">Cliente / Contacto</th>
                        <th class="px-6 py-4">Estado</th>
                        <th class="px-6 py-4 text-right">Total</th>
                        <th class="px-6 py-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($orders as $order)
                        <tr class="hover:bg-slate-50/50 transition-colors group">
                            <td class="px-6 py-4">
                                <div class="flex flex-col">
                                    <span class="text-[13px] font-bold text-[#0a4d8c]">#{{ $order->id }}</span>
                                    <span
                                        class="text-[11px] text-slate-400">{{ $order->createdAt->format('d/m/Y H:i') }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col">
                                    <span
                                        class="text-[13px] font-bold text-slate-700">{{ $order->user->name ?? 'Invitado' }}</span>
                                    <div class="flex items-center gap-2 mt-0.5">
                                        <span
                                            class="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-bold">{{ $order->user->documentNumber ?? '-' }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="px-2.5 py-1 rounded-full text-[11px] font-bold border {{ $order->status === 'PENDING'
                                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                                        : ($order->status === 'CONFIRMED'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                            : ($order->status === 'SHIPPED'
                                                ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                : 'bg-slate-50 text-slate-600 border-slate-100')) }}">
                                    {{ $order->status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <span class="text-[14px] font-bold text-slate-700">S/
                                    {{ number_format($order->total, 2) }}</span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <button wire:click="viewDetails({{ $order->id }})"
                                        class="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                                        title="Ver Detalles">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                    <div x-data="{ open: false }" class="relative">
                                        <button @click="open = !open"
                                            class="p-2 hover:bg-slate-100 text-slate-400 rounded-lg transition-colors">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                        <div x-show="open" @click.away="open = false"
                                            class="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-20 p-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                                            style="display: none;">
                                            <button wire:click="updateStatus({{ $order->id }}, 'confirmed')"
                                                @click="open = false"
                                                class="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all">
                                                Confirmar
                                            </button>
                                            <button wire:click="updateStatus({{ $order->id }}, 'shipped')"
                                                @click="open = false"
                                                class="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all">
                                                Marcar Enviado
                                            </button>
                                            <button wire:click="updateStatus({{ $order->id }}, 'cancelled')"
                                                @click="open = false"
                                                class="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-12 text-center text-slate-400 text-sm">No se encontraron
                                pedidos.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100">
            {{ $orders->links() }}
        </div>
    </div>

    {{-- Details Modal --}}
    @if ($isDetailsOpen && $selectedOrder)
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div
                class="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div class="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
                    <div>
                        <h3 class="text-lg font-montserrat font-bold text-slate-800">Detalles de Pedido
                            #{{ $selectedOrder->id }}</h3>
                        <p class="text-[12px] text-slate-400">{{ $selectedOrder->createdAt->format('d/m/Y H:i') }}
                        </p>
                    </div>
                    <button wire:click="$set('isDetailsOpen', false)"
                        class="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="p-6 overflow-y-auto space-y-8">
                    {{-- Info Grid --}}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div class="space-y-4">
                            <h4 class="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Información del
                                Cliente</h4>
                            <div class="bg-slate-50 p-4 rounded-2xl space-y-3">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 rounded-full bg-[#0a4d8c] text-white flex items-center justify-center font-bold text-sm">
                                        {{ substr($selectedOrder->user->name ?? '?', 0, 1) }}
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-sm font-bold text-slate-700">
                                            {{ $selectedOrder->user->name ?? 'Invitado' }}</p>
                                        <p class="text-[12px] text-slate-400">{{ $selectedOrder->user->email ?? '-' }}
                                        </p>
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                                    <div>
                                        <p class="text-[10px] font-bold text-slate-400">RUC/DNI</p>
                                        <p class="text-[12px] font-medium text-slate-700">
                                            {{ $selectedOrder->user->documentNumber ?? '-' }}</p>
                                    </div>
                                    <div>
                                        <p class="text-[10px] font-bold text-slate-400">TELÉFONO</p>
                                        <p class="text-[12px] font-medium text-slate-700">
                                            {{ $selectedOrder->user->phone ?? '-' }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <h4 class="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Envío y
                                Facturación</h4>
                            <div class="bg-slate-50 p-4 rounded-2xl space-y-3">
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400">DIRECCIÓN DE ENTREGA</p>
                                    <p class="text-[12px] font-medium text-slate-700">
                                        {{ $selectedOrder->user->shippingAddress ?? 'No especificada' }}</p>
                                    <p class="text-[11px] text-slate-400">
                                        {{ $selectedOrder->user->shippingDistrict ?? '-' }}</p>
                                </div>
                                <div class="pt-2 border-t border-slate-200">
                                    <p class="text-[10px] font-bold text-slate-400">ESTADO ACTUAL</p>
                                    <span
                                        class="inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-bold {{ $selectedOrder->status === 'PENDING'
                                            ? 'bg-amber-100 text-amber-700'
                                            : ($selectedOrder->status === 'CONFIRMED'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-blue-100 text-blue-700') }}">
                                        {{ $selectedOrder->status }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- Items Table --}}
                    <div class="space-y-4">
                        <h4 class="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Productos del Pedido
                        </h4>
                        <div class="border border-slate-100 rounded-2xl overflow-hidden">
                            <table class="w-full text-left font-sans">
                                <thead
                                    class="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100">
                                    <tr>
                                        <th class="px-4 py-3">Producto</th>
                                        <th class="px-4 py-3 text-center">Cant.</th>
                                        <th class="px-4 py-3 text-right">Unitario</th>
                                        <th class="px-4 py-3 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-50 text-[13px]">
                                    @foreach ($selectedOrder->orderItems as $item)
                                        <tr>
                                            <td class="px-4 py-3">
                                                <div class="flex items-center gap-3">
                                                    <img src="{{ $item->product->image }}"
                                                        class="w-8 h-8 rounded border border-slate-100 flex-shrink-0">
                                                    <span
                                                        class="font-medium text-slate-700 truncate max-w-[200px]">{{ $item->product->name }}</span>
                                                </div>
                                            </td>
                                            <td class="px-4 py-3 text-center text-slate-500">{{ $item->quantity }}
                                            </td>
                                            <td class="px-4 py-3 text-right text-slate-500">S/
                                                {{ number_format($item->price, 2) }}</td>
                                            <td class="px-4 py-3 text-right font-bold text-slate-700">S/
                                                {{ number_format($item->price * $item->quantity, 2) }}</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                                <tfoot class="bg-slate-50/50">
                                    <tr class="font-bold">
                                        <td colspan="3" class="px-4 py-4 text-right text-slate-500">TOTAL PEDIDO:
                                        </td>
                                        <td class="px-4 py-4 text-right text-lg text-[#0a4d8c]">S/
                                            {{ number_format($selectedOrder->total, 2) }}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                <div
                    class="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between sticky bottom-0">
                    <button wire:click="$set('isDetailsOpen', false)"
                        class="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all">
                        Cerrar Detalle
                    </button>
                    <div class="flex gap-2">
                        @if ($selectedOrder->status === 'PENDING')
                            <button wire:click="updateStatus({{ $selectedOrder->id }}, 'shipped')"
                                class="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all font-sans">
                                Marcar Enviado
                            </button>
                        @endif
                        @if ($selectedOrder->status === 'SHIPPED')
                            <button wire:click="updateStatus({{ $selectedOrder->id }}, 'confirmed')"
                                class="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all font-sans">
                                Confirmar Recepción
                            </button>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    @endif

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
