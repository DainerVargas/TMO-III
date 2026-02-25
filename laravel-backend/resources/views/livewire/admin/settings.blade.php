<div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {{-- Page Header --}}
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-montserrat font-bold text-slate-800 tracking-tight">Configuración del Sistema</h2>
            <p class="text-slate-500 text-[14px] font-sans">Administra los parámetros globales, integraciones y webhooks
                del e-commerce.</p>
        </div>
        <button wire:click="loadSettings"
            class="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-xl font-bold text-[13px] hover:bg-slate-50 transition-all shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Recargar
        </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {{-- Integrations Section --}}
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div class="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                <div
                    class="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[#0a4d8c] shadow-sm">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                </div>
                <h3 class="font-bold text-lg text-slate-800 font-montserrat">Integraciones Externas</h3>
            </div>

            <div class="p-6 space-y-6 flex-1">
                @php
                    $integrations = [
                        [
                            'key' => 'N8N_WEBHOOK_URL',
                            'label' => 'n8n Webhook URL',
                            'placeholder' => 'https://n8n.example.com/...',
                        ],
                        ['key' => 'CRM_API_KEY', 'label' => 'CRM API Key', 'placeholder' => 'ABC-123-XYZ'],
                    ];
                @endphp

                @foreach ($integrations as $s)
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <label class="text-[13px] font-bold text-slate-500 ml-1">{{ $s['label'] }}</label>
                            <span
                                class="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{{ $s['key'] }}</span>
                        </div>
                        <div class="flex gap-2">
                            <input type="text" value="{{ $settings[$s['key']] ?? '' }}"
                                placeholder="{{ $s['placeholder'] }}"
                                onblur="@this.updateSetting('{{ $s['key'] }}', this.value)"
                                class="flex-1 px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-sans">
                            <button
                                class="p-2.5 rounded-xl bg-white border border-slate-200 text-[#0a4d8c] hover:bg-blue-50 transition-all shadow-sm">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>

        {{-- System Params Section --}}
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div class="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                <div
                    class="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[#0a4d8c] shadow-sm">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                </div>
                <h3 class="font-bold text-lg text-slate-800 font-montserrat">Parámetros del Sistema</h3>
            </div>

            <div class="p-6 space-y-6 flex-1">
                @php
                    $params = [
                        [
                            'key' => 'STORE_NAME',
                            'label' => 'Nombre de la Tienda',
                            'placeholder' => 'Mi Tienda E-commerce',
                        ],
                        [
                            'key' => 'SUPPORT_EMAIL',
                            'label' => 'Email de Soporte',
                            'placeholder' => 'soporte@ejemplo.com',
                        ],
                    ];
                @endphp

                @foreach ($params as $s)
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <label class="text-[13px] font-bold text-slate-500 ml-1">{{ $s['label'] }}</label>
                            <span
                                class="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{{ $s['key'] }}</span>
                        </div>
                        <div class="flex gap-2">
                            <input type="text" value="{{ $settings[$s['key']] ?? '' }}"
                                placeholder="{{ $s['placeholder'] }}"
                                onblur="@this.updateSetting('{{ $s['key'] }}', this.value)"
                                class="flex-1 px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all font-sans">
                            <button
                                class="p-2.5 rounded-xl bg-white border border-slate-200 text-[#0a4d8c] hover:bg-blue-50 transition-all shadow-sm">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>

        {{-- Security Banner --}}
        <div class="bg-blue-50 rounded-2xl border border-blue-100 p-6 flex items-center gap-6 lg:col-span-2">
            <div
                class="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-[#0a4d8c] shadow-lg shadow-blue-500/10 shrink-0">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            </div>
            <div>
                <h4 class="font-bold text-[#0a4d8c] text-lg font-montserrat">Auditoría Activa</h4>
                <p class="text-blue-700/70 text-[14px] leading-relaxed">Todos los cambios realizados en esta sección son
                    registrados automáticamente en los <span class="font-bold">Logs de Auditoría</span> para garantizar
                    la integridad y trazabilidad del sistema.</p>
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
