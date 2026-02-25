<div x-data="{ isOpen: @entangle('isOpen') }">
    {{-- Modal Overlay --}}
    <div x-show="isOpen" x-transition:enter="transition-opacity duration-300" x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100" x-transition:leave="transition-opacity duration-300"
        x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0"
        class="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">

        {{-- Modal Content --}}
        <div x-show="isOpen" x-transition:enter="transition-all duration-300"
            x-transition:enter-start="opacity-0 scale-95 translate-y-4"
            x-transition:enter-end="opacity-100 scale-100 translate-y-0"
            x-transition:leave="transition-all duration-200"
            x-transition:leave-start="opacity-100 scale-100 translate-y-0"
            x-transition:leave-end="opacity-0 scale-95 translate-y-4"
            class="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

            {{-- Header --}}
            <div
                class="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
                <h2 class="text-lg font-montserrat font-black text-slate-800 tracking-tight">Completar Pedido</h2>
                <button @click="isOpen = false"
                    class="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {{-- Fixed Stepper --}}
            <div class="px-12 py-6 bg-slate-50/50 border-b border-slate-100 sticky top-[69px] z-10">
                <div class="flex items-center justify-between relative">
                    <div class="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>

                    <div class="relative z-10 flex flex-col items-center gap-1.5">
                        <div
                            class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 {{ $step >= 1 ? 'bg-[#0a4d8c] text-white shadow-md shadow-blue-500/30' : 'bg-white text-slate-400 border-2 border-slate-200' }}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <span
                            class="text-[9px] font-black uppercase tracking-widest {{ $step >= 1 ? 'text-[#0a4d8c]' : 'text-slate-400' }}">Datos</span>
                    </div>

                    <div class="relative z-10 flex flex-col items-center gap-1.5">
                        <div
                            class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 {{ $step >= 2 ? 'bg-[#0a4d8c] text-white shadow-md shadow-blue-500/30' : 'bg-white text-slate-400 border-2 border-slate-200' }}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <span
                            class="text-[9px] font-black uppercase tracking-widest {{ $step >= 2 ? 'text-[#0a4d8c]' : 'text-slate-400' }}">Envío</span>
                    </div>

                    <div class="relative z-10 flex flex-col items-center gap-1.5">
                        <div
                            class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 {{ $step >= 3 ? 'bg-[#0a4d8c] text-white shadow-md shadow-blue-500/30' : 'bg-white text-slate-400 border-2 border-slate-200' }}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span
                            class="text-[9px] font-black uppercase tracking-widest {{ $step >= 3 ? 'text-[#0a4d8c]' : 'text-slate-400' }}">Confirmar</span>
                    </div>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto custom-scrollbar">
                <div class="p-7 space-y-6">
                    @if ($step == 1)
                        {{-- Step 1: Datos --}}
                        <div class="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div class="flex items-center gap-3">
                                <div class="w-1.5 h-5 bg-[#0a4d8c] rounded-full"></div>
                                <h3 class="text-[16px] font-montserrat font-bold text-slate-800">Datos del Cliente</h3>
                            </div>

                            <div
                                class="bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl flex items-start gap-4">
                                <div
                                    class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-[12px] text-emerald-800 font-bold mb-0.5">Datos completados
                                        automáticamente</p>
                                    <p class="text-[10px] text-emerald-600/80 font-medium">Revisa y ajusta si es
                                        necesario. Asegúrate de que tu contacto sea correcto.</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <label
                                        class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre
                                        *</label>
                                    <input wire:model="name" type="text"
                                        class="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#0a4d8c]/20 focus:ring-4 focus:ring-[#0a4d8c]/5 rounded-xl px-4 py-2.5 text-[13px] font-bold text-slate-700 outline-none transition-all"
                                        placeholder="Juan">
                                    @error('name')
                                        <span class="text-[9px] text-red-500 font-bold ml-1">{{ $message }}</span>
                                    @enderror
                                </div>
                                <div class="space-y-1">
                                    <label
                                        class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Apellido
                                        *</label>
                                    <input wire:model="lastName" type="text"
                                        class="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#0a4d8c]/20 focus:ring-4 focus:ring-[#0a4d8c]/5 rounded-xl px-4 py-2.5 text-[13px] font-bold text-slate-700 outline-none transition-all"
                                        placeholder="Pérez">
                                    @error('lastName')
                                        <span class="text-[9px] text-red-500 font-bold ml-1">{{ $message }}</span>
                                    @enderror
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <label
                                        class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email
                                        *</label>
                                    <input wire:model="email" type="email"
                                        class="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#0a4d8c]/20 focus:ring-4 focus:ring-[#0a4d8c]/5 rounded-xl px-4 py-2.5 text-[13px] font-bold text-slate-700 outline-none transition-all"
                                        placeholder="juan@ejemplo.com">
                                    @error('email')
                                        <span class="text-[9px] text-red-500 font-bold ml-1">{{ $message }}</span>
                                    @enderror
                                </div>
                                <div class="space-y-1">
                                    <label
                                        class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Teléfono
                                        *</label>
                                    <input wire:model="phone" type="text"
                                        class="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#0a4d8c]/20 focus:ring-4 focus:ring-[#0a4d8c]/5 rounded-xl px-4 py-2.5 text-[13px] font-bold text-slate-700 outline-none transition-all"
                                        placeholder="987 654 321">
                                    @error('phone')
                                        <span class="text-[9px] text-red-500 font-bold ml-1">{{ $message }}</span>
                                    @enderror
                                </div>
                            </div>

                            <div class="space-y-2.5">
                                <label
                                    class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tipo
                                    de Documento *</label>
                                <div class="flex gap-3">
                                    <button wire:click="$set('documentType', 'RUC')"
                                        class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-black text-[12px] {{ $documentType == 'RUC' ? 'bg-[#0a4d8c]/5 border-[#0a4d8c] text-[#0a4d8c]' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100' }}">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        RUC
                                    </button>
                                    <button wire:click="$set('documentType', 'DNI')"
                                        class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-black text-[12px] {{ $documentType == 'DNI' ? 'bg-[#0a4d8c]/5 border-[#0a4d8c] text-[#0a4d8c]' : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100' }}">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        DNI
                                    </button>
                                </div>
                            </div>

                            <div class="space-y-1">
                                <label
                                    class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Número
                                    de Documento *</label>
                                <input wire:model="documentNumber" type="text"
                                    class="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#0a4d8c]/20 focus:ring-4 focus:ring-[#0a4d8c]/5 rounded-xl px-4 py-2.5 text-[13px] font-bold text-slate-700 outline-none transition-all"
                                    placeholder="20123456789">
                                @error('documentNumber')
                                    <span class="text-[9px] text-red-500 font-bold ml-1">{{ $message }}</span>
                                @enderror
                            </div>

                            @if ($documentType == 'RUC')
                                <div class="space-y-1 animate-in fade-in duration-300">
                                    <label
                                        class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Razón
                                        Social / Empresa *</label>
                                    <input wire:model="companyName" type="text"
                                        class="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#0a4d8c]/20 focus:ring-4 focus:ring-[#0a4d8c]/5 rounded-xl px-4 py-2.5 text-[13px] font-bold text-slate-700 outline-none transition-all"
                                        placeholder="Industrias del Pacífico S.A.C.">
                                    @error('companyName')
                                        <span class="text-[9px] text-red-500 font-bold ml-1">{{ $message }}</span>
                                    @enderror
                                </div>
                            @endif
                        </div>
                    @elseif($step == 2)
                        {{-- Step 2: Envío --}}
                        <div class="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div class="flex items-center gap-3">
                                <div class="w-1.5 h-5 bg-[#0a4d8c] rounded-full"></div>
                                <h3 class="text-[16px] font-montserrat font-bold text-slate-800">Datos de Entrega</h3>
                            </div>

                            <div class="space-y-1">
                                <label
                                    class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Dirección
                                    de Envío *</label>
                                <input wire:model="shippingAddress" type="text"
                                    class="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#0a4d8c]/20 focus:ring-4 focus:ring-[#0a4d8c]/5 rounded-xl px-4 py-2.5 text-[13px] font-bold text-slate-700 outline-none transition-all"
                                    placeholder="Av. Larco 123">
                                @error('shippingAddress')
                                    <span class="text-[9px] text-red-500 font-bold ml-1">{{ $message }}</span>
                                @enderror
                            </div>

                            <div class="space-y-1">
                                <label
                                    class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Distrito
                                    *</label>
                                <input wire:model="shippingDistrict" type="text"
                                    class="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#0a4d8c]/20 focus:ring-4 focus:ring-[#0a4d8c]/5 rounded-xl px-4 py-2.5 text-[13px] font-bold text-slate-700 outline-none transition-all"
                                    placeholder="Miraflores">
                                @error('shippingDistrict')
                                    <span class="text-[9px] text-red-500 font-bold ml-1">{{ $message }}</span>
                                @enderror
                            </div>

                            <div class="space-y-1">
                                <label
                                    class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Referencia
                                    (Opcional)</label>
                                <textarea wire:model="shippingReference"
                                    class="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#0a4d8c]/20 focus:ring-4 focus:ring-[#0a4d8c]/5 rounded-xl px-4 py-2.5 text-[13px] font-bold text-slate-700 outline-none transition-all min-h-[80px]"
                                    placeholder="Frente al centro comercial..."></textarea>
                            </div>
                        </div>
                    @elseif($step == 3)
                        {{-- Step 3: Confirmación --}}
                        <div
                            class="flex flex-col items-center justify-center text-center py-8 space-y-6 animate-in zoom-in duration-500">
                            <div
                                class="w-20 h-20 rounded-[2rem] bg-emerald-50 flex items-center justify-center text-emerald-500 border-2 border-emerald-100 shadow-xl shadow-emerald-500/10">
                                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-xl font-montserrat font-black text-slate-800 mb-2">¡Todo listo!</h3>
                                <p class="text-slate-500 text-[13px] max-w-sm mx-auto">Tu cotización ha sido procesada
                                    correctamente. Un asesor se contactará contigo pronto.</p>
                            </div>
                            <div class="w-full bg-slate-50 rounded-[2rem] p-5 text-left space-y-2.5">
                                <div class="flex justify-between items-center text-[11px]">
                                    <span class="text-slate-400 font-bold tracking-widest uppercase">Cliente</span>
                                    <span class="text-slate-800 font-black">{{ $name }}
                                        {{ $lastName }}</span>
                                </div>
                                <div class="flex justify-between items-center text-[11px]">
                                    <span class="text-slate-400 font-bold tracking-widest uppercase">Documento</span>
                                    <span class="text-slate-800 font-black">{{ $documentType }}:
                                        {{ $documentNumber }}</span>
                                </div>
                                <div class="flex justify-between items-center text-[11px]">
                                    <span class="text-slate-400 font-bold tracking-widest uppercase">Contacto</span>
                                    <span class="text-slate-800 font-black">{{ $phone }}</span>
                                </div>
                                <div class="flex justify-between items-center text-[11px]">
                                    <span class="text-slate-400 font-bold tracking-widest uppercase">Entrega</span>
                                    <span class="text-slate-800 font-black">{{ $shippingDistrict }}</span>
                                </div>
                            </div>
                        </div>
                    @endif
                </div>
            </div>

            {{-- Footer --}}
            <div
                class="px-8 py-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between sticky bottom-0 z-20">
                @if ($step == 1)
                    <button @click="isOpen = false"
                        class="text-slate-400 hover:text-slate-600 font-black text-[12px] uppercase tracking-widest transition-all">
                        Cancelar
                    </button>
                    <button wire:click="nextStep"
                        class="bg-[#0a4d8c] text-white px-8 py-3.5 rounded-xl font-black text-[13px] uppercase tracking-[0.15em] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95 transition-all flex items-center gap-2.5">
                        Continuar
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                @elseif($step == 2)
                    <button wire:click="prevStep"
                        class="text-slate-400 hover:text-slate-600 font-black text-[12px] uppercase tracking-widest transition-all">
                        Atrás
                    </button>
                    <button wire:click="submitOrder"
                        class="bg-[#0a4d8c] text-white px-8 py-3.5 rounded-xl font-black text-[13px] uppercase tracking-[0.15em] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95 transition-all flex items-center gap-2.5">
                        Finalizar
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                @else
                    <div class="w-full flex justify-center">
                        <button @click="isOpen = false"
                            class="bg-[#0a4d8c] text-white px-10 py-3.5 rounded-xl font-black text-[13px] uppercase tracking-[0.15em] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95 transition-all">
                            Cerrar
                        </button>
                    </div>
                @endif
            </div>

        </div>
    </div>

    <style>
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #cbd5e1;
        }
    </style>
</div>
