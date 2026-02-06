<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CampaignController extends Controller
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    /**
     * Display campaigns list.
     */
    public function index(Request $request): Response
    {
        $query = Campaign::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $campaigns = $query->orderByDesc('created_at')->paginate(20)->withQueryString();

        $stats = [
            'total' => Campaign::count(),
            'draft' => Campaign::draft()->count(),
            'scheduled' => Campaign::scheduled()->count(),
            'completed' => Campaign::completed()->count(),
        ];

        return Inertia::render('admin/campaigns/index', [
            'campaigns' => $campaigns,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'type']),
            'typeOptions' => Campaign::typeOptions(),
            'statusOptions' => Campaign::statusOptions(),
        ]);
    }

    /**
     * Show create campaign form.
     */
    public function create(): Response
    {
        return Inertia::render('admin/campaigns/create', [
            'typeOptions' => Campaign::typeOptions(),
            'channelOptions' => Campaign::channelOptions(),
        ]);
    }

    /**
     * Store new campaign.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:wallet_reminder,subscription_renewal,offer,promotional,transactional'],
            'channel' => ['required', 'in:sms,whatsapp,push,email,all'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message_template' => ['required', 'string', 'max:2000'],
            'target_audience' => ['nullable', 'array'],
            'scheduled_at' => ['nullable', 'date', 'after:now'],
        ]);

        $validated['status'] = $validated['scheduled_at'] ? Campaign::STATUS_SCHEDULED : Campaign::STATUS_DRAFT;
        $validated['created_by'] = auth()->id();

        Campaign::create($validated);

        return redirect()->route('admin.campaigns.index')
            ->with('success', 'Campaign created successfully.');
    }

    /**
     * Display campaign details.
     */
    public function show(Campaign $campaign): Response
    {
        return Inertia::render('admin/campaigns/show', [
            'campaign' => $campaign->load('creator'),
            'typeOptions' => Campaign::typeOptions(),
            'channelOptions' => Campaign::channelOptions(),
            'statusOptions' => Campaign::statusOptions(),
        ]);
    }

    /**
     * Show edit campaign form.
     */
    public function edit(Campaign $campaign): Response
    {
        if (! in_array($campaign->status, [Campaign::STATUS_DRAFT, Campaign::STATUS_SCHEDULED])) {
            return redirect()->route('admin.campaigns.show', $campaign)
                ->with('error', 'Cannot edit a campaign that has already been sent.');
        }

        return Inertia::render('admin/campaigns/edit', [
            'campaign' => $campaign,
            'typeOptions' => Campaign::typeOptions(),
            'channelOptions' => Campaign::channelOptions(),
        ]);
    }

    /**
     * Update campaign.
     */
    public function update(Request $request, Campaign $campaign): RedirectResponse
    {
        if (! in_array($campaign->status, [Campaign::STATUS_DRAFT, Campaign::STATUS_SCHEDULED])) {
            return back()->withErrors(['error' => 'Cannot edit a campaign that has already been sent.']);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:wallet_reminder,subscription_renewal,offer,promotional,transactional'],
            'channel' => ['required', 'in:sms,whatsapp,push,email,all'],
            'subject' => ['nullable', 'string', 'max:255'],
            'message_template' => ['required', 'string', 'max:2000'],
            'target_audience' => ['nullable', 'array'],
            'scheduled_at' => ['nullable', 'date', 'after:now'],
        ]);

        if ($validated['scheduled_at']) {
            $validated['status'] = Campaign::STATUS_SCHEDULED;
        }

        $campaign->update($validated);

        return redirect()->route('admin.campaigns.index')
            ->with('success', 'Campaign updated successfully.');
    }

    /**
     * Delete campaign.
     */
    public function destroy(Campaign $campaign): RedirectResponse
    {
        if ($campaign->status === Campaign::STATUS_SENDING) {
            return back()->withErrors(['error' => 'Cannot delete a campaign that is currently sending.']);
        }

        $campaign->delete();

        return redirect()->route('admin.campaigns.index')
            ->with('success', 'Campaign deleted successfully.');
    }

    /**
     * Send campaign immediately.
     */
    public function send(Campaign $campaign): RedirectResponse
    {
        if (! $campaign->canSend()) {
            return back()->withErrors(['error' => 'This campaign cannot be sent.']);
        }

        // Get target users based on audience filters
        $query = User::active();

        if ($campaign->target_audience) {
            // Apply audience filters
            if (isset($campaign->target_audience['zone_ids'])) {
                $query->whereHas('addresses', fn ($q) => $q->whereIn('zone_id', $campaign->target_audience['zone_ids']));
            }
            if (isset($campaign->target_audience['has_subscription'])) {
                $query->whereHas('subscriptions');
            }
            if (isset($campaign->target_audience['has_wallet'])) {
                $query->whereHas('wallet');
            }
        }

        $users = $query->pluck('id')->toArray();

        $campaign->update([
            'status' => Campaign::STATUS_SENDING,
            'total_recipients' => count($users),
        ]);

        // Send to all users
        $sent = $this->notificationService->broadcast(
            $users,
            $campaign->channel === 'all' ? 'in_app' : $campaign->channel,
            $campaign->subject ?? $campaign->name,
            $campaign->message_template,
            ['campaign_id' => $campaign->id]
        );

        $campaign->update([
            'sent_count' => $sent,
            'failed_count' => count($users) - $sent,
            'status' => Campaign::STATUS_COMPLETED,
            'sent_at' => now(),
        ]);

        return back()->with('success', "Campaign sent to {$sent} users.");
    }

    /**
     * Cancel scheduled campaign.
     */
    public function cancel(Campaign $campaign): RedirectResponse
    {
        if (! $campaign->canCancel()) {
            return back()->withErrors(['error' => 'This campaign cannot be cancelled.']);
        }

        $campaign->markAsCancelled();

        return back()->with('success', 'Campaign cancelled.');
    }
}
