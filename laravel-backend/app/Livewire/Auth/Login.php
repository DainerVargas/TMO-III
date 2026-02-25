<?php

namespace App\Livewire\Auth;

use Livewire\Component;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class Login extends Component
{
    public $mode = 'login'; // login or register
    public $email = '';
    public $password = '';
    public $remember = false;

    // Register fields
    public $name = '';
    public $lastName = '';
    public $phone = '';
    public $documentType = 'DNI';
    public $documentNumber = '';
    public $companyName = '';

    public function setMode($mode)
    {
        $this->mode = $mode;
        $this->resetValidation();
    }

    public function login()
    {
        $this->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt(['email' => $this->email, 'password' => $this->password], $this->remember)) {
            throw ValidationException::withMessages([
                'email' => 'Las credenciales proporcionadas no coinciden con nuestros registros.',
            ]);
        }

        session()->regenerate();

        $user = Auth::user();
        if ($user->role === 'ADMIN' || $user->role === 'MANAGER') {
            return redirect()->intended(route('admin.dashboard'));
        }

        return redirect()->intended(route('admin.profile'));
    }

    public function register()
    {
        $this->validate([
            'name' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'phone' => 'nullable|string',
            'documentType' => 'required|in:DNI,RUC',
            'documentNumber' => 'required|string',
            'companyName' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $this->name,
            'lastName' => $this->lastName,
            'email' => $this->email,
            'password' => Hash::make($this->password),
            'phone' => $this->phone,
            'documentType' => $this->documentType,
            'documentNumber' => $this->documentNumber,
            'companyName' => $this->companyName,
            'role' => 'USER',
            'isActive' => true,
        ]);

        Auth::login($user);

        return redirect(route('home'));
    }

    public function render()
    {
        return view('livewire.auth.login')->layout('layouts.app');
    }
}
