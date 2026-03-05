<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithPagination;
use Livewire\Attributes\On;
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

    protected $listeners = [
        'view-product' => 'viewProduct',
    ];

    #[On('search-updated')]
    public function handleSearch($query)
    {
        $this->searchQuery = $query;
        $this->resetPage();
        if ($this->searchQuery) {
            $this->dispatch('scroll-to-catalog');
        }
    }

    protected $queryString = ['searchQuery', 'selectedCategory', 'sortBy', 'todayOnly'];

    public function render()
    {
        $query = Product::with('category')->where('isActive', true);

        if ($this->selectedCategory !== 'all') {
            $query->where('categoryId', $this->selectedCategory);
        }

        if ($this->searchQuery) {
            $words = explode(' ', $this->searchQuery);
            $query->where(function ($q) use ($words) {
                foreach ($words as $word) {
                    $word = trim($word);
                    if (strlen($word) < 3) continue;
                    $term = '%' . $word . '%';

                    $q->orWhere(function ($sq) use ($term) {
                        $sq->where('name', 'like', $term)
                            ->orWhere('sku', 'like', $term)
                            ->orWhere('brand', 'like', $term)
                            ->orWhere('description', 'like', $term)
                            ->orWhere('tags', 'like', $term)
                            ->orWhereHas('category', function ($cq) use ($term) {
                                $cq->where('name', 'like', $term);
                            });
                    });
                }
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

        $products = $query->paginate(50);

        return view('livewire.product-list', [
            'products' => $products,

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
        $this->resetPage();
    }

    public function setSort($sort)
    {
        $this->sortBy = $sort;
        $this->resetPage();
    }

    public function toggleTodayOnly()
    {
        $this->todayOnly = !$this->todayOnly;
        $this->resetPage();
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
