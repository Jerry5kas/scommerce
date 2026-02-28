<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckServiceabilityRequest;
use App\Http\Requests\SetLocationRequest;
use App\Models\UserAddress;
use App\Services\LocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ZoneController extends Controller
{
    public function __construct(
        private LocationService $locationService
    ) {}

    public function index(): Response
    {
        $zones = $this->locationService->getServiceableZones()->map(function ($zone) {
            return [
                'id' => $zone->id,
                'name' => $zone->name,
                'code' => $zone->code,
                'city' => $zone->city,
                'state' => $zone->state,
                'delivery_charge' => $zone->delivery_charge,
                'min_order_amount' => $zone->min_order_amount,
            ];
        });

        return Inertia::render('location/select', [
            'zones' => $zones,
        ]);
    }

    public function checkServiceability(CheckServiceabilityRequest $request): JsonResponse
    {
        $pincode = $request->validated('pincode');
        $lat = $request->validated('latitude');
        $lng = $request->validated('longitude');

        if ($pincode !== null && $pincode !== '') {
            $address = [
                'pincode' => $pincode,
                'latitude' => $lat,
                'longitude' => $lng,
            ];
            $zone = $this->locationService->validateAddress($address);
        } elseif ($lat !== null && $lng !== null) {
            $zone = $this->locationService->findZoneByCoordinates((float) $lat, (float) $lng);
            if ($zone !== null && ! $zone->isServiceableAtTime()) {
                $zone = null;
            }
        } else {
            $zone = null;
        }

        return response()->json([
            'serviceable' => $zone !== null,
            'zone' => $zone?->only(['id', 'name', 'code', 'city', 'state', 'delivery_charge', 'min_order_amount']),
        ]);
    }

    public function getZoneByPincode(string $pincode): JsonResponse
    {
        $zone = $this->locationService->findZoneByPincode($pincode);

        return response()->json([
            'zone' => $zone?->only(['id', 'name', 'code', 'city', 'state', 'delivery_charge', 'min_order_amount']),
        ]);
    }

    public function setLocation(SetLocationRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $user = $request->user();

        $zone = $this->locationService->findZoneByCoordinates((float) $data['latitude'], (float) $data['longitude']);
        if ($zone !== null && ! $zone->isServiceableAtTime()) {
            $zone = null;
        }

        if ($zone === null) {
            $zone = $this->locationService->validateAddress([
                'pincode' => $data['pincode'],
            ], $user?->id);
        }

        if ($zone === null) {
            return back()->withErrors([
                'location' => 'Selected location is outside our delivery zones.',
            ]);
        }

        if ($user) {
            $user->addresses()->update(['is_default' => false]);

            $defaultAddress = $user->addresses()
                ->active()
                ->latest('id')
                ->first();

            $addressData = [
                'type' => $data['type'] ?? UserAddress::TYPE_HOME,
                'label' => $data['label'] ?? 'Selected location',
                'address_line_1' => $data['address_line_1'],
                'address_line_2' => $data['address_line_2'] ?? null,
                'landmark' => $data['landmark'] ?? null,
                'city' => $data['city'],
                'state' => $data['state'],
                'pincode' => $data['pincode'],
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
                'zone_id' => $zone->id,
                'is_default' => true,
                'is_active' => true,
            ];

            if ($defaultAddress !== null) {
                $defaultAddress->update($addressData);
            } else {
                $user->addresses()->create($addressData);
            }
        } else {
            // Guest user logic: store in session
            session([
                'guest_zone_id' => $zone->id,
                'guest_address' => [
                    'address_line_1' => $data['address_line_1'],
                    'city' => $data['city'],
                    'state' => $data['state'],
                    'pincode' => $data['pincode'],
                    'latitude' => $data['latitude'],
                    'longitude' => $data['longitude'],
                ],
            ]);
        }

        if ((bool) ($data['from_navbar'] ?? false)) {
            return back()->with('message', 'Delivery location updated.');
        }

        return redirect()->route('catalog.home')->with('message', 'Delivery location updated.');
    }
}
