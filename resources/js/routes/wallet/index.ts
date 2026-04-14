import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import recharge4e04af from './recharge'
import autoRecharge0221ef from './auto-recharge'
/**
* @see \App\Http\Controllers\WalletController::index
 * @see app/Http/Controllers/WalletController.php:26
 * @route '/wallet'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/wallet',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WalletController::index
 * @see app/Http/Controllers/WalletController.php:26
 * @route '/wallet'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::index
 * @see app/Http/Controllers/WalletController.php:26
 * @route '/wallet'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WalletController::index
 * @see app/Http/Controllers/WalletController.php:26
 * @route '/wallet'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WalletController::recharge
 * @see app/Http/Controllers/WalletController.php:48
 * @route '/wallet/recharge'
 */
export const recharge = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recharge.url(options),
    method: 'get',
})

recharge.definition = {
    methods: ["get","head"],
    url: '/wallet/recharge',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WalletController::recharge
 * @see app/Http/Controllers/WalletController.php:48
 * @route '/wallet/recharge'
 */
recharge.url = (options?: RouteQueryOptions) => {
    return recharge.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::recharge
 * @see app/Http/Controllers/WalletController.php:48
 * @route '/wallet/recharge'
 */
recharge.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: recharge.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WalletController::recharge
 * @see app/Http/Controllers/WalletController.php:48
 * @route '/wallet/recharge'
 */
recharge.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: recharge.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WalletController::transactions
 * @see app/Http/Controllers/WalletController.php:222
 * @route '/wallet/transactions'
 */
export const transactions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(options),
    method: 'get',
})

transactions.definition = {
    methods: ["get","head"],
    url: '/wallet/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WalletController::transactions
 * @see app/Http/Controllers/WalletController.php:222
 * @route '/wallet/transactions'
 */
transactions.url = (options?: RouteQueryOptions) => {
    return transactions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::transactions
 * @see app/Http/Controllers/WalletController.php:222
 * @route '/wallet/transactions'
 */
transactions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WalletController::transactions
 * @see app/Http/Controllers/WalletController.php:222
 * @route '/wallet/transactions'
 */
transactions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: transactions.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WalletController::balance
 * @see app/Http/Controllers/WalletController.php:251
 * @route '/wallet/balance'
 */
export const balance = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: balance.url(options),
    method: 'get',
})

balance.definition = {
    methods: ["get","head"],
    url: '/wallet/balance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WalletController::balance
 * @see app/Http/Controllers/WalletController.php:251
 * @route '/wallet/balance'
 */
balance.url = (options?: RouteQueryOptions) => {
    return balance.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::balance
 * @see app/Http/Controllers/WalletController.php:251
 * @route '/wallet/balance'
 */
balance.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: balance.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WalletController::balance
 * @see app/Http/Controllers/WalletController.php:251
 * @route '/wallet/balance'
 */
balance.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: balance.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WalletController::autoRecharge
 * @see app/Http/Controllers/WalletController.php:267
 * @route '/wallet/auto-recharge'
 */
export const autoRecharge = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: autoRecharge.url(options),
    method: 'get',
})

autoRecharge.definition = {
    methods: ["get","head"],
    url: '/wallet/auto-recharge',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WalletController::autoRecharge
 * @see app/Http/Controllers/WalletController.php:267
 * @route '/wallet/auto-recharge'
 */
autoRecharge.url = (options?: RouteQueryOptions) => {
    return autoRecharge.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::autoRecharge
 * @see app/Http/Controllers/WalletController.php:267
 * @route '/wallet/auto-recharge'
 */
autoRecharge.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: autoRecharge.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WalletController::autoRecharge
 * @see app/Http/Controllers/WalletController.php:267
 * @route '/wallet/auto-recharge'
 */
autoRecharge.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: autoRecharge.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WalletController::lowBalanceThreshold
 * @see app/Http/Controllers/WalletController.php:313
 * @route '/wallet/low-balance-threshold'
 */
export const lowBalanceThreshold = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lowBalanceThreshold.url(options),
    method: 'post',
})

lowBalanceThreshold.definition = {
    methods: ["post"],
    url: '/wallet/low-balance-threshold',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WalletController::lowBalanceThreshold
 * @see app/Http/Controllers/WalletController.php:313
 * @route '/wallet/low-balance-threshold'
 */
lowBalanceThreshold.url = (options?: RouteQueryOptions) => {
    return lowBalanceThreshold.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::lowBalanceThreshold
 * @see app/Http/Controllers/WalletController.php:313
 * @route '/wallet/low-balance-threshold'
 */
lowBalanceThreshold.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lowBalanceThreshold.url(options),
    method: 'post',
})
const wallet = {
    index: Object.assign(index, index),
recharge: Object.assign(recharge, recharge4e04af),
transactions: Object.assign(transactions, transactions),
balance: Object.assign(balance, balance),
autoRecharge: Object.assign(autoRecharge, autoRecharge0221ef),
lowBalanceThreshold: Object.assign(lowBalanceThreshold, lowBalanceThreshold),
}

export default wallet