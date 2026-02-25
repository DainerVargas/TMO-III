<div class="bg-slate-50 min-h-screen">
    {{-- Header Section --}}
    <section class="bg-[#0a4d8c] pt-24 pb-48 relative overflow-hidden">
        <div class="absolute inset-0 bg-grid-white/[0.05] bg-[size:40px_40px]"></div>
        <div class="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <h1 class="text-white font-montserrat font-black text-5xl mb-6">Contáctanos</h1>
            <p class="text-white/70 max-w-xl mx-auto font-sans text-lg">
                ¿Necesitas una cotización especial o tienes dudas técnicas? Nuestro equipo de expertos está listo para
                ayudarte.
            </p>
        </div>
    </section>

    {{-- Contact Info Cards & Form --}}
    <section class="max-w-7xl mx-auto px-4 -mt-32 pb-24 relative z-20">
        <div class="grid lg:grid-cols-12 gap-8 items-start">

            {{-- Contact Info --}}
            <div class="lg:col-span-4 space-y-6">
                <div class="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
                    <h3 class="text-[#0a4d8c] font-black text-xl mb-8">Información Directa</h3>

                    <div class="space-y-8">
                        <div class="flex gap-4">
                            <div
                                class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0a4d8c] shrink-0">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">WhatsApp
                                    / Call</p>
                                <p class="text-slate-900 font-bold text-lg">+51 976 222 970</p>
                            </div>
                        </div>

                        <div class="flex gap-4">
                            <div
                                class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0a4d8c] shrink-0">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                                <p class="text-slate-900 font-bold text-lg">ventas@tmo.pe</p>
                            </div>
                        </div>

                        <div class="flex gap-4">
                            <div
                                class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0a4d8c] shrink-0">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ubicación
                                </p>
                                <p class="text-slate-900 font-medium">Av. Argentina, Cercado de Lima<br>Almacén Central
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-12 pt-12 border-t border-slate-100">
                        <h4 class="text-slate-900 font-bold mb-4">Horario de Atención</h4>
                        <p class="text-slate-500 text-sm">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                        <p class="text-slate-500 text-sm">Sábados: 9:00 AM - 1:00 PM</p>
                    </div>
                </div>
            </div>

            {{-- Contact Form --}}
            <div class="lg:col-span-8">
                <div class="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
                    <h2 class="text-[#0a4d8c] font-black text-3xl mb-8">Envíanos un mensaje</h2>

                    @if (session()->has('message'))
                        <div
                            class="mb-8 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-3">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span class="font-bold">{{ session('message') }}</span>
                        </div>
                    @endif

                    <form wire:submit.prevent="submit" class="grid md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nombre
                                Completo</label>
                            <input type="text" wire:model="name"
                                class="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-4 focus:ring-[#0a4d8c]/5 focus:bg-white transition-all">
                            @error('name')
                                <span class="text-red-500 text-xs ml-1">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="space-y-2">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Correo
                                Electrónico</label>
                            <input type="email" wire:model="email"
                                class="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-4 focus:ring-[#0a4d8c]/5 focus:bg-white transition-all">
                            @error('email')
                                <span class="text-red-500 text-xs ml-1">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="space-y-2">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Teléfono
                                (Opcional)</label>
                            <input type="text" wire:model="phone"
                                class="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-4 focus:ring-[#0a4d8c]/5 focus:bg-white transition-all">
                        </div>

                        <div class="space-y-2">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Asunto</label>
                            <select wire:model="subject"
                                class="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-4 focus:ring-[#0a4d8c]/5 focus:bg-white transition-all">
                                <option value="">Selecciona una opción</option>
                                <option value="cotizacion">Cotización de Productos</option>
                                <option value="soporte">Soporte Técnico</option>
                                <option value="ventas">Consulta de Ventas</option>
                                <option value="otro">Otro</option>
                            </select>
                            @error('subject')
                                <span class="text-red-500 text-xs ml-1">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="space-y-2 md:col-span-2">
                            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Mensaje o
                                Requerimiento</label>
                            <textarea wire:model="message" rows="5"
                                class="w-full bg-slate-50 border-none rounded-xl p-4 focus:ring-4 focus:ring-[#0a4d8c]/5 focus:bg-white transition-all"></textarea>
                            @error('message')
                                <span class="text-red-500 text-xs ml-1">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="md:col-span-2 pt-4">
                            <button type="submit"
                                class="w-full md:w-auto bg-[#0a4d8c] text-white px-12 py-4 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-[#0f60af] transition-all active:scale-95">
                                Enviar Mensaje
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>

    {{-- Map Section --}}
    <section class="max-w-7xl mx-auto px-4 pb-24 h-[400px]">
        <div
            class="w-full h-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex items-center justify-center relative">
            <div class="absolute inset-0 bg-slate-200">
                {{-- Imagine a map here --}}
                <img src="https://images.unsplash.com/photo-1526778545894-62d468e8810b?auto=format&fit=crop&q=80&w=2000"
                    class="w-full h-full object-cover grayscale opacity-50" />
            </div>
            <div
                class="relative bg-white/90 backdrop-blur p-6 rounded-2xl shadow-xl text-center border border-white/20">
                <h4 class="text-[#0a4d8c] font-black mb-2">Nuestro Centro de Operaciones</h4>
                <p class="text-slate-600 text-sm mb-4">Av. Argentina 215, Cercado de Lima</p>
                <a href="#"
                    class="inline-block bg-[#00bcd4] text-white px-6 py-2 rounded-lg text-xs font-bold uppercase">Ver
                    en Google Maps</a>
            </div>
        </div>
    </section>
</div>
