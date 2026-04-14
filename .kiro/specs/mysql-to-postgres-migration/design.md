# Design Document: MySQL to PostgreSQL Migration

## Overview

This document describes the technical approach for migrating the Freshtick Laravel application from MySQL/MariaDB to PostgreSQL 14+. The migration is purely a database driver swap — no application logic changes, no schema redesign. Every change is the minimum required to make existing code run correctly under the `pgsql` driver.

The work falls into five categories:

1. Environment and config file edits
2. Migration file compatibility fixes (column positioning, MySQL-only attributes, raw ALTER TABLE, driver guards)
3. Raw SQL query conversions in service classes
4. Data migration from the existing MySQL instance
5. Test suite compatibility

---

## Architecture

The application uses Laravel 12's standard database abstraction. All database access goes through either Eloquent models or the `DB` query builder. The `pgsql` connection block already exists in `config/database.php`; the only architectural change is making it the default.

```mermaid
flowchart LR
    App["Laravel App"] --> QB["Query Builder / Eloquent"]
    QB --> PDO["PDO (pdo_pgsql)"]
    PDO --> PG["PostgreSQL 14+"]
```

No new layers, services, or abstractions are introduced.

---

## Components and Interfaces

### 1. Environment & Configuration

**Files changed:** `.env`, `.env.example`, `config/database.php`

The `pgsql` connection block in `config/database.php` is already complete and correct. Only two things need updating:

- The `default` key fallback in `config/database.php` must change from `'sqlite'` to `'pgsql'`
- `.env` / `.env.example` must point at PostgreSQL

**`.env.example` — before:**
```dotenv
# MySQL (default for Freshtick)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=scommerce
DB_USERNAME=root
DB_PASSWORD=
```

**`.env.example` — after:**
```dotenv
# PostgreSQL (default for Freshtick)
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=scommerce
DB_USERNAME=postgres
DB_PASSWORD=
DB_SSLMODE=prefer
```

`DB_SOCKET` and `MYSQL_ATTR_SSL_CA` are removed entirely from `.env.example`.

**`config/database.php` — before:**
```php
'default' => env('DB_CONNECTION', 'sqlite'),
```

**`config/database.php` — after:**
```php
'default' => env('DB_CONNECTION', 'pgsql'),
```

The `pgsql` block already reads `DB_SSLMODE` via `'sslmode' => env('DB_SSLMODE', 'prefer')` — no change needed there.

---

### 2. Migration Compatibility Fixes

#### 2a. Remove `->after()` and `->first()` (Requirement 3)

PostgreSQL does not support column positioning. These calls must be stripped from 11 files. They are purely cosmetic in MySQL and have no effect on the resulting schema.

**Pattern — before (example from `2026_02_06_055218_add_referral_columns_to_users_table.php`):**
```php
$table->string('referral_code')->nullable()->unique()->after('email');
$table->foreignId('referred_by_id')->nullable()->after('referral_code')->constrained('users')->nullOnDelete();
```

**After:**
```php
$table->string('referral_code')->nullable()->unique();
$table->foreignId('referred_by_id')->nullable()->constrained('users')->nullOnDelete();
```

The full list of files and call counts:

| File | `->after()` calls |
|---|---|
| `2025_02_02_100000_add_phase2_columns_to_users_table.php` | 7 |
| `2025_02_02_200004_add_verticals_to_zones_table.php` | 1 |
| `2025_02_02_300004_add_vertical_to_catalog_tables.php` | 3 |
| `2026_02_06_055218_add_referral_columns_to_users_table.php` | 2 |
| `2026_02_26_184910_add_prices_to_subscription_plans_table.php` | 1 |
| `2026_02_28_064352_restructure_subscription_plans_tables.php` | 4 |
| `2026_03_06_111005_add_variant_id_to_cart_items_table.php` | 1 |
| `2026_03_07_045705_add_vertical_to_banners_table.php` | 1 |
| `2026_03_07_120000_add_custom_rules_to_collections_table.php` | 5 |
| `2026_03_08_175159_add_phone_verified_at_to_users_table.php` | 1 |
| `2026_03_08_225753_add_subscription_payment_retry_fields_to_orders_table.php` | 3 |

#### 2b. Remove `->comment()` (Requirement 4)

Laravel 12 does not support `->comment()` in the Blueprint API for PostgreSQL. The calls must be removed from 4 files. The comments are developer documentation only and carry no runtime significance.

**Before (example from `create_imagekit_files_table.php`):**
```php
$table->string('file_hash', 64)->unique()->comment('MD5 hash of the file content');
$table->string('file_id', 255)->unique()->comment('ImageKit file ID');
$table->string('url', 500)->comment('ImageKit CDN URL');
$table->string('file_path', 500)->comment('ImageKit file path');
$table->string('name', 255)->comment('Original filename');
$table->unsignedBigInteger('size')->comment('File size in bytes');
```

**After:**
```php
$table->string('file_hash', 64)->unique();
$table->string('file_id', 255)->unique();
$table->string('url', 500);
$table->string('file_path', 500);
$table->string('name', 255);
$table->unsignedBigInteger('size');
```

Files affected: `create_imagekit_files_table.php` (6), `create_payments_table.php` (2), `create_wallets_table.php` (1), `create_wallet_transactions_table.php` (2).

#### 2c. Replace raw `ALTER TABLE MODIFY` with Blueprint `->change()` (Requirement 6)

`ALTER TABLE ... MODIFY` is MySQL syntax. The existing driver guard only handles `mysql`. It must be extended to also handle `pgsql` using a driver-agnostic Blueprint approach.

**Before (`2025_02_02_100000_add_phase2_columns_to_users_table.php`):**
```php
$driver = Schema::getConnection()->getDriverName();
if ($driver === 'mysql') {
    DB::statement('ALTER TABLE users MODIFY name VARCHAR(255) NULL, MODIFY email VARCHAR(255) NULL, MODIFY password VARCHAR(255) NULL');
}
```

**After:**
```php
$driver = Schema::getConnection()->getDriverName();
if (in_array($driver, ['mysql', 'pgsql'])) {
    Schema::table('users', function (Blueprint $table) {
        $table->string('name')->nullable()->change();
        $table->string('email')->nullable()->change();
        $table->string('password')->nullable()->change();
    });
}
```

The `down()` method mirrors this:

**Before:**
```php
$driver = Schema::getConnection()->getDriverName();
if ($driver === 'mysql') {
    DB::statement('ALTER TABLE users MODIFY name VARCHAR(255) NOT NULL, MODIFY email VARCHAR(255) NOT NULL, MODIFY password VARCHAR(255) NOT NULL');
}
```

**After:**
```php
$driver = Schema::getConnection()->getDriverName();
if (in_array($driver, ['mysql', 'pgsql'])) {
    Schema::table('users', function (Blueprint $table) {
        $table->string('name')->nullable(false)->change();
        $table->string('email')->nullable(false)->change();
        $table->string('password')->nullable(false)->change();
    });
}
```

> Note: Per Laravel 12 docs, `->change()` requires all previously defined column attributes to be re-specified to avoid them being dropped. The `string()` call already implies `VARCHAR(255)`, so only `nullable()` needs to be added.

#### 2d. Add `pgsql` driver guard branch (Requirement 7)

`2026_02_28_064352_restructure_subscription_plans_tables.php` has a guard that only runs `dropUnique`/`dropIndex` for SQLite. PostgreSQL also requires indexes to be dropped before their columns can be removed.

**Before:**
```php
if (Schema::hasColumn('subscription_plans', 'slug') && DB::getDriverName() === 'sqlite') {
    Schema::table('subscription_plans', function (Blueprint $table) {
        try { $table->dropUnique('subscription_plans_slug_unique'); } catch (\Throwable) {}
        try { $table->dropIndex('subscription_plans_is_active_display_order_index'); } catch (\Throwable) {}
    });
}
```

**After:**
```php
if (Schema::hasColumn('subscription_plans', 'slug') && in_array(DB::getDriverName(), ['sqlite', 'pgsql'])) {
    Schema::table('subscription_plans', function (Blueprint $table) {
        try { $table->dropUnique('subscription_plans_slug_unique'); } catch (\Throwable) {}
        try { $table->dropIndex('subscription_plans_is_active_display_order_index'); } catch (\Throwable) {}
    });
}
```

The `->after()` calls in this same file are also removed as part of 2a above.

---

### 3. Raw Query Conversions

#### 3a. `DATE_FORMAT` → `TO_CHAR` in `AnalyticsService::getRevenueChart()` (Requirement 8)

MySQL's `DATE_FORMAT` uses `%Y-%m-%d` style format strings. PostgreSQL's `TO_CHAR` uses `YYYY-MM-DD` style. The format strings are not compatible.

**Before:**
```php
$dateFormat = match ($groupBy) {
    'week'  => '%Y-%u',
    'month' => '%Y-%m',
    default => '%Y-%m-%d',
};

DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period"),
```

**After:**
```php
$driver = DB::getDriverName();

if ($driver === 'pgsql') {
    $dateFormat = match ($groupBy) {
        'week'  => 'IYYY-IW',
        'month' => 'YYYY-MM',
        default => 'YYYY-MM-DD',
    };
    $periodExpr = DB::raw("TO_CHAR(created_at, '{$dateFormat}') as period");
} else {
    $dateFormat = match ($groupBy) {
        'week'  => '%Y-%u',
        'month' => '%Y-%m',
        default => '%Y-%m-%d',
    };
    $periodExpr = DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period");
}
```

The `IYYY-IW` format in PostgreSQL produces ISO week numbers equivalent to MySQL's `%Y-%u`.

#### 3b. `JSON_EXTRACT` → `->>` operator in `AnalyticsService::getProductViews()` (Requirement 9)

MySQL's `JSON_EXTRACT(col, '$.key')` returns a JSON-typed value (with surrounding quotes for strings). PostgreSQL's `->>` operator extracts as text directly.

**Before:**
```php
->select(
    DB::raw("JSON_EXTRACT(properties, '$.product_id') as product_id"),
    DB::raw("JSON_EXTRACT(properties, '$.product_name') as product_name"),
    DB::raw('COUNT(*) as views')
)
->groupBy('product_id', 'product_name')

// filter:
$query->whereRaw("JSON_EXTRACT(properties, '$.product_id') = ?", [$productId]);
```

**After:**
```php
->select(
    DB::raw("properties->>'product_id' as product_id"),
    DB::raw("properties->>'product_name' as product_name"),
    DB::raw('COUNT(*) as views')
)
->groupBy(DB::raw("properties->>'product_id'"), DB::raw("properties->>'product_name'"))

// filter:
$query->whereRaw("(properties->>'product_id')::integer = ?", [$productId]);
```

The `::integer` cast is required because `->>` always returns text; the `$productId` binding is an integer.

#### 3c. NULL ordering fix in `LocationService::resolveOverrideZone()` (Requirement 10)

MySQL treats `IS NOT NULL` as a boolean (1/0) and sorts `DESC` naturally. PostgreSQL requires explicit `NULLS LAST` to push NULLs to the end when sorting descending.

**Before:**
```php
->orderByRaw('address_id IS NOT NULL DESC')
```

**After:**
```php
->orderByRaw('address_id IS NOT NULL DESC NULLS LAST')
```

This is valid syntax on both MySQL (where `NULLS LAST` is a no-op since MySQL always puts NULLs last in DESC) and PostgreSQL, making it driver-agnostic.

---

### 4. Data Migration Approach (Requirement 12)

The recommended tool is **pgloader**, which handles the MySQL → PostgreSQL type mapping automatically in a single command.

```bash
pgloader mysql://root:password@127.0.0.1/scommerce \
         postgresql://postgres:password@127.0.0.1/scommerce
```

pgloader automatically:
- Maps `tinyint(1)` → `boolean`
- Maps `int unsigned` → `integer` with CHECK constraint
- Converts `enum` string values (verified against PostgreSQL CHECK constraints post-import)
- Resets sequences after import

**Post-import sequence reset** (required to avoid PK conflicts on new inserts):
```sql
SELECT setval(pg_get_serial_sequence('users', 'id'), MAX(id)) FROM users;
-- Repeat for every table with an auto-increment PK
```

**Alternative: `mysqldump` + manual conversion** — use only if pgloader is unavailable. Requires sed/awk transforms on the dump file to convert MySQL DDL to PostgreSQL DDL, which is error-prone and not recommended.

**Post-import verification checklist:**
1. Foreign key constraint check: `SET session_replication_role = replica; -- then re-enable`
2. Boolean columns: spot-check `tinyint(1)` columns are `true`/`false`, not `1`/`0`
3. Enum columns: verify values satisfy CHECK constraints
4. Sequence values: confirm `nextval()` returns a value higher than the current MAX(id)

---

## Data Models

No schema changes are introduced by this migration. The PostgreSQL schema is structurally identical to the MySQL schema. Laravel's Blueprint methods map as follows:

| Laravel method | MySQL type | PostgreSQL type |
|---|---|---|
| `string()` | `varchar(255)` | `varchar(255)` |
| `text()` / `mediumText()` / `longText()` | `text` variants | `text` |
| `json()` | `json` | `jsonb` |
| `enum()` | `enum` | `varchar` + `CHECK` constraint |
| `unsignedTinyInteger()` | `tinyint unsigned` | `smallint` + `CHECK (col >= 0)` |
| `unsignedInteger()` | `int unsigned` | `integer` + `CHECK (col >= 0)` |
| `boolean()` | `tinyint(1)` | `boolean` |
| `id()` | `bigint unsigned AUTO_INCREMENT` | `bigserial` |

The `jsonb` type used by PostgreSQL for `json()` columns is a superset of JSON — it supports all the same operations plus indexing. The `->>` operator used in `getProductViews()` works on `jsonb`.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: No MySQL-only column positioning directives in migration files

*For any* migration file in `database/migrations/`, the file content should not contain `->after(` or `->first(` method calls.

**Validates: Requirements 3.1, 3.2**

---

### Property 2: No `->comment()` calls in migration files

*For any* migration file in `database/migrations/`, the file content should not contain `->comment(` method calls.

**Validates: Requirements 4.4**

---

### Property 3: Blueprint `->change()` used for nullable column modification

*For any* execution of `2025_02_02_100000_add_phase2_columns_to_users_table.php` against a PostgreSQL connection, the `name`, `email`, and `password` columns on the `users` table should be nullable after `up()` runs and non-nullable after `down()` runs.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4**

---

### Property 4: Revenue chart period format correctness

*For any* `groupBy` value of `'day'`, `'week'`, or `'month'`, the `getRevenueChart()` method should return rows where the `period` field matches the expected PostgreSQL `TO_CHAR` format pattern (`YYYY-MM-DD`, `IYYY-IW`, or `YYYY-MM` respectively).

**Validates: Requirements 8.1, 8.2, 8.3**

---

### Property 5: JSON property extraction correctness

*For any* tracking event record whose `properties` JSON column contains `product_id` and `product_name` keys, `getProductViews()` should return those values correctly extracted as plain scalar values (not JSON-encoded strings with surrounding quotes).

**Validates: Requirements 9.1, 9.2, 9.4**

---

### Property 6: Product ID filter returns only matching rows

*For any* integer `$productId` passed to `getProductViews()`, every row in the result set should have a `product_id` equal to that value.

**Validates: Requirements 9.3, 9.5**

---

### Property 7: Address-specific overrides take priority over user-level overrides

*For any* combination of active zone overrides where at least one has a non-null `address_id` and at least one has only a `user_id`, `resolveOverrideZone()` should return the override with the non-null `address_id` first.

**Validates: Requirements 10.1, 10.2**

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| `pdo_pgsql` extension not loaded | PHP throws `PDOException` on first connection attempt with a descriptive message. No special handling needed — fail fast is correct. |
| `dropUnique`/`dropIndex` on non-existent constraint | Wrapped in `try/catch (\Throwable)` already — silently skipped. |
| `->change()` on column with existing data | PostgreSQL will cast in-place; `VARCHAR(255) NOT NULL → NULLABLE` is always safe. |
| pgloader import failure | pgloader exits non-zero and prints the offending row. Fix the data and re-run; pgloader is idempotent with `--on-error-stop`. |
| Sequence out of sync after import | `setval()` must be run manually post-import. Missing this causes `duplicate key` errors on first insert. |
| JSON `->>` on NULL `properties` column | Returns NULL, which is consistent with MySQL `JSON_EXTRACT` behaviour on NULL. |

---

## Testing Strategy

### Unit / Feature Tests

Use PHPUnit feature tests (`php artisan make:test --phpunit`) against a PostgreSQL test database (set `DB_CONNECTION=pgsql` in `phpunit.xml` or `.env.testing`).

Focus unit tests on:
- Config resolution: assert `config('database.default')` returns `'pgsql'`
- `.env.example` content: assert presence/absence of specific keys
- `AnalyticsService::getRevenueChart()` period format per `groupBy` value
- `AnalyticsService::getProductViews()` JSON extraction and filter
- `LocationService::resolveOverrideZone()` ordering with mixed address/user overrides

### Property-Based Tests

Use **[Eris](https://github.com/giorgiosironi/eris)** (PHP property-based testing library) for the universally-quantified properties above.

Each property test must run a minimum of **100 iterations**.

Tag format for each test: `Feature: mysql-to-postgres-migration, Property {N}: {property_text}`

| Property | Test approach |
|---|---|
| P1: No `->after()`/`->first()` in migrations | Generate random subsets of migration file paths; assert none contain the forbidden method calls |
| P2: No `->comment()` in migrations | Same approach over all migration files |
| P4: Revenue chart period format | Generate random `Carbon` date pairs and random `groupBy` values; assert returned `period` strings match the expected regex for each format |
| P5: JSON extraction correctness | Generate random `product_id` / `product_name` pairs; insert as tracking events; assert `getProductViews()` returns unquoted scalar values |
| P6: Product ID filter | Generate random sets of tracking events with varying `product_id` values; assert all returned rows match the filter |
| P7: Override priority | Generate random sets of `ZoneOverride` records mixing address-level and user-level; assert the first result always has a non-null `address_id` when one exists |

Properties P1 and P2 are static file-content checks and can be implemented as simple PHPUnit assertions over `glob()` results without a PBT library — they are deterministic, not randomised.

### Migration Integration Tests

Run `php artisan migrate --database=pgsql` against a fresh PostgreSQL instance in CI. Assert exit code 0. This covers Requirements 3.3, 4.5, 5.5, 6.3, 7.5.

### Running Tests

```bash
# All tests against PostgreSQL
DB_CONNECTION=pgsql php artisan test --compact

# Targeted filter
DB_CONNECTION=pgsql php artisan test --compact --filter=AnalyticsService
DB_CONNECTION=pgsql php artisan test --compact --filter=LocationService
```
