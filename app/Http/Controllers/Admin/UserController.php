<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateUserAddressRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use App\Models\UserAddress;
use App\Services\ActivityLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $role = $request->query('role');
        $query = User::query()
            ->whereIn('role', [User::ROLE_CUSTOMER, User::ROLE_DRIVER])
            ->withCount('addresses')
            ->orderByDesc('created_at');

        if (in_array($role, [User::ROLE_CUSTOMER, User::ROLE_DRIVER], true)) {
            $query->where('role', $role);
        }

        $users = $query->get();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filterRole' => $role,
        ]);
    }

    public function show(User $user): Response
    {
        $user->load(['addresses' => fn ($q) => $q->orderByDesc('is_default')->orderBy('created_at')]);

        return Inertia::render('admin/users/show', [
            'user' => $user,
        ]);
    }

    public function edit(User $user): Response
    {
        $user->load(['addresses' => fn ($q) => $q->orderByDesc('is_default')->orderBy('created_at')]);
        $zones = \App\Models\Zone::query()->active()->orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('admin/users/edit', [
            'user' => $user,
            'zones' => $zones,
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = collect($request->validated())->except(['password'])->filter()->all();
        if ($request->filled('password')) {
            $data['password'] = $request->input('password');
        }
        $user->update($data);

        return redirect()->route('admin.users.show', $user)->with('message', 'User updated.');
    }

    public function updateAddress(UpdateUserAddressRequest $request, User $user, UserAddress $address): RedirectResponse
    {
        if ($address->user_id !== $user->id) {
            abort(404);
        }
        $address->update($request->validated());
        $address->autoAssignZone();

        return redirect()->back()->with('message', 'Address updated.');
    }

    public function block(User $user, ActivityLogService $activityLogService): RedirectResponse
    {
        $user->update(['is_active' => false]);
        $activityLogService->log(
            'user.blocked',
            $user,
            $user,
            null,
            'User blocked by admin',
            ['is_active' => false]
        );
        return redirect()->back()->with('message', 'User blocked.');
    }

    public function unblock(User $user, ActivityLogService $activityLogService): RedirectResponse
    {
        $user->update(['is_active' => true]);
        $activityLogService->log(
            'user.unblocked',
            $user,
            $user,
            null,
            'User unblocked by admin',
            ['is_active' => true]
        );
        return redirect()->back()->with('message', 'User unblocked.');
    }

    public function export(Request $request): StreamedResponse
    {
        $role = $request->query('role');
        $query = User::query()->whereIn('role', [User::ROLE_CUSTOMER, User::ROLE_DRIVER]);
        if (in_array($role, [User::ROLE_CUSTOMER, User::ROLE_DRIVER], true)) {
            $query->where('role', $role);
        }

        $filename = 'users_export_' . now()->format('Ymd_His') . '.csv';
        return response()->streamDownload(function () use ($query) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['id', 'name', 'phone', 'email', 'role', 'is_active', 'created_at']);
            $query->orderBy('id')->chunk(500, function ($chunk) use ($handle) {
                foreach ($chunk as $u) {
                    fputcsv($handle, [
                        $u->id,
                        $u->name,
                        $u->phone,
                        $u->email,
                        $u->role,
                        $u->is_active ? 1 : 0,
                        $u->created_at?->toDateTimeString(),
                    ]);
                }
            });
            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
