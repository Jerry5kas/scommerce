import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import addresses2498c9 from './addresses'
/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:13
 * @route '/profile'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:13
 * @route '/profile'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:13
 * @route '/profile'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::index
 * @see app/Http/Controllers/UserController.php:13
 * @route '/profile'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\UserController::update
 * @see app/Http/Controllers/UserController.php:30
 * @route '/profile'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/profile',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\UserController::update
 * @see app/Http/Controllers/UserController.php:30
 * @route '/profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::update
 * @see app/Http/Controllers/UserController.php:30
 * @route '/profile'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\UserAddressController::addresses
 * @see app/Http/Controllers/UserAddressController.php:55
 * @route '/profile/addresses'
 */
export const addresses = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: addresses.url(options),
    method: 'get',
})

addresses.definition = {
    methods: ["get","head"],
    url: '/profile/addresses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserAddressController::addresses
 * @see app/Http/Controllers/UserAddressController.php:55
 * @route '/profile/addresses'
 */
addresses.url = (options?: RouteQueryOptions) => {
    return addresses.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAddressController::addresses
 * @see app/Http/Controllers/UserAddressController.php:55
 * @route '/profile/addresses'
 */
addresses.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: addresses.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserAddressController::addresses
 * @see app/Http/Controllers/UserAddressController.php:55
 * @route '/profile/addresses'
 */
addresses.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: addresses.url(options),
    method: 'head',
})
const profile = {
    index: Object.assign(index, index),
update: Object.assign(update, update),
addresses: Object.assign(addresses, addresses2498c9),
}

export default profile