<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use Livewire\WithPagination;
use Livewire\WithFileUploads;
use App\Models\Product;
use App\Models\Category;
use App\Traits\LogsAudit;

class Products extends Component
{
    use WithPagination, WithFileUploads, LogsAudit;

    public $search = '';
    public $category = 'all';
    public $stockStatus = 'all';
    public $activeFilter = 'all';

    public $isModalOpen = false;
    public $editingProduct = null;

    // Form inputs
    public $name, $sku, $brand, $price, $unit, $stock, $image, $categoryId, $isActive = true, $deliveryDays = 1, $description = '', $tags = '';
    public $newImage;

    protected $queryString = ['search', 'category', 'stockStatus', 'activeFilter'];

    public function updatedSearch()
    {
        $this->resetPage();
    }
    public function updatedCategory()
    {
        $this->resetPage();
    }
    public function updatedStockStatus()
    {
        $this->resetPage();
    }
    public function updatedActiveFilter()
    {
        $this->resetPage();
    }

    public function toggleStatus($id)
    {
        $product = Product::findOrFail($id);
        $oldData = $product->toArray();
        $product->isActive = !$product->isActive;
        $product->save();

        $this->logAction('UPDATE', 'Product', $id, $oldData, $product->fresh()->toArray());
        $this->dispatch(
            'notify',
            message: $product->isActive ? 'Producto activado' : 'Producto desactivado',
            type: 'success'
        );
    }

    public function delete($id)
    {
        $product = Product::findOrFail($id);
        $oldData = $product->toArray();
        $product->delete();

        $this->logAction('DELETE', 'Product', $id, $oldData);
        $this->dispatch('notify', message: 'Producto eliminado', type: 'success');
    }

    public function openModal($id = null)
    {
        $this->resetErrorBag();
        if ($id) {
            $product = Product::findOrFail($id);
            $this->editingProduct = $product;
            $this->name = $product->name;
            $this->sku = $product->sku;
            $this->brand = $product->brand;
            $this->price = $product->price;
            $this->unit = $product->unit;
            $this->stock = $product->stock;
            $this->categoryId = $product->categoryId;
            $this->isActive = $product->isActive;
            $this->deliveryDays = $product->deliveryDays;
            $this->image = $product->image;
            $this->description = $product->description;
            $this->tags = $product->tags;
        } else {
            $this->editingProduct = null;
            $this->reset(['name', 'sku', 'brand', 'price', 'unit', 'stock', 'categoryId', 'isActive', 'deliveryDays', 'image', 'newImage', 'description', 'tags']);
            $this->isActive = true;
            $this->deliveryDays = 1;
            $this->description = '';
            $this->tags = '';
        }
        $this->isModalOpen = true;
    }

    public function save()
    {
        $this->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:product,sku,' . ($this->editingProduct->id ?? 'NULL'),
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'categoryId' => 'required|exists:category,id',
        ]);

        $status = 'in-stock';
        if ($this->stock == 0) $status = 'out-of-stock';
        elseif ($this->stock <= 10) $status = 'low-stock';

        $data = [
            'name' => $this->name,
            'sku' => $this->sku,
            'brand' => $this->brand ?? 'Genérico',
            'price' => $this->price,
            'unit' => $this->unit ?? 'UND',
            'stock' => $this->stock,
            'stockStatus' => $status,
            'categoryId' => $this->categoryId,
            'isActive' => $this->isActive,
            'deliveryDays' => $this->deliveryDays,
            'description' => $this->description ?? '',
            'tags' => $this->tags ?? '',
            'image' => $this->image ?? 'https://placehold.co/400x400?text=No+Image',
        ];

        if ($this->newImage) {
            // Store locally and get path
            $path = $this->newImage->store('products', 'public');
            $data['image'] = '/storage/' . $path;
        }

        if ($this->editingProduct) {
            $oldData = $this->editingProduct->toArray();
            $this->editingProduct->update($data);
            $this->logAction('UPDATE', 'Product', $this->editingProduct->id, $oldData, $this->editingProduct->fresh()->toArray());
            $message = 'Producto actualizado';
        } else {
            $product = Product::create($data);
            $this->logAction('CREATE', 'Product', $product->id, null, $product->toArray());
            $message = 'Producto creado';
        }

        $this->isModalOpen = false;
        $this->dispatch('notify', message: $message, type: 'success');
    }

    public function render()
    {
        $query = Product::with('category');

        if ($this->search) {
            $query->where(function ($q) {
                $q->where('id', 'like', '%' . $this->search . '%')
                    ->orWhere('name', 'like', '%' . $this->search . '%')
                    ->orWhere('sku', 'like', '%' . $this->search . '%');
            });
        }

        if ($this->category !== 'all') {
            $query->where('categoryId', $this->category);
        }

        if ($this->stockStatus === 'low-stock') {
            $query->where('stock', '<=', 10)->where('stock', '>', 0);
        } elseif ($this->stockStatus === 'out-of-stock') {
            $query->where('stock', 0);
        } elseif ($this->stockStatus === 'in-stock') {
            $query->where('stock', '>', 10);
        }

        if ($this->activeFilter === 'active') {
            $query->where('isActive', true);
        } elseif ($this->activeFilter === 'inactive') {
            $query->where('isActive', false);
        }

        return view('livewire.admin.products', [
            'products' => $query->latest()->paginate(10),
            'categories' => Category::all()
        ])->layout('layouts.admin');
    }
}
