<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    /**
     * Display user's notifications.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $notifications = Notification::forUser($user->id)
            ->whereIn('channel', [Notification::CHANNEL_IN_APP, Notification::CHANNEL_DATABASE])
            ->orderByDesc('created_at')
            ->paginate(20);

        $unreadCount = $this->notificationService->getUnreadCount($user);

        return Inertia::render('notifications/index', [
            'notifications' => $notifications,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        $user = $request->user();

        if ($notification->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'unreadCount' => $this->notificationService->getUnreadCount($user),
        ]);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $user = $request->user();

        $count = $this->notificationService->markAllAsRead($user);

        return response()->json([
            'success' => true,
            'marked' => $count,
            'unreadCount' => 0,
        ]);
    }

    /**
     * Get unread count.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'count' => $this->notificationService->getUnreadCount($user),
        ]);
    }

    /**
     * Register device token for push notifications.
     */
    public function registerDevice(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
            'platform' => ['required', 'in:ios,android,web'],
            'device_name' => ['nullable', 'string', 'max:255'],
        ]);

        $user = $request->user();

        $device = $this->notificationService->registerDevice(
            $user,
            $validated['token'],
            $validated['platform'],
            $validated['device_name'] ?? null
        );

        return response()->json([
            'success' => true,
            'device_id' => $device->id,
        ]);
    }

    /**
     * Unregister device token.
     */
    public function unregisterDevice(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'token' => ['required', 'string'],
        ]);

        $this->notificationService->unregisterDevice($validated['token']);

        return response()->json(['success' => true]);
    }
}
