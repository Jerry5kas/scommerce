import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\WalletController::rechargeForm
 * @see app/Http/Controllers/WalletController.php:48
 * @route '/wallet/recharge'
 */
export const rechargeForm = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rechargeForm.url(options),
    method: 'get',
})

rechargeForm.definition = {
    methods: ["get","head"],
    url: '/wallet/recharge',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WalletController::rechargeForm
 * @see app/Http/Controllers/WalletController.php:48
 * @route '/wallet/recharge'
 */
rechargeForm.url = (options?: RouteQueryOptions) => {
    return rechargeForm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::rechargeForm
 * @see app/Http/Controllers/WalletController.php:48
 * @route '/wallet/recharge'
 */
rechargeForm.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rechargeForm.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WalletController::rechargeForm
 * @see app/Http/Controllers/WalletController.php:48
 * @route '/wallet/recharge'
 */
rechargeForm.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: rechargeForm.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WalletController::recharge
 * @see app/Http/Controllers/WalletController.php:62
 * @route '/wallet/recharge'
 */
export const recharge = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recharge.url(options),
    method: 'post',
})

recharge.definition = {
    methods: ["post"],
    url: '/wallet/recharge',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WalletController::recharge
 * @see app/Http/Controllers/WalletController.php:62
 * @route '/wallet/recharge'
 */
recharge.url = (options?: RouteQueryOptions) => {
    return recharge.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::recharge
 * @see app/Http/Controllers/WalletController.php:62
 * @route '/wallet/recharge'
 */
recharge.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recharge.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WalletController::initiateRecharge
 * @see app/Http/Controllers/WalletController.php:70
 * @route '/wallet/recharge/initiate'
 */
export const initiateRecharge = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiateRecharge.url(options),
    method: 'post',
})

initiateRecharge.definition = {
    methods: ["post"],
    url: '/wallet/recharge/initiate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WalletController::initiateRecharge
 * @see app/Http/Controllers/WalletController.php:70
 * @route '/wallet/recharge/initiate'
 */
initiateRecharge.url = (options?: RouteQueryOptions) => {
    return initiateRecharge.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::initiateRecharge
 * @see app/Http/Controllers/WalletController.php:70
 * @route '/wallet/recharge/initiate'
 */
initiateRecharge.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiateRecharge.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WalletController::verifyRecharge
 * @see app/Http/Controllers/WalletController.php:157
 * @route '/wallet/recharge/verify'
 */
export const verifyRecharge = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyRecharge.url(options),
    method: 'post',
})

verifyRecharge.definition = {
    methods: ["post"],
    url: '/wallet/recharge/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WalletController::verifyRecharge
 * @see app/Http/Controllers/WalletController.php:157
 * @route '/wallet/recharge/verify'
 */
verifyRecharge.url = (options?: RouteQueryOptions) => {
    return verifyRecharge.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::verifyRecharge
 * @see app/Http/Controllers/WalletController.php:157
 * @route '/wallet/recharge/verify'
 */
verifyRecharge.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyRecharge.url(options),
    method: 'post',
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
* @see \App\Http\Controllers\WalletController::autoRechargeSettings
 * @see app/Http/Controllers/WalletController.php:267
 * @route '/wallet/auto-recharge'
 */
export const autoRechargeSettings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: autoRechargeSettings.url(options),
    method: 'get',
})

autoRechargeSettings.definition = {
    methods: ["get","head"],
    url: '/wallet/auto-recharge',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WalletController::autoRechargeSettings
 * @see app/Http/Controllers/WalletController.php:267
 * @route '/wallet/auto-recharge'
 */
autoRechargeSettings.url = (options?: RouteQueryOptions) => {
    return autoRechargeSettings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::autoRechargeSettings
 * @see app/Http/Controllers/WalletController.php:267
 * @route '/wallet/auto-recharge'
 */
autoRechargeSettings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: autoRechargeSettings.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WalletController::autoRechargeSettings
 * @see app/Http/Controllers/WalletController.php:267
 * @route '/wallet/auto-recharge'
 */
autoRechargeSettings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: autoRechargeSettings.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\WalletController::setAutoRecharge
 * @see app/Http/Controllers/WalletController.php:280
 * @route '/wallet/auto-recharge'
 */
export const setAutoRecharge = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setAutoRecharge.url(options),
    method: 'post',
})

setAutoRecharge.definition = {
    methods: ["post"],
    url: '/wallet/auto-recharge',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WalletController::setAutoRecharge
 * @see app/Http/Controllers/WalletController.php:280
 * @route '/wallet/auto-recharge'
 */
setAutoRecharge.url = (options?: RouteQueryOptions) => {
    return setAutoRecharge.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::setAutoRecharge
 * @see app/Http/Controllers/WalletController.php:280
 * @route '/wallet/auto-recharge'
 */
setAutoRecharge.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setAutoRecharge.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WalletController::setLowBalanceThreshold
 * @see app/Http/Controllers/WalletController.php:313
 * @route '/wallet/low-balance-threshold'
 */
export const setLowBalanceThreshold = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setLowBalanceThreshold.url(options),
    method: 'post',
})

setLowBalanceThreshold.definition = {
    methods: ["post"],
    url: '/wallet/low-balance-threshold',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WalletController::setLowBalanceThreshold
 * @see app/Http/Controllers/WalletController.php:313
 * @route '/wallet/low-balance-threshold'
 */
setLowBalanceThreshold.url = (options?: RouteQueryOptions) => {
    return setLowBalanceThreshold.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::setLowBalanceThreshold
 * @see app/Http/Controllers/WalletController.php:313
 * @route '/wallet/low-balance-threshold'
 */
setLowBalanceThreshold.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setLowBalanceThreshold.url(options),
    method: 'post',
})
const WalletController = { index, rechargeForm, recharge, initiateRecharge, verifyRecharge, transactions, balance, autoRechargeSettings, setAutoRecharge, setLowBalanceThreshold }

export default WalletController