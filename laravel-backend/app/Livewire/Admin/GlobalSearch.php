<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\User;

class GlobalSearch extends Component
{
    public $search = '';
    public $results = [];

    public function updatedSearch()
    {
        if (strlen($this->search) < 2) {
            $this->results = [];
            return;
        }

        $this->results = [];

        // Search Products
        $products = Product::where('name', 'like', '%' . $this->search . '%')
            ->orWhere('sku', 'like', '%' . $this->search . '%')
            ->limit(5)
            ->get()
            ->map(function ($product) {
                return [
                    'title' => $product->name,
                    'subtitle' => 'SKU: ' . $product->sku . ' - S/ ' . number_format($product->price, 2),
                    'type' => 'Producto',
                    'icon' => 'package',
                    'route' => route('admin.products', ['search' => $product->id]),
                ];
            });

        // Search Categories
        $categories = Category::where('name', 'like', '%' . $this->search . '%')
            ->orWhere('id', 'like', '%' . $this->search . '%')
            ->limit(3)
            ->get()
            ->map(function ($category) {
                return [
                    'title' => $category->name,
                    'subtitle' => 'Categoría: ' . $category->id,
                    'type' => 'Categoría',
                    'icon' => 'tag',
                    'route' => route('admin.categories', ['search' => $category->name]),
                ];
            });

        // Search Orders
        $orders = Order::where('id', 'like', '%' . $this->search . '%')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'title' => 'Pedido #' . $order->id,
                    'subtitle' => 'Estado: ' . $order->status . ' - Total: S/ ' . number_format($order->total, 2),
                    'type' => 'Pedido',
                    'icon' => 'shopping-cart',
                    'route' => route('admin.orders', ['search' => $order->id]),
                ];
            });

        // Search Users
        $users = User::where('name', 'like', '%' . $this->search . '%')
            ->orWhere('lastName', 'like', '%' . $this->search . '%')
            ->orWhere('email', 'like', '%' . $this->search . '%')
            ->orWhere('documentNumber', 'like', '%' . $this->search . '%')
            ->limit(5)
            ->get()
            ->map(function ($user) {
                return [
                    'title' => $user->name . ' ' . $user->lastName,
                    'subtitle' => $user->email . ($user->documentNumber ? ' - Doc: ' . $user->documentNumber : ''),
                    'type' => 'Usuario',
                    'icon' => 'users',
                    'route' => route('admin.users', ['search' => $user->email]),
                ];
            });

        $this->results = collect($products)
            ->merge($categories)
            ->merge($orders)
            ->merge($users)
            ->toArray();
    }

    public function render()
    {
        return view('livewire.admin.global-search');
    }
}
