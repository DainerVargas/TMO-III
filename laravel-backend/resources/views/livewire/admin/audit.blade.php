<div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {{-- Page Header --}}
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-montserrat font-bold text-slate-800 tracking-tight">Logs de Auditoría</h2>
            <p class="text-slate-500 text-[14px] font-sans">Monitorea todas las acciones y cambios realizados en el
                sistema.</p>
        </div>
        <div class="flex items-center gap-3">
            <button wire:click="clearLogs"
                wire:confirm="¿Estás seguro de que deseas limpiar todo el historial de auditoría? Esta acción no se puede deshacer."
                class="flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-red-50 transition-all shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpiar Historial
            </button>
            <button wire:click="$refresh"
                class="flex items-center justify-center gap-2 bg-[#0a4d8c] text-white px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-[#083d6e] transition-all shadow-lg shadow-[#0a4d8c]/20">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualizar Lista
            </button>
        </div>
    </div>

    {{-- Filters --}}
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative group">
            <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0a4d8c] transition-colors"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input wire:model.live.debounce.300ms="search" type="text"
                placeholder="Buscar por usuario, acción o ID..."
                class="w-full pl-10 pr-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-sans">
        </div>
        <select wire:model.live="filterEntity"
            class="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#0a4d8c]/10 cursor-pointer font-sans">
            <option value="all">Todas las entidades</option>
            <option value="Product">Productos</option>
            <option value="Category">Categorías</option>
            <option value="User">Usuarios</option>
            <option value="Order">Pedidos</option>
            <option value="GlobalSetting">Configuración</option>
            <option value="Notification">Notificaciones</option>
        </select>
    </div>

    {{-- Table --}}
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left font-sans text-[13px]">
                <thead>
                    <tr
                        class="bg-slate-50 text-[12px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                        <th class="px-6 py-4">Fecha y Hora</th>
                        <th class="px-6 py-4">Usuario</th>
                        <th class="px-6 py-4">Acción</th>
                        <th class="px-6 py-4">Entidad</th>
                        <th class="px-6 py-4 text-right">Detalles</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($logs as $log)
                        <tr class="hover:bg-slate-50/50 transition-colors group">
                            <td class="px-6 py-4">
                                <div class="flex flex-col">
                                    <span class="font-bold text-slate-700">{{ $log->createdAt->format('d/m/Y') }}</span>
                                    <span
                                        class="text-[11px] text-slate-400">{{ $log->createdAt->format('H:i:s') }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <div
                                        class="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[#0a4d8c] font-black text-[10px]">
                                        {{ substr($log->user->name ?? '?', 0, 1) }}
                                    </div>
                                    <span
                                        class="font-medium text-slate-600 truncate max-w-[120px]">{{ $log->user->name ?? 'Sistema' }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                @php
                                    $actionColors = [
                                        'CREATE' => 'bg-emerald-50 text-emerald-700 border-emerald-100',
                                        'UPDATE' => 'bg-blue-50 text-blue-700 border-blue-100',
                                        'DELETE' => 'bg-red-50 text-red-700 border-red-100',
                                        'STOCK_ADJUST' => 'bg-amber-50 text-amber-700 border-amber-100',
                                        'PASSWORD_CHANGE' => 'bg-purple-50 text-purple-700 border-purple-100',
                                        'CLEAR_ALL' => 'bg-slate-50 text-slate-700 border-slate-100',
                                    ];
                                    $badgeClass =
                                        $actionColors[$log->action] ?? 'bg-gray-50 text-gray-700 border-gray-100';
                                @endphp
                                <span
                                    class="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border {{ $badgeClass }}">
                                    {{ str_replace('_', ' ', $log->action) }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col">
                                    <span class="font-medium text-slate-700">{{ $log->entity }}</span>
                                    <span class="text-[10px] font-mono text-slate-400">ID: {{ $log->entityId }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button wire:click="viewLog({{ $log->id }})"
                                    class="p-2 hover:bg-slate-100 text-[#0a4d8c] rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-12 text-center text-slate-400 text-sm">No se encontraron
                                registros.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100">
            {{ $logs->links() }}
        </div>
    </div>

    {{-- Detail Modal --}}
    @if ($selectedLog)
        <div
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                class="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div class="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h3 class="text-lg font-montserrat font-bold text-slate-800">Detalles de Auditoría</h3>
                    <button wire:click="closeLog"
                        class="p-2 hover:bg-white rounded-full text-slate-400 transition-colors shadow-sm">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {{-- Data preview --}}
                    <div class="grid grid-cols-2 gap-4 text-[12px]">
                        <div>
                            <p class="font-bold text-slate-400 uppercase tracking-tighter">Entidad</p>
                            <p class="text-slate-700 font-bold">{{ $selectedLog->entity }}
                                #{{ $selectedLog->entityId }}</p>
                        </div>
                        <div>
                            <p class="font-bold text-slate-400 uppercase tracking-tighter">Acción</p>
                            <p class="text-slate-700 font-bold">{{ $selectedLog->action }}</p>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div class="rounded-xl border border-slate-100 overflow-hidden">
                            <div
                                class="bg-slate-50 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">
                                Datos Anteriores</div>
                            <pre class="p-4 text-[11px] bg-white overflow-x-auto text-slate-600 font-mono">{{ json_encode($selectedLog->oldData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) ?: '{}' }}</pre>
                        </div>
                        <div class="rounded-xl border border-slate-100 overflow-hidden">
                            <div
                                class="bg-emerald-50 px-4 py-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest border-b border-slate-100">
                                Datos Nuevos</div>
                            <pre class="p-4 text-[11px] bg-white overflow-x-auto text-slate-600 font-mono">{{ json_encode($selectedLog->newData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) ?: '{}' }}</pre>
                        </div>
                    </div>
                </div>
                <div class="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button wire:click="closeLog"
                        class="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-[13px] text-slate-600 hover:bg-slate-100 transition-all">Cerrar</button>
                </div>
            </div>
        </div>
    @endif
</div>
