import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductController::index
 * @see app/Http/Controllers/ProductController.php:23
 * @route '/products'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/products',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductController::index
 * @see app/Http/Controllers/ProductController.php:23
 * @route '/products'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductController::index
 * @see app/Http/Controllers/ProductController.php:23
 * @route '/products'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductController::index
 * @see app/Http/Controllers/ProductController.php:23
 * @route '/products'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProductController::relatedProducts
 * @see app/Http/Controllers/ProductController.php:126
 * @route '/products/{product}/related'
 */
export const relatedProducts = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: relatedProducts.url(args, options),
    method: 'get',
})

relatedProducts.definition = {
    methods: ["get","head"],
    url: '/products/{product}/related',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductController::relatedProducts
 * @see app/Http/Controllers/ProductController.php:126
 * @route '/products/{product}/related'
 */
relatedProducts.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return relatedProducts.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductController::relatedProducts
 * @see app/Http/Controllers/ProductController.php:126
 * @route '/products/{product}/related'
 */
relatedProducts.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: relatedProducts.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductController::relatedProducts
 * @see app/Http/Controllers/ProductController.php:126
 * @route '/products/{product}/related'
 */
relatedProducts.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: relatedProducts.url(args, options),
    method: 'head',
})
const ProductController = { index, relatedProducts }

export default ProductController