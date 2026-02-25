<div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {{-- Page Header --}}
    <div>
        <h2 class="text-[26px] font-black text-[#1e293b] font-montserrat tracking-tight leading-none">Dashboard</h2>
        <p class="text-[#64748b] text-[14px] font-sans mt-2 font-medium">Bienvenido al panel central de TMO Suministros.
        </p>
    </div>

    {{-- KPI Cards --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        @php
            $kpis = [
                [
                    'label' => 'Productos',
                    'value' => $stats['totalProducts'],
                    'icon' => '
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>',
                    'color' => 'bg-[#3b82f6]',
                    'trend' => $stats['activeProducts'] . ' activos',
                    'trend_color' => 'bg-[#f0f9ff] text-[#0369a1]',
                ],
                [
                    'label' => 'Pedidos Pendientes',
                    'value' => $stats['pendingOrders'],
                    'icon' => '
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>',
                    'color' => 'bg-[#f59e0b]',
                    'trend' => 'Requieren atención',
                    'trend_color' => 'bg-[#fffbeb] text-[#b45309]',
                ],
                [
                    'label' => 'Valor del Inventario',
                    'value' => 'S/ ' . number_format($stats['totalStockValue'], 2),
                    'icon' => '
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>',
                    'color' => 'bg-[#10b981]',
                    'trend' => '+ 12.5%',
                    'trend_color' => 'bg-[#ecfdf5] text-[#047857]',
                ],
                [
                    'label' => 'Usuarios Totales',
                    'value' => $stats['totalUsers'],
                    'icon' => '
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>',
                    'color' => 'bg-[#6366f1]',
                    'trend' => 'Registrados',
                    'trend_color' => 'bg-[#f5f3ff] text-[#4338ca]',
                ],
            ];
        @endphp

        @foreach ($kpis as $kpi)
            <div
                class="bg-white p-6 rounded-[24px] border border-[#f1f5f9] shadow-sm hover:shadow-md transition-all group">
                <div class="flex items-start justify-between">
                    <div
                        class="w-12 h-12 rounded-xl {{ $kpi['color'] }} text-white flex items-center justify-center shadow-lg shadow-current/20">
                        {!! $kpi['icon'] !!}
                    </div>
                    <div
                        class="flex items-center gap-1.5 px-3 py-1 rounded-full {{ $kpi['trend_color'] }} text-[11px] font-black uppercase tracking-tight">
                        @if (str_contains($kpi['trend'], '+'))
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                    d="M5 15l7-7 7 7" />
                            </svg>
                        @endif
                        {{ $kpi['trend'] }}
                    </div>
                </div>
                <div class="mt-6">
                    <p class="text-[#94a3b8] text-[13px] font-bold font-sans uppercase tracking-wider">
                        {{ $kpi['label'] }}</p>
                    <p class="text-[28px] font-black text-[#1e293b] font-montserrat mt-1 leading-none tracking-tight">
                        {{ $kpi['value'] }}
                    </p>
                </div>
            </div>
        @endforeach
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {{-- Chart Card --}}
        <div
            class="lg:col-span-2 bg-white p-8 rounded-[32px] border border-[#f1f5f9] shadow-sm relative overflow-hidden">
            <div class="flex items-center justify-between mb-10 relative z-10">
                <div>
                    <h3 class="text-[18px] font-black text-[#1e293b] font-montserrat tracking-tight">Resumen de Ventas
                    </h3>
                </div>
                <div class="relative">
                    <select
                        class="appearance-none bg-[#f8fafc] border border-[#f1f5f9] px-4 py-2 rounded-xl text-[12px] font-bold text-[#64748b] pr-10 outline-none focus:ring-4 focus:ring-[#0a4d8c]/5 font-sans">
                        <option>Últimos 7 días</option>
                        <option>Último mes</option>
                    </select>
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            @php
                $maxTotal = $salesData->max('total') ?: 100;
                $maxTotal = ceil($maxTotal / 100) * 100;
                $points = [];
                foreach ($salesData as $index => $data) {
                    $x = $index * (800 / 6);
                    $y = 260 - ($data['total'] / $maxTotal) * 220;
                    $points[] = "$x,$y";
                }
                $pathLine = 'M' . implode(' L', $points);
                $pathArea = $pathLine . ' L800,260 L0,260 Z';
            @endphp

            <div class="h-[300px] w-full relative">
                {{-- Chart SVG --}}
                <svg viewBox="0 0 800 300" class="w-full h-full text-[#0a4d8c]" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="currentColor" stop-opacity="0.15" />
                            <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
                        </linearGradient>
                    </defs>
                    <path d="{{ $pathLine }}" fill="none" stroke="currentColor" stroke-width="4"
                        stroke-linecap="round" stroke-linejoin="round" />
                    <path d="{{ $pathArea }}" fill="url(#chartGradient)" />
                </svg>

                {{-- Y-axis labels --}}
                <div
                    class="absolute top-0 left-0 h-[260px] flex flex-col justify-between text-[11px] font-black text-slate-300 py-4 font-sans uppercase">
                    <span>S/ {{ number_format($maxTotal / 1000, 1) }}k</span>
                    <span>S/ {{ number_format(($maxTotal * 0.75) / 1000, 1) }}k</span>
                    <span>S/ {{ number_format(($maxTotal * 0.5) / 1000, 1) }}k</span>
                    <span>S/ {{ number_format(($maxTotal * 0.25) / 1000, 1) }}k</span>
                    <span>0</span>
                </div>

                {{-- Grid lines --}}
                <div class="absolute inset-0 h-[260px] flex flex-col justify-between py-6 pointer-events-none">
                    <div class="border-b border-dashed border-slate-100 w-full"></div>
                    <div class="border-b border-dashed border-slate-100 w-full"></div>
                    <div class="border-b border-dashed border-slate-100 w-full"></div>
                    <div class="border-b border-dashed border-slate-100 w-full"></div>
                </div>

                {{-- X-axis labels --}}
                <div class="absolute bottom-0 left-0 w-full flex justify-between px-2 pt-4">
                    @foreach ($salesData as $data)
                        <span class="text-[11px] font-bold text-slate-400 font-sans uppercase">
                            {{ $data['label'] }}
                        </span>
                    @endforeach
                </div>
            </div>
        </div>

        {{-- Alertas Card --}}
        <div class="bg-white p-8 rounded-[32px] border border-[#f1f5f9] shadow-sm">
            <h3 class="text-[18px] font-black text-[#1e293b] font-montserrat tracking-tight mb-8">Alertas e Inventario
            </h3>

            <div class="space-y-8">
                {{-- Alert section --}}
                <div class="p-6 rounded-2xl bg-[#fff1f2] border border-[#fee2e2] flex items-center gap-5">
                    <div
                        class="w-12 h-12 rounded-xl bg-[#ef4444] text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-[14px] font-black text-[#991b1b] font-sans">Productos en Alerta</p>
                        <p class="text-[12px] text-[#b91c1c] font-medium font-sans mt-0.5">
                            {{ $stats['lowStockProducts'] }} productos agotados o bajos</p>
                    </div>
                </div>

                {{-- Catalog distribution --}}
                <div class="space-y-6">
                    <h4 class="text-[12px] font-black text-[#94a3b8] uppercase tracking-widest font-sans">Distribución
                        de Catálogo</h4>

                    <div class="space-y-5">
                        @foreach ($topCategories as $cat)
                            <div class="space-y-2">
                                <div class="flex items-center justify-between text-[13px] font-bold font-sans">
                                    <span class="text-[#475569]">{{ $cat['label'] }}</span>
                                    <span class="text-[#94a3b8]">{{ $cat['percentage'] }}%</span>
                                </div>
                                <div class="h-2 w-full bg-[#f1f5f9] rounded-full overflow-hidden">
                                    <div class="h-full {{ $cat['color'] }} rounded-full transition-all duration-1000"
                                        style="width: {{ $cat['percentage'] }}%"></div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
