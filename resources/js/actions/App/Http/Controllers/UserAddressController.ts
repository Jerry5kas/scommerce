import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UserAddressController::forLocation
 * @see app/Http/Controllers/UserAddressController.php:16
 * @route '/location/addresses'
 */
export const forLocation = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: forLocation.url(options),
    method: 'get',
})

forLocation.definition = {
    methods: ["get","head"],
    url: '/location/addresses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserAddressController::forLocation
 * @see app/Http/Controllers/UserAddressController.php:16
 * @route '/location/addresses'
 */
forLocation.url = (options?: RouteQueryOptions) => {
    return forLocation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAddressController::forLocation
 * @see app/Http/Controllers/UserAddressController.php:16
 * @route '/location/addresses'
 */
forLocation.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: forLocation.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserAddressController::forLocation
 * @see app/Http/Controllers/UserAddressController.php:16
 * @route '/location/addresses'
 */
forLocation.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: forLocation.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserAddressController::index
 * @see app/Http/Controllers/UserAddressController.php:55
 * @route '/profile/addresses'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/profile/addresses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserAddressController::index
 * @see app/Http/Controllers/UserAddressController.php:55
 * @route '/profile/addresses'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAddressController::index
 * @see app/Http/Controllers/UserAddressController.php:55
 * @route '/profile/addresses'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserAddressController::index
 * @see app/Http/Controllers/UserAddressController.php:55
 * @route '/profile/addresses'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserAddressController::store
 * @see app/Http/Controllers/UserAddressController.php:69
 * @route '/profile/addresses'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/profile/addresses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserAddressController::store
 * @see app/Http/Controllers/UserAddressController.php:69
 * @route '/profile/addresses'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAddressController::store
 * @see app/Http/Controllers/UserAddressController.php:69
 * @route '/profile/addresses'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAddressController::update
 * @see app/Http/Controllers/UserAddressController.php:82
 * @route '/profile/addresses/{address}'
 */
export const update = (args: { address: number | { id: number } } | [address: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/profile/addresses/{address}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\UserAddressController::update
 * @see app/Http/Controllers/UserAddressController.php:82
 * @route '/profile/addresses/{address}'
 */
update.url = (args: { address: number | { id: number } } | [address: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { address: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { address: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    address: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        address: typeof args.address === 'object'
                ? args.address.id
                : args.address,
                }

    return update.definition.url
            .replace('{address}', parsedArgs.address.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAddressController::update
 * @see app/Http/Controllers/UserAddressController.php:82
 * @route '/profile/addresses/{address}'
 */
update.put = (args: { address: number | { id: number } } | [address: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\UserAddressController::destroy
 * @see app/Http/Controllers/UserAddressController.php:94
 * @route '/profile/addresses/{address}'
 */
export const destroy = (args: { address: number | { id: number } } | [address: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/profile/addresses/{address}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\UserAddressController::destroy
 * @see app/Http/Controllers/UserAddressController.php:94
 * @route '/profile/addresses/{address}'
 */
destroy.url = (args: { address: number | { id: number } } | [address: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { address: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { address: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    address: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        address: typeof args.address === 'object'
                ? args.address.id
                : args.address,
                }

    return destroy.definition.url
            .replace('{address}', parsedArgs.address.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAddressController::destroy
 * @see app/Http/Controllers/UserAddressController.php:94
 * @route '/profile/addresses/{address}'
 */
destroy.delete = (args: { address: number | { id: number } } | [address: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\UserAddressController::setDefault
 * @see app/Http/Controllers/UserAddressController.php:104
 * @route '/profile/addresses/{address}/default'
 */
export const setDefault = (args: { address: number | { id: number } } | [address: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setDefault.url(args, options),
    method: 'post',
})

setDefault.definition = {
    methods: ["post"],
    url: '/profile/addresses/{address}/default',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\UserAddressController::setDefault
 * @see app/Http/Controllers/UserAddressController.php:104
 * @route '/profile/addresses/{address}/default'
 */
setDefault.url = (args: { address: number | { id: number } } | [address: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { address: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { address: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    address: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        address: typeof args.address === 'object'
                ? args.address.id
                : args.address,
                }

    return setDefault.definition.url
            .replace('{address}', parsedArgs.address.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAddressController::setDefault
 * @see app/Http/Controllers/UserAddressController.php:104
 * @route '/profile/addresses/{address}/default'
 */
setDefault.post = (args: { address: number | { id: number } } | [address: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setDefault.url(args, options),
    method: 'post',
})
const UserAddressController = { forLocation, index, store, update, destroy, setDefault }

export default UserAddressController