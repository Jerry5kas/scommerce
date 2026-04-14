# Implementation Plan: MySQL to PostgreSQL Migration

## Overview

Migrate the Freshtick Laravel application from MySQL to PostgreSQL by updating environment config, fixing migration compatibility issues, converting MySQL-specific raw SQL, and verifying correctness with PHPUnit feature tests and property-based tests.

## Tasks

- [x] 1. Update environment and database configuration
  - [x] 1.1 Update `.env.example` to use PostgreSQL defaults
    - Change `DB_CONNECTION` to `pgsql`, `DB_PORT` to `5432`, `DB_USERNAME` to `postgres`
    - Remove `DB_SOCKET` and `MYSQL_ATTR_SSL_CA` lines
    - Add `DB_SSLMODE=prefer`
    - Update the comment from `# MySQL (default for Freshtick)` to `# PostgreSQL (default for Freshtick)`
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.2 Update `config/database.php` default connection
    - Change `'default' => env('DB_CONNECTION', 'sqlite')` to `'default' => env('DB_CONNECTION', 'pgsql')`
    - _Requirements: 1.4, 1.5_

  - [ ]* 1.3 Write feature test for config resolution
    - Assert `config('database.default')` returns `'pgsql'` when `DB_CONNECTION=pgsql`
    - Assert the `pgsql` connection block is present and has the correct keys (`host`, `port`, `sslmode`)
    - _Requirements: 1.4, 1.5_

- [x] 2. Remove `->after()` column positioning directives from migration files
  - [x] 2.1 Strip `->after()` calls from the 11 affected migration files
    - `2025_02_02_100000_add_phase2_columns_to_users_table.php` — 7 calls
    - `2025_02_02_200004_add_verticals_to_zones_table.php` — 1 call
    - `2025_02_02_300004_add_vertical_to_catalog_tables.php` — 3 calls
    - `2026_02_06_055218_add_referral_columns_to_users_table.php` — 2 calls
    - `2026_02_26_184910_add_prices_to_subscription_plans_table.php` — 1 call
    - `2026_02_28_064352_restructure_subscription_plans_tables.php` — 4 calls
    - `2026_03_06_111005_add_variant_id_to_cart_items_table.php` — 1 call
    - `2026_03_07_045705_add_vertical_to_banners_table.php` — 1 call
    - `2026_03_07_120000_add_custom_rules_to_collections_table.php` — 5 calls
    - `2026_03_08_175159_add_phone_verified_at_to_users_table.php` — 1 call
    - `2026_03_08_225753_add_subscription_payment_retry_fields_to_orders_table.php` — 3 calls
    - Remove only the `->after('...')` chain segment; preserve all other chained calls on each column definition
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 2.2 Write property test: no `->after()` or `->first()` in any migration file
    - **Property 1: No MySQL-only column positioning directives in migration files**
    - **Validates: Requirements 3.1, 3.2**
    - Use `glob(database_path('migrations/*.php'))` to collect all migration file paths
    - Assert none of the file contents contain `->after(` or `->first(`

- [x] 3. Remove `->comment()` calls from migration files
  - [x] 3.1 Strip `->comment()` calls from the 4 affected migration files
    - `2026_02_03_070746_create_imagekit_files_table.php` — 6 calls
    - `2026_02_05_232800_create_payments_table.php` — 2 calls
    - `2026_02_05_232806_create_wallets_table.php` — 1 call
    - `2026_02_05_232807_create_wallet_transactions_table.php` — 2 calls
    - Remove only the `->comment('...')` chain segment; preserve all other chained calls
    - _Requirements: 4.4, 4.5_

  - [ ]* 3.2 Write property test: no `->comment()` in any migration file
    - **Property 2: No `->comment()` calls in migration files**
    - **Validates: Requirements 4.4**
    - Use `glob(database_path('migrations/*.php'))` to collect all migration file paths
    - Assert none of the file contents contain `->comment(`

- [x] 4. Replace raw `ALTER TABLE MODIFY` with Blueprint `->change()` in `add_phase2_columns_to_users_table.php`
  - [x] 4.1 Update `up()` in `2025_02_02_100000_add_phase2_columns_to_users_table.php`
    - Replace the `if ($driver === 'mysql') { DB::statement('ALTER TABLE users MODIFY ...') }` block with:
      ```php
      if (in_array($driver, ['mysql', 'pgsql'])) {
          Schema::table('users', function (Blueprint $table) {
              $table->string('name')->nullable()->change();
              $table->string('email')->nullable()->change();
              $table->string('password')->nullable()->change();
          });
      }
      ```
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 4.2 Update `down()` in the same migration to mirror the change
    - Replace the `if ($driver === 'mysql') { DB::statement('ALTER TABLE users MODIFY ... NOT NULL') }` block with:
      ```php
      if (in_array($driver, ['mysql', 'pgsql'])) {
          Schema::table('users', function (Blueprint $table) {
              $table->string('name')->nullable(false)->change();
              $table->string('email')->nullable(false)->change();
              $table->string('password')->nullable(false)->change();
          });
      }
      ```
    - _Requirements: 6.4_

  - [ ]* 4.3 Write feature test for Blueprint `->change()` nullable behaviour
    - **Property 3: Blueprint `->change()` used for nullable column modification**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**
    - Assert that after `up()` runs, `name`, `email`, and `password` columns on `users` are nullable
    - Assert that after `down()` runs, those columns are non-nullable

- [x] 5. Add `pgsql` driver guard branch in `restructure_subscription_plans_tables.php`
  - [x] 5.1 Extend the SQLite-only guard to include `pgsql`
    - Change `DB::getDriverName() === 'sqlite'` to `in_array(DB::getDriverName(), ['sqlite', 'pgsql'])`
    - The `dropUnique` and `dropIndex` calls inside the guard remain unchanged
    - _Requirements: 7.4, 7.5_

- [x] 6. Checkpoint — verify migration compatibility changes
  - Ensure all tests pass, ask the user if questions arise.
  - Confirm `->after()`, `->comment()`, and raw `ALTER TABLE` changes are complete before proceeding to query conversions.

- [x] 7. Fix `DATE_FORMAT` → `TO_CHAR` in `AnalyticsService::getRevenueChart()`
  - [x] 7.1 Replace the `$dateFormat` / `DB::raw("DATE_FORMAT(...)")` block with a driver-aware expression
    - Detect driver via `DB::getDriverName()`
    - For `pgsql`: use `TO_CHAR(created_at, ...)` with formats `'YYYY-MM-DD'`, `'IYYY-IW'`, `'YYYY-MM'`
    - For all other drivers: keep existing `DATE_FORMAT` with `'%Y-%m-%d'`, `'%Y-%u'`, `'%Y-%m'`
    - Assign the resulting `DB::raw(...)` expression to `$periodExpr` and use it in the `->select()` call
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ]* 7.2 Write property test for revenue chart period format correctness
    - **Property 4: Revenue chart period format correctness**
    - **Validates: Requirements 8.1, 8.2, 8.3**
    - For each `groupBy` value (`'day'`, `'week'`, `'month'`), seed at least one paid order and call `getRevenueChart()`
    - Assert each returned `period` string matches the expected regex: `YYYY-MM-DD`, `IYYY-IW` (e.g. `2024-03`), or `YYYY-MM`

- [x] 8. Fix `JSON_EXTRACT` → `->>` operator in `AnalyticsService::getProductViews()`
  - [x] 8.1 Replace `JSON_EXTRACT` select expressions with PostgreSQL `->>` operator
    - Change `DB::raw("JSON_EXTRACT(properties, '$.product_id') as product_id")` to `DB::raw("properties->>'product_id' as product_id")`
    - Change `DB::raw("JSON_EXTRACT(properties, '$.product_name') as product_name")` to `DB::raw("properties->>'product_name' as product_name")`
    - Update `->groupBy('product_id', 'product_name')` to `->groupBy(DB::raw("properties->>'product_id'"), DB::raw("properties->>'product_name'"))`
    - _Requirements: 9.1, 9.2, 9.4_

  - [x] 8.2 Replace `JSON_EXTRACT` in the `whereRaw` product ID filter
    - Change `whereRaw("JSON_EXTRACT(properties, '$.product_id') = ?", [$productId])` to `whereRaw("(properties->>'product_id')::integer = ?", [$productId])`
    - _Requirements: 9.3, 9.5_

  - [ ]* 8.3 Write property test for JSON extraction correctness
    - **Property 5: JSON property extraction correctness**
    - **Validates: Requirements 9.1, 9.2, 9.4**
    - Seed tracking events with known `product_id` and `product_name` values in the `properties` JSON column
    - Call `getProductViews()` and assert returned `product_id` and `product_name` are plain scalar values (not JSON-encoded strings with surrounding quotes)

  - [ ]* 8.4 Write property test for product ID filter
    - **Property 6: Product ID filter returns only matching rows**
    - **Validates: Requirements 9.3, 9.5**
    - Seed tracking events with at least two distinct `product_id` values
    - Call `getProductViews()` with a specific `$productId` and assert every row in the result has `product_id` equal to that value

- [x] 9. Fix NULL ordering in `LocationService::resolveOverrideZone()`
  - [x] 9.1 Append `NULLS LAST` to the `orderByRaw` expression
    - Change `->orderByRaw('address_id IS NOT NULL DESC')` to `->orderByRaw('address_id IS NOT NULL DESC NULLS LAST')`
    - _Requirements: 10.1, 10.2_

  - [ ]* 9.2 Write property test for address-specific override priority
    - **Property 7: Address-specific overrides take priority over user-level overrides**
    - **Validates: Requirements 10.1, 10.2**
    - Create a mix of active `ZoneOverride` records: at least one with a non-null `address_id` and at least one with only a `user_id`
    - Call `resolveOverrideZone()` and assert the returned override has a non-null `address_id`

- [x] 10. Final checkpoint — run full test suite
  - Ensure all tests pass, ask the user if questions arise.
  - Run `php artisan test --compact` with `DB_CONNECTION=pgsql` to confirm all feature tests pass against PostgreSQL.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Property tests (P1, P2) are static file-content checks using `glob()` — no PBT library required
- Property tests (P4–P7) require a live PostgreSQL test database (`DB_CONNECTION=pgsql` in `.env.testing`)
- Each task references specific requirements for traceability
- The `->after()` removal (task 2) and `->comment()` removal (task 3) are purely mechanical — no logic changes
- The `restructure_subscription_plans_tables.php` file is touched by both task 2 (remove `->after()`) and task 5 (add pgsql guard); complete both in the same edit pass
