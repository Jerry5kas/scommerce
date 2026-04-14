import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AnalyticsController::dashboard
 * @see app/Http/Controllers/Admin/AnalyticsController.php:22
 * @route '/admin/analytics'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin/analytics',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::dashboard
 * @see app/Http/Controllers/Admin/AnalyticsController.php:22
 * @route '/admin/analytics'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::dashboard
 * @see app/Http/Controllers/Admin/AnalyticsController.php:22
 * @route '/admin/analytics'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AnalyticsController::dashboard
 * @see app/Http/Controllers/Admin/AnalyticsController.php:22
 * @route '/admin/analytics'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::events
 * @see app/Http/Controllers/Admin/AnalyticsController.php:51
 * @route '/admin/analytics/events'
 */
export const events = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: events.url(options),
    method: 'get',
})

events.definition = {
    methods: ["get","head"],
    url: '/admin/analytics/events',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::events
 * @see app/Http/Controllers/Admin/AnalyticsController.php:51
 * @route '/admin/analytics/events'
 */
events.url = (options?: RouteQueryOptions) => {
    return events.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::events
 * @see app/Http/Controllers/Admin/AnalyticsController.php:51
 * @route '/admin/analytics/events'
 */
events.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: events.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AnalyticsController::events
 * @see app/Http/Controllers/Admin/AnalyticsController.php:51
 * @route '/admin/analytics/events'
 */
events.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: events.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::funnel
 * @see app/Http/Controllers/Admin/AnalyticsController.php:84
 * @route '/admin/analytics/funnel'
 */
export const funnel = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: funnel.url(options),
    method: 'get',
})

funnel.definition = {
    methods: ["get","head"],
    url: '/admin/analytics/funnel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::funnel
 * @see app/Http/Controllers/Admin/AnalyticsController.php:84
 * @route '/admin/analytics/funnel'
 */
funnel.url = (options?: RouteQueryOptions) => {
    return funnel.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::funnel
 * @see app/Http/Controllers/Admin/AnalyticsController.php:84
 * @route '/admin/analytics/funnel'
 */
funnel.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: funnel.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AnalyticsController::funnel
 * @see app/Http/Controllers/Admin/AnalyticsController.php:84
 * @route '/admin/analytics/funnel'
 */
funnel.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: funnel.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::revenue
 * @see app/Http/Controllers/Admin/AnalyticsController.php:120
 * @route '/admin/analytics/revenue'
 */
export const revenue = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: revenue.url(options),
    method: 'get',
})

revenue.definition = {
    methods: ["get","head"],
    url: '/admin/analytics/revenue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::revenue
 * @see app/Http/Controllers/Admin/AnalyticsController.php:120
 * @route '/admin/analytics/revenue'
 */
revenue.url = (options?: RouteQueryOptions) => {
    return revenue.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::revenue
 * @see app/Http/Controllers/Admin/AnalyticsController.php:120
 * @route '/admin/analytics/revenue'
 */
revenue.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: revenue.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AnalyticsController::revenue
 * @see app/Http/Controllers/Admin/AnalyticsController.php:120
 * @route '/admin/analytics/revenue'
 */
revenue.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: revenue.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::products
 * @see app/Http/Controllers/Admin/AnalyticsController.php:151
 * @route '/admin/analytics/products'
 */
export const products = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: products.url(options),
    method: 'get',
})

products.definition = {
    methods: ["get","head"],
    url: '/admin/analytics/products',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::products
 * @see app/Http/Controllers/Admin/AnalyticsController.php:151
 * @route '/admin/analytics/products'
 */
products.url = (options?: RouteQueryOptions) => {
    return products.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AnalyticsController::products
 * @see app/Http/Controllers/Admin/AnalyticsController.php:151
 * @route '/admin/analytics/products'
 */
products.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: products.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AnalyticsController::products
 * @see app/Http/Controllers/Admin/AnalyticsController.php:151
 * @route '/admin/analytics/products'
 */
products.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: products.url(options),
    method: 'head',
})
const analytics = {
    dashboard: Object.assign(dashboard, dashboard),
events: Object.assign(events, events),
funnel: Object.assign(funnel, funnel),
revenue: Object.assign(revenue, revenue),
products: Object.assign(products, products),
}

export default analytics