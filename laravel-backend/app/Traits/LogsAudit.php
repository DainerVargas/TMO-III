<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

trait LogsAudit
{
    protected function logAction($action, $entity, $entityId, $oldData = null, $newData = null)
    {
        AuditLog::create([
            'userId' => Auth::id(),
            'action' => $action,
            'entity' => $entity,
            'entityId' => $entityId,
            'oldData' => $oldData,
            'newData' => $newData,
            'createdAt' => now(),
        ]);
    }
}
