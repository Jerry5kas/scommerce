<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserAddressRequest;
use App\Http\Requests\UpdateUserAddressRequest;
use App\Models\UserAddress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserAddressController extends Controller
{
    public function forLocation(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user === null) {
            return response()->json([
                'can_manage' => false,
                'addresses' => [],
            ]);
        }

        $addresses = $user
            ->addresses()
            ->active()
            ->orderByDesc('is_default')
            ->orderByDesc('id')
            ->get()
            ->map(fn (UserAddress $address) => [
                'id' => $address->id,
                'type' => $address->type,
                'label' => $address->label,
                'address_line_1' => $address->address_line_1,
                'address_line_2' => $address->address_line_2,
                'landmark' => $address->landmark,
                'city' => $address->city,
                'state' => $address->state,
                'pincode' => $address->pincode,
                'latitude' => $address->latitude,
                'longitude' => $address->longitude,
                'is_default' => (bool) $address->is_default,
            ])
            ->values();

        return response()->json([
            'can_manage' => true,
            'addresses' => $addresses,
        ]);
    }

    public function index(Request $request): Response
    {
        $addresses = $request->user()
            ->addresses()
            ->active()
            ->orderByDesc('is_default')
            ->orderBy('created_at')
            ->get();

        return Inertia::render('profile/addresses', [
            'addresses' => $addresses,
        ]);
    }

    public function store(StoreUserAddressRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();
        if (! empty($data['is_default'])) {
            $user->addresses()->update(['is_default' => false]);
        }
        $address = $user->addresses()->create(array_merge($data, ['is_active' => true]));
        $address->autoAssignZone();

        return $this->redirectAfterMutation($request, 'Address added.');
    }

    public function update(UpdateUserAddressRequest $request, UserAddress $address): RedirectResponse
    {
        $data = $request->validated();
        if (! empty($data['is_default'])) {
            $request->user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }
        $address->update($data);
        $address->autoAssignZone();

        return $this->redirectAfterMutation($request, 'Address updated.');
    }

    public function destroy(Request $request, UserAddress $address): RedirectResponse
    {
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }
        $address->update(['is_active' => false]);

        return $this->redirectAfterMutation($request, 'Address removed.');
    }

    public function setDefault(Request $request, UserAddress $address): RedirectResponse
    {
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }
        $request->user()->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);
        $address->autoAssignZone();

        return $this->redirectAfterMutation($request, 'Default address updated.');
    }

    private function redirectAfterMutation(Request $request, string $message): RedirectResponse
    {
        if ($request->boolean('from_location')) {
            return back()->with('message', $message);
        }

        return redirect()->route('profile.addresses')->with('message', $message);
    }
}
