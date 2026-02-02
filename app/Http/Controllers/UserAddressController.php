<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserAddressRequest;
use App\Http\Requests\UpdateUserAddressRequest;
use App\Models\UserAddress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserAddressController extends Controller
{
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

        return redirect()->route('profile.addresses')->with('message', 'Address added.');
    }

    public function update(UpdateUserAddressRequest $request, UserAddress $address): RedirectResponse
    {
        $data = $request->validated();
        if (! empty($data['is_default'])) {
            $request->user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }
        $address->update($data);
        $address->autoAssignZone();

        return redirect()->route('profile.addresses')->with('message', 'Address updated.');
    }

    public function destroy(Request $request, UserAddress $address): RedirectResponse
    {
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }
        $address->update(['is_active' => false]);

        return redirect()->route('profile.addresses')->with('message', 'Address removed.');
    }

    public function setDefault(Request $request, UserAddress $address): RedirectResponse
    {
        if ($address->user_id !== $request->user()->id) {
            abort(403);
        }
        $request->user()->addresses()->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return redirect()->route('profile.addresses')->with('message', 'Default address updated.');
    }
}
