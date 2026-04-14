import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LoyaltyController::index
 * @see app/Http/Controllers/LoyaltyController.php:21
 * @route '/loyalty'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/loyalty',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LoyaltyController::index
 * @see app/Http/Controllers/LoyaltyController.php:21
 * @route '/loyalty'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoyaltyController::index
 * @see app/Http/Controllers/LoyaltyController.php:21
 * @route '/loyalty'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LoyaltyController::index
 * @see app/Http/Controllers/LoyaltyController.php:21
 * @route '/loyalty'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LoyaltyController::balance
 * @see app/Http/Controllers/LoyaltyController.php:40
 * @route '/loyalty/balance'
 */
export const balance = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: balance.url(options),
    method: 'get',
})

balance.definition = {
    methods: ["get","head"],
    url: '/loyalty/balance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LoyaltyController::balance
 * @see app/Http/Controllers/LoyaltyController.php:40
 * @route '/loyalty/balance'
 */
balance.url = (options?: RouteQueryOptions) => {
    return balance.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoyaltyController::balance
 * @see app/Http/Controllers/LoyaltyController.php:40
 * @route '/loyalty/balance'
 */
balance.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: balance.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LoyaltyController::balance
 * @see app/Http/Controllers/LoyaltyController.php:40
 * @route '/loyalty/balance'
 */
balance.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: balance.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LoyaltyController::transactions
 * @see app/Http/Controllers/LoyaltyController.php:54
 * @route '/loyalty/transactions'
 */
export const transactions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(options),
    method: 'get',
})

transactions.definition = {
    methods: ["get","head"],
    url: '/loyalty/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LoyaltyController::transactions
 * @see app/Http/Controllers/LoyaltyController.php:54
 * @route '/loyalty/transactions'
 */
transactions.url = (options?: RouteQueryOptions) => {
    return transactions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoyaltyController::transactions
 * @see app/Http/Controllers/LoyaltyController.php:54
 * @route '/loyalty/transactions'
 */
transactions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LoyaltyController::transactions
 * @see app/Http/Controllers/LoyaltyController.php:54
 * @route '/loyalty/transactions'
 */
transactions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: transactions.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LoyaltyController::convertToWallet
 * @see app/Http/Controllers/LoyaltyController.php:72
 * @route '/loyalty/convert'
 */
export const convertToWallet = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convertToWallet.url(options),
    method: 'post',
})

convertToWallet.definition = {
    methods: ["post"],
    url: '/loyalty/convert',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LoyaltyController::convertToWallet
 * @see app/Http/Controllers/LoyaltyController.php:72
 * @route '/loyalty/convert'
 */
convertToWallet.url = (options?: RouteQueryOptions) => {
    return convertToWallet.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoyaltyController::convertToWallet
 * @see app/Http/Controllers/LoyaltyController.php:72
 * @route '/loyalty/convert'
 */
convertToWallet.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convertToWallet.url(options),
    method: 'post',
})
const LoyaltyController = { index, balance, transactions, convertToWallet }

export default LoyaltyController