<div class="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
    {{-- Header --}}
    <div>
        <h2 class="text-2xl font-montserrat font-bold text-slate-800 tracking-tight">
            @if (auth()->user()->role === 'USER')
                @if ($activeTab === 'personal')
                    Mi Información
                @elseif($activeTab === 'compras')
                    Mis Compras
                @elseif($activeTab === 'notificaciones')
                    Notificaciones
                @elseif($activeTab === 'seguridad')
                    Seguridad
                @endif
            @else
                Mi Perfil
            @endif
        </h2>
        <p class="text-slate-500 text-[14px] font-sans">
            @if (auth()->user()->role === 'USER')
                @if ($activeTab === 'personal')
                    Administra tu información personal y datos de envío.
                @elseif($activeTab === 'compras')
                    Revisa el historial y estado de tus pedidos.
                @elseif($activeTab === 'notificaciones')
                    Mantente al día con las actualizaciones de tu cuenta.
                @elseif($activeTab === 'seguridad')
                    Gestiona la seguridad de tu acceso.
                @endif
            @else
                Administra tu información personal, datos de envío y seguridad.
            @endif
        </p>
    </div>

    <div class="grid grid-cols-1 {{ auth()->user()->role !== 'USER' ? 'lg:grid-cols-4' : '' }} gap-8">
        @if (auth()->user()->role !== 'USER')
            {{-- Sidebar Tabs --}}
            <div class="lg:col-span-1 space-y-4">
                <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-2">
                    <button wire:click="setTab('personal')"
                        class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-[14px] {{ $activeTab === 'personal' ? 'bg-[#0a4d8c] text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50' }}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Mi Información
                    </button>
                    <button wire:click="setTab('compras')"
                        class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-[14px] {{ $activeTab === 'compras' ? 'bg-[#0a4d8c] text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50' }}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Mis Compras
                    </button>
                    <button wire:click="setTab('notificaciones')"
                        class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-[14px] {{ $activeTab === 'notificaciones' ? 'bg-[#0a4d8c] text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50' }}">
                        <div class="relative">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            @if (auth()->user()->unreadNotifications->count() > 0)
                                <span
                                    class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                            @endif
                        </div>
                        Notificaciones
                    </button>
                    <button wire:click="setTab('seguridad')"
                        class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-[14px] {{ $activeTab === 'seguridad' ? 'bg-[#0a4d8c] text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50' }}">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Seguridad
                    </button>
                </div>
            </div>
        @endif

        {{-- Main Content --}}
        <div class="{{ auth()->user()->role !== 'USER' ? 'lg:col-span-3' : 'lg:col-span-4' }} space-y-8">
            @if ($activeTab === 'personal')
                {{-- Personal Information Form (Existing) --}}
                <div
                    class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                    <div class="p-6 border-b border-slate-100 flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0a4d8c]">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-montserrat font-bold text-slate-800">Información Personal</h3>
                    </div>

                    <form wire:submit.prevent="updateProfile" class="p-6 space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-1">
                                <label class="text-[12px] font-bold text-slate-500 ml-1">Nombres</label>
                                <input wire:model="name" type="text"
                                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                                @error('name')
                                    <span class="text-red-500 text-[11px] ml-1">{{ $message }}</span>
                                @enderror
                            </div>
                            <div class="space-y-1">
                                <label class="text-[12px] font-bold text-slate-500 ml-1">Apellidos</label>
                                <input wire:model="lastName" type="text"
                                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                            </div>
                            <div class="space-y-1">
                                <label class="text-[12px] font-bold text-slate-500 ml-1">Correo Electrónico</label>
                                <input wire:model="email" type="email"
                                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                                @error('email')
                                    <span class="text-red-500 text-[11px] ml-1">{{ $message }}</span>
                                @enderror
                            </div>
                            <div class="space-y-1">
                                <label class="text-[12px] font-bold text-slate-500 ml-1">Teléfono</label>
                                <input wire:model="phone" type="text"
                                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                            </div>
                            <div class="space-y-1">
                                <label class="text-[12px] font-bold text-slate-500 ml-1">Empresa</label>
                                <input wire:model="companyName" type="text"
                                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                            </div>
                            <div class="space-y-1 flex gap-4">
                                <div class="w-1/3">
                                    <label class="text-[12px] font-bold text-slate-500 ml-1">Tipo Doc.</label>
                                    <select wire:model="documentType"
                                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all font-bold">
                                        <option value="DNI">DNI</option>
                                        <option value="RUC">RUC</option>
                                    </select>
                                </div>
                                <div class="flex-1">
                                    <label class="text-[12px] font-bold text-slate-500 ml-1">N° Documento</label>
                                    <input wire:model="documentNumber" type="text"
                                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                                </div>
                            </div>
                        </div>

                        <div class="pt-4 border-t border-slate-100">
                            <h4 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Datos de
                                Envío
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-1 md:col-span-2">
                                    <label class="text-[12px] font-bold text-slate-500 ml-1">Dirección de Envío</label>
                                    <input wire:model="shippingAddress" type="text"
                                        placeholder="Calle, jirón, avenida..."
                                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[12px] font-bold text-slate-500 ml-1">Distrito / Ciudad</label>
                                    <input wire:model="shippingDistrict" type="text"
                                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[12px] font-bold text-slate-500 ml-1">Referencia</label>
                                    <input wire:model="shippingReference" type="text"
                                        placeholder="Ej: Cerca al parque..."
                                        class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end pt-4">
                            <button type="submit"
                                class="bg-[#0a4d8c] text-white px-8 py-3 rounded-2xl font-bold text-[14px] shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 transition-all active:scale-95 font-montserrat">
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            @elseif ($activeTab === 'compras')
                {{-- Purchases List --}}
                <div
                    class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                    <div class="p-6 border-b border-slate-100 flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-montserrat font-bold text-slate-800">Mis Compras</h3>
                    </div>

                    <div class="p-6">
                        @if ($this->orders->isEmpty())
                            <div class="text-center py-12">
                                <div
                                    class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <p class="text-slate-500 font-bold">Aún no has realizado ninguna compra.</p>
                                <a href="/productos"
                                    class="text-[#0a4d8c] text-sm font-bold mt-2 inline-block hover:underline">Ir a la
                                    tienda</a>
                            </div>
                        @else
                            <div class="space-y-4">
                                @foreach ($this->orders as $order)
                                    <div
                                        class="bg-slate-50 rounded-2xl p-4 border border-slate-100 group hover:border-blue-200 transition-all">
                                        <div class="flex items-center justify-between gap-4">
                                            <div class="flex items-center gap-4">
                                                <div
                                                    class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#0a4d8c]">
                                                    <svg class="w-6 h-6" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h4 class="font-bold text-slate-800">Pedido #{{ $order->id }}
                                                    </h4>
                                                    <p class="text-[12px] text-slate-500">
                                                        {{ $order->createdAt->format('d M, Y H:i') }}</p>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-6">
                                                <div class="text-right">
                                                    <p class="text-sm font-bold text-slate-800">S/
                                                        {{ number_format($order->total, 2) }}</p>
                                                    @php
                                                        $statusColors = [
                                                            'PENDING' => 'bg-amber-100 text-amber-700',
                                                            'PROCESSING' => 'bg-blue-100 text-blue-700',
                                                            'SHIPPED' => 'bg-purple-100 text-purple-700',
                                                            'DELIVERED' => 'bg-green-100 text-green-700',
                                                            'CANCELLED' => 'bg-red-100 text-red-700',
                                                        ];
                                                        $statusColor =
                                                            $statusColors[$order->status] ??
                                                            'bg-slate-100 text-slate-700';
                                                    @endphp
                                                    <span
                                                        class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider {{ $statusColor }}">
                                                        {{ $order->status }}
                                                    </span>
                                                </div>
                                                <button wire:click="viewOrderDetails({{ $order->id }})"
                                                    class="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-[#0a4d8c]">
                                                    <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                        viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        @endif
                    </div>
                </div>
            @elseif ($activeTab === 'notificaciones')
                {{-- Notifications List --}}
                <div
                    class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                    <div class="p-6 border-b border-slate-100 flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-montserrat font-bold text-slate-800">Notificaciones</h3>
                    </div>

                    <div class="p-6">
                        @if ($this->notifications->isEmpty())
                            <div class="text-center py-12">
                                <div
                                    class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <p class="text-slate-500 font-bold">No tienes notificaciones nuevas.</p>
                            </div>
                        @else
                            <div class="divide-y divide-slate-100">
                                @foreach ($this->notifications as $notification)
                                    @php
                                        $status = $notification->data['status'] ?? '';
                                        $colorClasses = match ($status) {
                                            'CONFIRMED', 'DELIVERED', 'COMPLETED' => 'bg-emerald-100 text-emerald-600',
                                            'SHIPPED' => 'bg-indigo-100 text-indigo-600',
                                            'PENDING', 'PROCESSING' => 'bg-amber-100 text-amber-600',
                                            'CANCELLED', 'DENIED', 'REJECTED' => 'bg-red-100 text-red-600',
                                            default => 'bg-blue-100 text-[#0a4d8c]',
                                        };
                                        $iconPath = match ($status) {
                                            'CONFIRMED' => 'M5 13l4 4L19 7',
                                            'SHIPPED'
                                                => 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
                                            'CANCELLED',
                                            'DENIED'
                                                => 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
                                            default => 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                                        };
                                    @endphp
                                    <div
                                        class="py-4 flex gap-4 {{ !$notification->read_at ? 'bg-blue-50/50 -mx-6 px-6' : '' }}">
                                        <div class="shrink-0">
                                            <div
                                                class="w-10 h-10 rounded-full flex items-center justify-center {{ $colorClasses }}">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2" d="{{ $iconPath }}" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div class="flex-1">
                                            <p class="text-sm font-medium text-slate-800">
                                                {{ $notification->data['message'] ?? 'Actualización del sistema' }}</p>
                                            <p class="text-xs text-slate-500 mt-1">
                                                {{ $notification->created_at->diffForHumans() }}</p>
                                        </div>
                                        @if (!$notification->read_at)
                                            <button wire:click="markAsRead('{{ $notification->id }}')"
                                                class="text-[11px] font-bold text-[#0a4d8c] hover:underline">
                                                Marcar como leída
                                            </button>
                                        @endif
                                    </div>
                                @endforeach
                            </div>
                        @endif
                    </div>
                </div>
            @elseif ($activeTab === 'seguridad')
                {{-- Security Section (Existing) --}}
                <div
                    class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                    <div class="p-6 border-b border-slate-100 flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 class="text-lg font-montserrat font-bold text-slate-800">Seguridad</h3>
                    </div>

                    <form wire:submit.prevent="updatePassword" class="p-6 space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-1 md:col-span-2">
                                <label class="text-[12px] font-bold text-slate-500 ml-1">Contraseña Actual</label>
                                <input wire:model="current_password" type="password"
                                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                                @error('current_password')
                                    <span class="text-red-500 text-[11px] ml-1">{{ $message }}</span>
                                @enderror
                            </div>
                            <div class="space-y-1">
                                <label class="text-[12px] font-bold text-slate-500 ml-1">Nueva Contraseña</label>
                                <input wire:model="new_password" type="password"
                                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                                @error('new_password')
                                    <span class="text-red-500 text-[11px] ml-1">{{ $message }}</span>
                                @enderror
                            </div>
                            <div class="space-y-1">
                                <label class="text-[12px] font-bold text-slate-500 ml-1">Confirmar Contraseña</label>
                                <input wire:model="new_password_confirmation" type="password"
                                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                            </div>
                        </div>

                        <div class="flex justify-end pt-4">
                            <button type="submit"
                                class="bg-slate-800 text-white px-8 py-3 rounded-2xl font-bold text-[14px] transition-all active:scale-95 font-montserrat">
                                Restablecer Contraseña
                            </button>
                        </div>
                    </form>
                </div>
            @endif
        </div>
    </div>

    {{-- Order Details Modal --}}
    @if ($selectedOrder)
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" wire:click="closeOrderDetails"></div>
            <div
                class="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
                <div class="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 class="text-2xl font-montserrat font-bold text-slate-800">Detalle de Compra</h3>
                        <p class="text-slate-500 text-sm">Pedido #{{ $selectedOrder->id }}</p>
                    </div>
                    <button wire:click="closeOrderDetails" class="p-2 hover:bg-slate-50 rounded-xl transition-all">
                        <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="p-8 max-h-[60vh] overflow-y-auto">
                    <div class="space-y-6">
                        @foreach ($selectedOrder->orderItems as $item)
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                                    @if ($item->product && $item->product->image)
                                        <img src="{{ $item->product->image }}" class="w-full h-full object-cover">
                                    @else
                                        <div class="w-full h-full flex items-center justify-center text-slate-300">
                                            <svg class="w-8 h-8" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    @endif
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-bold text-slate-800 text-sm">
                                        {{ $item->product->name ?? 'Producto no disponible' }}</h4>
                                    <p class="text-xs text-slate-500">Cantidad: {{ $item->quantity }} x S/
                                        {{ number_format($item->price, 2) }}</p>
                                </div>
                                <div class="text-right">
                                    <p class="font-bold text-slate-800 text-sm">S/
                                        {{ number_format($item->quantity * $item->price, 2) }}</p>
                                </div>
                            </div>
                        @endforeach
                    </div>

                    <div class="mt-8 pt-6 border-t border-slate-100 space-y-2">
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500">Subtotal</span>
                            <span class="text-slate-800 font-bold">S/
                                {{ number_format($selectedOrder->total, 2) }}</span>
                        </div>
                        <div class="flex justify-between text-lg pt-2">
                            <span class="font-montserrat font-bold text-slate-800">Total</span>
                            <span class="font-montserrat font-black text-[#0a4d8c]">S/
                                {{ number_format($selectedOrder->total, 2) }}</span>
                        </div>
                    </div>
                </div>

                <div class="p-8 bg-slate-50 flex justify-end">
                    <button wire:click="closeOrderDetails"
                        class="bg-[#0a4d8c] text-white px-8 py-3 rounded-2xl font-bold text-[14px] shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 transition-all active:scale-95 font-montserrat">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    @endif
</div>
