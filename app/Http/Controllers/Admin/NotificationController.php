<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    /**
     * Display notifications list.
     */
    public function index(Request $request): Response
    {
        $query = Notification::with('user:id,name,email');

        if ($request->filled('search')) {
            $query->whereHas('user', fn ($q) => $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%"));
        }

        if ($request->filled('channel')) {
            $query->byChannel($request->channel);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $notifications = $query->orderByDesc('created_at')->paginate(30)->withQueryString();

        $stats = [
            'total' => Notification::count(),
            'pending' => Notification::pending()->count(),
            'sent' => Notification::sent()->count(),
            'failed' => Notification::failed()->count(),
        ];

        return Inertia::render('admin/notifications/index', [
            'notifications' => $notifications,
            'stats' => $stats,
            'filters' => $request->only(['search', 'channel', 'status']),
            'channelOptions' => Notification::channelOptions(),
            'statusOptions' => Notification::statusOptions(),
        ]);
    }

    /**
     * Display notification details.
     */
    public function show(Notification $notification): Response
    {
        return Inertia::render('admin/notifications/show', [
            'notification' => $notification->load('user'),
        ]);
    }

    /**
     * Retry failed notification.
     */
    public function retry(Notification $notification): RedirectResponse
    {
        if ($notification->status !== Notification::STATUS_FAILED) {
            return back()->withErrors(['error' => 'Only failed notifications can be retried.']);
        }

        $result = $this->notificationService->retryFailed($notification);

        if ($result) {
            return back()->with('success', 'Notification retried successfully.');
        }

        return back()->withErrors(['error' => 'Retry failed. Maximum retries reached.']);
    }

    /**
     * Get notification stats.
     */
    public function stats(): Response
    {
        $stats = [
            'total' => Notification::count(),
            'by_channel' => [
                'sms' => Notification::byChannel('sms')->count(),
                'whatsapp' => Notification::byChannel('whatsapp')->count(),
                'push' => Notification::byChannel('push')->count(),
                'email' => Notification::byChannel('email')->count(),
                'in_app' => Notification::byChannel('in_app')->count(),
            ],
            'by_status' => [
                'pending' => Notification::pending()->count(),
                'sent' => Notification::sent()->count(),
                'failed' => Notification::failed()->count(),
                'delivered' => Notification::where('status', 'delivered')->count(),
                'read' => Notification::where('status', 'read')->count(),
            ],
            'today' => Notification::whereDate('created_at', today())->count(),
            'this_week' => Notification::where('created_at', '>=', now()->startOfWeek())->count(),
        ];

        return Inertia::render('admin/notifications/stats', [
            'stats' => $stats,
        ]);
    }
}
