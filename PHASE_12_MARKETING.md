# Phase 12: Marketing & Notifications

## Objective
Implement multi-channel notification system (SMS, WhatsApp, Push, Email) with automated campaign triggers and banner management.

## Prerequisites
- Phase 2 completed (Authentication)
- Phase 5 completed (Subscriptions)
- Phase 7 completed (Wallet)
- User communication consent is tracked

## Tasks

### 12.1 Notification System
- [ ] Create `notifications` table migration
  - [ ] `id` (primary key)
  - [ ] `user_id` (foreign key, nullable, indexed) - Nullable for broadcast
  - [ ] `type` (enum: 'sms', 'whatsapp', 'push', 'email', 'in_app')
  - [ ] `channel` (string) - Channel identifier
  - [ ] `title` (string, nullable)
  - [ ] `message` (text)
  - [ ] `data` (json, nullable) - Additional data
  - [ ] `status` (enum: 'pending', 'sent', 'failed', 'delivered', 'read')
  - [ ] `scheduled_at` (timestamp, nullable)
  - [ ] `sent_at` (timestamp, nullable)
  - [ ] `delivered_at` (timestamp, nullable)
  - [ ] `read_at` (timestamp, nullable)
  - [ ] `failure_reason` (text, nullable)
  - [ ] `retry_count` (integer, default: 0)
  - [ ] `timestamps`
- [ ] Create `Notification` model
  - [ ] Relationships (user)
  - [ ] Scopes (pending, sent, failed, byType, byChannel)
  - [ ] Helper methods (markAsSent, markAsDelivered, markAsRead)

### 12.2 Notification Channels
- [ ] Set up SMS gateway (Twilio, MSG91, etc.)
- [ ] Set up WhatsApp Business API (Twilio, etc.)
- [ ] Set up Firebase Cloud Messaging (FCM) for push
- [ ] Configure email service (SMTP or service like SendGrid)
- [ ] Create channel configuration in `.env`

### 12.3 Notification Service
- [ ] Create `NotificationService` class
  - [ ] `send(notification)` - Send notification
  - [ ] `sendSMS(user, message, data)` - Send SMS
  - [ ] `sendWhatsApp(user, message, data)` - Send WhatsApp
  - [ ] `sendPush(user, title, message, data)` - Send push notification
  - [ ] `sendEmail(user, subject, message, data)` - Send email
  - [ ] `sendInApp(user, title, message, data)` - Send in-app notification
  - [ ] `broadcast(users, notification)` - Broadcast to multiple users
  - [ ] `schedule(notification, scheduledAt)` - Schedule notification
  - [ ] `retryFailed(notification)` - Retry failed notification

### 12.4 SMS Service
- [ ] Create `SMSService` class
  - [ ] `send(phone, message)` - Send SMS
  - [ ] `sendOTP(phone, otp)` - Send OTP (Phase 2 integration)
  - [ ] `sendAlert(phone, message)` - Send alert
  - [ ] `validatePhone(phone)` - Validate phone number
- [ ] Integrate with SMS gateway
- [ ] Handle SMS delivery status

### 12.5 WhatsApp Service
- [ ] Create `WhatsAppService` class
  - [ ] `send(phone, message)` - Send WhatsApp message
  - [ ] `sendTemplate(phone, template, params)` - Send template message
  - [ ] `sendWalletReminder(phone, balance)` - Wallet reminder
  - [ ] `sendDeliveryUpdate(phone, order)` - Delivery update
- [ ] Integrate with WhatsApp Business API
- [ ] Use approved templates

### 12.6 Push Notification Service
- [ ] Create `PushNotificationService` class
  - [ ] `send(user, title, message, data)` - Send push
  - [ ] `sendToDevice(deviceToken, title, message, data)` - Send to device
  - [ ] `sendToTopic(topic, title, message, data)` - Send to topic
  - [ ] `registerDevice(user, deviceToken)` - Register device
  - [ ] `unregisterDevice(deviceToken)` - Unregister device
- [ ] Integrate with FCM
- [ ] Handle device tokens

### 12.7 Email Service
- [ ] Create `EmailService` class
  - [ ] `send(user, subject, template, data)` - Send email
  - [ ] `sendWelcome(user)` - Welcome email
  - [ ] `sendOrderConfirmation(user, order)` - Order confirmation
  - [ ] `sendDeliveryUpdate(user, delivery)` - Delivery update
- [ ] Create email templates (Blade)
- [ ] Configure email service

### 12.8 Campaign Management
- [ ] Create `campaigns` table migration
  - [ ] `id` (primary key)
  - [ ] `name` (string)
  - [ ] `type` (enum: 'wallet_reminder', 'subscription_renewal', 'offer', 'promotional', 'transactional')
  - [ ] `channel` (enum: 'sms', 'whatsapp', 'push', 'email', 'all')
  - [ ] `message_template` (text)
  - [ ] `target_audience` (json, nullable) - User filters
  - [ ] `scheduled_at` (timestamp, nullable)
  - [ ] `sent_at` (timestamp, nullable)
  - [ ] `status` (enum: 'draft', 'scheduled', 'sending', 'completed', 'cancelled')
  - [ ] `total_recipients` (integer, default: 0)
  - [ ] `sent_count` (integer, default: 0)
  - [ ] `failed_count` (integer, default: 0)
  - [ ] `created_by` (foreign key, nullable)
  - [ ] `timestamps`
- [ ] Create `Campaign` model
  - [ ] Relationships (creator, notifications)
  - [ ] Scopes (draft, scheduled, active, completed)

### 12.9 Automated Campaign Triggers
- [ ] Create `CampaignTriggerService` class
  - [ ] `triggerWalletReminder(user)` - Low wallet balance
  - [ ] `triggerSubscriptionRenewal(user, subscription)` - Subscription renewal
  - [ ] `triggerDeliveryUpdate(user, delivery)` - Delivery status change
  - [ ] `triggerOrderConfirmation(user, order)` - Order placed
  - [ ] `triggerFreeSamplePrompt(user)` - Free sample available
  - [ ] `triggerAbandonedCart(user, cart)` - Abandoned cart (optional)
- [ ] Create event listeners for triggers
- [ ] Integrate with Laravel events

### 12.10 Banner Management
- [ ] Create `banners` table migration
  - [ ] `id` (primary key)
  - [ ] `name` (string)
  - [ ] `type` (enum: 'home', 'category', 'product', 'promotional')
  - [ ] `title` (string, nullable)
  - [ ] `description` (text, nullable)
  - [ ] `image` (string) - Banner image URL
  - [ ] `mobile_image` (string, nullable)
  - [ ] `link_url` (string, nullable)
  - [ ] `link_type` (enum: 'product', 'category', 'collection', 'external', 'none')
  - [ ] `link_id` (string, nullable) - Product/category/collection ID
  - [ ] `display_order` (integer, default: 0)
  - [ ] `is_active` (boolean, default: true)
  - [ ] `starts_at` (timestamp, nullable)
  - [ ] `ends_at` (timestamp, nullable)
  - [ ] `zones` (json, nullable) - Zone IDs (null = all zones)
  - [ ] `timestamps`
- [ ] Create `Banner` model
  - [ ] Relationships (zones - many-to-many if needed)
  - [ ] Scopes (active, current, byType, byZone)

### 12.11 Notification Controllers
- [ ] Create `NotificationController` (customer)
  - [ ] `index()` - List user's notifications
  - [ ] `markAsRead(notification)` - Mark as read
  - [ ] `markAllAsRead()` - Mark all as read
  - [ ] `getUnreadCount()` - Get unread count
- [ ] Create `Admin/NotificationController`
  - [ ] `index()` - List all notifications
  - [ ] `show(notification)` - Show notification details
  - [ ] `retry(notification)` - Retry failed notification
  - [ ] `getStats()` - Get notification statistics

### 12.12 Campaign Controllers (Admin)
- [ ] Create `Admin/CampaignController`
  - [ ] `index()` - List campaigns
  - [ ] `show(campaign)` - Show campaign details
  - [ ] `store(Request)` - Create campaign
  - [ ] `update(Request, campaign)` - Update campaign
  - [ ] `destroy(campaign)` - Delete campaign
  - [ ] `send(campaign)` - Send campaign
  - [ ] `getStats(campaign)` - Get campaign statistics
- [ ] Create Form Requests:
  - [ ] `StoreCampaignRequest`
  - [ ] `UpdateCampaignRequest`

### 12.13 Banner Controllers
- [ ] Create `BannerController` (customer)
  - [ ] `index(Request)` - Get active banners (filtered by zone)
- [ ] Create `Admin/BannerController`
  - [ ] `index()` - List banners
  - [ ] `store(Request)` - Create banner
  - [ ] `update(Request, banner)` - Update banner
  - [ ] `destroy(banner)` - Delete banner
  - [ ] `toggleStatus(banner)` - Toggle active status
- [ ] Create Form Requests for banner management

### 12.14 Notification Jobs
- [ ] Create `SendNotification` job
  - [ ] Handle notification sending
  - [ ] Retry on failure
  - [ ] Update status
- [ ] Create `ProcessScheduledNotifications` job
  - [ ] Run periodically
  - [ ] Send scheduled notifications
- [ ] Create `SendCampaign` job
  - [ ] Send campaign to recipients
  - [ ] Update campaign status

### 12.15 Frontend Notification UI
- [ ] Create notification bell icon (with unread count)
- [ ] Create notification dropdown/list
  - [ ] List of notifications
  - [ ] Mark as read functionality
  - [ ] Notification types (badges)
- [ ] Create notification settings page
  - [ ] Channel preferences
  - [ ] Notification types preferences
  - [ ] Communication consent

### 12.16 Admin Marketing UI
- [ ] Create campaign management page (admin)
  - [ ] Campaign list
  - [ ] Create/edit campaign form
  - [ ] Target audience selection
  - [ ] Message template editor
  - [ ] Schedule interface
  - [ ] Send/preview buttons
- [ ] Create banner management page (admin)
  - [ ] Banner list
  - [ ] Create/edit banner form
  - [ ] Image upload
  - [ ] Link configuration
  - [ ] Zone selection
  - [ ] Date range picker
- [ ] Create notification management page (admin)
  - [ ] Notification list
  - [ ] Filters and search
  - [ ] Retry failed notifications
  - [ ] Statistics dashboard

### 12.17 Database Seeders
- [ ] Create `BannerSeeder` (test banners)
- [ ] Create `CampaignSeeder` (test campaigns)
- [ ] Create test notifications

### 12.18 Testing
- [ ] Test SMS sending
- [ ] Test WhatsApp sending
- [ ] Test push notifications
- [ ] Test email sending
- [ ] Test campaign creation and sending
- [ ] Test banner management
- [ ] Test notification delivery status
- [ ] Test automated triggers
- [ ] Feature tests for notification flow

## Deliverables
- ✅ Multi-channel notification system
- ✅ SMS integration
- ✅ WhatsApp integration
- ✅ Push notification integration
- ✅ Email integration
- ✅ Campaign management
- ✅ Automated triggers
- ✅ Banner management
- ✅ Customer notification UI
- ✅ Admin marketing UI

## Success Criteria
- [ ] Notifications are sent via all channels
- [ ] Campaigns can be created and sent
- [ ] Automated triggers work correctly
- [ ] Banners are displayed correctly
- [ ] Notification delivery status is tracked
- [ ] Failed notifications are retried
- [ ] Communication consent is respected

## Database Tables Created
- `notifications`
- `campaigns`
- `banners`
- `device_tokens` (for push notifications)

## Notes
- Respect user communication consent
- Handle notification failures gracefully
- Implement retry mechanism for failed notifications
- Use approved WhatsApp templates
- Push notifications require device token registration
- Campaigns should respect user preferences
- Banners should be zone-filtered
- Consider notification rate limiting

## Next Phase
Once Phase 12 is complete, proceed to **Phase 13: Analytics & Tracking**

