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
        'gallery' => 'array',
    ];

    protected $appends = [
        'price_with_igv',
        'unit_price_with_igv',
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
        'isActive',
        'technicalSheet',
        'gallery'
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

    public function getPriceWithIgvAttribute()
    {
        return $this->price ? round($this->price * 1.18, 2) : 0;
    }

    public function setPriceAttribute($value)
    {
        $this->attributes['price'] = ($value === '' || $value === null) ? null : $value;
    }

    public function setUnitPriceAttribute($value)
    {
        $this->attributes['unitPrice'] = ($value === '' || $value === null) ? null : $value;
    }

    public function getUnitPriceWithIgvAttribute()
    {
        return $this->unitPrice ? round($this->unitPrice * 1.18, 2) : 0;
    }
}
