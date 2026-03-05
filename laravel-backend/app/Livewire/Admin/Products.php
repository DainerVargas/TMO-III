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

    public $name, $sku, $brand, $price, $unit, $stock, $image, $categoryId, $isActive = true, $deliveryDays = 1, $description = '', $tags = '';
    public $unitPrice, $unitPriceUnit, $technicalSheet;
    public $newImage;
    public $newGallery = [];
    public $existingGallery = [];
    public $importFile;
    public $importResults = null;
    public $isImportSummaryOpen = false;

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

    public function export()
    {
        $products = Product::with('category')->get();
        $filename = 'inventario_productos_' . now()->format('Y-m-d_H-i-s') . '.csv';

        return response()->streamDownload(function () use ($products) {
            $handle = fopen('php://output', 'w');

            // UTF-8 BOM for Excel visibility
            fputs($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            // Header
            fputcsv($handle, [
                'ID',
                'Nombre',
                'SKU',
                'Categoría',
                'Marca',
                'Precio Paquete',
                'Unidad Paquete',
                'Precio Unitario',
                'Unidad Individual',
                'Stock',
                'Estado Stock',
                'Días de Entrega',
                'Activo',
                'Tags',
                'Creado'
            ], ';');

            foreach ($products as $p) {
                fputcsv($handle, [
                    $p->id,
                    $p->name,
                    $p->sku,
                    $p->category->name ?? 'Sin categoría',
                    $p->brand,
                    $p->price,
                    $p->unit,
                    $p->unitPrice,
                    $p->unitPriceUnit,
                    $p->stock,
                    $p->stockStatus,
                    $p->deliveryDays,
                    $p->isActive ? 'SI' : 'NO',
                    is_array($p->tags) ? implode(', ', $p->tags) : $p->tags,
                    $p->createdAt
                ], ';');
            }

            fclose($handle);
        }, $filename);
    }

    public function updatedImportFile()
    {
        $this->import();
    }

    public function import()
    {
        $this->validate([
            'importFile' => 'required|mimes:csv,txt|max:10240',
        ], [
            'importFile.required' => 'Debes seleccionar un archivo.',
            'importFile.mimes' => 'El archivo debe ser un CSV.',
        ]);

        $path = $this->importFile->getRealPath();
        $handle = fopen($path, 'r');

        // Detect delimiter
        $firstLine = fgets($handle);
        $semicolons = substr_count($firstLine, ';');
        $commas = substr_count($firstLine, ',');
        $delimiter = $semicolons >= $commas ? ';' : ',';

        rewind($handle);
        // Skip UTF-8 BOM if present
        $bom = fread($handle, 3);
        if ($bom !== "\xEF\xBB\xBF") {
            rewind($handle);
        }

        // Get header
        $header = fgetcsv($handle, 0, $delimiter);
        if (!$header) {
            $this->dispatch('notify', message: 'Archivo CSV vacío o inválido', type: 'error');
            return;
        }

        // Clean headers (trim, lowercase, remove accents for better matching)
        $cleanHeaders = array_map(function ($h) {
            $h = trim(strtolower($h));
            $h = str_replace(['á', 'é', 'í', 'ó', 'ú'], ['a', 'e', 'i', 'o', 'u'], $h);
            return $h;
        }, $header);

        $imported = 0;
        $updated = 0;
        $errors = [];

        // Fallback category
        $defaultCategory = Category::first();

        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            if (count($row) < 2) continue;

            $data = [];
            foreach ($cleanHeaders as $index => $key) {
                if (isset($row[$index])) {
                    $data[$key] = $row[$index];
                }
            }

            // Map keys with flexibility
            $sku = $data['sku'] ?? null;
            $name = $data['nombre'] ?? null;

            if (!$sku && !$name) {
                $errors[] = "Fila vacía: No se encontró Nombre ni SKU.";
                continue;
            }

            $product = null;
            if ($sku) {
                $product = Product::where('sku', $sku)->first();
            }
            if (!$product && $name) {
                $product = Product::where('name', $name)->first();
            }

            // Find category
            $categoryName = $data['categoria'] ?? null;
            $categoryId = null;
            if ($categoryName) {
                $cat = Category::where('name', 'like', '%' . trim($categoryName) . '%')->first();
                if ($cat) {
                    $categoryId = $cat->id;
                }
            }

            // If still no category, use default or the first one available
            if (!$categoryId) {
                $categoryId = $product ? $product->categoryId : ($defaultCategory ? $defaultCategory->id : null);
            }

            if (!$categoryId) {
                $errors[] = "Producto '" . ($name ?? $sku) . "': Categoría '" . ($categoryName ?? 'vacía') . "' no existe y no hay una por defecto.";
                continue;
            }

            $isActiveStr = isset($data['activo']) ? strtoupper($data['activo']) : '';
            $isActive = ($isActiveStr === 'SI' || $isActiveStr === 'S' || $isActiveStr === '1');

            $stock = (int)($data['stock'] ?? 0);
            $status = 'in-stock';
            if ($stock == 0) $status = 'out-of-stock';
            elseif ($stock <= 10) $status = 'low-stock';

            // Partial matching for price headers if exact match fails
            $pricePaquete = $data['precio paquete'] ?? $data['precio paque'] ?? null;
            $unitPaquete = $data['unidad paquete'] ?? $data['unidad paque'] ?? 'UND';
            $priceUnit = $data['precio unitario'] ?? $data['precio unitar'] ?? null;
            $unitUnit = $data['unidad individual'] ?? $data['unidad indivi'] ?? 'UND';
            $days = $data['dias de entrega'] ?? $data['dias de entre'] ?? 1;

            $tagsRaw = $data['tags'] ?? '';
            $tags = !empty($tagsRaw) ? array_filter(array_map('trim', explode(',', $tagsRaw))) : [];

            $productData = [
                'name' => $name,
                'sku' => $sku,
                'brand' => $data['marca'] ?? 'Genérico',
                'price' => !empty($pricePaquete) ? (float)$pricePaquete : null,
                'unit' => $unitPaquete,
                'stock' => $stock,
                'stockStatus' => $status,
                'categoryId' => $categoryId,
                'deliveryDays' => (int)$days,
                'tags' => $tags,
                'unitPrice' => !empty($priceUnit) ? (float)$priceUnit : null,
                'unitPriceUnit' => $unitUnit,
            ];

            try {
                if ($product) {
                    $oldData = $product->toArray();
                    $product->update($productData);
                    if (isset($data['activo'])) {
                        $product->isActive = $isActive;
                        $product->save();
                    }
                    $this->logAction('UPDATE', 'Product', $product->id, $oldData, $product->fresh()->toArray());
                    $updated++;
                } else {
                    $productData['isActive'] = false; // New products are always inactive
                    $product = Product::create($productData);
                    $this->logAction('CREATE', 'Product', $product->id, null, $product->toArray());
                    $imported++;
                }
            } catch (\Exception $e) {
                $errors[] = "Producto '" . ($name ?? $sku) . "': Error al guardar. " . $e->getMessage();
            }
        }

        fclose($handle);
        $this->importFile = null;

        $this->importResults = [
            'imported' => $imported,
            'updated' => $updated,
            'errors' => $errors
        ];

        $this->isImportSummaryOpen = true;
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
            $this->unitPrice = $product->unitPrice;
            $this->unitPriceUnit = $product->unitPriceUnit;
            $this->technicalSheet = $product->technicalSheet;
            $this->existingGallery = is_array($product->gallery) ? $product->gallery : [];
            $this->newGallery = [];
            $this->tags = is_array($product->tags) ? implode(', ', $product->tags) : $product->tags;
        } else {
            $this->editingProduct = null;
            $this->reset(['name', 'sku', 'brand', 'price', 'unit', 'stock', 'categoryId', 'isActive', 'deliveryDays', 'image', 'newImage', 'description', 'tags', 'unitPrice', 'unitPriceUnit', 'technicalSheet', 'newGallery', 'existingGallery']);
            $this->isActive = true;
            $this->deliveryDays = 1;
            $this->description = '';
            $this->tags = '';
            $this->existingGallery = [];
            $this->newGallery = [];
        }
        $this->isModalOpen = true;
    }

    public function save()
    {
        $this->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:product,sku,' . ($this->editingProduct->id ?? 'NULL'),
            'categoryId' => 'required|exists:category,id',
            'stock' => 'required|integer|min:0',
            'price' => 'required_without:unitPrice|nullable|numeric|min:0',
            'unitPrice' => 'required_without:price|nullable|numeric|min:0',
            'unit' => 'required_with:price|nullable|string|max:50',
            'unitPriceUnit' => 'required_with:unitPrice|nullable|string|max:50',
        ], [
            'name.required' => 'El nombre es obligatorio.',
            'sku.required' => 'El SKU es obligatorio.',
            'sku.unique' => 'Este SKU ya está en uso.',
            'categoryId.required' => 'Debes seleccionar una categoría.',
            'stock.required' => 'El stock es obligatorio.',
            'price.required_without' => 'Debes ingresar al menos un precio (Paquete o Unidad).',
            'unitPrice.required_without' => 'Debes ingresar al menos un precio (Paquete o Unidad).',
            'unit.required_with' => 'Si ingresas precio de paquete, debes poner una etiqueta (ej: CAJA).',
            'unitPriceUnit.required_with' => 'Si ingresas precio de unidad, debes poner una etiqueta (ej: UND).',
        ]);

        $status = 'in-stock';
        if ($this->stock == 0) $status = 'out-of-stock';
        elseif ($this->stock <= 10) $status = 'low-stock';

        $tagsArray = is_string($this->tags) ? array_filter(array_map('trim', explode(',', $this->tags))) : ($this->tags ?? []);

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
            'tags' => $tagsArray,
            'unitPrice' => $this->unitPrice,
            'unitPriceUnit' => $this->unitPriceUnit,
            'technicalSheet' => $this->technicalSheet,
            'image' => $this->image ?? 'https://placehold.co/400x400?text=No+Image',
        ];

        if ($this->newImage) {
            $path = $this->newImage->store('products', 'public');
            $data['image'] = '/storage/' . $path;
        }

        // Handle Gallery
        $gallery = $this->existingGallery ?? [];
        if ($this->newGallery) {
            foreach ($this->newGallery as $photo) {
                $path = $photo->store('products/gallery', 'public');
                $gallery[] = '/storage/' . $path;
            }
        }
        $data['gallery'] = $gallery;

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

    public function removeGalleryImage($index)
    {
        if (isset($this->existingGallery[$index])) {
            unset($this->existingGallery[$index]);
            $this->existingGallery = array_values($this->existingGallery);
        }
    }

    public function render()
    {
        $query = Product::with('category');


        if ($this->search) {
            $words = explode(' ', $this->search);
            $query->where(function ($q) use ($words) {
                foreach ($words as $word) {
                    $word = trim($word);
                    if (strlen($word) < 2) continue; // Admin search allows shorter words
                    $term = '%' . $word . '%';

                    $q->orWhere(function ($sq) use ($term) {
                        $sq->where('id', 'like', $term)
                            ->orWhere('name', 'like', $term)
                            ->orWhere('sku', 'like', $term)
                            ->orWhere('brand', 'like', $term)
                            ->orWhere('description', 'like', $term)
                            ->orWhere('tags', 'like', $term);
                    });
                }
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
            'products' => $query->latest()->paginate(50),
            'categories' => Category::all()
        ])->layout('layouts.admin');
    }
}
