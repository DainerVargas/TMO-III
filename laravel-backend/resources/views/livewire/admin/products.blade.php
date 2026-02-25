<div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {{-- Page Header --}}
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h2 class="text-2xl font-montserrat font-bold text-slate-800 tracking-tight">Gestión de Productos</h2>
            <p class="text-slate-500 text-[14px] font-sans">Administra el catálogo, stock y precios de tus suministros.
            </p>
        </div>
        <button wire:click="openModal()"
            class="flex items-center justify-center gap-2 bg-[#0a4d8c] text-white px-5 py-2.5 rounded-xl font-bold text-[14px] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-95 transition-all font-montserrat">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Producto
        </button>
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
                                <div class="flex flex-col">
                                    <span class="text-[14px] font-bold text-[#0a4d8c]">S/
                                        {{ number_format($p->price, 2) }}</span>
                                    <span class="text-[11px] text-slate-400">x {{ $p->unit }}</span>
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
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <div class="space-y-1">
                            <label class="text-[12px] font-bold text-slate-500 ml-1">Precio (S/)</label>
                            <input wire:model="price" type="number" step="0.01"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all">
                            @error('price')
                                <span class="text-red-500 text-[11px] ml-1">{{ $message }}</span>
                            @enderror
                        </div>
                        <div class="space-y-1">
                            <label class="text-[12px] font-bold text-slate-500 ml-1">Unidad</label>
                            <input wire:model="unit" type="text" placeholder="UND, CJ, etc"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] focus:bg-white focus:border-[#0a4d8c] outline-none transition-all">
                        </div>
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

                    {{-- Image --}}
                    <div class="space-y-2">
                        <label class="text-[12px] font-bold text-slate-500 ml-1">Imagen del Producto</label>
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
