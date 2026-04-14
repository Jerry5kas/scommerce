import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\WalletController::store
 * @see app/Http/Controllers/WalletController.php:62
 * @route '/wallet/recharge'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/wallet/recharge',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WalletController::store
 * @see app/Http/Controllers/WalletController.php:62
 * @route '/wallet/recharge'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::store
 * @see app/Http/Controllers/WalletController.php:62
 * @route '/wallet/recharge'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WalletController::initiate
 * @see app/Http/Controllers/WalletController.php:70
 * @route '/wallet/recharge/initiate'
 */
export const initiate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiate.url(options),
    method: 'post',
})

initiate.definition = {
    methods: ["post"],
    url: '/wallet/recharge/initiate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WalletController::initiate
 * @see app/Http/Controllers/WalletController.php:70
 * @route '/wallet/recharge/initiate'
 */
initiate.url = (options?: RouteQueryOptions) => {
    return initiate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::initiate
 * @see app/Http/Controllers/WalletController.php:70
 * @route '/wallet/recharge/initiate'
 */
initiate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\WalletController::verify
 * @see app/Http/Controllers/WalletController.php:157
 * @route '/wallet/recharge/verify'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/wallet/recharge/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WalletController::verify
 * @see app/Http/Controllers/WalletController.php:157
 * @route '/wallet/recharge/verify'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::verify
 * @see app/Http/Controllers/WalletController.php:157
 * @route '/wallet/recharge/verify'
 */
verify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})
const recharge = {
    store: Object.assign(store, store),
initiate: Object.assign(initiate, initiate),
verify: Object.assign(verify, verify),
}

export default recharge