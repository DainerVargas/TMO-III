<div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {{-- Page Header --}}
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-montserrat font-bold text-slate-800 tracking-tight">Gestión de Productos</h2>
            <p class="text-slate-500 text-[14px] font-sans">Administra el catálogo, stock y precios de tus suministros.
            </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-2">
            {{-- Import Button --}}
            <div class="relative group">
                <input type="file" wire:model.live="importFile" id="import_file" class="hidden" accept=".csv">

                <button onclick="document.getElementById('import_file').click()" wire:loading.attr="disabled"
                    wire:target="importFile, import"
                    class="flex items-center justify-center gap-2 bg-white text-slate-700 px-5 py-2.5 rounded-xl font-bold text-[14px] border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all font-montserrat disabled:opacity-50 shadow-sm">

                    <div wire:loading wire:target="importFile, import">
                        <svg class="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                    </div>

                    <svg wire:loading.remove wire:target="importFile, import"
                        class="w-5 h-5 text-slate-400 group-hover:text-[#0a4d8c] transition-colors" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                    </svg>

                    <span wire:loading.remove wire:target="importFile, import">Importar CSV</span>
                    <span wire:loading wire:target="importFile, import">Procesando...</span>
                </button>

                @error('importFile')
                    <div
                        class="absolute top-full left-0 mt-2 w-max bg-red-50 text-red-600 text-[11px] px-3 py-1 rounded-lg border border-red-100 shadow-sm z-10 animate-in fade-in slide-in-from-top-1">
                        {{ $message }}
                    </div>
                @enderror
            </div>

            {{-- Export Button --}}
            <button wire:click="export()" wire:loading.attr="disabled" wire:target="export"
                class="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-[14px] shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95 transition-all font-montserrat">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar Excel
            </button>
            <button wire:click="openModal()"
                class="flex items-center justify-center gap-2 bg-[#0a4d8c] text-white px-5 py-2.5 rounded-xl font-bold text-[14px] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95 transition-all font-montserrat">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Nuevo Producto
            </button>
        </div>
    </div>

    {{-- Filters --}}
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4" x-data="{ showFilters: false }">
        <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1 relative group">
                <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0a4d8c] transition-colors"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input wire:model.live.debounce.300ms="search" type="text" placeholder="Buscar por nombre o SKU..."
                    class="w-full pl-10 pr-4 py-2.5 bg-[#f5f7fa] border border-transparent rounded-xl text-[14px] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-sans">
            </div>
            <div class="flex gap-2">
                <button @click="showFilters = !showFilters"
                    :class="showFilters ? 'bg-[#0a4d8c] text-white border-[#0a4d8c]' :
                        'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
                    class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-semibold border transition-all font-sans">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filtros
                </button>
            </div>
        </div>

        <div x-show="showFilters" x-transition
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div class="space-y-1">
                <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Categoría</label>
                <select wire:model.live="category"
                    class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[#0a4d8c]/10">
                    <option value="all">Todas las categorías</option>
                    @foreach ($categories as $cat)
                        <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                    @endforeach
                </select>
            </div>
            <div class="space-y-1">
                <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Estado de
                    Stock</label>
                <select wire:model.live="stockStatus"
                    class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[#0a4d8c]/10">
                    <option value="all">Cualquier estado</option>
                    <option value="in-stock">En Stock (>10)</option>
                    <option value="low-stock">Bajo Stock (≤10)</option>
                    <option value="out-of-stock">Agotado (0)</option>
                </select>
            </div>
            <div class="space-y-1">
                <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Visibilidad</label>
                <select wire:model.live="activeFilter"
                    class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[#0a4d8c]/10">
                    <option value="all">Todos</option>
                    <option value="active">Solo Activos</option>
                    <option value="inactive">Solo Ocultos</option>
                </select>
            </div>
        </div>
    </div>

    {{-- Table --}}
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left font-sans">
                <thead>
                    <tr
                        class="bg-slate-50 text-[12px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                        <th class="px-6 py-4">Producto</th>
                        <th class="px-6 py-4">Categoría</th>
                        <th class="px-6 py-4">Precio</th>
                        <th class="px-6 py-4">Stock</th>
                        <th class="px-6 py-4 text-center">Estado</th>
                        <th class="px-6 py-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($products as $p)
                        <tr class="hover:bg-slate-50/50 transition-colors group">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 p-1 overflow-hidden shrink-0">
                                        <img src="{{ $p->image }}" alt="{{ $p->name }}"
                                            class="w-full h-full object-contain">
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-[14px] font-bold text-slate-700 truncate max-w-[200px]">
                                            {{ $p->name }}</p>
                                        <p class="text-[11px] text-slate-400 font-medium">{{ $p->sku }} ·
                                            {{ $p->brand }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="text-[13px] text-slate-600 font-medium capitalize">{{ $p->category->name ?? $p->categoryId }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col gap-1">
                                    @if ($p->price > 0)
                                        <div class="flex flex-col">
                                            <span class="text-[13px] font-bold text-[#0a4d8c] leading-tight">S/
                                                {{ number_format($p->price, 2) }}</span>
                                            <span
                                                class="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Paquete:
                                                {{ $p->unit }}</span>
                                        </div>
                                    @endif
                                    @if ($p->unitPrice > 0)
                                        <div class="flex flex-col border-t border-slate-100 pt-1">
                                            <span class="text-[13px] font-bold text-emerald-600 leading-tight">S/
                                                {{ number_format($p->unitPrice, 2) }}</span>
                                            <span
                                                class="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Unidad:
                                                {{ $p->unitPriceUnit }}</span>
                                        </div>
                                    @endif
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-2">
                                    <span
                                        class="w-2 h-2 rounded-full {{ $p->stock > 10 ? 'bg-emerald-500' : ($p->stock > 0 ? 'bg-amber-500' : 'bg-red-500') }}"></span>
                                    <span class="text-[13px] font-bold text-slate-700">{{ $p->stock }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <button wire:click="toggleStatus({{ $p->id }})"
                                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all {{ $p->isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500' }}">
                                    @if ($p->isActive)
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Activo
                                    @else
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                        Oculto
                                    @endif
                                </button>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-1">
                                    <button wire:click="openModal({{ $p->id }})"
                                        class="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                        title="Editar">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button wire:click="delete({{ $p->id }})"
                                        wire:confirm="¿Eliminar este producto?"
                                        class="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                        title="Eliminar">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="6" class="px-6 py-12 text-center text-slate-400 text-sm">No se encontraron
                                productos.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100">
            {{ $products->links() }}
        </div>
    </div>

    {{-- Modal --}}
    @if ($isModalOpen)
        <div
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                class="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
                    <h3 class="text-lg font-montserrat font-bold text-slate-800">
                        {{ $editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
                    <button wire:click="$set('isModalOpen', false)"
                        class="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="p-6 max-h-[80vh] overflow-y-auto space-y-6">
                    {{-- Form fields --}}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div class="space-y-1">
                            <label class="text-[12px] font-bold text-slate-500 ml-1">Nombre del Producto</label>
                            <input wire:model="name" type="text"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all">
                            @error('name')
                                <span class="text-red-500 text-[11px] ml-1">{{ $message }}</span>
                            @enderror
                        </div>
                        <div class="space-y-1">
                            <label class="text-[12px] font-bold text-slate-500 ml-1">SKU</label>
                            <input wire:model="sku" type="text"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all">
                            @error('sku')
                                <span class="text-red-500 text-[11px] ml-1">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="text-[12px] font-bold text-slate-500 ml-1">Categoría</label>
                        <select wire:model="categoryId"
                            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c]">
                            <option value="">Seleccionar...</option>
                            @foreach ($categories as $cat)
                                <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                            @endforeach
                        </select>
                        @error('categoryId')
                            <span class="text-red-500 text-[11px] ml-1">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                        <h4 class="text-[12px] font-bold text-[#0a4d8c] uppercase tracking-widest mb-4">Configuración
                            de Precios</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {{-- Package Option --}}
                            <div class="space-y-4">
                                <div class="flex items-center gap-2">
                                    <div
                                        class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#0a4d8c]">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <span class="text-[13px] font-bold text-slate-700">Opción de Paquete/Caja</span>
                                </div>
                                <div class="grid grid-cols-2 gap-3 pl-10">
                                    <div class="space-y-1">
                                        <label class="text-[11px] font-bold text-slate-400">Precio</label>
                                        <input wire:model="price" type="number" step="0.01"
                                            class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] focus:border-[#0a4d8c] outline-none">
                                        @error('price')
                                            <span class="text-red-500 text-[10px]">{{ $message }}</span>
                                        @enderror
                                    </div>
                                    <div class="space-y-1">
                                        <label class="text-[11px] font-bold text-slate-400">Etiqueta (Eje:
                                            CAJA)</label>
                                        <input wire:model="unit" type="text"
                                            class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] focus:border-[#0a4d8c] outline-none">
                                        @error('unit')
                                            <span class="text-red-500 text-[10px]">{{ $message }}</span>
                                        @enderror
                                    </div>
                                </div>
                            </div>

                            {{-- Unit Option --}}
                            <div class="space-y-4 border-l border-slate-200 pl-6">
                                <div class="flex items-center gap-2">
                                    <div
                                        class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M20 12H4" />
                                        </svg>
                                    </div>
                                    <span class="text-[13px] font-bold text-slate-700">Opción de Unidad
                                        Individual</span>
                                </div>
                                <div class="grid grid-cols-2 gap-3 pl-10">
                                    <div class="space-y-1">
                                        <label class="text-[11px] font-bold text-slate-400">Precio</label>
                                        <input wire:model="unitPrice" type="number" step="0.01"
                                            class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] focus:border-[#0a4d8c] outline-none">
                                        @error('unitPrice')
                                            <span class="text-red-500 text-[10px]">{{ $message }}</span>
                                        @enderror
                                    </div>
                                    <div class="space-y-1">
                                        <label class="text-[11px] font-bold text-slate-400">Etiqueta (Eje: UND)</label>
                                        <input wire:model="unitPriceUnit" type="text"
                                            class="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[13px] focus:border-[#0a4d8c] outline-none">
                                        @error('unitPriceUnit')
                                            <span class="text-red-500 text-[10px]">{{ $message }}</span>
                                        @enderror
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p class="text-[10px] text-slate-400 mt-4 px-1 italic">* Si dejas una opción vacía, no se
                            mostrará al cliente.</p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="space-y-1">
                            <label class="text-[12px] font-bold text-slate-500 ml-1">Stock Actual</label>
                            <input wire:model="stock" type="number"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all">
                            @error('stock')
                                <span class="text-red-500 text-[11px] ml-1">{{ $message }}</span>
                            @enderror
                        </div>
                        <div class="space-y-1">
                            <label class="text-[12px] font-bold text-slate-500 ml-1">Marca</label>
                            <input wire:model="brand" type="text"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[12px] font-bold text-slate-500 ml-1">Días Entrega</label>
                            <select wire:model="deliveryDays"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c]">
                                <option value="1">Entrega Mañana</option>
                                <option value="2">2 Días</option>
                                <option value="3">3 Días</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="text-[12px] font-bold text-slate-500 ml-1">Descripción</label>
                        <textarea wire:model="description" rows="3"
                            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all resize-none"></textarea>
                    </div>

                    <div class="space-y-1">
                        <label class="text-[12px] font-bold text-slate-500 ml-1">Etiquetas (separadas por coma)</label>
                        <input wire:model="tags" type="text" placeholder="Ej: oficina, papel, a4"
                            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all">
                    </div>

                    <div class="space-y-1">
                        <label class="text-[12px] font-bold text-slate-500 ml-1">Link Ficha Técnica</label>
                        <input wire:model="technicalSheet" type="url" placeholder="https://ejemplo.com/ficha.pdf"
                            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all">
                    </div>

                    {{-- Image --}}
                    <div class="space-y-2">
                        <label class="text-[12px] font-bold text-slate-500 ml-1">Imagen Principal</label>
                        <div class="flex items-center gap-4">
                            <div
                                class="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                                @if ($newImage)
                                    <img src="{{ $newImage->temporaryUrl() }}" class="w-full h-full object-contain">
                                @elseif($image)
                                    <img src="{{ $image }}" class="w-full h-full object-contain">
                                @else
                                    <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                @endif
                            </div>
                            <div class="flex-1">
                                <input type="file" wire:model="newImage" id="image_upload" class="hidden">
                                <label for="image_upload"
                                    class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-[13px] font-bold hover:bg-slate-200 transition-colors">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4-4m4 4v12" />
                                    </svg>
                                    Cambiar Imagen
                                </label>
                                <p class="text-[11px] text-slate-400 mt-2">Recomendado: 500x500px, PNG o JPG</p>
                            </div>
                        </div>
                    </div>

                    {{-- Gallery --}}
                    <div class="space-y-4 pt-4 border-t border-slate-100">
                        <label class="text-[12px] font-bold text-slate-500 ml-1 uppercase tracking-wider">Galería de
                            Imágenes (Opcional)</label>

                        <div class="grid grid-cols-4 sm:grid-cols-6 gap-3">
                            {{-- Existing Gallery Images --}}
                            @foreach ($existingGallery as $index => $img)
                                <div
                                    class="relative aspect-square rounded-xl bg-slate-50 border border-slate-200 overflow-hidden group">
                                    <img src="{{ $img }}" class="w-full h-full object-contain">
                                    <button wire:click="removeGalleryImage({{ $index }})" type="button"
                                        class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            @endforeach

                            {{-- New Gallery Images Preview --}}
                            @foreach ($newGallery as $index => $photo)
                                <div
                                    class="relative aspect-square rounded-xl bg-slate-50 border border-slate-200 overflow-hidden">
                                    <img src="{{ $photo->temporaryUrl() }}" class="w-full h-full object-contain">
                                    <div class="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                                        <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                                d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                            @endforeach

                            {{-- Upload Button --}}
                            <label
                                class="cursor-pointer aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 hover:bg-slate-50 transition-colors group">
                                <input type="file" wire:model="newGallery" multiple class="hidden">
                                <svg class="w-5 h-5 text-slate-400 group-hover:text-[#0a4d8c] transition-colors"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 4v16m8-8H4" />
                                </svg>
                                <span
                                    class="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Añadir</span>
                            </label>
                        </div>
                        <div wire:loading wire:target="newGallery"
                            class="text-[11px] text-[#0a4d8c] font-bold animate-pulse">
                            Subiendo imágenes...
                        </div>
                    </div>
                </div>

                <div class="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                    <button wire:click="$set('isModalOpen', false)"
                        class="px-5 py-2.5 rounded-xl text-[14px] font-bold text-slate-500 hover:bg-slate-100 transition-all font-sans">
                        Cancelar
                    </button>
                    <button wire:click="save"
                        class="px-8 py-2.5 bg-[#0a4d8c] text-white rounded-xl text-[14px] font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 transition-all active:scale-95 font-montserrat">
                        {{ $editingProduct ? 'Guardar Cambios' : 'Crear Producto' }}
                    </button>
                </div>
            </div>
        </div>
    @endif

    {{-- Import Summary Modal --}}
    @if ($isImportSummaryOpen)
        <div
            class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                class="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div class="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 class="text-lg font-montserrat font-bold text-slate-800">Resultado de Importación</h3>
                    <button wire:click="$set('isImportSummaryOpen', false)"
                        class="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="p-6 space-y-4">
                    <div class="grid grid-cols-3 gap-4">
                        <div class="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
                            <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Creados</p>
                            <p class="text-2xl font-black text-emerald-700">{{ $importResults['imported'] ?? 0 }}</p>
                        </div>
                        <div class="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
                            <p class="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Actualizados</p>
                            <p class="text-2xl font-black text-blue-700">{{ $importResults['updated'] ?? 0 }}</p>
                        </div>
                        <div class="bg-red-50 p-4 rounded-2xl border border-red-100 text-center">
                            <p class="text-[10px] font-bold text-red-600 uppercase tracking-widest">Errores</p>
                            <p class="text-2xl font-black text-red-700">{{ count($importResults['errors'] ?? []) }}
                            </p>
                        </div>
                    </div>

                    @if (!empty($importResults['errors']))
                        <div class="space-y-2">
                            <p class="text-[12px] font-bold text-slate-500 ml-1">Detalle de Errores:</p>
                            <div
                                class="max-h-[200px] overflow-y-auto bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-1">
                                @foreach ($importResults['errors'] as $error)
                                    <div class="flex items-start gap-2 text-[11px] text-red-600 font-medium">
                                        <svg class="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {{ $error }}
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    @endif
                </div>

                <div class="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button wire:click="$set('isImportSummaryOpen', false)"
                        class="px-8 py-2.5 bg-[#0a4d8c] text-white rounded-xl text-[14px] font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 transition-all active:scale-95 font-montserrat">
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    @endif

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
