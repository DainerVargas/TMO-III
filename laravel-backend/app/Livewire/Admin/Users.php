<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Traits\LogsAudit;

class Users extends Component
{
    use WithPagination, LogsAudit;

    public $search = '';
    public $isModalOpen = false;
    public $editingUser = null;

    // Form fields
    public $name, $lastName, $email, $role = 'USER', $phone, $ruc, $companyName, $documentNumber, $documentType = 'DNI', $isActive = true, $password;
    public $permissions = [];

    public $availableSections = [
        'dashboard' => 'Dashboard',
        'categories' => 'Categorías',
        'products' => 'Productos',
        'orders' => 'Pedidos',
        'users' => 'Usuarios',
        'inventory' => 'Inventario',
        'audit' => 'Auditoría',
        'settings' => 'Configuración',
    ];

    protected $queryString = ['search'];

    public function updatedRole($value)
    {
        if ($value !== 'MANAGER') {
            $this->permissions = [];
        }
    }

    public function updatedSearch()
    {
        $this->resetPage();
    }

    public function openModal($id = null)
    {
        $this->resetErrorBag();
        if ($id) {
            $user = User::findOrFail($id);
            $this->editingUser = $user;
            $this->name = $user->name;
            $this->lastName = $user->lastName;
            $this->email = $user->email;
            $this->role = $user->role;
            $this->phone = $user->phone;
            $this->ruc = $user->ruc;
            $this->companyName = $user->companyName;
            $this->documentNumber = $user->documentNumber;
            $this->documentType = $user->documentType;
            $this->isActive = $user->isActive;
            $this->permissions = $user->permissions ?? [];
            $this->password = '';
        } else {
            $this->editingUser = null;
            $this->reset(['name', 'lastName', 'email', 'role', 'phone', 'ruc', 'companyName', 'documentNumber', 'documentType', 'isActive', 'password', 'permissions']);
            $this->role = 'USER';
            $this->isActive = true;
            $this->documentType = 'DNI';
            $this->permissions = [];
        }
        $this->isModalOpen = true;
    }

    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        $oldData = $user->toArray();
        $user->isActive = !$user->isActive;
        $user->save();

        $this->logAction('UPDATE', 'User', $id, $oldData, $user->fresh()->toArray());
        $this->dispatch(
            'notify',
            message: $user->isActive ? 'Usuario activado' : 'Usuario desactivado',
            type: 'success'
        );
    }

    public function delete($id)
    {
        if ($id == \Illuminate\Support\Facades\Auth::id()) {
            $this->dispatch('notify', message: 'No puedes eliminarte a ti mismo', type: 'error');
            return;
        }

        $user = User::findOrFail($id);
        $oldData = $user->toArray();
        $user->delete();

        $this->logAction('DELETE', 'User', $id, $oldData);
        $this->dispatch('notify', message: 'Usuario eliminado', type: 'success');
    }

    public function updateRole($id, $newRole)
    {
        $user = User::findOrFail($id);
        $oldData = $user->toArray();
        $user->role = $newRole;
        $user->save();

        $this->logAction('UPDATE', 'User', $id, $oldData, $user->fresh()->toArray());
        $this->dispatch('notify', message: 'Rol actualizado', type: 'success');
    }

    public function save()
    {
        $this->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:user,email,' . ($this->editingUser->id ?? ''),
            'role' => 'required|in:USER,MANAGER,ADMIN',
            'password' => $this->editingUser ? 'nullable|min:6' : 'required|min:6',
        ]);

        $data = [
            'name' => $this->name,
            'lastName' => $this->lastName,
            'email' => $this->email,
            'role' => $this->role,
            'phone' => $this->phone,
            'ruc' => $this->ruc,
            'companyName' => $this->companyName,
            'documentNumber' => $this->documentNumber,
            'documentType' => $this->documentType,
            'isActive' => $this->isActive,
            'permissions' => $this->permissions,
        ];

        if ($this->password) {
            $data['password'] = Hash::make($this->password);
        }

        if ($this->editingUser) {
            $oldData = $this->editingUser->toArray();
            $this->editingUser->update($data);
            $this->logAction('UPDATE', 'User', $this->editingUser->id, $oldData, $this->editingUser->fresh()->toArray());
            $message = 'Usuario actualizado';
        } else {
            $user = User::create($data);
            $this->logAction('CREATE', 'User', $user->id, null, $user->toArray());
            $message = 'Usuario creado';
        }

        $this->isModalOpen = false;
        $this->dispatch('notify', message: $message, type: 'success');
    }

    public function render()
    {
        $query = User::query();

        if ($this->search) {
            $query->where(function ($q) {
                $q->where('id', 'like', '%' . $this->search . '%')
                    ->orWhere('name', 'like', '%' . $this->search . '%')
                    ->orWhere('email', 'like', '%' . $this->search . '%')
                    ->orWhere('companyName', 'like', '%' . $this->search . '%');
            });
        }

        return view('livewire.admin.users', [
            'users' => $query->latest()->paginate(10)
        ])->layout('layouts.admin');
    }
}
