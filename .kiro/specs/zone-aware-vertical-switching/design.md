# Zone-Aware Vertical Switching Bugfix Design

## Overview

When a zone only supports a subset of `BusinessVertical` values, `VerticalContext::current()` ignores that constraint and returns the hardcoded `daily_fresh` default (or whatever is in the session). The user lands on a vertical their zone does not serve, sees an empty catalog, and can still manually toggle to the unsupported vertical via the Header.

The fix has two parts:

1. **Backend** — add an optional `?Zone $zone` parameter to `VerticalContext::current()`. When a zone is provided and the resolved vertical is not in the zone's supported list, override it with the first supported vertical and update the session.
2. **Frontend** — `HandleInertiaRequests` shares `availableVerticals` (derived from the resolved zone) alongside `currentVertical`. The `Header` component reads `availableVerticals` and hides toggle buttons for unsupported verticals.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug — a zone that supports only a strict subset of verticals is present, yet the resolved vertical is not in that subset.
- **Property (P)**: The desired behavior when the bug condition holds — the resolved vertical must be the first vertical in the zone's supported list, and the session must be updated accordingly.
- **Preservation**: All resolution logic for zones that support both verticals (or have an empty `verticals` array) must remain byte-for-byte identical to the current behavior.
- **VerticalContext**: `app/Support/VerticalContext.php` — static helper that resolves the active `BusinessVertical` string from query param → session → default.
- **HandleInertiaRequests**: `app/Http/Middleware/HandleInertiaRequests.php` — Inertia middleware that shares global props; the only call-site for `VerticalContext::current()` that has access to the resolved `Zone` model.
- **availableVerticals**: The array of vertical strings the current zone supports, derived via `LocationService::getVerticalsForZone()`. Falls back to `BusinessVertical::values()` when no zone is resolved.
- **Zone::verticals**: JSON column on the `zones` table; empty array or `null` means the zone supports all verticals (backward-compatible default).

## Bug Details

### Bug Condition

The bug manifests when a `Zone` is resolved for the current user (authenticated with a default address, or guest with a session zone) **and** that zone's `verticals` array is non-empty **and** the vertical resolved by the existing query-param → session → default chain is not present in that array.

**Formal Specification:**
```
FUNCTION isBugCondition(zone, resolvedVertical)
  INPUT: zone of type Zone|null, resolvedVertical of type string
  OUTPUT: boolean

  IF zone IS NULL THEN
    RETURN false          // no zone → no constraint → not a bug
  END IF

  supportedVerticals := zone.verticals  // array, may be empty
  IF supportedVerticals IS EMPTY THEN
    RETURN false          // empty means "all verticals" → not a bug
  END IF

  RETURN resolvedVertical NOT IN supportedVerticals
END FUNCTION
```

### Examples

- Zone supports `['society_fresh']`, no query param, session empty → resolves `daily_fresh` (bug: should be `society_fresh`)
- Zone supports `['society_fresh']`, session contains `daily_fresh` from prior visit → returns `daily_fresh` (bug: should be `society_fresh`)
- Zone supports `['society_fresh']`, Header renders both toggle buttons → user can click `daily_fresh` (bug: button should be hidden/disabled)
- Zone supports `['daily_fresh', 'society_fresh']`, no query param → resolves `daily_fresh` (not a bug — both supported)
- Zone is `null` (unauthenticated), no query param → resolves `daily_fresh` (not a bug — no zone constraint)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- When a zone supports both verticals (or has an empty `verticals` array), `VerticalContext::current()` with the zone param must produce exactly the same result as the current implementation without the zone param.
- Explicit `?vertical=` query params that are valid for the zone must continue to be honoured and stored in the session.
- When no zone is resolved (`null`), the function must fall back to `daily_fresh` exactly as today.
- All other Inertia shared props (`auth`, `cart`, `zone`, `location`, etc.) must remain unchanged.
- The Header must continue to render both toggle buttons as active and clickable when the zone supports both verticals.

**Scope:**
All inputs where `isBugCondition` returns `false` must be completely unaffected by this fix. This includes:
- Zones with empty or null `verticals` (all verticals supported)
- Requests with a valid `?vertical=` query param that matches a supported vertical
- Unauthenticated users and guests without a resolved zone

## Hypothesized Root Cause

1. **No zone awareness in `VerticalContext::current()`**: The method signature accepts only `Request` and a `$default` string. It has no knowledge of the zone, so it cannot validate the resolved vertical against zone constraints.

2. **`HandleInertiaRequests` resolves the zone but does not pass it to `VerticalContext`**: The middleware already builds the `$zone` array from the user's default address or guest session, but calls `VerticalContext::current($request, ...)` before that zone resolution block, and never passes the `Zone` model to the method.

3. **`availableVerticals` is never shared**: The frontend has no signal about which verticals the zone supports, so the Header always renders all toggle buttons.

4. **Session stickiness amplifies the bug**: Once `daily_fresh` is written to the session from a prior visit, every subsequent request for a `society_fresh`-only zone returns the stale session value until the session is cleared.

## Correctness Properties

Property 1: Bug Condition - Zone-Constrained Vertical Resolution

_For any_ request where `isBugCondition(zone, resolvedVertical)` returns `true` (i.e. the zone is non-null, has a non-empty `verticals` array, and the chain-resolved vertical is not in that array), the fixed `VerticalContext::current()` SHALL return the first vertical in the zone's supported list and update the session to that value.

**Validates: Requirements 2.1, 2.2**

Property 2: Preservation - Unconstrained Vertical Resolution

_For any_ request where `isBugCondition` returns `false` (zone is null, zone supports all verticals, or the resolved vertical is already in the zone's supported list), the fixed `VerticalContext::current()` SHALL produce exactly the same result as the original function, preserving the query-param → session → default resolution chain.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

**File**: `app/Support/VerticalContext.php`

**Function**: `VerticalContext::current()`

**Specific Changes**:
1. **Add optional `?Zone $zone = null` parameter** to the method signature (after `$default`).
2. **After the existing resolution chain**, check `isBugCondition($zone, $resolved)`: if the zone is non-null, has a non-empty `verticals` array, and `$resolved` is not in it, override `$resolved` with `$zone->verticals[0]` and update the session.
3. **No changes to the query-param or session branches** — the override only fires as a post-resolution correction.

```
FUNCTION current(request, default = 'daily_fresh', zone = null)
  // --- existing resolution chain (unchanged) ---
  resolved := resolveFromQueryParamOrSessionOrDefault(request, default)

  // --- new zone-aware correction ---
  IF zone IS NOT NULL THEN
    supported := zone.verticals  // array<string>
    IF supported IS NOT EMPTY AND resolved NOT IN supported THEN
      resolved := supported[0]
      request.session().put('vertical', resolved)
    END IF
  END IF

  RETURN resolved
END FUNCTION
```

---

**File**: `app/Http/Middleware/HandleInertiaRequests.php`

**Function**: `share()`

**Specific Changes**:
1. **Resolve the `Zone` model** (not just the array) before calling `VerticalContext::current()`. The zone model is already available via `$defaultAddress->zone` or `Zone::find(session('guest_zone_id'))` — extract it into a `?Zone $zoneModel` variable.
2. **Pass `$zoneModel` to `VerticalContext::current()`**: `VerticalContext::current($request, BusinessVertical::DailyFresh->value, $zoneModel)`.
3. **Compute `availableVerticals`**: use `app(LocationService::class)->getVerticalsForZone($zoneModel)` when a zone model is available, otherwise `BusinessVertical::values()`.
4. **Share `availableVerticals`** in the returned props array alongside `currentVertical`.

---

**File**: `resources/js/components/user/Header.tsx`

**Specific Changes**:
1. **Add `availableVerticals` to the `pageProps` type** as `availableVerticals?: string[]`.
2. **Derive `availableVerticals`** with a fallback: `const availableVerticals = pageProps.availableVerticals ?? BusinessVertical.values()`.
3. **Conditionally render each vertical toggle button**: only render (or render as enabled) when the vertical's value is present in `availableVerticals`. When only one vertical is available, hide the entire toggle pill container rather than showing a single-item toggle.

## Testing Strategy

### Validation Approach

Two-phase: first run exploratory tests against the **unfixed** code to confirm the root cause, then write fix-checking and preservation tests to validate the corrected behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug on unfixed code and confirm the root cause analysis.

**Test Plan**: Call `VerticalContext::current()` with a mocked `Request` (no query param, empty session) and a `Zone` whose `verticals` is `['society_fresh']`. Assert the result is `society_fresh`. On unfixed code this will fail, returning `daily_fresh`.

**Test Cases**:
1. **No query param, society_fresh-only zone** — expect `society_fresh`, unfixed returns `daily_fresh` (will fail)
2. **Session contains `daily_fresh`, society_fresh-only zone** — expect `society_fresh`, unfixed returns `daily_fresh` (will fail)
3. **`HandleInertiaRequests` shares `availableVerticals`** — expect key present in shared props, unfixed omits it (will fail)
4. **Header hides unsupported button** — expect `daily_fresh` button absent when `availableVerticals = ['society_fresh']`, unfixed renders it (will fail)

**Expected Counterexamples**:
- `VerticalContext::current()` returns `daily_fresh` for a `society_fresh`-only zone because the zone parameter does not exist yet.
- Shared props do not contain `availableVerticals` key.

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL (zone, resolvedVertical) WHERE isBugCondition(zone, resolvedVertical) DO
  result := VerticalContext_fixed::current(request, default, zone)
  ASSERT result IN zone.verticals
  ASSERT result = zone.verticals[0]
  ASSERT session('vertical') = result
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original.

**Pseudocode:**
```
FOR ALL (zone, request) WHERE NOT isBugCondition(zone, resolvedVertical) DO
  ASSERT VerticalContext_original::current(request, default)
       = VerticalContext_fixed::current(request, default, zone)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because the input space (all combinations of query params, session values, zone configurations) is large and manual tests miss edge cases.

**Test Cases**:
1. **Both-vertical zone, no query param** — result must equal original behavior (daily_fresh default)
2. **Both-vertical zone, explicit query param** — result must equal original behavior (query param wins)
3. **Null zone** — result must equal original behavior (no zone constraint)
4. **society_fresh-only zone, explicit `?vertical=society_fresh`** — query param is valid, must be honoured unchanged

### Unit Tests

- `VerticalContext::current()` with `society_fresh`-only zone and no query param → returns `society_fresh`
- `VerticalContext::current()` with `society_fresh`-only zone and stale `daily_fresh` session → returns `society_fresh` and updates session
- `VerticalContext::current()` with null zone → unchanged behavior
- `VerticalContext::current()` with both-vertical zone → unchanged behavior
- `HandleInertiaRequests::share()` includes `availableVerticals` key with correct values

### Property-Based Tests

- For any zone with `verticals = []` or `verticals = ['daily_fresh', 'society_fresh']`, `VerticalContext::current()` with zone param produces the same result as without zone param (preservation property)
- For any zone with a single-vertical `verticals` array, `VerticalContext::current()` always returns a value in `zone.verticals` (fix property)
- For any `availableVerticals` array, the Header renders exactly the buttons whose values appear in `availableVerticals`

### Integration Tests

- Full Inertia request for an authenticated user with a `society_fresh`-only zone: `currentVertical` in shared props is `society_fresh` and `availableVerticals` is `['society_fresh']`
- Full Inertia request for a user with a both-vertical zone: `availableVerticals` contains both values and `currentVertical` follows the normal resolution chain
- Guest user with `guest_zone_id` session pointing to a `society_fresh`-only zone: same zone-aware correction applies
