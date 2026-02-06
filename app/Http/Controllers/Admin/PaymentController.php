<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\RefundService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(
        private RefundService $refundService
    ) {}

    /**
     * List all payments with filters
     */
    public function index(Request $request): Response
    {
        $query = Payment::query()
            ->with(['order', 'user']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        // Filter by method
        if ($request->filled('method')) {
            $query->where('method', $request->string('method'));
        }

        // Filter by gateway
        if ($request->filled('gateway')) {
            $query->where('gateway', $request->string('gateway'));
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date('date_to'));
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('payment_id', 'like', "%{$search}%")
                    ->orWhereHas('order', fn ($oq) => $oq->where('order_number', 'like', "%{$search}%"))
                    ->orWhereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$search}%")->orWhere('phone', 'like', "%{$search}%"));
            });
        }

        $payments = $query->orderByDesc('created_at')->paginate(20);

        return Inertia::render('admin/payments/index', [
            'payments' => $payments,
            'statusOptions' => Payment::statusOptions(),
            'methodOptions' => Payment::methodOptions(),
            'filters' => $request->only(['status', 'method', 'gateway', 'date_from', 'date_to', 'search']),
        ]);
    }

    /**
     * Show payment details
     */
    public function show(Payment $payment): Response
    {
        $payment->load(['order.items', 'user']);

        $refundSummary = $this->refundService->getRefundSummary($payment->order);

        return Inertia::render('admin/payments/show', [
            'payment' => $payment,
            'refundSummary' => $refundSummary,
            'canRefund' => $payment->canRefund(),
            'statusOptions' => Payment::statusOptions(),
        ]);
    }

    /**
     * Process refund
     */
    public function refund(Request $request, Payment $payment): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:1', 'max:'.$payment->getRemainingRefundableAmount()],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        if (! $payment->canRefund()) {
            return back()->with('error', 'This payment cannot be refunded.');
        }

        $result = $this->refundService->processRefund(
            $payment->order,
            $validated['amount'],
            $validated['reason']
        );

        if (! $result['success']) {
            return back()->with('error', $result['error']);
        }

        return back()->with('success', "₹{$result['refunded_amount']} refunded successfully via {$result['method']}.");
    }

    /**
     * Retry failed payment
     */
    public function retry(Payment $payment): RedirectResponse
    {
        if ($payment->status !== Payment::STATUS_FAILED) {
            return back()->with('error', 'Only failed payments can be retried.');
        }

        // Reset payment status to pending
        $payment->update([
            'status' => Payment::STATUS_PENDING,
            'failure_reason' => null,
        ]);

        return back()->with('success', 'Payment marked for retry.');
    }

    /**
     * Mark COD as collected
     */
    public function markCollected(Payment $payment): RedirectResponse
    {
        if ($payment->method !== Payment::METHOD_COD) {
            return back()->with('error', 'This is not a COD payment.');
        }

        if ($payment->status === Payment::STATUS_COMPLETED) {
            return back()->with('error', 'Payment already marked as collected.');
        }

        $payment->update([
            'status' => Payment::STATUS_COMPLETED,
            'paid_at' => now(),
        ]);

        $payment->order->update([
            'payment_status' => 'paid',
        ]);

        return back()->with('success', 'COD payment marked as collected.');
    }
}
