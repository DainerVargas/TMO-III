<div class="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
    {{-- Page Header --}}
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
            <h2 class="text-[32px] font-montserrat font-black text-[#1e293b] tracking-tight">Gestión de Usuarios</h2>
            <p class="text-slate-400 text-[16px] font-sans font-medium">Administra los roles, permisos y acceso de tus
                colaboradores.</p>
        </div>
        <button wire:click="openModal()"
            class="flex items-center justify-center gap-3 bg-[#0a4d8c] text-white px-8 py-4 rounded-[1.2rem] font-black text-[15px] shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:bg-[#083d6f] active:scale-95 transition-all font-sans">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Usuario
        </button>
    </div>

    {{-- Filters Card --}}
    <div class="bg-white p-6 rounded-[1.8rem] border border-[#f1f5f9] shadow-sm">
        <div class="relative group">
            <svg class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#0a4d8c] transition-colors"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input wire:model.live.debounce.300ms="search" type="text"
                placeholder="Buscar por nombre, email o empresa..."
                class="w-full pl-14 pr-6 py-4 bg-[#f8fafc] border border-transparent rounded-[1.25rem] text-[15px] font-medium text-slate-600 focus:bg-white focus:border-[#0a4d8c] focus:ring-4 focus:ring-[#0a4d8c]/5 outline-none transition-all font-sans">
        </div>
    </div>

    {{-- Table Card --}}
    <div class="bg-white rounded-[2rem] border border-[#f1f5f9] shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left font-sans">
                <thead>
                    <tr
                        class="text-[13px] text-slate-400 font-black uppercase tracking-widest border-b border-[#f1f5f9]">
                        <th class="px-10 py-6">Usuario</th>
                        <th class="px-10 py-6 text-center">Rol</th>
                        <th class="px-10 py-6 text-center">Estado</th>
                        <th class="px-10 py-6 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-[#f1f5f9]">
                    @forelse($users as $u)
                        <tr class="hover:bg-slate-50/50 transition-all group">
                            <td class="px-10 py-6">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="w-12 h-12 rounded-[1rem] bg-[#f0f7ff] text-[#0a4d8c] flex items-center justify-center font-black text-[16px] border border-blue-50 shadow-sm">
                                        {{ substr($u->name, 0, 1) }}{{ substr($u->lastName, 0, 1) }}
                                    </div>
                                    <div>
                                        <p class="text-[16px] font-black text-slate-800 tracking-tight leading-snug">
                                            {{ $u->name }} {{ $u->lastName }}</p>
                                        <p class="text-[13px] text-slate-400 font-medium">{{ $u->email }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-10 py-6 text-center">
                                <div class="inline-block relative">
                                    <select wire:change="updateRole({{ $u->id }}, $event.target.value)"
                                        class="appearance-none border-none rounded-lg px-4 py-1.5 text-[11px] font-black outline-none transition-all cursor-pointer text-center ring-0 focus:ring-4 focus:ring-blue-100 {{ $u->role === 'ADMIN'
                                            ? 'bg-purple-100 text-purple-700'
                                            : ($u->role === 'MANAGER'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-slate-100 text-slate-600') }}">
                                        <option value="USER" {{ $u->role === 'USER' ? 'selected' : '' }}>USUARIO
                                        </option>
                                        <option value="MANAGER" {{ $u->role === 'MANAGER' ? 'selected' : '' }}>GESTOR
                                        </option>
                                        <option value="ADMIN" {{ $u->role === 'ADMIN' ? 'selected' : '' }}>ADMIN
                                        </option>
                                    </select>
                                </div>
                            </td>
                            <td class="px-10 py-6 text-center">
                                <span
                                    class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-black {{ $u->isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100' }}">
                                    <span
                                        class="w-1.5 h-1.5 rounded-full {{ $u->isActive ? 'bg-emerald-500' : 'bg-red-500' }} animate-pulse"></span>
                                    {{ $u->isActive ? 'Activo' : 'Inactivo' }}
                                </span>
                            </td>
                            <td class="px-10 py-6 text-right">
                                <div class="flex items-center justify-end gap-3">
                                    <button wire:click="openModal({{ $u->id }})"
                                        class="p-2.5 bg-white border border-[#f1f5f9] text-[#0a4d8c] rounded-xl hover:bg-[#0a4d8c] hover:text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all group/edit"
                                        title="Editar">
                                        <svg class="w-5 h-5 transition-transform group-hover/edit:rotate-12"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button wire:click="delete({{ $u->id }})"
                                        wire:confirm="¿Estás seguro de que deseas eliminar este usuario?"
                                        class="p-2.5 bg-white border border-[#f1f5f9] text-red-400 rounded-xl hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 transition-all"
                                        title="Eliminar">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="px-10 py-20 text-center">
                                <div class="flex flex-col items-center">
                                    <img src="https://illustrations.popsy.co/amber/woman-searching.svg"
                                        class="w-40 h-40 opacity-20 mb-4" alt="No users">
                                    <p class="text-slate-400 font-bold font-sans">No se encontraron colaboradores.</p>
                                </div>
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        @if ($users->hasPages())
            <div class="px-10 py-6 bg-slate-50/50 border-t border-[#f1f5f9]">
                {{ $users->links() }}
            </div>
        @endif
    </div>

    {{-- Modal --}}
    @if ($isModalOpen)
        <div
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                class="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div class="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
                    <h3 class="text-lg font-montserrat font-bold text-slate-800">
                        {{ $editingUser ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>
                    <button wire:click="$set('isModalOpen', false)"
                        class="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="p-6 max-h-[80vh] overflow-y-auto space-y-5">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label class="text-[12px] font-bold text-slate-500 ml-1">Nombres</label>
                            <input wire:model="name" type="text"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                            @error('name')
                                <span class="text-red-500 text-[11px] ml-1">{{ $message }}</span>
                            @enderror
                        </div>
                        <div class="space-y-1">
                            <label class="text-[12px] font-bold text-slate-500 ml-1">Apellidos</label>
                            <input wire:model="lastName" type="text"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                        </div>
                    </div>

                    <div class="space-y-1">
                        <label class="text-[12px] font-bold text-slate-500 ml-1">Correo Electrónico</label>
                        <input wire:model="email" type="email"
                            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                        @error('email')
                            <span class="text-red-500 text-[11px] ml-1">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label class="text-[12px] font-bold text-slate-500 ml-1">Rol de Usuario</label>
                            <select wire:model.live="role"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c]">
                                <option value="USER">USUARIO (Cliente)</option>
                                <option value="MANAGER">GESTOR (Staff)</option>
                                <option value="ADMIN">ADMINISTRADOR</option>
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[12px] font-bold text-slate-500 ml-1">Contraseña
                                {{ $editingUser ? '(Dejar vacío para no cambiar)' : '' }}</label>
                            <input wire:model="password" type="password"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                            @error('password')
                                <span class="text-red-500 text-[11px] ml-1">{{ $message }}</span>
                            @enderror
                        </div>
                    </div>

                    <div class="border-t border-slate-100 pt-4 mt-2">
                        <h4 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Datos
                            Corporativos</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-[12px] font-bold text-slate-500 ml-1">Empresa</label>
                                <input wire:model="companyName" type="text"
                                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                            </div>
                            <div class="space-y-1">
                                <label class="text-[12px] font-bold text-slate-500 ml-1">Tipo Documento</label>
                                <select wire:model="documentType"
                                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c]">
                                    <option value="DNI">DNI</option>
                                    <option value="RUC">RUC</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mt-4">
                            <div class="space-y-1">
                                <label class="text-[12px] font-bold text-slate-500 ml-1">Número Documento</label>
                                <input wire:model="documentNumber" type="text"
                                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                            </div>
                            <div class="space-y-1">
                                <label class="text-[12px] font-bold text-slate-500 ml-1">Teléfono</label>
                                <input wire:model="phone" type="text"
                                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:bg-white focus:border-[#0a4d8c] transition-all">
                            </div>
                        </div>
                    </div>

                    @if ($role === 'MANAGER')
                        <div class="border-t border-slate-100 pt-4 mt-2 animate-in fade-in zoom-in-95 duration-300">
                            <h4 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Acceso a
                                Secciones
                            </h4>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                @foreach ($availableSections as $key => $label)
                                    <label
                                        class="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50 cursor-pointer hover:bg-white hover:border-blue-200 transition-all select-none">
                                        <input type="checkbox" wire:model="permissions" value="{{ $key }}"
                                            class="w-4 h-4 rounded border-slate-300 text-[#0a4d8c] focus:ring-[#0a4d8c]/20">
                                        <span class="text-[13px] font-bold text-slate-600">{{ $label }}</span>
                                    </label>
                                @endforeach
                            </div>
                        </div>
                    @endif
                </div>

                <div class="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                    <button wire:click="$set('isModalOpen', false)"
                        class="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all font-sans">
                        Cancelar
                    </button>
                    <button wire:click="save"
                        class="px-8 py-2.5 bg-[#0a4d8c] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 transition-all active:scale-95 font-montserrat">
                        {{ $editingUser ? 'Guardar Cambios' : 'Crear Usuario' }}
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
