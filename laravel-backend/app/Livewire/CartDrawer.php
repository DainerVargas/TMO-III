<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\Attributes\On;
use App\Models\Product;

class CartDrawer extends Component
{
    public $isOpen = false;

    #[On('cart-updated')]
    public function refreshCart()
    {
        // Simply refresh the component to reload session data
    }

    #[On('open-cart')]
    public function openCart()
    {
        $this->isOpen = true;
    }

    public function closeCart()
    {
        $this->isOpen = false;
    }

    public function updateQuantity($cartId, $quantity)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$cartId])) {
            $product = Product::find($cart[$cartId]['id']);
            $minOrder = $product ? ($product->minOrder ?? 1) : 1;

            $cart[$cartId]['quantity'] = max($minOrder, $quantity);
            session()->put('cart', $cart);
            $this->updateSessionCount();
        }
    }

    public function removeItem($cartId)
    {
        $cart = session()->get('cart', []);

        if (isset($cart[$cartId])) {
            unset($cart[$cartId]);
            session()->put('cart', $cart);
            $this->updateSessionCount();
        }
    }

    public function clearCart()
    {
        session()->forget('cart');
        session()->forget('cart_count');
        $this->dispatch('cart-updated', count: 0);
    }

    protected function updateSessionCount()
    {
        $cart = session()->get('cart', []);
        $count = collect($cart)->sum('quantity');
        session()->put('cart_count', $count);
        $this->dispatch('cart-updated', count: $count);
    }

    public function render()
    {
        $cart = session()->get('cart', []);
        $subtotal = collect($cart)->sum(function ($item) {
            return $item['price'] * $item['quantity'];
        });
        $igv = $subtotal * 0.18;
        $total = $subtotal + $igv;

        return view('livewire.cart-drawer', [
            'items' => $cart,
            'subtotal' => $subtotal,
            'igv' => $igv,
            'total' => $total,
            'totalItems' => collect($cart)->sum('quantity'),
        ]);
    }
}
