import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\OrderController::store
 * @see app/Http/Controllers/OrderController.php:126
 * @route '/checkout'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderController::store
 * @see app/Http/Controllers/OrderController.php:126
 * @route '/checkout'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::store
 * @see app/Http/Controllers/OrderController.php:126
 * @route '/checkout'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderController::initiatePayment
 * @see app/Http/Controllers/OrderController.php:154
 * @route '/checkout/initiate-payment'
 */
export const initiatePayment = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiatePayment.url(options),
    method: 'post',
})

initiatePayment.definition = {
    methods: ["post"],
    url: '/checkout/initiate-payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderController::initiatePayment
 * @see app/Http/Controllers/OrderController.php:154
 * @route '/checkout/initiate-payment'
 */
initiatePayment.url = (options?: RouteQueryOptions) => {
    return initiatePayment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::initiatePayment
 * @see app/Http/Controllers/OrderController.php:154
 * @route '/checkout/initiate-payment'
 */
initiatePayment.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiatePayment.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\OrderController::verifyPayment
 * @see app/Http/Controllers/OrderController.php:208
 * @route '/checkout/verify-payment'
 */
export const verifyPayment = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyPayment.url(options),
    method: 'post',
})

verifyPayment.definition = {
    methods: ["post"],
    url: '/checkout/verify-payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrderController::verifyPayment
 * @see app/Http/Controllers/OrderController.php:208
 * @route '/checkout/verify-payment'
 */
verifyPayment.url = (options?: RouteQueryOptions) => {
    return verifyPayment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::verifyPayment
 * @see app/Http/Controllers/OrderController.php:208
 * @route '/checkout/verify-payment'
 */
verifyPayment.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyPayment.url(options),
    method: 'post',
})
const checkout = {
    store: Object.assign(store, store),
initiatePayment: Object.assign(initiatePayment, initiatePayment),
verifyPayment: Object.assign(verifyPayment, verifyPayment),
}

export default checkout