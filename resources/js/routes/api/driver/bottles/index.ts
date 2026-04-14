import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::forDelivery
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:22
 * @route '/api/v1/driver/deliveries/{delivery}/bottles'
 */
export const forDelivery = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: forDelivery.url(args, options),
    method: 'get',
})

forDelivery.definition = {
    methods: ["get","head"],
    url: '/api/v1/driver/deliveries/{delivery}/bottles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::forDelivery
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:22
 * @route '/api/v1/driver/deliveries/{delivery}/bottles'
 */
forDelivery.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return forDelivery.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::forDelivery
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:22
 * @route '/api/v1/driver/deliveries/{delivery}/bottles'
 */
forDelivery.get = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: forDelivery.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::forDelivery
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:22
 * @route '/api/v1/driver/deliveries/{delivery}/bottles'
 */
forDelivery.head = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: forDelivery.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::returnMethod
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:53
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/return'
 */
export const returnMethod = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: returnMethod.url(args, options),
    method: 'post',
})

returnMethod.definition = {
    methods: ["post"],
    url: '/api/v1/driver/deliveries/{delivery}/bottles/return',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::returnMethod
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:53
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/return'
 */
returnMethod.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return returnMethod.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::returnMethod
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:53
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/return'
 */
returnMethod.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: returnMethod.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::issue
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:96
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/issue'
 */
export const issue = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: issue.url(args, options),
    method: 'post',
})

issue.definition = {
    methods: ["post"],
    url: '/api/v1/driver/deliveries/{delivery}/bottles/issue',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::issue
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:96
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/issue'
 */
issue.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return issue.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::issue
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:96
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/issue'
 */
issue.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: issue.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::damaged
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:144
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/damaged'
 */
export const damaged = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: damaged.url(args, options),
    method: 'post',
})

damaged.definition = {
    methods: ["post"],
    url: '/api/v1/driver/deliveries/{delivery}/bottles/damaged',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::damaged
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:144
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/damaged'
 */
damaged.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return damaged.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::damaged
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:144
 * @route '/api/v1/driver/deliveries/{delivery}/bottles/damaged'
 */
damaged.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: damaged.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::scan
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:177
 * @route '/api/v1/driver/bottles/scan'
 */
export const scan = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: scan.url(options),
    method: 'post',
})

scan.definition = {
    methods: ["post"],
    url: '/api/v1/driver/bottles/scan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::scan
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:177
 * @route '/api/v1/driver/bottles/scan'
 */
scan.url = (options?: RouteQueryOptions) => {
    return scan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\BottleController::scan
 * @see app/Http/Controllers/Api/V1/Driver/BottleController.php:177
 * @route '/api/v1/driver/bottles/scan'
 */
scan.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: scan.url(options),
    method: 'post',
})
const bottles = {
    forDelivery: Object.assign(forDelivery, forDelivery),
return: Object.assign(returnMethod, returnMethod),
issue: Object.assign(issue, issue),
damaged: Object.assign(damaged, damaged),
scan: Object.assign(scan, scan),
}

export default bottles