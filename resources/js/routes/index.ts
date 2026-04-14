import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../wayfinder'
/**
 * @see routes/web.php:34
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:34
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:34
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:34
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProductController::products
 * @see app/Http/Controllers/ProductController.php:23
 * @route '/products'
 */
export const products = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: products.url(options),
    method: 'get',
})

products.definition = {
    methods: ["get","head"],
    url: '/products',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductController::products
 * @see app/Http/Controllers/ProductController.php:23
 * @route '/products'
 */
products.url = (options?: RouteQueryOptions) => {
    return products.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductController::products
 * @see app/Http/Controllers/ProductController.php:23
 * @route '/products'
 */
products.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: products.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductController::products
 * @see app/Http/Controllers/ProductController.php:23
 * @route '/products'
 */
products.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: products.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SubscriptionController::subscription
 * @see app/Http/Controllers/SubscriptionController.php:36
 * @route '/subscription'
 */
export const subscription = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: subscription.url(options),
    method: 'get',
})

subscription.definition = {
    methods: ["get","head"],
    url: '/subscription',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SubscriptionController::subscription
 * @see app/Http/Controllers/SubscriptionController.php:36
 * @route '/subscription'
 */
subscription.url = (options?: RouteQueryOptions) => {
    return subscription.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::subscription
 * @see app/Http/Controllers/SubscriptionController.php:36
 * @route '/subscription'
 */
subscription.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: subscription.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SubscriptionController::subscription
 * @see app/Http/Controllers/SubscriptionController.php:36
 * @route '/subscription'
 */
subscription.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: subscription.url(options),
    method: 'head',
})

/**
 * @see routes/web.php:336
 * @route '/welcome'
 */
export const welcome = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: welcome.url(options),
    method: 'get',
})

welcome.definition = {
    methods: ["get","head"],
    url: '/welcome',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:336
 * @route '/welcome'
 */
welcome.url = (options?: RouteQueryOptions) => {
    return welcome.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:336
 * @route '/welcome'
 */
welcome.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: welcome.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:336
 * @route '/welcome'
 */
welcome.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: welcome.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:28
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:28
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:28
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuthController::login
 * @see app/Http/Controllers/AuthController.php:28
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:354
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:354
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:354
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderController::checkout
 * @see app/Http/Controllers/OrderController.php:83
 * @route '/checkout'
 */
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(options),
    method: 'get',
})

checkout.definition = {
    methods: ["get","head"],
    url: '/checkout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::checkout
 * @see app/Http/Controllers/OrderController.php:83
 * @route '/checkout'
 */
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::checkout
 * @see app/Http/Controllers/OrderController.php:83
 * @route '/checkout'
 */
checkout.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrderController::checkout
 * @see app/Http/Controllers/OrderController.php:83
 * @route '/checkout'
 */
checkout.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkout.url(options),
    method: 'head',
})