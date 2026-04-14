import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\PaymentController::index
 * @see app/Http/Controllers/Admin/PaymentController.php:22
 * @route '/admin/payments'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/payments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PaymentController::index
 * @see app/Http/Controllers/Admin/PaymentController.php:22
 * @route '/admin/payments'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PaymentController::index
 * @see app/Http/Controllers/Admin/PaymentController.php:22
 * @route '/admin/payments'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PaymentController::index
 * @see app/Http/Controllers/Admin/PaymentController.php:22
 * @route '/admin/payments'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PaymentController::show
 * @see app/Http/Controllers/Admin/PaymentController.php:73
 * @route '/admin/payments/{payment}'
 */
export const show = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/payments/{payment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\PaymentController::show
 * @see app/Http/Controllers/Admin/PaymentController.php:73
 * @route '/admin/payments/{payment}'
 */
show.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment: typeof args.payment === 'object'
                ? args.payment.id
                : args.payment,
                }

    return show.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PaymentController::show
 * @see app/Http/Controllers/Admin/PaymentController.php:73
 * @route '/admin/payments/{payment}'
 */
show.get = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\PaymentController::show
 * @see app/Http/Controllers/Admin/PaymentController.php:73
 * @route '/admin/payments/{payment}'
 */
show.head = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\PaymentController::refund
 * @see app/Http/Controllers/Admin/PaymentController.php:90
 * @route '/admin/payments/{payment}/refund'
 */
export const refund = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refund.url(args, options),
    method: 'post',
})

refund.definition = {
    methods: ["post"],
    url: '/admin/payments/{payment}/refund',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PaymentController::refund
 * @see app/Http/Controllers/Admin/PaymentController.php:90
 * @route '/admin/payments/{payment}/refund'
 */
refund.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment: typeof args.payment === 'object'
                ? args.payment.id
                : args.payment,
                }

    return refund.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PaymentController::refund
 * @see app/Http/Controllers/Admin/PaymentController.php:90
 * @route '/admin/payments/{payment}/refund'
 */
refund.post = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refund.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\PaymentController::retry
 * @see app/Http/Controllers/Admin/PaymentController.php:117
 * @route '/admin/payments/{payment}/retry'
 */
export const retry = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

retry.definition = {
    methods: ["post"],
    url: '/admin/payments/{payment}/retry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\PaymentController::retry
 * @see app/Http/Controllers/Admin/PaymentController.php:117
 * @route '/admin/payments/{payment}/retry'
 */
retry.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { payment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    payment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payment: typeof args.payment === 'object'
                ? args.payment.id
                : args.payment,
                }

    return retry.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\PaymentController::retry
 * @see app/Http/Controllers/Admin/PaymentController.php:117
 * @route '/admin/payments/{payment}/retry'
 */
retry.post = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})
const payments = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
refund: Object.assign(refund, refund),
retry: Object.assign(retry, retry),
}

export default payments