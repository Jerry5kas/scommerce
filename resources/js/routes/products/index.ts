import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import freeSample from './free-sample'
/**
* @see \App\Http\Controllers\ProductController::related
 * @see app/Http/Controllers/ProductController.php:126
 * @route '/products/{product}/related'
 */
export const related = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: related.url(args, options),
    method: 'get',
})

related.definition = {
    methods: ["get","head"],
    url: '/products/{product}/related',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductController::related
 * @see app/Http/Controllers/ProductController.php:126
 * @route '/products/{product}/related'
 */
related.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return related.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductController::related
 * @see app/Http/Controllers/ProductController.php:126
 * @route '/products/{product}/related'
 */
related.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: related.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductController::related
 * @see app/Http/Controllers/ProductController.php:126
 * @route '/products/{product}/related'
 */
related.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: related.url(args, options),
    method: 'head',
})
const products = {
    related: Object.assign(related, related),
freeSample: Object.assign(freeSample, freeSample),
}

export default products