<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(): Response
    {
        $logs = ActivityLog::query()
            ->with(['user:id,name,phone,email', 'admin:id,name,phone,email'])
            ->orderByDesc('created_at')
            ->paginate(50)
            ->through(function (ActivityLog $log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'description' => $log->description,
                    'model_type' => $log->model_type,
                    'model_id' => $log->model_id,
                    'user' => $log->user ? [
                        'id' => $log->user->id,
                        'name' => $log->user->name,
                        'phone' => $log->user->phone,
                    ] : null,
                    'admin' => $log->admin ? [
                        'id' => $log->admin->id,
                        'name' => $log->admin->name,
                        'phone' => $log->admin->phone,
                    ] : null,
                    'ip_address' => $log->ip_address,
                    'created_at' => $log->created_at?->toDateTimeString(),
                ];
            });

        return Inertia::render('admin/activity-logs/index', [
            'logs' => $logs,
        ]);
    }
}
