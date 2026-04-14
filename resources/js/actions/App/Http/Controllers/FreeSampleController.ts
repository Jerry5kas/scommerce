import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FreeSampleController::claim
 * @see app/Http/Controllers/FreeSampleController.php:19
 * @route '/products/{product}/free-sample/claim'
 */
export const claim = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: claim.url(args, options),
    method: 'post',
})

claim.definition = {
    methods: ["post"],
    url: '/products/{product}/free-sample/claim',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FreeSampleController::claim
 * @see app/Http/Controllers/FreeSampleController.php:19
 * @route '/products/{product}/free-sample/claim'
 */
claim.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return claim.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FreeSampleController::claim
 * @see app/Http/Controllers/FreeSampleController.php:19
 * @route '/products/{product}/free-sample/claim'
 */
claim.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: claim.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FreeSampleController::checkEligibility
 * @see app/Http/Controllers/FreeSampleController.php:44
 * @route '/products/{product}/free-sample/check'
 */
export const checkEligibility = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkEligibility.url(args, options),
    method: 'get',
})

checkEligibility.definition = {
    methods: ["get","head"],
    url: '/products/{product}/free-sample/check',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FreeSampleController::checkEligibility
 * @see app/Http/Controllers/FreeSampleController.php:44
 * @route '/products/{product}/free-sample/check'
 */
checkEligibility.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return checkEligibility.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FreeSampleController::checkEligibility
 * @see app/Http/Controllers/FreeSampleController.php:44
 * @route '/products/{product}/free-sample/check'
 */
checkEligibility.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkEligibility.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\FreeSampleController::checkEligibility
 * @see app/Http/Controllers/FreeSampleController.php:44
 * @route '/products/{product}/free-sample/check'
 */
checkEligibility.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkEligibility.url(args, options),
    method: 'head',
})
const FreeSampleController = { claim, checkEligibility }

export default FreeSampleController