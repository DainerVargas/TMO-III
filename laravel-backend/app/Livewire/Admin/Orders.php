<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\Order;
use App\Traits\LogsAudit;

class Orders extends Component
{
    use WithPagination, LogsAudit;

    public $search = '';
    public $status = 'all';

    public $selectedOrder = null;
    public $isDetailsOpen = false;

    protected $queryString = ['search', 'status'];

    public function updatedSearch()
    {
        $this->resetPage();
    }
    public function updatedStatus()
    {
        $this->resetPage();
    }

    public function viewDetails($id)
    {
        $this->selectedOrder = Order::with(['user', 'orderItems.product'])->findOrFail($id);
        $this->isDetailsOpen = true;
    }

    public function updateStatus($id, $newStatus)
    {
        $order = Order::findOrFail($id);
        $oldData = $order->toArray();
        $order->status = strtoupper($newStatus);
        $order->save();

        // Notify user
        if ($order->user) {
            $order->user->notify(new \App\Notifications\OrderStatusChanged($order));
        }

        $this->logAction('UPDATE', 'Order', $id, $oldData, $order->fresh()->toArray());
        $this->dispatch('notify', message: 'Estado de pedido actualizado', type: 'success');

        if ($this->selectedOrder && $this->selectedOrder->id == $id) {
            $this->selectedOrder = $order;
        }
    }

    public function render()
    {
        $query = Order::with('user');

        if ($this->search) {
            $query->where(function ($q) {
                $q->where('id', 'like', '%' . $this->search . '%')
                    ->orWhereHas('user', function ($qu) {
                        $qu->where('name', 'like', '%' . $this->search . '%')
                            ->orWhere('documentNumber', 'like', '%' . $this->search . '%');
                    });
            });
        }

        if ($this->status !== 'all') {
            $query->where('status', strtoupper($this->status));
        }

        return view('livewire.admin.orders', [
            'orders' => $query->latest()->paginate(10)
        ])->layout('layouts.admin');
    }
}
