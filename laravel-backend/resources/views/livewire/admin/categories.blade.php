<div class="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
    {{-- Page Header --}}
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
            <h2 class="text-[32px] font-montserrat font-black text-[#1e293b] tracking-tight">Gestión de Categorías</h2>
            <p class="text-slate-400 text-[16px] font-sans font-medium">Administra las categorías de productos para
                organizar tu catálogo.</p>
        </div>
        <button wire:click="openModal()"
            class="flex items-center justify-center gap-3 bg-[#0a4d8c] text-white px-8 py-4 rounded-[1.2rem] font-black text-[15px] shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:bg-[#083d6f] active:scale-95 transition-all font-sans">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Categoría
        </button>
    </div>

    {{-- Search Card --}}
    <div class="bg-white p-6 rounded-[1.8rem] border border-[#f1f5f9] shadow-sm">
        <div class="relative group">
            <svg class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#0a4d8c] transition-colors"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input wire:model.live.debounce.300ms="search" type="text" placeholder="Buscar por nombre o ID..."
                class="w-full pl-14 pr-6 py-4 bg-[#f8fafc] border border-transparent rounded-[1.25rem] text-[15px] font-medium text-slate-600 focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-sans">
        </div>
    </div>

    {{-- Grid Content --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        @forelse($categories as $cat)
            <div
                class="bg-white p-8 rounded-[2rem] border border-[#f1f5f9] shadow-sm hover:shadow-xl hover:border-[#0a4d8c]/5 transition-all group relative">
                <div class="flex items-start justify-between mb-6">
                    <div
                        class="w-14 h-14 rounded-[1.2rem] bg-[#f0f7ff] flex items-center justify-center text-[#0a4d8c] border border-blue-50 shadow-sm transition-transform group-hover:scale-110">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                    <div class="flex gap-2">
                        <button wire:click="openModal('{{ $cat->id }}')"
                            class="p-2.5 bg-white border border-[#f1f5f9] text-[#0a4d8c] rounded-xl hover:bg-[#0a4d8c] hover:text-white transition-all group/edit">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button wire:click="delete('{{ $cat->id }}')"
                            class="p-2.5 bg-white border border-[#f1f5f9] text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                <h3 class="font-black text-[20px] text-slate-800 mb-2 font-sans tracking-tight">{{ $cat->name }}</h3>
                <p
                    class="text-[12px] font-mono text-slate-400 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 uppercase tracking-tighter inline-block mb-6">
                    ID: {{ $cat->id }}
                </p>
                <div class="pt-6 border-t border-[#f8fafc] flex items-center justify-between">
                    <span class="text-[14px] text-slate-400 font-medium">Productos vinculados</span>
                    <span
                        class="bg-[#0a4d8c] text-white px-3 py-1 rounded-full text-[12px] font-black">{{ $cat->products_count ?? 0 }}</span>
                </div>
            </div>
        @empty
            <div class="col-span-full text-center py-20 bg-white rounded-[2rem] border border-dashed border-[#f1f5f9]">
                <img src="https://illustrations.popsy.co/amber/woman-searching.svg"
                    class="w-40 h-40 opacity-20 mx-auto mb-4" alt="No data">
                <h3 class="text-xl font-black text-slate-400 font-sans">No encontramos categorías</h3>
                <p class="text-slate-300 font-medium mt-1 font-sans">Intenta con otro término o crea una nueva.</p>
            </div>
        @endforelse
    </div>

    {{-- Modal --}}
    @if ($isModalOpen)
        <div
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                class="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div class="p-8 border-b border-[#f1f5f9] bg-white sticky top-0 flex items-center justify-between">
                    <h3 class="text-xl font-montserrat font-black text-[#0a4d8c]">
                        {{ $editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}
                    </h3>
                    <button wire:click="$set('isModalOpen', false)"
                        class="text-slate-300 hover:text-red-500 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="p-8 space-y-6">
                    <div class="space-y-2">
                        <label
                            class="block text-[13px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre</label>
                        <input wire:model.live="name" type="text" placeholder="Ej: Útiles de Oficina"
                            class="w-full px-5 py-4 rounded-[1rem] border border-[#f1f5f9] bg-[#f8fafc] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all text-sm font-bold">
                        @error('name')
                            <span class="text-red-500 text-[11px] ml-1">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="space-y-2">
                        <label class="block text-[13px] font-black text-slate-500 uppercase tracking-widest ml-1">ID /
                            Slug</label>
                        <input wire:model="slug" type="text" {{ $editingCategory ? 'disabled' : '' }}
                            placeholder="ej: utiles-oficina"
                            class="w-full px-5 py-4 rounded-[1rem] border border-[#f1f5f9] bg-[#f8fafc] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all text-sm font-bold disabled:opacity-50">
                        @error('slug')
                            <span class="text-red-500 text-[11px] ml-1">{{ $message }}</span>
                        @enderror
                    </div>
                    <div class="space-y-2">
                        <label class="block text-[13px] font-black text-slate-500 uppercase tracking-widest ml-1">Icono
                            (SVG o Clase)</label>
                        <input wire:model="icon" type="text" placeholder="Ej: shopping-cart"
                            class="w-full px-5 py-4 rounded-[1rem] border border-[#f1f5f9] bg-[#f8fafc] focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all text-sm font-bold">
                    </div>

                    <div class="flex gap-4 pt-6">
                        <button wire:click="save"
                            class="flex-1 px-4 py-4 rounded-[1.2rem] font-black bg-[#0a4d8c] text-white hover:bg-[#083d6f] active:scale-95 transition-all shadow-xl shadow-blue-500/20 text-[15px]">
                            {{ $editingCategory ? 'Actualizar' : 'Crear Categoría' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    @endif

    {{-- Notification (Shared) --}}
    <div x-data="{ show: false, message: '', type: 'success' }"
        x-on:notify.window="show = true; message = $event.detail.message; type = $event.detail.type; setTimeout(() => show = false, 3000)"
        x-show="show" class="fixed bottom-8 right-8 z-[200]" style="display: none;">
        <div class="px-8 py-4 rounded-2xl shadow-2xl border text-white flex items-center gap-4 bg-[#0a4d8c]"
            :class="{ 'bg-emerald-600 border-emerald-500': type === 'success', 'bg-red-600 border-red-500': type === 'error' }">
            <template x-if="type === 'success'">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </template>
            <span x-text="message" class="font-black text-[15px] font-sans"></span>
        </div>
    </div>
</div>
