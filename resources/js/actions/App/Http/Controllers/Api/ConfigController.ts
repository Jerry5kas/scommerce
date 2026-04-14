import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ConfigController::googleMapsKey
 * @see app/Http/Controllers/Api/ConfigController.php:9
 * @route '/api/google-maps-key'
 */
export const googleMapsKey = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: googleMapsKey.url(options),
    method: 'get',
})

googleMapsKey.definition = {
    methods: ["get","head"],
    url: '/api/google-maps-key',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ConfigController::googleMapsKey
 * @see app/Http/Controllers/Api/ConfigController.php:9
 * @route '/api/google-maps-key'
 */
googleMapsKey.url = (options?: RouteQueryOptions) => {
    return googleMapsKey.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ConfigController::googleMapsKey
 * @see app/Http/Controllers/Api/ConfigController.php:9
 * @route '/api/google-maps-key'
 */
googleMapsKey.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: googleMapsKey.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ConfigController::googleMapsKey
 * @see app/Http/Controllers/Api/ConfigController.php:9
 * @route '/api/google-maps-key'
 */
googleMapsKey.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: googleMapsKey.url(options),
    method: 'head',
})
const ConfigController = { googleMapsKey }

export default ConfigController