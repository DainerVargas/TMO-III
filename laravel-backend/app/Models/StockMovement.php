<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $table = 'stockmovement';
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = null;
    protected $fillable = ['productId', 'quantity', 'type', 'reason'];

    public function product()
    {
        return $this->belongsTo(Product::class, 'productId');
    }
}
