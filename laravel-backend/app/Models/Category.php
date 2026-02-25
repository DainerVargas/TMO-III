<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'category';
    protected $keyType = 'string';
    public $incrementing = false;
    public $timestamps = false; // Based on prisma schema

    protected $fillable = ['id', 'name', 'icon'];

    public function products()
    {
        return $this->hasMany(Product::class, 'categoryId');
    }
}
