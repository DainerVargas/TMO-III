<div class="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
    {{-- Header --}}
    <div>
        <h2 class="text-2xl font-montserrat font-bold text-slate-800 tracking-tight">Mi Perfil</h2>
        <p class="text-slate-500 text-[14px] font-sans">Administra tu información personal, datos de envío y seguridad.
        </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {{-- Sidebar Info --}}
        <div class="lg:col-span-1 space-y-6">
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="h-24 bg-gradient-to-r from-[#0a4d8c] to-[#1a6db3]"></div>
                <div class="px-6 pb-6 text-center -mt-12">
                    <div
                        class="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white border-4 border-white shadow-xl overflow-hidden mb-4">
                        <div
                            class="w-full h-full bg-[#f0f7ff] flex items-center justify-center text-[#0a4d8c] text-3xl font-black font-montserrat uppercase">
                            {{ substr(auth()->user()->name, 0, 1) }}
                        </div>
                    </div>
                    <h3 class="text-lg font-bold text-slate-800">{{ auth()->user()->name }}
                        {{ auth()->user()->lastName ?? '' }}</h3>
                    <p class="text-sm font-bold text-[#0a4d8c] bg-blue-50 px-3 py-1 rounded-full inline-block mt-1">
                        {{ auth()->user()->role }}</p>

                    <div class="mt-8 space-y-3 text-left">
                        <div class="flex items-center gap-3 text-sm text-slate-600">
                            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span class="truncate">{{ auth()->user()->email }}</span>
                        </div>
                        <div class="flex items-center gap-3 text-sm text-slate-600">
                            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>{{ auth()->user()->phone ?? 'No registrado' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {{-- Forms Section --}}
        <div class="lg:col-span-2 space-y-8">
            {{-- Personal Information Form --}}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
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
                        <h4 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Datos de Envío
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

            {{-- Security Section --}}
            <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-slate-100 flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
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
        </div>
    </div>
</div>
