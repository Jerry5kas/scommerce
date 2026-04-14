import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::getDeliveryBottles
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:22
 * @route '/api/v1/driver/deliveries/{delivery}/bottles'
 */
export const getDeliveryBottles = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDeliveryBottles.url(args, options),
    method: 'get',
})

getDeliveryBottles.definition = {
    methods: ["get","head"],
    url: '/api/v1/driver/deliveries/{delivery}/bottles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::getDeliveryBottles
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:22
 * @route '/api/v1/driver/deliveries/{delivery}/bottles'
 */
getDeliveryBottles.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return getDeliveryBottles.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::getDeliveryBottles
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:22
 * @route '/api/v1/driver/deliveries/{delivery}/bottles'
 */
getDeliveryBottles.get = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDeliveryBottles.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::getDeliveryBottles
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:22
 * @route '/api/v1/driver/deliveries/{delivery}/bottles'
 */
getDeliveryBottles.head = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDeliveryBottles.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::returnBottle
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:53
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/return'
 */
export const returnBottle = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: returnBottle.url(args, options),
    method: 'post',
})

returnBottle.definition = {
    methods: ["post"],
    url: '/api/v1/driver/deliveries/{delivery}/bottles/return',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::returnBottle
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:53
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/return'
 */
returnBottle.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return returnBottle.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::returnBottle
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:53
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/return'
 */
returnBottle.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: returnBottle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::issueBottle
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:96
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/issue'
 */
export const issueBottle = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: issueBottle.url(args, options),
    method: 'post',
})

issueBottle.definition = {
    methods: ["post"],
    url: '/api/v1/driver/deliveries/{delivery}/bottles/issue',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::issueBottle
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:96
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/issue'
 */
issueBottle.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return issueBottle.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::issueBottle
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:96
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/issue'
 */
issueBottle.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: issueBottle.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::markDamaged
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:144
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/damaged'
 */
export const markDamaged = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markDamaged.url(args, options),
    method: 'post',
})

markDamaged.definition = {
    methods: ["post"],
    url: '/api/v1/driver/deliveries/{delivery}/bottles/damaged',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::markDamaged
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:144
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/damaged'
 */
markDamaged.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return markDamaged.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::markDamaged
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:144
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/damaged'
 */
markDamaged.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markDamaged.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::scanBarcode
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:177
 * @route '/api/v1/driver/bottles/scan'
 */
export const scanBarcode = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: scanBarcode.url(options),
    method: 'post',
})

scanBarcode.definition = {
    methods: ["post"],
    url: '/api/v1/driver/bottles/scan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::scanBarcode
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:177
 * @route '/api/v1/driver/bottles/scan'
 */
scanBarcode.url = (options?: RouteQueryOptions) => {
    return scanBarcode.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::scanBarcode
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:177
 * @route '/api/v1/driver/bottles/scan'
 */
scanBarcode.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: scanBarcode.url(options),
    method: 'post',
})
const BottleController = { getDeliveryBottles, returnBottle, issueBottle, markDamaged, scanBarcode }

export default BottleController