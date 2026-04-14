import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::index
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:28
 * @route '/api/v1/driver/deliveries'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/driver/deliveries',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::index
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:28
 * @route '/api/v1/driver/deliveries'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::index
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:28
 * @route '/api/v1/driver/deliveries'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::index
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:28
 * @route '/api/v1/driver/deliveries'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::route
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:214
 * @route '/api/v1/driver/deliveries/route'
 */
export const route = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: route.url(options),
    method: 'get',
})

route.definition = {
    methods: ["get","head"],
    url: '/api/v1/driver/deliveries/route',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::route
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:214
 * @route '/api/v1/driver/deliveries/route'
 */
route.url = (options?: RouteQueryOptions) => {
    return route.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::route
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:214
 * @route '/api/v1/driver/deliveries/route'
 */
route.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: route.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::route
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:214
 * @route '/api/v1/driver/deliveries/route'
 */
route.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: route.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::show
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:46
 * @route '/api/v1/driver/deliveries/{delivery}'
 */
export const show = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/v1/driver/deliveries/{delivery}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::show
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:46
 * @route '/api/v1/driver/deliveries/{delivery}'
 */
show.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { delivery: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { delivery: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    delivery: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        delivery: typeof args.delivery === 'object'
                ? args.delivery.id
                : args.delivery,
                }

    return show.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::show
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:46
 * @route '/api/v1/driver/deliveries/{delivery}'
 */
show.get = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::show
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:46
 * @route '/api/v1/driver/deliveries/{delivery}'
 */
show.head = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::start
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:66
 * @route '/api/v1/driver/deliveries/{delivery}/start'
 */
export const start = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/api/v1/driver/deliveries/{delivery}/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::start
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:66
 * @route '/api/v1/driver/deliveries/{delivery}/start'
 */
start.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { delivery: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { delivery: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    delivery: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        delivery: typeof args.delivery === 'object'
                ? args.delivery.id
                : args.delivery,
                }

    return start.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::start
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:66
 * @route '/api/v1/driver/deliveries/{delivery}/start'
 */
start.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::location
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:99
 * @route '/api/v1/driver/deliveries/{delivery}/location'
 */
export const location = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: location.url(args, options),
    method: 'post',
})

location.definition = {
    methods: ["post"],
    url: '/api/v1/driver/deliveries/{delivery}/location',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::location
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:99
 * @route '/api/v1/driver/deliveries/{delivery}/location'
 */
location.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { delivery: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { delivery: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    delivery: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        delivery: typeof args.delivery === 'object'
                ? args.delivery.id
                : args.delivery,
                }

    return location.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::location
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:99
 * @route '/api/v1/driver/deliveries/{delivery}/location'
 */
location.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: location.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::complete
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:136
 * @route '/api/v1/driver/deliveries/{delivery}/complete'
 */
export const complete = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/api/v1/driver/deliveries/{delivery}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::complete
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:136
 * @route '/api/v1/driver/deliveries/{delivery}/complete'
 */
complete.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { delivery: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { delivery: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    delivery: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        delivery: typeof args.delivery === 'object'
                ? args.delivery.id
                : args.delivery,
                }

    return complete.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::complete
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:136
 * @route '/api/v1/driver/deliveries/{delivery}/complete'
 */
complete.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::fail
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:184
 * @route '/api/v1/driver/deliveries/{delivery}/fail'
 */
export const fail = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: fail.url(args, options),
    method: 'post',
})

fail.definition = {
    methods: ["post"],
    url: '/api/v1/driver/deliveries/{delivery}/fail',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::fail
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:184
 * @route '/api/v1/driver/deliveries/{delivery}/fail'
 */
fail.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { delivery: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { delivery: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    delivery: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        delivery: typeof args.delivery === 'object'
                ? args.delivery.id
                : args.delivery,
                }

    return fail.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::fail
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:184
 * @route '/api/v1/driver/deliveries/{delivery}/fail'
 */
fail.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: fail.url(args, options),
    method: 'post',
})
const deliveries = {
    index: Object.assign(index, index),
route: Object.assign(route, route),
show: Object.assign(show, show),
start: Object.assign(start, start),
location: Object.assign(location, location),
complete: Object.assign(complete, complete),
fail: Object.assign(fail, fail),
}

export default deliveries