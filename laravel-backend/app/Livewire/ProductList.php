<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\Product;
use App\Models\Category;

class ProductList extends Component
{
    use WithPagination;
    public $searchQuery = '';
    public $selectedCategory = 'all';
    public $sortBy = 'name';
    public $todayOnly = false;
    public $viewMode = 'grid';
    public $selectedProduct = null;

    protected $listeners = ['view-product' => 'viewProduct'];

    protected $queryString = ['searchQuery', 'selectedCategory', 'sortBy', 'todayOnly'];

    public function render()
    {
        $query = Product::with('category')->where('isActive', true);

        if ($this->selectedCategory !== 'all') {
            $query->where('categoryId', $this->selectedCategory);
        }

        if ($this->searchQuery) {
            $query->where(function ($q) {
                $q->where('name', 'like', '%' . $this->searchQuery . '%')
                    ->orWhere('sku', 'like', '%' . $this->searchQuery . '%')
                    ->orWhere('brand', 'like', '%' . $this->searchQuery . '%');
            });
        }

        if ($this->todayOnly) {
            $query->where('deliveryDays', 1);
        }

        switch ($this->sortBy) {
            case 'price-asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price-desc':
                $query->orderBy('price', 'desc');
                break;
            case 'stock':
                $query->orderBy('stock', 'desc');
                break;
            default:
                $query->orderBy('name', 'asc');
                break;
        }

        return view('livewire.product-list', [
            'products' => $query->paginate(12),
            'categories' => Category::withCount(['products' => function ($query) {
                $query->where('isActive', true);
            }])->get(),
            'totalProducts' => Product::where('isActive', true)->count(),
            'crossSellProducts' => $this->getCrossSellProducts(),
        ])->layout('layouts.app');
    }

    public function setCategory($id)
    {
        $this->selectedCategory = $id;
    }

    public function setSort($sort)
    {
        $this->sortBy = $sort;
    }

    public function toggleTodayOnly()
    {
        $this->todayOnly = !$this->todayOnly;
    }

    public function setViewMode($mode)
    {
        $this->viewMode = $mode;
    }

    public function addToCart($productId, $quantity = 1, $unit = 'box')
    {
        $product = Product::findOrFail($productId);

        $cart = session()->get('cart', []);

        $cartId = $productId . '_' . $unit;

        if (isset($cart[$cartId])) {
            $cart[$cartId]['quantity'] += $quantity;
        } else {
            $cart[$cartId] = [
                'id' => $productId,
                'name' => $product->name,
                'price' => $unit === 'unit' && $product->unitPrice ? $product->unitPrice : $product->price,
                'quantity' => $quantity,
                'unit' => $unit === 'unit' ? $product->unitPriceUnit : $product->unit,
                'image' => $product->image,
                'unit_type' => $unit
            ];
        }

        session()->put('cart', $cart);

        $count = collect($cart)->sum('quantity');
        session()->put('cart_count', $count);

        $this->dispatch('cart-updated', count: $count);
        $this->dispatch('notify', message: 'Producto añadido al carrito', type: 'success');
    }

    public function viewProduct($productId)
    {
        $this->selectedProduct = Product::find($productId);
    }

    public function closeProductModal()
    {
        $this->selectedProduct = null;
    }

    public function getCrossSellProducts()
    {
        if (!$this->selectedProduct) return collect();

        return Product::where('isActive', true)
            ->where('id', '!=', $this->selectedProduct->id)
            ->where('categoryId', '!=', $this->selectedProduct->categoryId)
            ->inRandomOrder()
            ->limit(3)
            ->get();
    }
}
