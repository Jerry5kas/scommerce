import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\SubscriptionController::clear
 * @see app/Http/Controllers/SubscriptionController.php:445
 * @route '/subscriptions/{subscription}/vacation'
 */
export const clear = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clear.url(args, options),
    method: 'delete',
})

clear.definition = {
    methods: ["delete"],
    url: '/subscriptions/{subscription}/vacation',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SubscriptionController::clear
 * @see app/Http/Controllers/SubscriptionController.php:445
 * @route '/subscriptions/{subscription}/vacation'
 */
clear.url = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subscription: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.id
                : args.subscription,
                }

    return clear.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::clear
 * @see app/Http/Controllers/SubscriptionController.php:445
 * @route '/subscriptions/{subscription}/vacation'
 */
clear.delete = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clear.url(args, options),
    method: 'delete',
})
const vacation = {
    clear: Object.assign(clear, clear),
}

export default vacation