import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PaymentWebhookController::payment
 * @see app/Http/Controllers/Api/PaymentWebhookController.php:22
 * @route '/api/webhooks/payment/{gateway}'
 */
export const payment = (args: { gateway: string | number } | [gateway: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: payment.url(args, options),
    method: 'post',
})

payment.definition = {
    methods: ["post"],
    url: '/api/webhooks/payment/{gateway}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PaymentWebhookController::payment
 * @see app/Http/Controllers/Api/PaymentWebhookController.php:22
 * @route '/api/webhooks/payment/{gateway}'
 */
payment.url = (args: { gateway: string | number } | [gateway: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { gateway: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    gateway: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        gateway: args.gateway,
                }

    return payment.definition.url
            .replace('{gateway}', parsedArgs.gateway.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PaymentWebhookController::payment
 * @see app/Http/Controllers/Api/PaymentWebhookController.php:22
 * @route '/api/webhooks/payment/{gateway}'
 */
payment.post = (args: { gateway: string | number } | [gateway: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: payment.url(args, options),
    method: 'post',
})
const webhooks = {
    payment: Object.assign(payment, payment),
}

export default webhooks