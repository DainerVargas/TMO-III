<div class="relative" x-data="{ open: false }">
    {{-- Notification Button --}}
    <button @click="open = !open"
        class="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-[#0a4d8c] transition-all relative focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        @if ($this->unreadCount > 0)
            <span
                class="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                {{ $this->unreadCount }}
            </span>
        @endif
    </button>

    {{-- Dropdown Panel --}}
    <div x-show="open" @click.away="open = false" x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0 scale-95" x-transition:enter-end="opacity-100 scale-100"
        x-transition:leave="transition ease-in duration-75" x-transition:leave-start="opacity-100 scale-100"
        x-transition:leave-end="opacity-0 scale-95"
        class="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl z-[100] overflow-hidden">

        <div class="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h3 class="text-[14px] font-black text-slate-800 uppercase tracking-tight">Notificaciones</h3>
            @if ($this->unreadCount > 0)
                <button wire:click="markAllAsRead" class="text-[11px] font-bold text-[#0a4d8c] hover:underline">
                    Marcar todo como leído
                </button>
            @endif
        </div>

        <div class="max-h-[400px] overflow-y-auto">
            @forelse ($this->notifications as $notif)
                <div class="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors relative group {{ $notif->read_at ? 'opacity-60' : '' }}"
                    wire:key="notif-{{ $notif->id }}">
                    <div class="flex gap-3">
                        @php
                            $status = $notif->data['status'] ?? '';
                            $colorClasses = match ($status) {
                                'CONFIRMED', 'DELIVERED', 'COMPLETED' => 'bg-emerald-100 text-emerald-600',
                                'SHIPPED' => 'bg-indigo-100 text-indigo-600',
                                'PENDING', 'PROCESSING' => 'bg-amber-100 text-amber-600',
                                'CANCELLED', 'DENIED', 'REJECTED' => 'bg-red-100 text-red-600',
                                default => $notif->data['type'] === 'PENDING_ORDER'
                                    ? 'bg-amber-100 text-amber-600'
                                    : 'bg-blue-100 text-blue-600',
                            };
                            $iconPath = match ($status) {
                                'CONFIRMED' => 'M5 13l4 4L19 7',
                                'SHIPPED'
                                    => 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
                                'CANCELLED',
                                'DENIED'
                                    => 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
                                default => $notif->data['type'] === 'PENDING_ORDER'
                                    ? 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                                    : 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                            };
                        @endphp
                        <div
                            class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center {{ $colorClasses }}">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="{{ $iconPath }}" />
                            </svg>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-[13px] font-bold text-slate-800 leading-snug">
                                {{ $notif->data['message'] }}
                            </p>
                            <p class="text-[11px] text-slate-400 mt-1 font-medium">
                                {{ $notif->created_at->diffForHumans() }}
                            </p>

                            <div class="mt-2 flex items-center gap-3">
                                @if (!$notif->read_at)
                                    <button wire:click="markAsRead('{{ $notif->id }}')"
                                        class="text-[11px] font-bold text-[#0a4d8c] bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors">
                                        Entendido
                                    </button>
                                @endif

                                @if (isset($notif->data['order_id']))
                                    <button
                                        wire:click="goToOrder('{{ $notif->id }}', '{{ $notif->data['order_id'] }}')"
                                        class="text-[11px] font-bold text-slate-600 hover:text-[#0a4d8c]">
                                        Ver Pedido
                                    </button>
                                @endif
                            </div>
                        </div>

                        {{-- Delete button on hover --}}
                        <button wire:click="deleteNotification('{{ $notif->id }}')"
                            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-all">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            @empty
                <div class="p-8 text-center">
                    <div class="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 8-8-8" />
                        </svg>
                    </div>
                    <p class="text-[13px] font-bold text-slate-400">No hay notificaciones</p>
                </div>
            @endforelse
        </div>

        @if ($this->notifications->count() > 0)
            <div class="p-3 border-t border-slate-50 text-center">
                <button wire:click="clearAll"
                    class="text-[11px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">
                    Limpiar todo
                </button>
            </div>
        @endif
    </div>
</div>
