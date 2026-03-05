<footer class="bg-grad-primary text-white pt-24 pb-12 px-4 relative overflow-hidden">
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
                    <a href="https://wa.me/51976222970" target="_blank"
                        class="group flex items-center gap-4 bg-white/5 p-4 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                        <div
                            class="w-10 h-10 rounded-xl bg-whatsapp flex items-center justify-center shrink-0 shadow-lg shadow-whatsapp/20">
                            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.407 3.481 2.241 2.242 3.48 5.226 3.481 8.408-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.3 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
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
                <p class="text-[11px] uppercase tracking-widest">Desarrollado por <a href="https://beitperu.com"
                        class="text-white/60 font-medium">Beit Peru</a></p>
            </div>
        </div>
    </div>
</footer>
