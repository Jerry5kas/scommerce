import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\WalletController::index
 * @see app/Http/Controllers/Admin/WalletController.php:23
 * @route '/admin/wallets'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/wallets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\WalletController::index
 * @see app/Http/Controllers/Admin/WalletController.php:23
 * @route '/admin/wallets'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WalletController::index
 * @see app/Http/Controllers/Admin/WalletController.php:23
 * @route '/admin/wallets'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\WalletController::index
 * @see app/Http/Controllers/Admin/WalletController.php:23
 * @route '/admin/wallets'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\WalletController::show
 * @see app/Http/Controllers/Admin/WalletController.php:72
 * @route '/admin/wallets/{wallet}'
 */
export const show = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/wallets/{wallet}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\WalletController::show
 * @see app/Http/Controllers/Admin/WalletController.php:72
 * @route '/admin/wallets/{wallet}'
 */
show.url = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { wallet: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { wallet: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    wallet: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        wallet: typeof args.wallet === 'object'
                ? args.wallet.id
                : args.wallet,
                }

    return show.definition.url
            .replace('{wallet}', parsedArgs.wallet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WalletController::show
 * @see app/Http/Controllers/Admin/WalletController.php:72
 * @route '/admin/wallets/{wallet}'
 */
show.get = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\WalletController::show
 * @see app/Http/Controllers/Admin/WalletController.php:72
 * @route '/admin/wallets/{wallet}'
 */
show.head = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\WalletController::adjust
 * @see app/Http/Controllers/Admin/WalletController.php:0
 * @route '/admin/wallets/{wallet}/adjust'
 */
export const adjust = (args: { wallet: string | number } | [wallet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adjust.url(args, options),
    method: 'post',
})

adjust.definition = {
    methods: ["post"],
    url: '/admin/wallets/{wallet}/adjust',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\WalletController::adjust
 * @see app/Http/Controllers/Admin/WalletController.php:0
 * @route '/admin/wallets/{wallet}/adjust'
 */
adjust.url = (args: { wallet: string | number } | [wallet: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { wallet: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    wallet: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        wallet: args.wallet,
                }

    return adjust.definition.url
            .replace('{wallet}', parsedArgs.wallet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WalletController::adjust
 * @see app/Http/Controllers/Admin/WalletController.php:0
 * @route '/admin/wallets/{wallet}/adjust'
 */
adjust.post = (args: { wallet: string | number } | [wallet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: adjust.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\WalletController::transactions
 * @see app/Http/Controllers/Admin/WalletController.php:135
 * @route '/admin/wallets/{wallet}/transactions'
 */
export const transactions = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(args, options),
    method: 'get',
})

transactions.definition = {
    methods: ["get","head"],
    url: '/admin/wallets/{wallet}/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\WalletController::transactions
 * @see app/Http/Controllers/Admin/WalletController.php:135
 * @route '/admin/wallets/{wallet}/transactions'
 */
transactions.url = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { wallet: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { wallet: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    wallet: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        wallet: typeof args.wallet === 'object'
                ? args.wallet.id
                : args.wallet,
                }

    return transactions.definition.url
            .replace('{wallet}', parsedArgs.wallet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\WalletController::transactions
 * @see app/Http/Controllers/Admin/WalletController.php:135
 * @route '/admin/wallets/{wallet}/transactions'
 */
transactions.get = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\WalletController::transactions
 * @see app/Http/Controllers/Admin/WalletController.php:135
 * @route '/admin/wallets/{wallet}/transactions'
 */
transactions.head = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: transactions.url(args, options),
    method: 'head',
})
const wallets = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
adjust: Object.assign(adjust, adjust),
transactions: Object.assign(transactions, transactions),
}

export default wallets