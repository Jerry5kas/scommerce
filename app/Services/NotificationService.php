<?php

namespace App\Services;

use App\Models\Delivery;
use App\Models\DeviceToken;
use App\Models\Notification;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    /**
     * Send notification via specific channel
     */
    public function send(Notification $notification): bool
    {
        try {
            $result = match ($notification->channel) {
                Notification::CHANNEL_SMS => $this->sendViaSMS($notification),
                Notification::CHANNEL_WHATSAPP => $this->sendViaWhatsApp($notification),
                Notification::CHANNEL_PUSH => $this->sendViaPush($notification),
                Notification::CHANNEL_EMAIL => $this->sendViaEmail($notification),
                Notification::CHANNEL_IN_APP, Notification::CHANNEL_DATABASE => $this->sendViaDatabase($notification),
                default => false,
            };

            if ($result) {
                $notification->markAsSent();
            }

            return $result;
        } catch (\Exception $e) {
            Log::error('Notification send failed', [
                'notification_id' => $notification->id,
                'channel' => $notification->channel,
                'error' => $e->getMessage(),
            ]);

            $notification->markAsFailed($e->getMessage());
            $notification->incrementRetry();

            return false;
        }
    }

    /**
     * Send SMS notification
     */
    public function sendSMS(User $user, string $message, array $data = []): ?Notification
    {
        if (! $user->phone || ! $user->communication_consent) {
            return null;
        }

        $notification = Notification::create([
            'user_id' => $user->id,
            'type' => 'sms',
            'channel' => Notification::CHANNEL_SMS,
            'message' => $message,
            'data' => $data,
            'status' => Notification::STATUS_PENDING,
        ]);

        $this->send($notification);

        return $notification;
    }

    /**
     * Send WhatsApp notification
     */
    public function sendWhatsApp(User $user, string $message, array $data = []): ?Notification
    {
        if (! $user->phone || ! $user->communication_consent) {
            return null;
        }

        $notification = Notification::create([
            'user_id' => $user->id,
            'type' => 'whatsapp',
            'channel' => Notification::CHANNEL_WHATSAPP,
            'message' => $message,
            'data' => $data,
            'status' => Notification::STATUS_PENDING,
        ]);

        $this->send($notification);

        return $notification;
    }

    /**
     * Send Push notification
     */
    public function sendPush(User $user, string $title, string $message, array $data = []): ?Notification
    {
        $notification = Notification::create([
            'user_id' => $user->id,
            'type' => 'push',
            'channel' => Notification::CHANNEL_PUSH,
            'title' => $title,
            'message' => $message,
            'data' => $data,
            'status' => Notification::STATUS_PENDING,
        ]);

        $this->send($notification);

        return $notification;
    }

    /**
     * Send Email notification
     */
    public function sendEmail(User $user, string $subject, string $message, array $data = []): ?Notification
    {
        if (! $user->email) {
            return null;
        }

        $notification = Notification::create([
            'user_id' => $user->id,
            'type' => 'email',
            'channel' => Notification::CHANNEL_EMAIL,
            'title' => $subject,
            'message' => $message,
            'data' => $data,
            'status' => Notification::STATUS_PENDING,
        ]);

        $this->send($notification);

        return $notification;
    }

    /**
     * Send In-App notification
     */
    public function sendInApp(User $user, string $title, string $message, array $data = []): Notification
    {
        return Notification::create([
            'user_id' => $user->id,
            'type' => 'in_app',
            'channel' => Notification::CHANNEL_IN_APP,
            'title' => $title,
            'message' => $message,
            'data' => $data,
            'status' => Notification::STATUS_SENT,
            'sent_at' => now(),
        ]);
    }

    /**
     * Broadcast notification to multiple users
     */
    public function broadcast(array $userIds, string $channel, string $title, string $message, array $data = []): int
    {
        $sent = 0;
        $users = User::whereIn('id', $userIds)->get();

        foreach ($users as $user) {
            $notification = match ($channel) {
                'sms' => $this->sendSMS($user, $message, $data),
                'whatsapp' => $this->sendWhatsApp($user, $message, $data),
                'push' => $this->sendPush($user, $title, $message, $data),
                'email' => $this->sendEmail($user, $title, $message, $data),
                'in_app' => $this->sendInApp($user, $title, $message, $data),
                default => null,
            };

            if ($notification) {
                $sent++;
            }
        }

        return $sent;
    }

    /**
     * Schedule notification for later
     */
    public function schedule(
        User $user,
        string $channel,
        string $title,
        string $message,
        \DateTime $scheduledAt,
        array $data = []
    ): Notification {
        return Notification::create([
            'user_id' => $user->id,
            'type' => 'scheduled',
            'channel' => $channel,
            'title' => $title,
            'message' => $message,
            'data' => $data,
            'status' => Notification::STATUS_PENDING,
            'scheduled_at' => $scheduledAt,
        ]);
    }

    /**
     * Retry failed notification
     */
    public function retryFailed(Notification $notification, int $maxRetries = 3): bool
    {
        if ($notification->retry_count >= $maxRetries) {
            return false;
        }

        $notification->update([
            'status' => Notification::STATUS_PENDING,
            'failure_reason' => null,
        ]);

        return $this->send($notification);
    }

    /**
     * Process scheduled notifications
     */
    public function processScheduled(): int
    {
        $notifications = Notification::scheduled()->get();
        $processed = 0;

        foreach ($notifications as $notification) {
            if ($this->send($notification)) {
                $processed++;
            }
        }

        return $processed;
    }

    /**
     * Get unread count for user
     */
    public function getUnreadCount(User $user): int
    {
        return Notification::forUser($user->id)
            ->whereIn('channel', [Notification::CHANNEL_IN_APP, Notification::CHANNEL_DATABASE])
            ->unread()
            ->count();
    }

    /**
     * Mark all notifications as read for user
     */
    public function markAllAsRead(User $user): int
    {
        return Notification::forUser($user->id)
            ->whereIn('channel', [Notification::CHANNEL_IN_APP, Notification::CHANNEL_DATABASE])
            ->unread()
            ->update([
                'status' => Notification::STATUS_READ,
                'read_at' => now(),
            ]);
    }

    /**
     * Register device token for push notifications
     */
    public function registerDevice(User $user, string $token, string $platform = 'web', ?string $deviceName = null): DeviceToken
    {
        return DeviceToken::updateOrCreate(
            ['token' => $token],
            [
                'user_id' => $user->id,
                'platform' => $platform,
                'device_name' => $deviceName,
                'is_active' => true,
                'last_used_at' => now(),
            ]
        );
    }

    /**
     * Unregister device token
     */
    public function unregisterDevice(string $token): bool
    {
        $device = DeviceToken::where('token', $token)->first();

        if (! $device) {
            return false;
        }

        $device->deactivate();

        return true;
    }

    // Domain-specific helpers: Subscriptions

    public function notifySubscriptionCreated(Subscription $subscription): void
    {
        $user = $subscription->user;
        $plan = $subscription->plan?->name ?? 'Subscription';
        $nextDate = $subscription->next_delivery_date?->toFormattedDateString();

        $title = 'Subscription Created';
        $message = "Your {$plan} subscription has been created. Next delivery: {$nextDate}.";
        $data = [
            'subscription_id' => $subscription->id,
            'status' => $subscription->status,
            'next_delivery_date' => $subscription->next_delivery_date?->toDateString(),
        ];

        $this->sendPush($user, $title, $message, $data);
        $this->sendInApp($user, $title, $message, $data);
        $this->sendSMS($user, $message, $data);
    }

    public function notifySubscriptionUpdated(Subscription $subscription): void
    {
        $user = $subscription->user;
        $plan = $subscription->plan?->name ?? 'Subscription';
        $title = 'Subscription Updated';
        $message = "Your {$plan} subscription has been updated. Next delivery: ".$subscription->next_delivery_date?->toFormattedDateString();
        $data = [
            'subscription_id' => $subscription->id,
            'status' => $subscription->status,
            'next_delivery_date' => $subscription->next_delivery_date?->toDateString(),
        ];

        $this->sendPush($user, $title, $message, $data);
        $this->sendInApp($user, $title, $message, $data);
        $this->sendSMS($user, $message, $data);
    }

    public function notifySubscriptionPaused(Subscription $subscription): void
    {
        $user = $subscription->user;
        $until = $subscription->paused_until?->toFormattedDateString();
        $title = 'Subscription Paused';
        $message = $until
            ? "Your subscription is paused until {$until}."
            : 'Your subscription has been paused.';
        $data = [
            'subscription_id' => $subscription->id,
            'status' => $subscription->status,
            'paused_until' => $subscription->paused_until?->toDateString(),
        ];

        $this->sendPush($user, $title, $message, $data);
        $this->sendInApp($user, $title, $message, $data);
        $this->sendSMS($user, $message, $data);
    }

    public function notifySubscriptionResumed(Subscription $subscription): void
    {
        $user = $subscription->user;
        $title = 'Subscription Resumed';
        $message = 'Your subscription has been resumed. Next delivery: '.$subscription->next_delivery_date?->toFormattedDateString();
        $data = [
            'subscription_id' => $subscription->id,
            'status' => $subscription->status,
            'next_delivery_date' => $subscription->next_delivery_date?->toDateString(),
        ];

        $this->sendPush($user, $title, $message, $data);
        $this->sendInApp($user, $title, $message, $data);
        $this->sendSMS($user, $message, $data);
    }

    public function notifySubscriptionCancelled(Subscription $subscription): void
    {
        $user = $subscription->user;
        $title = 'Subscription Cancelled';
        $message = 'Your subscription has been cancelled.';
        $data = [
            'subscription_id' => $subscription->id,
            'status' => $subscription->status,
            'cancelled_at' => $subscription->cancelled_at?->toDateTimeString(),
        ];

        $this->sendPush($user, $title, $message, $data);
        $this->sendInApp($user, $title, $message, $data);
        $this->sendSMS($user, $message, $data);
    }

    public function notifySubscriptionVacationSet(Subscription $subscription): void
    {
        $user = $subscription->user;
        $title = 'Vacation Hold Set';
        $message = 'Vacation hold set from '.$subscription->vacation_start?->toFormattedDateString().' to '.$subscription->vacation_end?->toFormattedDateString().'.';
        $data = [
            'subscription_id' => $subscription->id,
            'status' => $subscription->status,
            'vacation_start' => $subscription->vacation_start?->toDateString(),
            'vacation_end' => $subscription->vacation_end?->toDateString(),
        ];

        $this->sendPush($user, $title, $message, $data);
        $this->sendInApp($user, $title, $message, $data);
        $this->sendSMS($user, $message, $data);
    }

    public function notifySubscriptionVacationCleared(Subscription $subscription): void
    {
        $user = $subscription->user;
        $title = 'Vacation Hold Cleared';
        $message = 'Vacation hold has been cleared.';
        $data = [
            'subscription_id' => $subscription->id,
            'status' => $subscription->status,
        ];

        $this->sendPush($user, $title, $message, $data);
        $this->sendInApp($user, $title, $message, $data);
        $this->sendSMS($user, $message, $data);
    }

    // Domain-specific helpers: Deliveries

    public function notifyDeliveryAssigned(Delivery $delivery): void
    {
        $user = $delivery->user;
        $driver = $delivery->driver;
        $title = 'Delivery Assigned';
        $message = 'Your order '.$delivery->order?->order_number.' is assigned. Scheduled: '.$delivery->scheduled_date?->toFormattedDateString().($delivery->scheduled_time ? ' '.$delivery->scheduled_time : '').'. Driver: '.($driver?->name ?? 'TBD').'.';
        $data = [
            'delivery_id' => $delivery->id,
            'order_id' => $delivery->order_id,
            'status' => $delivery->status,
            'scheduled_date' => $delivery->scheduled_date?->toDateString(),
            'scheduled_time' => $delivery->scheduled_time,
            'driver' => $driver ? ['name' => $driver->name, 'phone' => $driver->phone] : null,
        ];

        $this->sendPush($user, $title, $message, $data);
        $this->sendInApp($user, $title, $message, $data);
        $this->sendSMS($user, $message, $data);
    }

    public function notifyDeliveryOutForDelivery(Delivery $delivery): void
    {
        $user = $delivery->user;
        $driver = $delivery->driver;
        $title = 'Out for Delivery';
        $message = 'Your order '.$delivery->order?->order_number.' is out for delivery. Driver: '.($driver?->name ?? 'TBD').', Phone: '.($driver?->phone ?? 'N/A').'.';
        $data = [
            'delivery_id' => $delivery->id,
            'order_id' => $delivery->order_id,
            'status' => $delivery->status,
            'driver' => $driver ? ['name' => $driver->name, 'phone' => $driver->phone] : null,
        ];

        $this->sendPush($user, $title, $message, $data);
        $this->sendInApp($user, $title, $message, $data);
        $this->sendSMS($user, $message, $data);
    }

    public function notifyDeliveryDelivered(Delivery $delivery): void
    {
        $user = $delivery->user;
        $title = 'Delivered';
        $message = 'Your order '.$delivery->order?->order_number.' has been delivered.';
        $data = [
            'delivery_id' => $delivery->id,
            'order_id' => $delivery->order_id,
            'status' => $delivery->status,
            'delivered_at' => $delivery->delivered_at?->toDateTimeString(),
        ];

        $this->sendPush($user, $title, $message, $data);
        $this->sendInApp($user, $title, $message, $data);
        $this->sendSMS($user, $message, $data);
    }

    public function notifyDeliveryFailed(Delivery $delivery): void
    {
        $user = $delivery->user;
        $title = 'Delivery Failed';
        $message = 'Delivery failed for order '.$delivery->order?->order_number.'. We will contact you for assistance.';
        $data = [
            'delivery_id' => $delivery->id,
            'order_id' => $delivery->order_id,
            'status' => $delivery->status,
            'failure_reason' => $delivery->failure_reason,
        ];

        $this->sendPush($user, $title, $message, $data);
        $this->sendInApp($user, $title, $message, $data);
        $this->sendSMS($user, $message, $data);
    }

    // Channel-specific send methods

    protected function sendViaSMS(Notification $notification): bool
    {
        // Mock implementation - integrate with actual SMS gateway
        Log::info('SMS notification sent (mock)', [
            'user_id' => $notification->user_id,
            'message' => $notification->message,
        ]);

        return true;
    }

    protected function sendViaWhatsApp(Notification $notification): bool
    {
        // Mock implementation - integrate with WhatsApp Business API
        Log::info('WhatsApp notification sent (mock)', [
            'user_id' => $notification->user_id,
            'message' => $notification->message,
        ]);

        return true;
    }

    protected function sendViaPush(Notification $notification): bool
    {
        if (! $notification->user_id) {
            return false;
        }

        $tokens = DeviceToken::forUser($notification->user_id)
            ->active()
            ->pluck('token')
            ->toArray();

        if (empty($tokens)) {
            return false;
        }

        // Mock implementation - integrate with FCM
        Log::info('Push notification sent (mock)', [
            'user_id' => $notification->user_id,
            'title' => $notification->title,
            'message' => $notification->message,
            'tokens' => count($tokens),
        ]);

        return true;
    }

    protected function sendViaEmail(Notification $notification): bool
    {
        if (! $notification->user?->email) {
            return false;
        }

        try {
            Mail::raw($notification->message, function ($mail) use ($notification) {
                $mail->to($notification->user->email)
                    ->subject($notification->title ?? 'Notification');
            });

            return true;
        } catch (\Exception $e) {
            Log::error('Email send failed', [
                'notification_id' => $notification->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    protected function sendViaDatabase(Notification $notification): bool
    {
        // Already saved in database, just mark as sent
        return true;
    }
}
