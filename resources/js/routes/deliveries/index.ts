import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DeliveryController::index
 * @see app/Http/Controllers/DeliveryController.php:23
 * @route '/deliveries'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/deliveries',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DeliveryController::index
 * @see app/Http/Controllers/DeliveryController.php:23
 * @route '/deliveries'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeliveryController::index
 * @see app/Http/Controllers/DeliveryController.php:23
 * @route '/deliveries'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DeliveryController::index
 * @see app/Http/Controllers/DeliveryController.php:23
 * @route '/deliveries'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DeliveryController::show
 * @see app/Http/Controllers/DeliveryController.php:50
 * @route '/deliveries/{delivery}'
 */
export const show = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/deliveries/{delivery}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DeliveryController::show
 * @see app/Http/Controllers/DeliveryController.php:50
 * @route '/deliveries/{delivery}'
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
* @see \App\Http\Controllers\DeliveryController::show
 * @see app/Http/Controllers/DeliveryController.php:50
 * @route '/deliveries/{delivery}'
 */
show.get = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DeliveryController::show
 * @see app/Http/Controllers/DeliveryController.php:50
 * @route '/deliveries/{delivery}'
 */
show.head = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DeliveryController::track
 * @see app/Http/Controllers/DeliveryController.php:73
 * @route '/deliveries/{delivery}/track'
 */
export const track = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: track.url(args, options),
    method: 'get',
})

track.definition = {
    methods: ["get","head"],
    url: '/deliveries/{delivery}/track',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DeliveryController::track
 * @see app/Http/Controllers/DeliveryController.php:73
 * @route '/deliveries/{delivery}/track'
 */
track.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return track.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeliveryController::track
 * @see app/Http/Controllers/DeliveryController.php:73
 * @route '/deliveries/{delivery}/track'
 */
track.get = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: track.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DeliveryController::track
 * @see app/Http/Controllers/DeliveryController.php:73
 * @route '/deliveries/{delivery}/track'
 */
track.head = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: track.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DeliveryController::status
 * @see app/Http/Controllers/DeliveryController.php:101
 * @route '/deliveries/{delivery}/status'
 */
export const status = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/deliveries/{delivery}/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DeliveryController::status
 * @see app/Http/Controllers/DeliveryController.php:101
 * @route '/deliveries/{delivery}/status'
 */
status.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return status.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeliveryController::status
 * @see app/Http/Controllers/DeliveryController.php:101
 * @route '/deliveries/{delivery}/status'
 */
status.get = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DeliveryController::status
 * @see app/Http/Controllers/DeliveryController.php:101
 * @route '/deliveries/{delivery}/status'
 */
status.head = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DeliveryController::liveTracking
 * @see app/Http/Controllers/DeliveryController.php:130
 * @route '/deliveries/{delivery}/live-tracking'
 */
export const liveTracking = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: liveTracking.url(args, options),
    method: 'get',
})

liveTracking.definition = {
    methods: ["get","head"],
    url: '/deliveries/{delivery}/live-tracking',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DeliveryController::liveTracking
 * @see app/Http/Controllers/DeliveryController.php:130
 * @route '/deliveries/{delivery}/live-tracking'
 */
liveTracking.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return liveTracking.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DeliveryController::liveTracking
 * @see app/Http/Controllers/DeliveryController.php:130
 * @route '/deliveries/{delivery}/live-tracking'
 */
liveTracking.get = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: liveTracking.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DeliveryController::liveTracking
 * @see app/Http/Controllers/DeliveryController.php:130
 * @route '/deliveries/{delivery}/live-tracking'
 */
liveTracking.head = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: liveTracking.url(args, options),
    method: 'head',
})
const deliveries = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
track: Object.assign(track, track),
status: Object.assign(status, status),
liveTracking: Object.assign(liveTracking, liveTracking),
}

export default deliveries