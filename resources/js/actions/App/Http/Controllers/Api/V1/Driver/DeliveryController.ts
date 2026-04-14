import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
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
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::getRoute
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:214
 * @route '/api/v1/driver/deliveries/route'
 */
export const getRoute = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRoute.url(options),
    method: 'get',
})

getRoute.definition = {
    methods: ["get","head"],
    url: '/api/v1/driver/deliveries/route',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::getRoute
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:214
 * @route '/api/v1/driver/deliveries/route'
 */
getRoute.url = (options?: RouteQueryOptions) => {
    return getRoute.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::getRoute
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:214
 * @route '/api/v1/driver/deliveries/route'
 */
getRoute.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRoute.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::getRoute
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:214
 * @route '/api/v1/driver/deliveries/route'
 */
getRoute.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getRoute.url(options),
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
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::startDelivery
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:66
 * @route '/api/v1/driver/deliveries/{delivery}/start'
 */
export const startDelivery = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: startDelivery.url(args, options),
    method: 'post',
})

startDelivery.definition = {
    methods: ["post"],
    url: '/api/v1/driver/deliveries/{delivery}/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::startDelivery
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:66
 * @route '/api/v1/driver/deliveries/{delivery}/start'
 */
startDelivery.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return startDelivery.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::startDelivery
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:66
 * @route '/api/v1/driver/deliveries/{delivery}/start'
 */
startDelivery.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: startDelivery.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::updateLocation
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:99
 * @route '/api/v1/driver/deliveries/{delivery}/location'
 */
export const updateLocation = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateLocation.url(args, options),
    method: 'post',
})

updateLocation.definition = {
    methods: ["post"],
    url: '/api/v1/driver/deliveries/{delivery}/location',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::updateLocation
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:99
 * @route '/api/v1/driver/deliveries/{delivery}/location'
 */
updateLocation.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateLocation.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::updateLocation
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:99
 * @route '/api/v1/driver/deliveries/{delivery}/location'
 */
updateLocation.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateLocation.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::completeDelivery
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:136
 * @route '/api/v1/driver/deliveries/{delivery}/complete'
 */
export const completeDelivery = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completeDelivery.url(args, options),
    method: 'post',
})

completeDelivery.definition = {
    methods: ["post"],
    url: '/api/v1/driver/deliveries/{delivery}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::completeDelivery
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:136
 * @route '/api/v1/driver/deliveries/{delivery}/complete'
 */
completeDelivery.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return completeDelivery.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::completeDelivery
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:136
 * @route '/api/v1/driver/deliveries/{delivery}/complete'
 */
completeDelivery.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completeDelivery.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::failDelivery
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:184
 * @route '/api/v1/driver/deliveries/{delivery}/fail'
 */
export const failDelivery = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: failDelivery.url(args, options),
    method: 'post',
})

failDelivery.definition = {
    methods: ["post"],
    url: '/api/v1/driver/deliveries/{delivery}/fail',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::failDelivery
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:184
 * @route '/api/v1/driver/deliveries/{delivery}/fail'
 */
failDelivery.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return failDelivery.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::failDelivery
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:184
 * @route '/api/v1/driver/deliveries/{delivery}/fail'
 */
failDelivery.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: failDelivery.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::batchUpdateLocation
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:256
 * @route '/api/v1/driver/location/batch'
 */
export const batchUpdateLocation = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: batchUpdateLocation.url(options),
    method: 'post',
})

batchUpdateLocation.definition = {
    methods: ["post"],
    url: '/api/v1/driver/location/batch',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::batchUpdateLocation
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:256
 * @route '/api/v1/driver/location/batch'
 */
batchUpdateLocation.url = (options?: RouteQueryOptions) => {
    return batchUpdateLocation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::batchUpdateLocation
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:256
 * @route '/api/v1/driver/location/batch'
 */
batchUpdateLocation.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: batchUpdateLocation.url(options),
    method: 'post',
})
const DeliveryController = { index, getRoute, show, startDelivery, updateLocation, completeDelivery, failDelivery, batchUpdateLocation }

export default DeliveryController