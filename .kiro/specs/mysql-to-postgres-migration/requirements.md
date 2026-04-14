# Requirements Document

## Introduction

This feature migrates the Freshtick Laravel application from MySQL/MariaDB to PostgreSQL. The application currently uses MySQL as its primary database (DB_CONNECTION=mysql, DB_PORT=3306) and contains MySQL-specific constructs across migrations, raw queries, and configuration. The migration covers: updating environment and database configuration, converting MySQL-specific migration syntax, replacing MySQL-only SQL functions with PostgreSQL equivalents, and ensuring all indexes and constraints work correctly under PostgreSQL.

## Glossary

- **Migration_File**: A Laravel PHP migration file located in `database/migrations/`
- **Raw_Query**: A SQL expression passed via `DB::raw()`, `whereRaw()`, `selectRaw()`, `orderByRaw()`, or `havingRaw()`
- **Analytics_Service**: The class `app/Services/AnalyticsService.php` responsible for revenue charts and product/event analytics
- **Location_Service**: The class `app/Services/LocationService.php` responsible for zone override lookups
- **Enum_Column**: A database column defined with `$table->enum()` in a Laravel migration
- **JSON_Column**: A database column defined with `$table->json()` in a Laravel migration
- **Driver_Guard**: A conditional block in a migration that checks `Schema::getConnection()->getDriverName()` or `DB::getDriverName()`
- **pdo_pgsql**: The PHP PDO extension required to connect to PostgreSQL
- **PostgreSQL**: The target relational database management system (version 14+)
- **MySQL**: The source relational database management system being replaced

---

## Requirements

### Requirement 1: Environment and Database Configuration

**User Story:** As a developer, I want the application environment and database configuration updated for PostgreSQL, so that the application connects to PostgreSQL instead of MySQL.

#### Acceptance Criteria

1. THE Migration_Tool SHALL update `DB_CONNECTION` to `pgsql` and `DB_PORT` to `5432` in both `.env` and `.env.example`.
2. THE Migration_Tool SHALL remove MySQL-specific environment variables (`DB_SOCKET`, `MYSQL_ATTR_SSL_CA`) from `.env.example`.
3. THE Migration_Tool SHALL add a `DB_SSLMODE` environment variable with a default value of `prefer` to `.env.example`.
4. WHEN the application boots with `DB_CONNECTION=pgsql`, THE Application SHALL resolve the `pgsql` connection block from `config/database.php` as the default connection.
5. THE Migration_Tool SHALL update the default value of `DB_CONNECTION` in `config/database.php` from `sqlite` to `pgsql`.

---

### Requirement 2: PHP Extension Prerequisite

**User Story:** As a developer, I want the PostgreSQL PHP extension requirement documented, so that the environment can be set up correctly before running migrations.

#### Acceptance Criteria

1. THE Documentation SHALL state that the `pdo_pgsql` PHP extension must be enabled before running migrations.
2. IF the `pdo_pgsql` extension is not loaded, THEN THE Application SHALL throw a `PDOException` with a descriptive message on first database connection attempt.

---

### Requirement 3: Migration Compatibility — Column Positioning Directives

**User Story:** As a developer, I want all `->after()` and `->first()` calls removed from migrations, so that migrations run without errors on PostgreSQL, which does not support column positioning.

#### Acceptance Criteria

1. THE Migration_Tool SHALL remove all `->after()` chained calls from the following 11 Migration_Files:
   - `2025_02_02_100000_add_phase2_columns_to_users_table.php` (7 calls)
   - `2025_02_02_200004_add_verticals_to_zones_table.php` (1 call)
   - `2025_02_02_300004_add_vertical_to_catalog_tables.php` (3 calls)
   - `2026_02_06_055218_add_referral_columns_to_users_table.php` (2 calls)
   - `2026_02_26_184910_add_prices_to_subscription_plans_table.php` (1 call)
   - `2026_02_28_064352_restructure_subscription_plans_tables.php` (4 calls)
   - `2026_03_06_111005_add_variant_id_to_cart_items_table.php` (1 call)
   - `2026_03_07_045705_add_vertical_to_banners_table.php` (1 call)
   - `2026_03_07_120000_add_custom_rules_to_collections_table.php` (5 calls)
   - `2026_03_08_175159_add_phone_verified_at_to_users_table.php` (1 call)
   - `2026_03_08_225753_add_subscription_payment_retry_fields_to_orders_table.php` (3 calls)
2. THE Migration_Tool SHALL remove all `->first()` chained calls from every Migration_File.
3. WHEN each of the above Migration_Files is run against PostgreSQL after removing `->after()` calls, THE Migration SHALL complete without error.

---

### Requirement 4: Migration Compatibility — MySQL-Only Column Attributes

**User Story:** As a developer, I want MySQL-specific column attributes removed from migrations, so that migrations are portable across database drivers.

#### Acceptance Criteria

1. THE Migration_Tool SHALL remove all `->charset()` chained calls from Migration_Files. (Audit found no occurrences — confirm by grep before closing.)
2. THE Migration_Tool SHALL remove all `->collation()` chained calls from Migration_Files. (Audit found no occurrences — confirm by grep before closing.)
3. THE Migration_Tool SHALL remove all `->engine()` chained calls from Migration_Files. (Audit found no occurrences — confirm by grep before closing.)
4. THE Migration_Tool SHALL remove all `->comment()` chained calls from the following 4 Migration_Files, as PostgreSQL column comments require a separate `DB::statement()` call and are not part of the Blueprint API in Laravel 12:
   - `2026_02_03_070746_create_imagekit_files_table.php` (6 calls)
   - `2026_02_05_232800_create_payments_table.php` (2 calls)
   - `2026_02_05_232806_create_wallets_table.php` (1 call)
   - `2026_02_05_232807_create_wallet_transactions_table.php` (2 calls)
5. WHEN each of the above Migration_Files is run against PostgreSQL after removing `->comment()` calls, THE Migration SHALL complete without error.

---

### Requirement 5: Migration Compatibility — MySQL-Specific Column Types

**User Story:** As a developer, I want MySQL-specific column type methods verified for PostgreSQL compatibility, so that the schema is created correctly.

#### Acceptance Criteria

1. THE Migration_Tool SHALL verify that `mediumText()` columns are acceptable in PostgreSQL (Laravel maps them to `text`).
2. THE Migration_Tool SHALL verify that `longText()` columns are acceptable in PostgreSQL (Laravel maps them to `text`).
3. THE Migration_Tool SHALL verify that `unsignedTinyInteger()` columns are acceptable in PostgreSQL (Laravel maps them to `smallint` with a check constraint).
4. THE Migration_Tool SHALL verify that `unsignedInteger()` columns are acceptable in PostgreSQL (Laravel maps them to `integer` with a check constraint).
5. WHEN all Migration_Files are run against PostgreSQL, THE Schema SHALL contain all expected tables and columns without type errors.

---

### Requirement 6: Migration Compatibility — Raw ALTER TABLE Statements

**User Story:** As a developer, I want the MySQL-specific `ALTER TABLE ... MODIFY` statement in the users migration replaced with a PostgreSQL-compatible approach, so that the migration runs on PostgreSQL.

#### Acceptance Criteria

1. THE Migration_Tool SHALL update `database/migrations/2025_02_02_100000_add_phase2_columns_to_users_table.php` to replace the MySQL-only `DB::statement('ALTER TABLE users MODIFY ...')` with a PostgreSQL-compatible `Schema::table()` approach using `->nullable()` and `->change()`.
2. THE Migration_Tool SHALL extend the Driver_Guard in that migration to handle `pgsql` in addition to `mysql`, or replace the raw statement with a driver-agnostic Blueprint `->change()` call.
3. WHEN the migration is run against PostgreSQL, THE Migration SHALL make the `name`, `email`, and `password` columns nullable without error.
4. WHEN the migration is reversed on PostgreSQL, THE Migration SHALL restore the `name`, `email`, and `password` columns to non-nullable without error.

---

### Requirement 7: Migration Compatibility — Driver Guards

**User Story:** As a developer, I want all Driver_Guards in migrations updated to include `pgsql`, so that PostgreSQL-specific logic is executed when needed.

#### Acceptance Criteria

1. THE Migration_Tool SHALL audit all Migration_Files for Driver_Guard blocks that check for `mysql` or `sqlite` but not `pgsql`.
2. WHEN a Driver_Guard block performs an operation that is also required on PostgreSQL, THE Migration_Tool SHALL add `pgsql` to the condition or refactor to a driver-agnostic approach.
3. WHEN a Driver_Guard block performs an operation that is MySQL-only and has no PostgreSQL equivalent, THE Migration_Tool SHALL add a separate `pgsql` block with the equivalent PostgreSQL syntax.
4. THE Migration_Tool SHALL update `database/migrations/2026_02_28_064352_restructure_subscription_plans_tables.php` to add a `pgsql` branch alongside the existing `sqlite`-only guard: the condition `if (Schema::hasColumn('subscription_plans', 'slug') && DB::getDriverName() === 'sqlite')` must be extended to also execute the `dropUnique` and `dropIndex` calls when the driver is `pgsql`, because PostgreSQL also requires indexes and unique constraints to be dropped before their columns can be removed.
5. WHEN `2026_02_28_064352_restructure_subscription_plans_tables.php` is run against PostgreSQL, THE Migration SHALL drop the `subscription_plans_slug_unique` unique constraint and the `subscription_plans_is_active_display_order_index` index before dropping the `slug` column, without error.

---

### Requirement 8: Raw Query Conversion — DATE_FORMAT

**User Story:** As a developer, I want the MySQL `DATE_FORMAT()` function in `AnalyticsService` replaced with a PostgreSQL-compatible equivalent, so that revenue chart queries execute correctly.

#### Acceptance Criteria

1. THE Migration_Tool SHALL replace `DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period")` in `AnalyticsService::getRevenueChart()` with a driver-aware expression using `TO_CHAR(created_at, ...)` for PostgreSQL.
2. THE Analytics_Service SHALL produce equivalent period grouping output (`YYYY-MM-DD`, `YYYY-WW`, `YYYY-MM`) on PostgreSQL as it does on MySQL.
3. WHEN `getRevenueChart()` is called with `groupBy='day'`, `'week'`, or `'month'`, THE Analytics_Service SHALL return results grouped by the correct period format on PostgreSQL.

---

### Requirement 9: Raw Query Conversion — JSON_EXTRACT

**User Story:** As a developer, I want the MySQL `JSON_EXTRACT()` function in `AnalyticsService` replaced with a PostgreSQL-compatible equivalent, so that product view analytics queries execute correctly.

#### Acceptance Criteria

1. THE Migration_Tool SHALL replace `DB::raw("JSON_EXTRACT(properties, '$.product_id') as product_id")` in `AnalyticsService::getProductViews()` with the PostgreSQL JSON operator `DB::raw("properties->>'product_id' as product_id")`.
2. THE Migration_Tool SHALL replace `DB::raw("JSON_EXTRACT(properties, '$.product_name') as product_name")` in `AnalyticsService::getProductViews()` with the PostgreSQL JSON operator `DB::raw("properties->>'product_name' as product_name")`.
3. THE Migration_Tool SHALL replace the `whereRaw("JSON_EXTRACT(properties, '$.product_id') = ?", [$productId])` filter with the PostgreSQL equivalent `whereRaw("(properties->>'product_id')::integer = ?", [$productId])`.
4. WHEN `getProductViews()` is called on PostgreSQL, THE Analytics_Service SHALL return product view data with `product_id` and `product_name` correctly extracted from the `properties` JSON column.
5. WHEN `getProductViews()` is called with a `$productId` filter on PostgreSQL, THE Analytics_Service SHALL return only rows matching that product ID.

---

### Requirement 10: Raw Query Conversion — NULL Ordering

**User Story:** As a developer, I want the MySQL-specific NULL ordering expression in `LocationService` replaced with a PostgreSQL-compatible equivalent, so that zone override lookups return correct results.

#### Acceptance Criteria

1. THE Migration_Tool SHALL replace `->orderByRaw('address_id IS NOT NULL DESC')` in `LocationService` with `->orderByRaw('address_id IS NOT NULL DESC NULLS LAST')` or use `->orderBy('address_id', 'desc')->orderByRaw('address_id IS NOT NULL DESC')` in a driver-aware manner.
2. WHEN `LocationService` resolves a zone override, THE Location_Service SHALL prioritise address-specific overrides over user-level overrides on PostgreSQL, matching the existing MySQL behaviour.

---

### Requirement 11: Enum Column Compatibility

**User Story:** As a developer, I want all `enum()` column definitions verified for PostgreSQL compatibility, so that schema creation and future enum alterations work correctly.

#### Acceptance Criteria

1. THE Migration_Tool SHALL verify that all `->enum()` column definitions in Migration_Files create valid `CHECK` constraints on PostgreSQL (Laravel's default behaviour for pgsql).
2. WHEN a Migration_File adds a new `->enum()` column via `Schema::table()`, THE Migration SHALL complete without error on PostgreSQL.
3. THE Documentation SHALL note that altering an existing enum column's allowed values on PostgreSQL requires dropping and recreating the CHECK constraint, unlike MySQL's `MODIFY COLUMN`.

---

### Requirement 12: Data Export and Import Process

**User Story:** As a developer, I want a documented process for exporting data from MySQL and importing it into PostgreSQL, so that existing production data is preserved during the migration.

#### Acceptance Criteria

1. THE Documentation SHALL describe using `pgloader` or `mysqldump` + manual conversion as the recommended data migration approach.
2. THE Documentation SHALL specify that sequences (auto-increment) must be reset after data import using `SELECT setval(...)` to avoid primary key conflicts.
3. THE Documentation SHALL specify that boolean columns stored as `tinyint(1)` in MySQL must be cast to PostgreSQL `boolean` during import.
4. THE Documentation SHALL specify that `enum` columns stored as strings in MySQL must be verified against the CHECK constraints in PostgreSQL after import.
5. WHEN data is imported into PostgreSQL, THE Database SHALL pass all foreign key constraint checks without violations.

---

### Requirement 13: Test Suite Compatibility

**User Story:** As a developer, I want the existing test suite to pass against PostgreSQL, so that the migration does not introduce regressions.

#### Acceptance Criteria

1. WHEN `php artisan test --compact` is run with `DB_CONNECTION=pgsql`, THE Test_Suite SHALL pass all tests that previously passed on MySQL.
2. THE Migration_Tool SHALL update any test fixtures or factories that use MySQL-specific syntax or assumptions.
3. IF a test uses `DB::raw()` with MySQL-specific functions, THEN THE Migration_Tool SHALL update the test to use a driver-agnostic or PostgreSQL-compatible expression.
