<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckServiceabilityRequest;
use App\Services\LocationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ZoneController extends Controller
{
    public function __construct(
        private LocationService $locationService
    ) {}

    public function index(): Response
    {
        $zones = $this->locationService->getServiceableZones();

        return Inertia::render('location/select', [
            'zones' => $zones,
        ]);
    }

    public function checkServiceability(CheckServiceabilityRequest $request): JsonResponse
    {
        $pincode = $request->validated('pincode');
        $lat = $request->validated('latitude');
        $lng = $request->validated('longitude');

        $address = [
            'pincode' => $pincode,
            'latitude' => $lat,
            'longitude' => $lng,
        ];
        $zone = $this->locationService->validateAddress($address);

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
}
