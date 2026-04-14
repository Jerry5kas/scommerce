import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\LoyaltyController::index
 * @see app/Http/Controllers/Admin/LoyaltyController.php:23
 * @route '/admin/loyalty'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/loyalty',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LoyaltyController::index
 * @see app/Http/Controllers/Admin/LoyaltyController.php:23
 * @route '/admin/loyalty'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LoyaltyController::index
 * @see app/Http/Controllers/Admin/LoyaltyController.php:23
 * @route '/admin/loyalty'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\LoyaltyController::index
 * @see app/Http/Controllers/Admin/LoyaltyController.php:23
 * @route '/admin/loyalty'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LoyaltyController::show
 * @see app/Http/Controllers/Admin/LoyaltyController.php:66
 * @route '/admin/loyalty/{loyaltyPoint}'
 */
export const show = (args: { loyaltyPoint: number | { id: number } } | [loyaltyPoint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/loyalty/{loyaltyPoint}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LoyaltyController::show
 * @see app/Http/Controllers/Admin/LoyaltyController.php:66
 * @route '/admin/loyalty/{loyaltyPoint}'
 */
show.url = (args: { loyaltyPoint: number | { id: number } } | [loyaltyPoint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { loyaltyPoint: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { loyaltyPoint: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    loyaltyPoint: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        loyaltyPoint: typeof args.loyaltyPoint === 'object'
                ? args.loyaltyPoint.id
                : args.loyaltyPoint,
                }

    return show.definition.url
            .replace('{loyaltyPoint}', parsedArgs.loyaltyPoint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LoyaltyController::show
 * @see app/Http/Controllers/Admin/LoyaltyController.php:66
 * @route '/admin/loyalty/{loyaltyPoint}'
 */
show.get = (args: { loyaltyPoint: number | { id: number } } | [loyaltyPoint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\LoyaltyController::show
 * @see app/Http/Controllers/Admin/LoyaltyController.php:66
 * @route '/admin/loyalty/{loyaltyPoint}'
 */
show.head = (args: { loyaltyPoint: number | { id: number } } | [loyaltyPoint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LoyaltyController::adjust
 * @see app/Http/Controllers/Admin/LoyaltyController.php:0
 * @route '/admin/loyalty/{loyaltyPoint}/adjust'
 */
export const adjust = (args: { loyaltyPoint: string | number } | [loyaltyPoint: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adjust.url(args, options),
    method: 'post',
})

adjust.definition = {
    methods: ["post"],
    url: '/admin/loyalty/{loyaltyPoint}/adjust',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\LoyaltyController::adjust
 * @see app/Http/Controllers/Admin/LoyaltyController.php:0
 * @route '/admin/loyalty/{loyaltyPoint}/adjust'
 */
adjust.url = (args: { loyaltyPoint: string | number } | [loyaltyPoint: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { loyaltyPoint: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    loyaltyPoint: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        loyaltyPoint: args.loyaltyPoint,
                }

    return adjust.definition.url
            .replace('{loyaltyPoint}', parsedArgs.loyaltyPoint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LoyaltyController::adjust
 * @see app/Http/Controllers/Admin/LoyaltyController.php:0
 * @route '/admin/loyalty/{loyaltyPoint}/adjust'
 */
adjust.post = (args: { loyaltyPoint: string | number } | [loyaltyPoint: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adjust.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LoyaltyController::toggleStatus
 * @see app/Http/Controllers/Admin/LoyaltyController.php:116
 * @route '/admin/loyalty/{loyaltyPoint}/toggle-status'
 */
export const toggleStatus = (args: { loyaltyPoint: number | { id: number } } | [loyaltyPoint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/admin/loyalty/{loyaltyPoint}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\LoyaltyController::toggleStatus
 * @see app/Http/Controllers/Admin/LoyaltyController.php:116
 * @route '/admin/loyalty/{loyaltyPoint}/toggle-status'
 */
toggleStatus.url = (args: { loyaltyPoint: number | { id: number } } | [loyaltyPoint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { loyaltyPoint: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { loyaltyPoint: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    loyaltyPoint: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        loyaltyPoint: typeof args.loyaltyPoint === 'object'
                ? args.loyaltyPoint.id
                : args.loyaltyPoint,
                }

    return toggleStatus.definition.url
            .replace('{loyaltyPoint}', parsedArgs.loyaltyPoint.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LoyaltyController::toggleStatus
 * @see app/Http/Controllers/Admin/LoyaltyController.php:116
 * @route '/admin/loyalty/{loyaltyPoint}/toggle-status'
 */
toggleStatus.post = (args: { loyaltyPoint: number | { id: number } } | [loyaltyPoint: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LoyaltyController::transactions
 * @see app/Http/Controllers/Admin/LoyaltyController.php:128
 * @route '/admin/loyalty/transactions'
 */
export const transactions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(options),
    method: 'get',
})

transactions.definition = {
    methods: ["get","head"],
    url: '/admin/loyalty/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LoyaltyController::transactions
 * @see app/Http/Controllers/Admin/LoyaltyController.php:128
 * @route '/admin/loyalty/transactions'
 */
transactions.url = (options?: RouteQueryOptions) => {
    return transactions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LoyaltyController::transactions
 * @see app/Http/Controllers/Admin/LoyaltyController.php:128
 * @route '/admin/loyalty/transactions'
 */
transactions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\LoyaltyController::transactions
 * @see app/Http/Controllers/Admin/LoyaltyController.php:128
 * @route '/admin/loyalty/transactions'
 */
transactions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: transactions.url(options),
    method: 'head',
})
const loyalty = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
adjust: Object.assign(adjust, adjust),
toggleStatus: Object.assign(toggleStatus, toggleStatus),
transactions: Object.assign(transactions, transactions),
}

export default loyalty