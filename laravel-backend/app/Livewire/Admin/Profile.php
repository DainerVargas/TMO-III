<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Traits\LogsAudit;

class Profile extends Component
{
    use LogsAudit;

    public $name, $lastName, $email, $phone, $documentType, $documentNumber, $companyName;
    public $shippingAddress, $shippingDistrict, $shippingReference;
    public $current_password, $new_password, $new_password_confirmation;

    public function mount()
    {
        $user = Auth::user();
        $this->name = $user->name;
        $this->lastName = $user->lastName;
        $this->email = $user->email;
        $this->phone = $user->phone;
        $this->documentType = $user->documentType;
        $this->documentNumber = $user->documentNumber;
        $this->companyName = $user->companyName;
        $this->shippingAddress = $user->shippingAddress;
        $this->shippingDistrict = $user->shippingDistrict;
        $this->shippingReference = $user->shippingReference;
    }

    public function updateProfile()
    {
        $this->validate([
            'name' => 'required|string|max:255',
            'lastName' => 'nullable|string|max:255',
            'email' => 'required|email|unique:user,email,' . Auth::id(),
            'phone' => 'nullable|string|max:20',
        ]);

        $user = User::find(Auth::id());
        $oldData = $user->toArray();

        $user->update([
            'name' => $this->name,
            'lastName' => $this->lastName,
            'email' => $this->email,
            'phone' => $this->phone,
            'documentType' => $this->documentType,
            'documentNumber' => $this->documentNumber,
            'companyName' => $this->companyName,
            'shippingAddress' => $this->shippingAddress,
            'shippingDistrict' => $this->shippingDistrict,
            'shippingReference' => $this->shippingReference,
        ]);

        $this->logAction('UPDATE', 'User', Auth::id(), $oldData, $user->fresh()->toArray());
        $this->dispatch('notify', message: 'Perfil actualizado correctamente', type: 'success');
    }

    public function updatePassword()
    {
        $this->validate([
            'current_password' => 'required|current_password',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = User::find(Auth::id());
        $user->update([
            'password' => Hash::make($this->new_password)
        ]);

        $this->reset(['current_password', 'new_password', 'new_password_confirmation']);
        $this->logAction('PASSWORD_CHANGE', 'User', Auth::id(), null, null);
        $this->dispatch('notify', message: 'Contraseña actualizada correctamente', type: 'success');
    }

    public function render()
    {
        return view('livewire.admin.profile')->layout('layouts.admin');
    }
}
