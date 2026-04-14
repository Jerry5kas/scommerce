import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrderController::index
 * @see app/Http/Controllers/OrderController.php:32
 * @route '/orders'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::index
 * @see app/Http/Controllers/OrderController.php:32
 * @route '/orders'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::index
 * @see app/Http/Controllers/OrderController.php:32
 * @route '/orders'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrderController::index
 * @see app/Http/Controllers/OrderController.php:32
 * @route '/orders'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderController::create
 * @see app/Http/Controllers/OrderController.php:83
 * @route '/checkout'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/checkout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::create
 * @see app/Http/Controllers/OrderController.php:83
 * @route '/checkout'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::create
 * @see app/Http/Controllers/OrderController.php:83
 * @route '/checkout'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrderController::create
 * @see app/Http/Controllers/OrderController.php:83
 * @route '/checkout'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderController::store
 * @see app/Http/Controllers/OrderController.php:126
 * @route '/checkout'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderController::store
 * @see app/Http/Controllers/OrderController.php:126
 * @route '/checkout'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::store
 * @see app/Http/Controllers/OrderController.php:126
 * @route '/checkout'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderController::initiatePayment
 * @see app/Http/Controllers/OrderController.php:154
 * @route '/checkout/initiate-payment'
 */
export const initiatePayment = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiatePayment.url(options),
    method: 'post',
})

initiatePayment.definition = {
    methods: ["post"],
    url: '/checkout/initiate-payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderController::initiatePayment
 * @see app/Http/Controllers/OrderController.php:154
 * @route '/checkout/initiate-payment'
 */
initiatePayment.url = (options?: RouteQueryOptions) => {
    return initiatePayment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::initiatePayment
 * @see app/Http/Controllers/OrderController.php:154
 * @route '/checkout/initiate-payment'
 */
initiatePayment.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiatePayment.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderController::verifyPayment
 * @see app/Http/Controllers/OrderController.php:208
 * @route '/checkout/verify-payment'
 */
export const verifyPayment = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyPayment.url(options),
    method: 'post',
})

verifyPayment.definition = {
    methods: ["post"],
    url: '/checkout/verify-payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderController::verifyPayment
 * @see app/Http/Controllers/OrderController.php:208
 * @route '/checkout/verify-payment'
 */
verifyPayment.url = (options?: RouteQueryOptions) => {
    return verifyPayment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::verifyPayment
 * @see app/Http/Controllers/OrderController.php:208
 * @route '/checkout/verify-payment'
 */
verifyPayment.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyPayment.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderController::show
 * @see app/Http/Controllers/OrderController.php:59
 * @route '/orders/{order}'
 */
export const show = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/orders/{order}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::show
 * @see app/Http/Controllers/OrderController.php:59
 * @route '/orders/{order}'
 */
show.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return show.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::show
 * @see app/Http/Controllers/OrderController.php:59
 * @route '/orders/{order}'
 */
show.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrderController::show
 * @see app/Http/Controllers/OrderController.php:59
 * @route '/orders/{order}'
 */
show.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderController::cancel
 * @see app/Http/Controllers/OrderController.php:261
 * @route '/orders/{order}/cancel'
 */
export const cancel = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/orders/{order}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderController::cancel
 * @see app/Http/Controllers/OrderController.php:261
 * @route '/orders/{order}/cancel'
 */
cancel.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return cancel.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::cancel
 * @see app/Http/Controllers/OrderController.php:261
 * @route '/orders/{order}/cancel'
 */
cancel.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderController::track
 * @see app/Http/Controllers/OrderController.php:290
 * @route '/orders/{order}/track'
 */
export const track = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: track.url(args, options),
    method: 'get',
})

track.definition = {
    methods: ["get","head"],
    url: '/orders/{order}/track',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::track
 * @see app/Http/Controllers/OrderController.php:290
 * @route '/orders/{order}/track'
 */
track.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return track.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::track
 * @see app/Http/Controllers/OrderController.php:290
 * @route '/orders/{order}/track'
 */
track.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: track.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrderController::track
 * @see app/Http/Controllers/OrderController.php:290
 * @route '/orders/{order}/track'
 */
track.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: track.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderController::reorder
 * @see app/Http/Controllers/OrderController.php:319
 * @route '/orders/{order}/reorder'
 */
export const reorder = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})

reorder.definition = {
    methods: ["post"],
    url: '/orders/{order}/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderController::reorder
 * @see app/Http/Controllers/OrderController.php:319
 * @route '/orders/{order}/reorder'
 */
reorder.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return reorder.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::reorder
 * @see app/Http/Controllers/OrderController.php:319
 * @route '/orders/{order}/reorder'
 */
reorder.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(args, options),
    method: 'post',
})
const OrderController = { index, create, store, initiatePayment, verifyPayment, show, cancel, track, reorder }

export default OrderController