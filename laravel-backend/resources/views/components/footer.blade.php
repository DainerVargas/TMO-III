<footer class="bg-[#0a4d8c] text-white pt-24 pb-12 px-4 relative overflow-hidden">
    {{-- Decorative background elements --}}
    <div
        class="absolute top-0 right-0 w-96 h-96 bg-[#00bcd4]/10 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none">
    </div>
    <div class="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none">
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
            {{-- Brand Column --}}
            <div class="lg:col-span-4">
                <img src="{{ asset('storage/logos/logo-footer.png') }}"
                    class="h-16 w-auto mb-8 filter brightness-0 invert" alt="SSI">
                <p class="text-white/80 max-w-sm font-sans text-[16px] leading-relaxed mb-8 font-medium">
                    Soluciones integrales de abastecimiento para la industria nacional. Stock permanente y logística de
                    alta eficiencia.
                </p>
            </div>

            {{-- Products Column --}}
            <div class="lg:col-span-2 lg:ml-auto">
                <h4 class="font-montserrat font-black mb-8 text-white text-[18px] uppercase tracking-wider">Productos
                </h4>
                <ul class="space-y-4 text-white/70 text-[15px] font-sans font-medium">
                    <li><a href="{{ route('products') }}"
                            class="hover:text-[#00bcd4] hover:translate-x-1 inline-block transition-all underline-offset-4 hover:underline">Ver
                            Catálogo</a></li>
                    <li><a href="#"
                            class="hover:text-[#00bcd4] hover:translate-x-1 inline-block transition-all underline-offset-4 hover:underline">Útiles
                            de Oficina</a></li>
                    <li><a href="#"
                            class="hover:text-[#00bcd4] hover:translate-x-1 inline-block transition-all underline-offset-4 hover:underline">Seguridad
                            Industrial</a></li>
                    <li><a href="#"
                            class="hover:text-[#00bcd4] hover:translate-x-1 inline-block transition-all underline-offset-4 hover:underline">Limpieza</a>
                    </li>
                    <li><a href="#"
                            class="hover:text-[#00bcd4] hover:translate-x-1 inline-block transition-all underline-offset-4 hover:underline">Sabanillas</a>
                    </li>
                </ul>
            </div>

            {{-- Company Column --}}
            <div class="lg:col-span-2 lg:ml-auto">
                <h4 class="font-montserrat font-black mb-8 text-white text-[18px] uppercase tracking-wider">Empresa</h4>
                <ul class="space-y-4 text-white/70 text-[15px] font-sans font-medium">
                    <li><a href="{{ route('about') }}"
                            class="hover:text-[#00bcd4] hover:translate-x-1 inline-block transition-all underline-offset-4 hover:underline">Nosotros</a>
                    </li>
                    <li><a href="{{ route('contact') }}"
                            class="hover:text-[#00bcd4] hover:translate-x-1 inline-block transition-all underline-offset-4 hover:underline">Contacto</a>
                    </li>
                    <li><a href="#"
                            class="hover:text-[#00bcd4] hover:translate-x-1 inline-block transition-all underline-offset-4 hover:underline">Mi
                            Cuenta</a></li>
                    <li><a href="#"
                            class="hover:text-[#00bcd4] hover:translate-x-1 inline-block transition-all underline-offset-4 hover:underline">Envíos</a>
                    </li>
                </ul>
            </div>

            {{-- Contact Column --}}
            <div class="lg:col-span-4 lg:ml-auto">
                <h4 class="font-montserrat font-black mb-8 text-white text-[18px] uppercase tracking-wider">Atención
                    Directa</h4>
                <div class="space-y-6">
                    <a href="tel:+51976222970"
                        class="group flex items-center gap-4 bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                        <div class="w-10 h-10 rounded-xl bg-[#00bcd4] flex items-center justify-center shrink-0">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-[10px] uppercase font-bold text-white/50 tracking-widest">WhatsApp / Celular
                            </p>
                            <p class="text-[15px] font-montserrat font-bold text-white">+51 976 222 970</p>
                        </div>
                    </a>
                    <a href="mailto:ventas@tmo.pe"
                        class="group flex items-center gap-4 bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                        <div class="w-10 h-10 rounded-xl bg-[#00bcd4] flex items-center justify-center shrink-0">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-[10px] uppercase font-bold text-white/50 tracking-widest">Correo Electrónico
                            </p>
                            <p class="text-[15px] font-montserrat font-bold text-white">ventas@tmo.pe</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>

        {{-- Bottom Bar --}}
        <div
            class="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-white/40 text-[14px]">
            <div class="flex items-center gap-6">
                <p>&copy; 2026 <span class="text-white/60 font-bold">TMO Suministros</span>. Todos los derechos
                    reservados.</p>
            </div>
            <div class="flex items-center gap-8 text-[13px]">
                <a href="#" class="hover:text-white transition-colors">Privacidad</a>
                <a href="#" class="hover:text-white transition-colors">Términos</a>
                <span class="text-white/10">|</span>
                <p class="text-[11px] uppercase tracking-widest">Desarrollado por <span
                        class="text-white/60 font-medium">Beit Peru</span></p>
            </div>
        </div>
    </div>
</footer>
