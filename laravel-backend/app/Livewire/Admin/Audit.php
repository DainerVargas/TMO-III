<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\AuditLog;

class Audit extends Component
{
    use WithPagination;

    public $search = '';
    public $filterEntity = 'all';
    public $selectedLog = null;

    protected $queryString = ['search', 'filterEntity'];

    public function updatedSearch()
    {
        $this->resetPage();
    }
    public function updatedFilterEntity()
    {
        $this->resetPage();
    }

    public function viewLog($id)
    {
        $this->selectedLog = AuditLog::with('user')->findOrFail($id);
    }

    public function closeLog()
    {
        $this->selectedLog = null;
    }

    public function clearLogs()
    {
        AuditLog::truncate();
        $this->dispatch('notify', message: 'Historial de auditoría limpiado', type: 'info');
    }

    public function render()
    {
        $query = AuditLog::with('user');

        if ($this->search) {
            $query->where(function ($q) {
                $q->where('action', 'like', '%' . $this->search . '%')
                    ->orWhere('entityId', 'like', '%' . $this->search . '%')
                    ->orWhereHas('user', function ($qu) {
                        $qu->where('name', 'like', '%' . $this->search . '%');
                    });
            });
        }

        if ($this->filterEntity !== 'all') {
            $query->where('entity', $this->filterEntity);
        }

        return view('livewire.admin.audit', [
            'logs' => $query->latest()->paginate(20)
        ])->layout('layouts.admin');
    }
}
