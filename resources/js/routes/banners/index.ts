import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\BannerController::index
 * @see app/Http/Controllers/BannerController.php:16
 * @route '/banners'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/banners',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BannerController::index
 * @see app/Http/Controllers/BannerController.php:16
 * @route '/banners'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BannerController::index
 * @see app/Http/Controllers/BannerController.php:16
 * @route '/banners'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BannerController::index
 * @see app/Http/Controllers/BannerController.php:16
 * @route '/banners'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const banners = {
    index: Object.assign(index, index),
}

export default banners