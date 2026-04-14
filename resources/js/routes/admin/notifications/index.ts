import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\NotificationController::index
 * @see app/Http/Controllers/Admin/NotificationController.php:22
 * @route '/admin/notifications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NotificationController::index
 * @see app/Http/Controllers/Admin/NotificationController.php:22
 * @route '/admin/notifications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificationController::index
 * @see app/Http/Controllers/Admin/NotificationController.php:22
 * @route '/admin/notifications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\NotificationController::index
 * @see app/Http/Controllers/Admin/NotificationController.php:22
 * @route '/admin/notifications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::show
 * @see app/Http/Controllers/Admin/NotificationController.php:60
 * @route '/admin/notifications/{notification}'
 */
export const show = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/notifications/{notification}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NotificationController::show
 * @see app/Http/Controllers/Admin/NotificationController.php:60
 * @route '/admin/notifications/{notification}'
 */
show.url = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: typeof args.notification === 'object'
                ? args.notification.id
                : args.notification,
                }

    return show.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificationController::show
 * @see app/Http/Controllers/Admin/NotificationController.php:60
 * @route '/admin/notifications/{notification}'
 */
show.get = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\NotificationController::show
 * @see app/Http/Controllers/Admin/NotificationController.php:60
 * @route '/admin/notifications/{notification}'
 */
show.head = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::retry
 * @see app/Http/Controllers/Admin/NotificationController.php:70
 * @route '/admin/notifications/{notification}/retry'
 */
export const retry = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

retry.definition = {
    methods: ["post"],
    url: '/admin/notifications/{notification}/retry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\NotificationController::retry
 * @see app/Http/Controllers/Admin/NotificationController.php:70
 * @route '/admin/notifications/{notification}/retry'
 */
retry.url = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: typeof args.notification === 'object'
                ? args.notification.id
                : args.notification,
                }

    return retry.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificationController::retry
 * @see app/Http/Controllers/Admin/NotificationController.php:70
 * @route '/admin/notifications/{notification}/retry'
 */
retry.post = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\NotificationController::stats
 * @see app/Http/Controllers/Admin/NotificationController.php:88
 * @route '/admin/notifications/stats'
 */
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/admin/notifications/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NotificationController::stats
 * @see app/Http/Controllers/Admin/NotificationController.php:88
 * @route '/admin/notifications/stats'
 */
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificationController::stats
 * @see app/Http/Controllers/Admin/NotificationController.php:88
 * @route '/admin/notifications/stats'
 */
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\NotificationController::stats
 * @see app/Http/Controllers/Admin/NotificationController.php:88
 * @route '/admin/notifications/stats'
 */
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})
const notifications = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
retry: Object.assign(retry, retry),
stats: Object.assign(stats, stats),
}

export default notifications