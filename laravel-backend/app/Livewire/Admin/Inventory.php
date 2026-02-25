<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\Product;
use App\Models\StockMovement;
use App\Traits\LogsAudit;

class Inventory extends Component
{
    use WithPagination, LogsAudit;

    public $search = '';
    public $filterStatus = 'all';

    protected $queryString = ['search', 'filterStatus'];

    public function updatedSearch()
    {
        $this->resetPage();
    }
    public function updatedFilterStatus()
    {
        $this->resetPage();
    }

    public function adjustStock($productId, $quantity, $type, $reason)
    {
        $product = Product::findOrFail($productId);
        $oldData = $product->toArray();

        if ($type === 'SALE' && $product->stock < abs($quantity)) {
            $this->dispatch('notify', message: 'Stock insuficiente', type: 'error');
            return;
        }

        $product->stock += $quantity;

        $status = 'in-stock';
        if ($product->stock == 0) $status = 'out-of-stock';
        elseif ($product->stock <= 10) $status = 'low-stock';
        $product->stockStatus = $status;

        $product->save();

        StockMovement::create([
            'productId' => $productId,
            'quantity' => $quantity,
            'type' => $type,
            'reason' => $reason
        ]);

        $this->logAction('STOCK_ADJUST', 'Product', $productId, $oldData, $product->fresh()->toArray());
        $this->dispatch('notify', message: 'Stock actualizado', type: 'success');
    }

    public function render()
    {
        $query = Product::with('category');

        if ($this->search) {
            $query->where(function ($q) {
                $q->where('name', 'like', '%' . $this->search . '%')
                    ->orWhere('sku', 'like', '%' . $this->search . '%');
            });
        }

        if ($this->filterStatus === 'low-stock') {
            $query->where('stock', '<=', 10)->where('stock', '>', 0);
        } elseif ($this->filterStatus === 'out-of-stock') {
            $query->where('stock', 0);
        } elseif ($this->filterStatus === 'in-stock') {
            $query->where('stock', '>', 10);
        }

        return view('livewire.admin.inventory', [
            'products' => $query->latest()->paginate(10),
            'movements' => StockMovement::with('product')->latest()->take(10)->get(),
            'stats' => [
                'total' => Product::count(),
                'low' => Product::where('stock', '<=', 10)->where('stock', '>', 0)->count(),
                'out' => Product::where('stock', 0)->count(),
                'movementsToday' => StockMovement::whereDate('createdAt', today())->count()
            ]
        ])->layout('layouts.admin');
    }
}
