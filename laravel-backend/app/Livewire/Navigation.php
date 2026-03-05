<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\On;
use App\Models\Category;
use Illuminate\Support\Facades\Auth;

class Navigation extends Component
{
    public $searchQuery = '';
    public $cartCount = 0;
    public $mobileMenuOpen = false;

    protected $queryString = ['searchQuery'];

    public function updatedSearchQuery()
    {
        $this->dispatch('search-updated', query: $this->searchQuery);
    }

    public function mount()
    {
        // Cart count logic will go here
        $this->cartCount = session()->get('cart_count', 0);
    }

    #[On('cart-updated')]
    public function updateCartCount($count)
    {
        $this->cartCount = $count;
    }

    public function openCart()
    {
        $this->dispatch('open-cart');
    }

    public function render()
    {
        return view('livewire.navigation', [
            'categories' => Category::all(),
            'user' => Auth::user(),
            'isLoggedIn' => Auth::check(),
        ]);
    }
}
