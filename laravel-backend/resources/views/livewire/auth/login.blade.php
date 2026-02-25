<div class="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8 bg-[#f8f9fb]">
    <div class="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        {{-- Back to site button --}}
        <div class="mb-6">
            <a href="/"
                class="inline-flex items-center gap-2 text-[#64748b] hover:text-[#0a4d8c] transition-colors font-medium text-sm group">
                <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a la tienda
            </a>
        </div>

        {{-- Tabs --}}
        <div class="flex bg-[#f5f7fa] p-1.5 rounded-2xl mb-8 border border-slate-200 shadow-sm">
            <button wire:click="setMode('login')"
                class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-bold transition-all {{ $mode === 'login' ? 'bg-white text-[#0a4d8c] shadow-md' : 'text-[#64748b] hover:text-[#0a4d8c]' }} font-montserrat">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Iniciar Sesión
            </button>
            <button wire:click="setMode('register')"
                class="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-bold transition-all {{ $mode === 'register' ? 'bg-white text-[#0a4d8c] shadow-md' : 'text-[#64748b] hover:text-[#0a4d8c]' }} font-montserrat">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Crear Cuenta
            </button>
        </div>

        @if ($mode === 'login')
            {{-- Login View --}}
            <div class="animate-in fade-in duration-500">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-black text-[#0a4d8c] mb-2 font-montserrat tracking-tight">
                        Bienvenido de nuevo
                    </h2>
                    <p class="text-[#64748b] font-sans text-sm font-medium">
                        Ingresa tus credenciales para acceder a tu panel corporativo.
                    </p>
                </div>

                <div class="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">
                    <form wire:submit="login" class="space-y-6">
                        {{-- Email --}}
                        <div class="space-y-2">
                            <label class="block text-[13px] font-bold text-[#374151] ml-1 font-sans">Correo
                                Electrónico</label>
                            <div class="relative group">
                                <div
                                    class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] transition-colors group-focus-within:text-[#0a4d8c]">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input type="email" wire:model="email" required
                                    class="w-full pl-11 pr-4 py-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-sans"
                                    placeholder="ejemplo@empresa.com">
                            </div>
                            @error('email')
                                <span class="text-red-500 text-[12px] ml-1 font-bold">{{ $message }}</span>
                            @enderror
                        </div>

                        {{-- Password --}}
                        <div class="space-y-2" x-data="{ show: false }">
                            <label class="block text-[13px] font-bold text-[#374151] ml-1 font-sans">Contraseña</label>
                            <div class="relative group">
                                <div
                                    class="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] transition-colors group-focus-within:text-[#0a4d8c]">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input :type="show ? 'text' : 'password'" wire:model="password" required
                                    class="w-full pl-11 pr-12 py-3.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-sans"
                                    placeholder="••••••••">
                                <button type="button" @click="show = !show"
                                    class="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#94a3b8] hover:text-[#0a4d8c] transition-colors">
                                    <svg x-show="!show" class="w-5 h-5" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <svg x-show="show" x-cloak class="w-5 h-5" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {{-- Submit --}}
                        <button type="submit" wire:loading.attr="disabled"
                            class="w-full bg-[#0a4d8c] hover:bg-[#083d6f] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0a4d8c]/25 transition-all hover:scale-[1.02] active:scale-[0.98] group font-montserrat tracking-wide">
                            <span wire:loading.remove>Acceder al Panel</span>
                            <span wire:loading class="flex items-center gap-2">
                                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10"
                                        stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                Procesando...
                            </span>
                            <svg wire:loading.remove class="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </form>

                    <div class="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p class="text-[14px] text-[#64748b] font-medium font-sans">
                            ¿No tienes una cuenta?
                            <button wire:click="setMode('register')"
                                class="text-[#0a4d8c] font-bold hover:underline">Registrarme</button>
                        </p>
                    </div>
                </div>
            </div>
        @else
            {{-- Register View --}}
            <div class="animate-in fade-in duration-500">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-black text-[#0a4d8c] mb-2 font-montserrat tracking-tight">
                        Registro Corporativo
                    </h2>
                    <p class="text-[#64748b] font-sans text-sm font-medium">
                        Únete a nuestra red de clientes y accede a beneficios exclusivos.
                    </p>
                </div>

                <div class="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">
                    <form wire:submit="register" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label class="block text-[13px] font-bold text-[#374151] ml-1">Nombres</label>
                                <input type="text" wire:model="name" required
                                    class="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-sans"
                                    placeholder="Juan">
                            </div>
                            <div class="space-y-1.5">
                                <label class="block text-[13px] font-bold text-[#374151] ml-1">Apellidos</label>
                                <input type="text" wire:model="lastName" required
                                    class="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-sans"
                                    placeholder="Pérez">
                            </div>
                        </div>

                        <div class="space-y-1.5">
                            <label class="block text-[13px] font-bold text-[#374151] ml-1">Correo Electrónico</label>
                            <input type="email" wire:model="email" required
                                class="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-sans"
                                placeholder="juan.perez@empresa.com">
                            @error('email')
                                <span class="text-red-500 text-[12px]">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label class="block text-[13px] font-bold text-[#374151] ml-1">Teléfono</label>
                                <input type="tel" wire:model="phone" required
                                    class="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-sans"
                                    placeholder="987654321">
                            </div>
                            <div class="space-y-1.5">
                                <label class="block text-[13px] font-bold text-[#374151] ml-1">Tipo Doc.</label>
                                <select wire:model="documentType" required
                                    class="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-sans">
                                    <option value="DNI">DNI</option>
                                    <option value="RUC">RUC</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label class="block text-[13px] font-bold text-[#374151] ml-1">Número Doc.</label>
                                <input type="text" wire:model="documentNumber" required
                                    class="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-sans"
                                    placeholder="12345678">
                            </div>
                            <div class="space-y-1.5">
                                <label class="block text-[13px] font-bold text-[#374151] ml-1">Contraseña</label>
                                <input type="password" wire:model="password" required
                                    class="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-sans"
                                    placeholder="••••••••">
                            </div>
                        </div>

                        <div class="space-y-1.5 pb-2">
                            <label class="block text-[13px] font-bold text-[#374151] ml-1">Nombre Empresa
                                (Opcional)</label>
                            <input type="text" wire:model="companyName"
                                class="w-full px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-sans"
                                placeholder="Mi Empresa S.A.C.">
                        </div>

                        <button type="submit" wire:loading.attr="disabled"
                            class="w-full bg-gradient-to-r from-[#0a4d8c] to-[#00bcd4] hover:shadow-cyan-500/20 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0a4d8c]/20 transition-all hover:scale-[1.02] active:scale-[0.98] font-montserrat tracking-wide">
                            <span wire:loading.remove>Crear Mi Cuenta</span>
                            <span wire:loading class="flex items-center gap-2">
                                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10"
                                        stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                Procesando...
                            </span>
                        </button>
                    </form>

                    <div class="mt-8 pt-6 border-t border-slate-100 text-center">
                        <p class="text-[14px] text-[#64748b] font-medium">
                            ¿Ya tienes cuenta?
                            <button wire:click="setMode('login')"
                                class="text-[#0a4d8c] font-bold hover:underline">Iniciar Sesión</button>
                        </p>
                    </div>
                </div>
            </div>
        @endif
    </div>
</div>
