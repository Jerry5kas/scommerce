import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\WishlistController::index
 * @see app/Http/Controllers/WishlistController.php:13
 * @route '/wishlist'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/wishlist',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WishlistController::index
 * @see app/Http/Controllers/WishlistController.php:13
 * @route '/wishlist'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WishlistController::index
 * @see app/Http/Controllers/WishlistController.php:13
 * @route '/wishlist'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WishlistController::index
 * @see app/Http/Controllers/WishlistController.php:13
 * @route '/wishlist'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WishlistController::toggle
 * @see app/Http/Controllers/WishlistController.php:55
 * @route '/wishlist/toggle/{product}'
 */
export const toggle = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})

toggle.definition = {
    methods: ["post"],
    url: '/wishlist/toggle/{product}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WishlistController::toggle
 * @see app/Http/Controllers/WishlistController.php:55
 * @route '/wishlist/toggle/{product}'
 */
toggle.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { product: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    product: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        product: typeof args.product === 'object'
                ? args.product.id
                : args.product,
                }

    return toggle.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WishlistController::toggle
 * @see app/Http/Controllers/WishlistController.php:55
 * @route '/wishlist/toggle/{product}'
 */
toggle.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggle.url(args, options),
    method: 'post',
})
const WishlistController = { index, toggle }

export default WishlistController