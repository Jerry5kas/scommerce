import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CatalogController::home
 * @see app/Http/Controllers/CatalogController.php:25
 * @route '/catalog'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})

home.definition = {
    methods: ["get","head"],
    url: '/catalog',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CatalogController::home
 * @see app/Http/Controllers/CatalogController.php:25
 * @route '/catalog'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CatalogController::home
 * @see app/Http/Controllers/CatalogController.php:25
 * @route '/catalog'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CatalogController::home
 * @see app/Http/Controllers/CatalogController.php:25
 * @route '/catalog'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
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
* @see \App\Http\Controllers\CatalogController::category
 * @see app/Http/Controllers/CatalogController.php:59
 * @route '/categories/{category}'
 */
export const category = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: category.url(args, options),
    method: 'get',
})

category.definition = {
    methods: ["get","head"],
    url: '/categories/{category}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CatalogController::category
 * @see app/Http/Controllers/CatalogController.php:59
 * @route '/categories/{category}'
 */
category.url = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return category.definition.url
            .replace('{category}', parsedArgs.category.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CatalogController::category
 * @see app/Http/Controllers/CatalogController.php:59
 * @route '/categories/{category}'
 */
category.get = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: category.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CatalogController::category
 * @see app/Http/Controllers/CatalogController.php:59
 * @route '/categories/{category}'
 */
category.head = (args: { category: string | { slug: string } } | [category: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: category.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CatalogController::collection
 * @see app/Http/Controllers/CatalogController.php:98
 * @route '/collections/{collection}'
 */
export const collection = (args: { collection: string | { slug: string } } | [collection: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: collection.url(args, options),
    method: 'get',
})

collection.definition = {
    methods: ["get","head"],
    url: '/collections/{collection}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CatalogController::collection
 * @see app/Http/Controllers/CatalogController.php:98
 * @route '/collections/{collection}'
 */
collection.url = (args: { collection: string | { slug: string } } | [collection: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return collection.definition.url
            .replace('{collection}', parsedArgs.collection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CatalogController::collection
 * @see app/Http/Controllers/CatalogController.php:98
 * @route '/collections/{collection}'
 */
collection.get = (args: { collection: string | { slug: string } } | [collection: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: collection.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CatalogController::collection
 * @see app/Http/Controllers/CatalogController.php:98
 * @route '/collections/{collection}'
 */
collection.head = (args: { collection: string | { slug: string } } | [collection: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: collection.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CatalogController::product
 * @see app/Http/Controllers/CatalogController.php:136
 * @route '/products/{product}'
 */
export const product = (args: { product: string | { slug: string } } | [product: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: product.url(args, options),
    method: 'get',
})

product.definition = {
    methods: ["get","head"],
    url: '/products/{product}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CatalogController::product
 * @see app/Http/Controllers/CatalogController.php:136
 * @route '/products/{product}'
 */
product.url = (args: { product: string | { slug: string } } | [product: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
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

    return product.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CatalogController::product
 * @see app/Http/Controllers/CatalogController.php:136
 * @route '/products/{product}'
 */
product.get = (args: { product: string | { slug: string } } | [product: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: product.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CatalogController::product
 * @see app/Http/Controllers/CatalogController.php:136
 * @route '/products/{product}'
 */
product.head = (args: { product: string | { slug: string } } | [product: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: product.url(args, options),
    method: 'head',
})
const catalog = {
    home: Object.assign(home, home),
search: Object.assign(search, search),
category: Object.assign(category, category),
collection: Object.assign(collection, collection),
product: Object.assign(product, product),
}

export default catalog