# Illuminate\Database\QueryException - Internal Server Error

SQLSTATE[42S22]: Column not found: 1054 Unknown column 'display_order' in 'order clause' (Connection: mysql, Host: 127.0.0.1, Port: 3306, Database: scommerce, SQL: select `subscription_plans`.*, (select count(*) from `subscriptions` where `subscription_plans`.`id` = `subscriptions`.`subscription_plan_id`) as `subscriptions_count` from `subscription_plans` order by `display_order` asc limit 20 offset 0)

PHP 8.2.12
Laravel 12.53.0
127.0.0.1:8000

## Stack Trace

0 - vendor\laravel\framework\src\Illuminate\Database\Connection.php:838
1 - vendor\laravel\framework\src\Illuminate\Database\Connection.php:794
2 - vendor\laravel\framework\src\Illuminate\Database\Connection.php:411
3 - vendor\laravel\framework\src\Illuminate\Database\Query\Builder.php:3475
4 - vendor\laravel\framework\src\Illuminate\Database\Query\Builder.php:3460
5 - vendor\laravel\framework\src\Illuminate\Database\Query\Builder.php:4050
6 - vendor\laravel\framework\src\Illuminate\Database\Query\Builder.php:3459
7 - vendor\laravel\framework\src\Illuminate\Database\Eloquent\Builder.php:902
8 - vendor\laravel\framework\src\Illuminate\Database\Eloquent\Builder.php:884
9 - vendor\laravel\framework\src\Illuminate\Database\Eloquent\Builder.php:1125
10 - app\Http\Controllers\Admin\SubscriptionPlanController.php:22
11 - vendor\laravel\framework\src\Illuminate\Routing\ControllerDispatcher.php:46
12 - vendor\laravel\framework\src\Illuminate\Routing\Route.php:265
13 - vendor\laravel\framework\src\Illuminate\Routing\Route.php:211
14 - vendor\laravel\framework\src\Illuminate\Routing\Router.php:822
15 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:180
16 - app\Http\Middleware\RedirectIfNotAdminAuthenticated.php:18
17 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
18 - vendor\laravel\boost\src\Middleware\InjectBoost.php:22
19 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
20 - vendor\laravel\framework\src\Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets.php:32
21 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
22 - vendor\inertiajs\inertia-laravel\src\Middleware.php:122
23 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
24 - vendor\laravel\framework\src\Illuminate\Routing\Middleware\SubstituteBindings.php:50
25 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
26 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken.php:87
27 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
28 - vendor\laravel\framework\src\Illuminate\View\Middleware\ShareErrorsFromSession.php:48
29 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
30 - vendor\laravel\framework\src\Illuminate\Session\Middleware\StartSession.php:120
31 - vendor\laravel\framework\src\Illuminate\Session\Middleware\StartSession.php:63
32 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
33 - vendor\laravel\framework\src\Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse.php:36
34 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
35 - vendor\laravel\framework\src\Illuminate\Cookie\Middleware\EncryptCookies.php:74
36 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
37 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:137
38 - vendor\laravel\framework\src\Illuminate\Routing\Router.php:821
39 - vendor\laravel\framework\src\Illuminate\Routing\Router.php:800
40 - vendor\laravel\framework\src\Illuminate\Routing\Router.php:764
41 - vendor\laravel\framework\src\Illuminate\Routing\Router.php:753
42 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Kernel.php:200
43 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:180
44 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Middleware\TransformsRequest.php:21
45 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull.php:31
46 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
47 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Middleware\TransformsRequest.php:21
48 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Middleware\TrimStrings.php:51
49 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
50 - vendor\laravel\framework\src\Illuminate\Http\Middleware\ValidatePostSize.php:27
51 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
52 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance.php:109
53 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
54 - vendor\laravel\framework\src\Illuminate\Http\Middleware\HandleCors.php:61
55 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
56 - vendor\laravel\framework\src\Illuminate\Http\Middleware\TrustProxies.php:58
57 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
58 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Middleware\InvokeDeferredCallbacks.php:22
59 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
60 - vendor\laravel\framework\src\Illuminate\Http\Middleware\ValidatePathEncoding.php:26
61 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:219
62 - vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php:137
63 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Kernel.php:175
64 - vendor\laravel\framework\src\Illuminate\Foundation\Http\Kernel.php:144
65 - vendor\laravel\framework\src\Illuminate\Foundation\Application.php:1220
66 - public\index.php:20
67 - vendor\laravel\framework\src\Illuminate\Foundation\resources\server.php:23

## Request

GET /admin/subscription-plans

## Headers

* **host**: 127.0.0.1:8000
* **connection**: keep-alive
* **sec-ch-ua-platform**: "Windows"
* **x-xsrf-token**: eyJpdiI6Im9xRTFSOTJRN3V2ZHlkekZqU1hvV2c9PSIsInZhbHVlIjoicFZsMnJZNUhDMS8zNk92SC9GeGVERzd2VUxlbzdsU2NkbzdDS0JXL1lHK0NIQm9aS3FrWmxRSVBpRWJqMkZRd0htV3piNSt4SitJcmdMRjNlMnlCYmt1bm5YVjZMM0VSTlg0R2hjN0xEbHdJOS8xRDFlM1lsZ1BIeitYUDhKaDciLCJtYWMiOiIwZjhjYzM4NTI5ZjYxZTA5MjVhYWU5ZTFlMjI2MjFhMTUyMDA0M2M0NzQwNjc0ZTVjYTdkYmM0NDk1OWRlZWQ0IiwidGFnIjoiIn0=
* **x-inertia-version**: 3d8472d4fc825d1d4e300c1d80b3d416
* **sec-ch-ua**: "Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"
* **x-inertia**: true
* **sec-ch-ua-mobile**: ?0
* **x-requested-with**: XMLHttpRequest
* **user-agent**: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36
* **accept**: text/html, application/xhtml+xml
* **sec-fetch-site**: same-origin
* **sec-fetch-mode**: cors
* **sec-fetch-dest**: empty
* **referer**: http://127.0.0.1:8000/admin/subscriptions
* **accept-encoding**: gzip, deflate, br, zstd
* **accept-language**: en-US,en;q=0.9
* **cookie**: _ga=GA1.1.1869242874.1764628029; _ga_GNYXP1XF3S=GS2.1.s1764891747$o4$g1$t1764895422$j60$l0$h0; _ga_64KK5PSF17=GS2.1.s1769325856$o3$g1$t1769326644$j60$l0$h0; localization=IN; _shopify_y=c1263bb2-2d8d-4a80-978c-585df2e9acc7; swym-pid="2MYFSjtd0rqDCZq/7GhoKCzMyMav4uPp2bTkSwZyauY="; appearance=system; __kla_id=eyJjaWQiOiJNREUyTmpFM05qVXRZelU1WmkwMFpqTTVMV0l6T1RVdE16TmhOamd6TkdReU9XVmsifQ==; _shopify_analytics=:AZwPn8DzAAEAAQocdaYhg2fzPsP79Jb5vvPA-Y--8-s5NNJdETLOYbjsGyV2bZSwrfq6af2vDRCWB3F881T09A:; swym-swymRegid="ZLt8v1TZWX12G8vKkPzVsb7F2B3ABI_HC27RX4gAlHn1jpA9FaSi35q8afjcjoFtQqpM-KPy58XinjVBbwdlRQZvRxOQ6a4WLbB2qeA4n5bt3dtMpGnSSoOLq1ngkRot7clRKSPzB27cCzBcNHG1ht4yXeNtjuyc0joOWM1SfZM"; swym-email=null; AMP_MKTG_449f576cce=JTdCJTIycmVmZXJyZXIlMjIlM0ElMjJodHRwJTNBJTJGJTJGMTI3LjAuMC4xJTNBOTI5MiUyRiUyMiUyQyUyMnJlZmVycmluZ19kb21haW4lMjIlM0ElMjIxMjcuMC4wLjElM0E5MjkyJTIyJTdE; AMP_449f576cce=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjI5NDNiMDk3Mi04OGRkLTQzNGMtOGUyNS04NTRmY2M1NTliY2QlMjIlMkMlMjJzZXNzaW9uSWQlMjIlM0ExNzcxNDY0NzkwNTI1JTJDJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJsYXN0RXZlbnRUaW1lJTIyJTNBMTc3MTQ2NDkxOTY5NyUyQyUyMmxhc3RFdmVudElkJTIyJTNBODMlMkMlMjJwYWdlQ291bnRlciUyMiUzQTIlMkMlMjJjb29raWVEb21haW4lMjIlM0ElMjIuMTI3LjAuMC4xJTIyJTdE; _shopify_essential=:AZxzoZRpAAH_eHW0HblRJZTFyU4Vj3-xPbO3gYM7KqbIYDVFa3nSlbiijggOzzVSgvheKEF4tyS7ynhvICAZvcDVqUDHT99VVRXZ0EIVVmqTZr3jknyFRaMFlG90TbG8VG8cFnDDEAmFlIfwyHfVRUXsYpeVJ2jNjzp0RYP9a1QLMTm1R6uU4WIu0Fj8JStm4_lyoc8ooySXWqIbdguCyguj9IDe8SwrFWJFYSHH0O_5UY0NQI_GoA7L5O9gcNmMYKuYu5CN2OF0o2OFgGaPtDL6QBbZE2E8dG4fFga1Q0W36gSGhXJrU5bBscmfOcUorxnKwwcAJeYottzYuRGVHb5LkAM0h7gjUTDrd8TN2_T5lGlJjjQTfBcTFRqyKgrYHG2MEMjR00UTHw1hnaf_WJcZTqc2zHusV1_KZob8RlxgzoI:; remember_admin_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6Im1ZTHJpV0FjbCszY016clh2SzZ2VUE9PSIsInZhbHVlIjoiT05LQXI1K1RnaUZNR25LWENLcmlhLzJkSnQvcmpnQWhnZk01Z2ZLL1o3bWoyZm9BdlRjb3BCc2haWUN3M3g5b2tVNVRYS3NJcTJSZFdLcHhCeW1MM3ZlUUJCT0t0YTBHcFJua3hVWTZRbzQwQ0xpNE5vcnVKbnk1T3d4OFNJUEo0THpiOSt3NDA1NHBGdEcyUlg0WktsVm9IWmVXdVFaaXZ5cTJEVHRmb1dmQjllV21KZ3g1NTkvQlJhNjQ5WDgrQ1IzUkYrcW1Gb1VmN1kzNUlPcTJMMjk3SUxmK3pDeEFueGJPUTRleFgzQT0iLCJtYWMiOiJlZTYwNWY4YjEzN2QzM2NjZGEyM2NkNjlkOTMyYjAxMDgxM2IwNTk2MjQ1ZWMzODY3MTBmOTY5YzU4MTE4MmIzIiwidGFnIjoiIn0%3D; XSRF-TOKEN=eyJpdiI6Im9xRTFSOTJRN3V2ZHlkekZqU1hvV2c9PSIsInZhbHVlIjoicFZsMnJZNUhDMS8zNk92SC9GeGVERzd2VUxlbzdsU2NkbzdDS0JXL1lHK0NIQm9aS3FrWmxRSVBpRWJqMkZRd0htV3piNSt4SitJcmdMRjNlMnlCYmt1bm5YVjZMM0VSTlg0R2hjN0xEbHdJOS8xRDFlM1lsZ1BIeitYUDhKaDciLCJtYWMiOiIwZjhjYzM4NTI5ZjYxZTA5MjVhYWU5ZTFlMjI2MjFhMTUyMDA0M2M0NzQwNjc0ZTVjYTdkYmM0NDk1OWRlZWQ0IiwidGFnIjoiIn0%3D; freshtick-session=eyJpdiI6IjA5TWdmVUtLS0FHbnhMMytyM1dReWc9PSIsInZhbHVlIjoibzBUbHFmZ3Z5UGI5NDJoWHY1NUJHa1BBdVVCVmNJVUxSVE5YL1hoZ2VMZW9tV0F4enZTS0I3K0ZTNWhUZUd3T0pmM0tlR2RnU0ZrZ0pVYmI0MXY4dHgwTTRQTlkvVnZmNHBTU1ZzN2hhRWR3VklYMG43NnBGNWw4SC95d2p0M2kiLCJtYWMiOiIwZGQxYjU0NjQ4MjY3YzI3MmY5ZjVjMWUwMjY0YjdlOGI3YzczZWJkYzAzM2EwYTQ0MzljMDk1MDJmMzk3ZWQ0IiwidGFnIjoiIn0%3D

## Route Context

controller: App\Http\Controllers\Admin\SubscriptionPlanController@index
route name: admin.subscription-plans.index
middleware: web, admin.auth

## Route Parameters

No route parameter data available.

## Database Queries

* mysql - select * from `sessions` where `id` = '7GBheNyMR1J8amNIzyiGPdDXodszwHtbkBwO6coh' limit 1 (20.39 ms)
* mysql - select * from `users` where `id` = 15 limit 1 (0.68 ms)
* mysql - select * from `user_addresses` where `user_addresses`.`user_id` = 15 and `user_addresses`.`user_id` is not null and `is_active` = 1 and `is_default` = 1 limit 1 (1.37 ms)
* mysql - select * from `zones` where `zones`.`id` = 6 and `zones`.`deleted_at` is null limit 1 (1.17 ms)
* mysql - select * from `admin_users` where `id` = 1 limit 1 (0.67 ms)
* mysql - select `product_id` from `wishlists` where `wishlists`.`user_id` = 15 and `wishlists`.`user_id` is not null (0.6 ms)
* mysql - select exists (select 1 from information_schema.tables where table_schema = schema() and table_name = 'theme_settings' and table_type in ('BASE TABLE', 'SYSTEM VERSIONED')) as `exists` (0.5 ms)
* mysql - select `value`, `key` from `theme_settings` where `key` in ('primary_1', 'primary_2', 'secondary', 'tertiary') (0.45 ms)
* mysql - select count(*) as aggregate from `subscription_plans` (0.4 ms)



