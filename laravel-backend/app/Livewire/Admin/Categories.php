<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use Livewire\WithPagination;
use App\Models\Category;
use Illuminate\Support\Str;
use App\Traits\LogsAudit;

class Categories extends Component
{
    use WithPagination, LogsAudit;
    public $search = '';
    public $isModalOpen = false;
    public $editingCategory = null;

    // Form fields
    public $slug, $name, $icon;

    public function openModal($id = null)
    {
        $this->resetErrorBag();
        if ($id) {
            $cat = Category::findOrFail($id);
            $this->editingCategory = $cat;
            $this->slug = $cat->id;
            $this->name = $cat->name;
            $this->icon = $cat->icon;
        } else {
            $this->editingCategory = null;
            $this->reset(['slug', 'name', 'icon']);
        }
        $this->isModalOpen = true;
    }

    public function updatedName($value)
    {
        if (!$this->editingCategory) {
            $this->slug = Str::slug($value);
        }
    }

    public function delete($id)
    {
        $category = Category::withCount('products')->findOrFail($id);

        if ($category->products_count > 0) {
            $this->dispatch('notify', message: 'No se puede eliminar una categoría con productos asociados', type: 'error');
            return;
        }

        $oldData = $category->toArray();
        $category->delete();

        $this->logAction('DELETE', 'Category', $id, $oldData);
        $this->dispatch('notify', message: 'Categoría eliminada', type: 'success');
    }

    public function save()
    {
        $this->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:category,id,' . ($this->editingCategory->id ?? 'NULL'),
        ]);

        if ($this->editingCategory) {
            $oldData = $this->editingCategory->toArray();
            $this->editingCategory->update([
                'name' => $this->name,
                'icon' => $this->icon,
            ]);

            $this->logAction('UPDATE', 'Category', $this->editingCategory->id, $oldData, $this->editingCategory->fresh()->toArray());
            $message = 'Categoría actualizada';
        } else {
            $category = Category::create([
                'id' => $this->slug,
                'name' => $this->name,
                'icon' => $this->icon,
            ]);

            $this->logAction('CREATE', 'Category', $category->id, null, $category->toArray());
            $message = 'Categoría creada';
        }

        $this->isModalOpen = false;
        $this->dispatch('notify', message: $message, type: 'success');
    }

    public function render()
    {
        $query = Category::withCount('products');

        if ($this->search) {
            $query->where('name', 'like', '%' . $this->search . '%')
                ->orWhere('id', 'like', '%' . $this->search . '%');
        }

        return view('livewire.admin.categories', [
            'categories' => $query->orderBy('name')->paginate(10)
        ])->layout('layouts.admin');
    }
}
