<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\FreeSampleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FreeSampleController extends Controller
{
    public function __construct(
        private FreeSampleService $freeSampleService
    ) {}

    /**
     * Claim a free sample
     */
    public function claim(Request $request, Product $product): JsonResponse
    {
        $user = $request->user();
        $phone = $request->string('phone')->toString();
        $deviceFingerprint = $request->string('device_fingerprint')->toString();

        try {
            $sample = $this->freeSampleService->claimSample($user, $product, $phone, $deviceFingerprint);

            return response()->json([
                'success' => true,
                'message' => 'Free sample claimed successfully.',
                'sample' => $sample,
            ]);
        } catch (\RuntimeException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Check eligibility for free sample
     */
    public function checkEligibility(Request $request, Product $product): JsonResponse
    {
        $user = $request->user();
        $phone = $request->string('phone')->toString();
        $deviceFingerprint = $request->string('device_fingerprint')->toString();

        $isEligible = $this->freeSampleService->checkEligibility($user, $product, $phone, $deviceFingerprint);

        return response()->json([
            'eligible' => $isEligible,
        ]);
    }
}
