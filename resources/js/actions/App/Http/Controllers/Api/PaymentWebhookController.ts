import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PaymentWebhookController::handle
 * @see app/Http/Controllers/Api/PaymentWebhookController.php:22
 * @route '/api/webhooks/payment/{gateway}'
 */
export const handle = (args: { gateway: string | number } | [gateway: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handle.url(args, options),
    method: 'post',
})

handle.definition = {
    methods: ["post"],
    url: '/api/webhooks/payment/{gateway}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PaymentWebhookController::handle
 * @see app/Http/Controllers/Api/PaymentWebhookController.php:22
 * @route '/api/webhooks/payment/{gateway}'
 */
handle.url = (args: { gateway: string | number } | [gateway: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return handle.definition.url
            .replace('{gateway}', parsedArgs.gateway.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PaymentWebhookController::handle
 * @see app/Http/Controllers/Api/PaymentWebhookController.php:22
 * @route '/api/webhooks/payment/{gateway}'
 */
handle.post = (args: { gateway: string | number } | [gateway: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: handle.url(args, options),
    method: 'post',
})
const PaymentWebhookController = { handle }

export default PaymentWebhookController