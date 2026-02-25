<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'product';
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';

    protected $casts = [
        'tags' => 'array',
    ];

    protected $fillable = [
        'name',
        'sku',
        'categoryId',
        'price',
        'unit',
        'stock',
        'stockStatus',
        'image',
        'description',
        'deliveryDays',
        'brand',
        'minOrder',
        'isRecurring',
        'tags',
        'unitPrice',
        'unitPriceUnit',
        'isActive'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'categoryId');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'productId');
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class, 'productId');
    }
}
