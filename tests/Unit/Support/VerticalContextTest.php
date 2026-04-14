<?php

namespace Tests\Unit\Support;

use App\Enums\BusinessVertical;
use App\Models\Zone;
use App\Support\VerticalContext;
use Illuminate\Http\Request;
use Illuminate\Session\ArraySessionHandler;
use Illuminate\Session\Store;
use Tests\TestCase;

class VerticalContextTest extends TestCase
{
    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private function makeRequest(string $vertical = '', array $sessionData = []): Request
    {
        $session = new Store('test', new ArraySessionHandler(10));
        foreach ($sessionData as $key => $value) {
            $session->put($key, $value);
        }

        $query = $vertical !== '' ? ['vertical' => $vertical] : [];
        $request = Request::create('/', 'GET', $query);
        $request->setLaravelSession($session);

        return $request;
    }

    private function makeZone(array $verticals): Zone
    {
        $zone = new Zone;
        $zone->verticals = $verticals;

        return $zone;
    }

    // =========================================================================
    // Property 1: Bug Condition — Zone-Constrained Vertical Resolution
    // These tests FAIL on unfixed code (confirms the bug exists).
    // =========================================================================

    public function test_society_fresh_only_zone_no_query_param_returns_society_fresh(): void
    {
        $request = $this->makeRequest();
        $zone = $this->makeZone(['society_fresh']);

        $result = VerticalContext::current($request, BusinessVertical::DailyFresh->value, $zone);

        $this->assertSame('society_fresh', $result);
    }

    public function test_society_fresh_only_zone_stale_daily_fresh_session_returns_society_fresh(): void
    {
        $request = $this->makeRequest('', ['vertical' => 'daily_fresh']);
        $zone = $this->makeZone(['society_fresh']);

        $result = VerticalContext::current($request, BusinessVertical::DailyFresh->value, $zone);

        $this->assertSame('society_fresh', $result);
        $this->assertSame('society_fresh', $request->session()->get('vertical'));
    }

    // =========================================================================
    // Property 2: Preservation — Unconstrained Vertical Resolution
    // These tests PASS on unfixed code (confirms baseline behavior to preserve).
    // =========================================================================

    public function test_null_zone_no_query_param_falls_back_to_default(): void
    {
        $request = $this->makeRequest();

        $original = VerticalContext::current($request, BusinessVertical::DailyFresh->value);

        $request2 = $this->makeRequest();
        $result = VerticalContext::current($request2, BusinessVertical::DailyFresh->value, null);

        $this->assertSame($original, $result);
        $this->assertSame('daily_fresh', $result);
    }

    public function test_both_vertical_zone_no_query_param_preserves_default_chain(): void
    {
        $request = $this->makeRequest();
        $zone = $this->makeZone(['daily_fresh', 'society_fresh']);

        $original = VerticalContext::current($this->makeRequest(), BusinessVertical::DailyFresh->value);
        $result = VerticalContext::current($request, BusinessVertical::DailyFresh->value, $zone);

        $this->assertSame($original, $result);
    }

    public function test_both_vertical_zone_explicit_query_param_is_honoured(): void
    {
        $request = $this->makeRequest('society_fresh');
        $zone = $this->makeZone(['daily_fresh', 'society_fresh']);

        $result = VerticalContext::current($request, BusinessVertical::DailyFresh->value, $zone);

        $this->assertSame('society_fresh', $result);
    }

    public function test_empty_verticals_zone_treated_as_all_verticals_supported(): void
    {
        $request = $this->makeRequest();
        $zone = $this->makeZone([]);

        $original = VerticalContext::current($this->makeRequest(), BusinessVertical::DailyFresh->value);
        $result = VerticalContext::current($request, BusinessVertical::DailyFresh->value, $zone);

        $this->assertSame($original, $result);
    }

    public function test_society_fresh_only_zone_with_valid_query_param_is_honoured(): void
    {
        $request = $this->makeRequest('society_fresh');
        $zone = $this->makeZone(['society_fresh']);

        $result = VerticalContext::current($request, BusinessVertical::DailyFresh->value, $zone);

        $this->assertSame('society_fresh', $result);
    }

    public function test_null_zone_with_session_vertical_returns_session_value(): void
    {
        $request = $this->makeRequest('', ['vertical' => 'society_fresh']);

        $result = VerticalContext::current($request, BusinessVertical::DailyFresh->value, null);

        $this->assertSame('society_fresh', $result);
    }
}
