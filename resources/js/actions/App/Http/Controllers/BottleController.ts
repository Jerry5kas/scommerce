import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BottleController::index
 * @see app/Http/Controllers/BottleController.php:21
 * @route '/bottles'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/bottles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BottleController::index
 * @see app/Http/Controllers/BottleController.php:21
 * @route '/bottles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BottleController::index
 * @see app/Http/Controllers/BottleController.php:21
 * @route '/bottles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BottleController::index
 * @see app/Http/Controllers/BottleController.php:21
 * @route '/bottles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BottleController::getBalance
 * @see app/Http/Controllers/BottleController.php:56
 * @route '/bottles/balance'
 */
export const getBalance = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getBalance.url(options),
    method: 'get',
})

getBalance.definition = {
    methods: ["get","head"],
    url: '/bottles/balance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BottleController::getBalance
 * @see app/Http/Controllers/BottleController.php:56
 * @route '/bottles/balance'
 */
getBalance.url = (options?: RouteQueryOptions) => {
    return getBalance.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BottleController::getBalance
 * @see app/Http/Controllers/BottleController.php:56
 * @route '/bottles/balance'
 */
getBalance.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getBalance.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BottleController::getBalance
 * @see app/Http/Controllers/BottleController.php:56
 * @route '/bottles/balance'
 */
getBalance.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getBalance.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BottleController::history
 * @see app/Http/Controllers/BottleController.php:70
 * @route '/bottles/history'
 */
export const history = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})

history.definition = {
    methods: ["get","head"],
    url: '/bottles/history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BottleController::history
 * @see app/Http/Controllers/BottleController.php:70
 * @route '/bottles/history'
 */
history.url = (options?: RouteQueryOptions) => {
    return history.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BottleController::history
 * @see app/Http/Controllers/BottleController.php:70
 * @route '/bottles/history'
 */
history.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: history.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BottleController::history
 * @see app/Http/Controllers/BottleController.php:70
 * @route '/bottles/history'
 */
history.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: history.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BottleController::show
 * @see app/Http/Controllers/BottleController.php:37
 * @route '/bottles/{bottle}'
 */
export const show = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/bottles/{bottle}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BottleController::show
 * @see app/Http/Controllers/BottleController.php:37
 * @route '/bottles/{bottle}'
 */
show.url = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bottle: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { bottle: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    bottle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        bottle: typeof args.bottle === 'object'
                ? args.bottle.id
                : args.bottle,
                }

    return show.definition.url
            .replace('{bottle}', parsedArgs.bottle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BottleController::show
 * @see app/Http/Controllers/BottleController.php:37
 * @route '/bottles/{bottle}'
 */
show.get = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BottleController::show
 * @see app/Http/Controllers/BottleController.php:37
 * @route '/bottles/{bottle}'
 */
show.head = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})
const BottleController = { index, getBalance, history, show }

export default BottleController