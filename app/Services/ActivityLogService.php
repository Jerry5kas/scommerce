<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class ActivityLogService
{
    /**
     * @param  array<string, mixed>  $changes
     */
    public function log(
        string $action,
        ?Model $model = null,
        ?User $user = null,
        ?User $admin = null,
        ?string $description = null,
        array $changes = [],
        ?Request $request = null
    ): ActivityLog {
        $request ??= request();

        return ActivityLog::create([
            'user_id' => $user?->id,
            'admin_id' => $admin?->id ?? $this->resolveAdminId($request),
            'action' => $action,
            'model_type' => $model ? $model::class : null,
            'model_id' => $model?->getKey(),
            'description' => $description,
            'changes' => $changes ?: null,
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
        ]);
    }

    protected function resolveAdminId(?Request $request = null): ?int
    {
        $request ??= request();

        /** @var \App\Models\User|null $authUser */
        $authUser = $request?->user('admin');

        return $authUser?->id;
    }
}

