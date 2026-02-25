<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $table = 'auditlog';
    const CREATED_AT = 'createdAt';
    const UPDATED_AT = null;
    protected $fillable = ['userId', 'action', 'entity', 'entityId', 'oldData', 'newData', 'createdAt'];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId');
    }

    protected function casts(): array
    {
        return [
            'createdAt' => 'datetime',
            'oldData' => 'array',
            'newData' => 'array',
        ];
    }
}
