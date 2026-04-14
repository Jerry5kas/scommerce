import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CatalogController::index
 * @see app/Http/Controllers/CatalogController.php:25
 * @route '/catalog'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/catalog',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CatalogController::index
 * @see app/Http/Controllers/CatalogController.php:25
 * @route '/catalog'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CatalogController::index
 * @see app/Http/Controllers/CatalogController.php:25
 * @route '/catalog'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CatalogController::index
 * @see app/Http/Controllers/CatalogController.php:25
 * @route '/catalog'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CatalogController::search
 * @see app/Http/Controllers/CatalogController.php:214
 * @route '/catalog/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/catalog/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CatalogController::search
 * @see app/Http/Controllers/CatalogController.php:214
 * @route '/catalog/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CatalogController::search
 * @see app/Http/Controllers/CatalogController.php:214
 * @route '/catalog/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CatalogController::search
 * @see app/Http/Controllers/CatalogController.php:214
 * @route '/catalog/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CatalogController::showCategory
 * @see app/Http/Controllers/CatalogController.php:59
 * @route '/categories/{category}'
 */
export const showCategory = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showCategory.url(args, options),
    method: 'get',
})

showCategory.definition = {
    methods: ["get","head"],
    url: '/categories/{category}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CatalogController::showCategory
 * @see app/Http/Controllers/CatalogController.php:59
 * @route '/categories/{category}'
 */
showCategory.url = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { category: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { category: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    category: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        category: typeof args.category === 'object'
                ? args.category.slug
                : args.category,
                }

    return showCategory.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CatalogController::showCategory
 * @see app/Http/Controllers/CatalogController.php:59
 * @route '/categories/{category}'
 */
showCategory.get = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showCategory.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CatalogController::showCategory
 * @see app/Http/Controllers/CatalogController.php:59
 * @route '/categories/{category}'
 */
showCategory.head = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showCategory.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CatalogController::showCollection
 * @see app/Http/Controllers/CatalogController.php:98
 * @route '/collections/{collection}'
 */
export const showCollection = (args: { collection: string | { slug: string } } | [collection: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showCollection.url(args, options),
    method: 'get',
})

showCollection.definition = {
    methods: ["get","head"],
    url: '/collections/{collection}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CatalogController::showCollection
 * @see app/Http/Controllers/CatalogController.php:98
 * @route '/collections/{collection}'
 */
showCollection.url = (args: { collection: string | { slug: string } } | [collection: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { collection: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { collection: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    collection: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        collection: typeof args.collection === 'object'
                ? args.collection.slug
                : args.collection,
                }

    return showCollection.definition.url
            .replace('{collection}', parsedArgs.collection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CatalogController::showCollection
 * @see app/Http/Controllers/CatalogController.php:98
 * @route '/collections/{collection}'
 */
showCollection.get = (args: { collection: string | { slug: string } } | [collection: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showCollection.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CatalogController::showCollection
 * @see app/Http/Controllers/CatalogController.php:98
 * @route '/collections/{collection}'
 */
showCollection.head = (args: { collection: string | { slug: string } } | [collection: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showCollection.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CatalogController::showProduct
 * @see app/Http/Controllers/CatalogController.php:136
 * @route '/products/{product}'
 */
export const showProduct = (args: { product: string | { slug: string } } | [product: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showProduct.url(args, options),
    method: 'get',
})

showProduct.definition = {
    methods: ["get","head"],
    url: '/products/{product}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CatalogController::showProduct
 * @see app/Http/Controllers/CatalogController.php:136
 * @route '/products/{product}'
 */
showProduct.url = (args: { product: string | { slug: string } } | [product: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { product: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    product: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        product: typeof args.product === 'object'
                ? args.product.slug
                : args.product,
                }

    return showProduct.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CatalogController::showProduct
 * @see app/Http/Controllers/CatalogController.php:136
 * @route '/products/{product}'
 */
showProduct.get = (args: { product: string | { slug: string } } | [product: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showProduct.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CatalogController::showProduct
 * @see app/Http/Controllers/CatalogController.php:136
 * @route '/products/{product}'
 */
showProduct.head = (args: { product: string | { slug: string } } | [product: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showProduct.url(args, options),
    method: 'head',
})
const CatalogController = { index, search, showCategory, showCollection, showProduct }

export default CatalogController