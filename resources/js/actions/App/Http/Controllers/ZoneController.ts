import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ZoneController::index
 * @see app/Http/Controllers/ZoneController.php:21
 * @route '/location'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/location',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ZoneController::index
 * @see app/Http/Controllers/ZoneController.php:21
 * @route '/location'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ZoneController::index
 * @see app/Http/Controllers/ZoneController.php:21
 * @route '/location'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ZoneController::index
 * @see app/Http/Controllers/ZoneController.php:21
 * @route '/location'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
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
* @see \App\Http\Controllers\ZoneController::getZoneByPincode
 * @see app/Http/Controllers/ZoneController.php:63
 * @route '/location/zone/{pincode}'
 */
export const getZoneByPincode = (args: { pincode: string | number } | [pincode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getZoneByPincode.url(args, options),
    method: 'get',
})

getZoneByPincode.definition = {
    methods: ["get","head"],
    url: '/location/zone/{pincode}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ZoneController::getZoneByPincode
 * @see app/Http/Controllers/ZoneController.php:63
 * @route '/location/zone/{pincode}'
 */
getZoneByPincode.url = (args: { pincode: string | number } | [pincode: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getZoneByPincode.definition.url
            .replace('{pincode}', parsedArgs.pincode.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ZoneController::getZoneByPincode
 * @see app/Http/Controllers/ZoneController.php:63
 * @route '/location/zone/{pincode}'
 */
getZoneByPincode.get = (args: { pincode: string | number } | [pincode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getZoneByPincode.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ZoneController::getZoneByPincode
 * @see app/Http/Controllers/ZoneController.php:63
 * @route '/location/zone/{pincode}'
 */
getZoneByPincode.head = (args: { pincode: string | number } | [pincode: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getZoneByPincode.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ZoneController::setLocation
 * @see app/Http/Controllers/ZoneController.php:72
 * @route '/location/set'
 */
export const setLocation = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setLocation.url(options),
    method: 'post',
})

setLocation.definition = {
    methods: ["post"],
    url: '/location/set',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ZoneController::setLocation
 * @see app/Http/Controllers/ZoneController.php:72
 * @route '/location/set'
 */
setLocation.url = (options?: RouteQueryOptions) => {
    return setLocation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ZoneController::setLocation
 * @see app/Http/Controllers/ZoneController.php:72
 * @route '/location/set'
 */
setLocation.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setLocation.url(options),
    method: 'post',
})
const ZoneController = { index, checkServiceability, getZoneByPincode, setLocation }

export default ZoneController