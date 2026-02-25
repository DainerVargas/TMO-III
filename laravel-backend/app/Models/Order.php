<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'order';
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = 'updatedAt';
    protected $fillable = ['userId', 'total', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'orderId');
    }
}
