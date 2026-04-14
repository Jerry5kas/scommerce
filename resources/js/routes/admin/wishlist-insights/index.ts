import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\WishlistController::index
 * @see app/Http/Controllers/Admin/WishlistController.php:13
 * @route '/admin/wishlist-insights'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/wishlist-insights',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\WishlistController::index
 * @see app/Http/Controllers/Admin/WishlistController.php:13
 * @route '/admin/wishlist-insights'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WishlistController::index
 * @see app/Http/Controllers/Admin/WishlistController.php:13
 * @route '/admin/wishlist-insights'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\WishlistController::index
 * @see app/Http/Controllers/Admin/WishlistController.php:13
 * @route '/admin/wishlist-insights'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const wishlistInsights = {
    index: Object.assign(index, index),
}

export default wishlistInsights