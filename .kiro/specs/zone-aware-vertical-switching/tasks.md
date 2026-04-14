# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Zone-Constrained Vertical Resolution
  - **CRITICAL**: This test MUST FAIL on unfixed code — failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior — it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to the concrete failing cases: a Zone whose `verticals = ['society_fresh']` with no query param, and with a stale `daily_fresh` session
  - Create `tests/Unit/Support/VerticalContextTest.php` using `php artisan make:test --unit --phpunit Support/VerticalContextTest`
  - Test 1: Call `VerticalContext::current($request, 'daily_fresh', $zone)` where `$zone->verticals = ['society_fresh']` and no `?vertical=` query param — assert result is `society_fresh`
  - Test 2: Same zone, but session pre-seeded with `daily_fresh` — assert result is `society_fresh` and session is updated to `society_fresh`
  - The test assertions match Property 1 from the design: result IN zone.verticals AND result = zone.verticals[0] AND session('vertical') = result
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Tests FAIL (returns `daily_fresh` instead of `society_fresh` — confirms bug exists)
  - Document counterexamples found (e.g. `VerticalContext::current()` returns `daily_fresh` for a `society_fresh`-only zone because the zone parameter does not exist yet)
  - Mark task complete when tests are written, run, and failure is documented
  - _Requirements: 1.1, 1.2_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Unconstrained Vertical Resolution
  - **IMPORTANT**: Follow observation-first methodology
  - Observe: `VerticalContext::current($request, 'daily_fresh')` with no query param, empty session → returns `daily_fresh` on unfixed code
  - Observe: `VerticalContext::current($request, 'daily_fresh')` with `?vertical=society_fresh` → returns `society_fresh` on unfixed code
  - Observe: `VerticalContext::current($request, 'daily_fresh')` with session `society_fresh` → returns `society_fresh` on unfixed code
  - Add preservation tests to `tests/Unit/Support/VerticalContextTest.php`:
    - Null zone: result equals original behavior (no zone constraint, falls back to `daily_fresh`)
    - Both-vertical zone (`verticals = ['daily_fresh', 'society_fresh']`): result equals original behavior (query-param → session → default chain unchanged)
    - Both-vertical zone with explicit `?vertical=society_fresh`: query param is honoured unchanged
    - Empty `verticals` array zone: treated as "all verticals supported", original chain unchanged
  - Write property-based tests: for any zone where `isBugCondition` returns false, `VerticalContext::current()` with zone param produces the same result as without zone param
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3. Fix for zone-unaware vertical resolution

  - [x] 3.1 Update `VerticalContext::current()` to accept an optional `?Zone $zone = null` parameter
    - Add `use App\Models\Zone;` import
    - Add `?Zone $zone = null` as third parameter after `$default`
    - After the existing resolution chain (query-param → session → default), add the zone-aware correction block:
      - If `$zone` is not null AND `$zone->verticals` is a non-empty array AND `$resolved` is not in that array, set `$resolved = $zone->verticals[0]` and call `$request->session()->put('vertical', $resolved)`
    - No changes to the query-param or session branches — the override only fires as a post-resolution correction
    - _Bug_Condition: isBugCondition(zone, resolvedVertical) — zone non-null, zone.verticals non-empty, resolvedVertical NOT IN zone.verticals_
    - _Expected_Behavior: return zone.verticals[0] and update session to zone.verticals[0]_
    - _Preservation: when isBugCondition returns false, produce exactly the same result as the original function_
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 3.4_

  - [x] 3.2 Update `HandleInertiaRequests::share()` to extract the Zone model and pass it to `VerticalContext::current()`
    - Add `use App\Services\LocationService;` import
    - Extract a `?Zone $zoneModel` variable from `$defaultAddress->zone` (authenticated) or `Zone::find(session('guest_zone_id'))` (guest) — this is the full Eloquent model, not the `->only([...])` array
    - Move the `VerticalContext::current()` call to after the zone resolution block, passing `$zoneModel` as the third argument: `VerticalContext::current($request, BusinessVertical::DailyFresh->value, $zoneModel)`
    - Compute `$availableVerticals`: when `$zoneModel` is not null use `app(LocationService::class)->getVerticalsForZone($zoneModel)`, otherwise `BusinessVertical::values()`
    - Add `'availableVerticals' => $availableVerticals` to the returned props array alongside `currentVertical`
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.3 Update `Header.tsx` to read `availableVerticals` and hide unsupported toggle buttons
    - Add `availableVerticals?: string[]` to the `pageProps` type definition
    - Derive with fallback: `const availableVerticals = pageProps.availableVerticals ?? ['daily_fresh', 'society_fresh']`
    - For the desktop toggle pill container (`hidden items-center rounded-full ...`): wrap in `{availableVerticals.length > 1 && (...)}` so it is hidden when only one vertical is available
    - For the mobile toggle grid (`grid grid-cols-2 gap-1`): wrap in `{availableVerticals.length > 1 && (...)}` similarly
    - Individual button visibility is handled implicitly by hiding the container when only one vertical is available; if partial support is needed in future, each button can be conditionally rendered using `availableVerticals.includes('daily_fresh')` etc.
    - _Requirements: 2.3, 3.5_

  - [x] 3.4 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Zone-Constrained Vertical Resolution
    - **IMPORTANT**: Re-run the SAME tests from task 1 — do NOT write new tests
    - Run `php artisan test --compact tests/Unit/Support/VerticalContextTest.php`
    - **EXPECTED OUTCOME**: Bug condition tests PASS (confirms bug is fixed)
    - _Requirements: 2.1, 2.2_

  - [x] 3.5 Verify preservation tests still pass
    - **Property 2: Preservation** - Unconstrained Vertical Resolution
    - **IMPORTANT**: Re-run the SAME tests from task 2 — do NOT write new tests
    - Run `php artisan test --compact tests/Unit/Support/VerticalContextTest.php`
    - **EXPECTED OUTCOME**: Preservation tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)

  - [x] 3.6 Write and run `HandleInertiaRequests` integration test
    - Create `tests/Feature/Http/Middleware/HandleInertiaRequestsTest.php` using `php artisan make:test --phpunit Http/Middleware/HandleInertiaRequestsTest`
    - Test: authenticated user with a `society_fresh`-only zone → shared props contain `currentVertical = 'society_fresh'` and `availableVerticals = ['society_fresh']`
    - Test: authenticated user with a both-vertical zone → `availableVerticals` contains both values and `currentVertical` follows normal resolution chain
    - Test: unauthenticated user → `availableVerticals` falls back to all verticals
    - Run `php artisan test --compact tests/Feature/Http/Middleware/HandleInertiaRequestsTest.php`
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.4_

- [x] 4. Checkpoint — Ensure all tests pass
  - Run `php artisan test --compact tests/Unit/Support/VerticalContextTest.php tests/Feature/Http/Middleware/HandleInertiaRequestsTest.php`
  - Ensure all tests pass; ask the user if any questions arise
  - Run `vendor/bin/pint --dirty --format agent` to ensure PHP code style is clean
