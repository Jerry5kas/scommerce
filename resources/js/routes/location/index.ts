import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ZoneController::select
 * @see app/Http/Controllers/ZoneController.php:21
 * @route '/location'
 */
export const select = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: select.url(options),
    method: 'get',
})

select.definition = {
    methods: ["get","head"],
    url: '/location',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ZoneController::select
 * @see app/Http/Controllers/ZoneController.php:21
 * @route '/location'
 */
select.url = (options?: RouteQueryOptions) => {
    return select.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ZoneController::select
 * @see app/Http/Controllers/ZoneController.php:21
 * @route '/location'
 */
select.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: select.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ZoneController::select
 * @see app/Http/Controllers/ZoneController.php:21
 * @route '/location'
 */
select.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: select.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ZoneController::checkServiceability
 * @see app/Http/Controllers/ZoneController.php:44
 * @route '/location/check-serviceability'
 */
export const checkServiceability = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkServiceability.url(options),
    method: 'post',
})

checkServiceability.definition = {
    methods: ["post"],
    url: '/location/check-serviceability',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ZoneController::checkServiceability
 * @see app/Http/Controllers/ZoneController.php:44
 * @route '/location/check-serviceability'
 */
checkServiceability.url = (options?: RouteQueryOptions) => {
    return checkServiceability.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ZoneController::checkServiceability
 * @see app/Http/Controllers/ZoneController.php:44
 * @route '/location/check-serviceability'
 */
checkServiceability.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkServiceability.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ZoneController::zoneByPincode
 * @see app/Http/Controllers/ZoneController.php:63
 * @route '/location/zone/{pincode}'
 */
export const zoneByPincode = (args: { pincode: string | number } | [pincode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: zoneByPincode.url(args, options),
    method: 'get',
})

zoneByPincode.definition = {
    methods: ["get","head"],
    url: '/location/zone/{pincode}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ZoneController::zoneByPincode
 * @see app/Http/Controllers/ZoneController.php:63
 * @route '/location/zone/{pincode}'
 */
zoneByPincode.url = (args: { pincode: string | number } | [pincode: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pincode: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    pincode: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pincode: args.pincode,
                }

    return zoneByPincode.definition.url
            .replace('{pincode}', parsedArgs.pincode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ZoneController::zoneByPincode
 * @see app/Http/Controllers/ZoneController.php:63
 * @route '/location/zone/{pincode}'
 */
zoneByPincode.get = (args: { pincode: string | number } | [pincode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: zoneByPincode.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ZoneController::zoneByPincode
 * @see app/Http/Controllers/ZoneController.php:63
 * @route '/location/zone/{pincode}'
 */
zoneByPincode.head = (args: { pincode: string | number } | [pincode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: zoneByPincode.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ZoneController::set
 * @see app/Http/Controllers/ZoneController.php:72
 * @route '/location/set'
 */
export const set = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: set.url(options),
    method: 'post',
})

set.definition = {
    methods: ["post"],
    url: '/location/set',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ZoneController::set
 * @see app/Http/Controllers/ZoneController.php:72
 * @route '/location/set'
 */
set.url = (options?: RouteQueryOptions) => {
    return set.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ZoneController::set
 * @see app/Http/Controllers/ZoneController.php:72
 * @route '/location/set'
 */
set.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: set.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\UserAddressController::addresses
 * @see app/Http/Controllers/UserAddressController.php:16
 * @route '/location/addresses'
 */
export const addresses = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: addresses.url(options),
    method: 'get',
})

addresses.definition = {
    methods: ["get","head"],
    url: '/location/addresses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserAddressController::addresses
 * @see app/Http/Controllers/UserAddressController.php:16
 * @route '/location/addresses'
 */
addresses.url = (options?: RouteQueryOptions) => {
    return addresses.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserAddressController::addresses
 * @see app/Http/Controllers/UserAddressController.php:16
 * @route '/location/addresses'
 */
addresses.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: addresses.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserAddressController::addresses
 * @see app/Http/Controllers/UserAddressController.php:16
 * @route '/location/addresses'
 */
addresses.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: addresses.url(options),
    method: 'head',
})
const location = {
    select: Object.assign(select, select),
checkServiceability: Object.assign(checkServiceability, checkServiceability),
zoneByPincode: Object.assign(zoneByPincode, zoneByPincode),
set: Object.assign(set, set),
addresses: Object.assign(addresses, addresses),
}

export default location