import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\WalletController::store
 * @see app/Http/Controllers/WalletController.php:280
 * @route '/wallet/auto-recharge'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/wallet/auto-recharge',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WalletController::store
 * @see app/Http/Controllers/WalletController.php:280
 * @route '/wallet/auto-recharge'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::store
 * @see app/Http/Controllers/WalletController.php:280
 * @route '/wallet/auto-recharge'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})
const autoRecharge = {
    store: Object.assign(store, store),
}

export default autoRecharge