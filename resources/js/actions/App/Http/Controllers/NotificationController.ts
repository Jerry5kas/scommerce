import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:21
 * @route '/notifications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:21
 * @route '/notifications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:21
 * @route '/notifications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificationController::index
 * @see app/Http/Controllers/NotificationController.php:21
 * @route '/notifications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\NotificationController::markAsRead
 * @see app/Http/Controllers/NotificationController.php:41
 * @route '/notifications/{notification}/read'
 */
export const markAsRead = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

markAsRead.definition = {
    methods: ["post"],
    url: '/notifications/{notification}/read',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificationController::markAsRead
 * @see app/Http/Controllers/NotificationController.php:41
 * @route '/notifications/{notification}/read'
 */
markAsRead.url = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
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

    return markAsRead.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::markAsRead
 * @see app/Http/Controllers/NotificationController.php:41
 * @route '/notifications/{notification}/read'
 */
markAsRead.post = (args: { notification: string | { id: string } } | [notification: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\NotificationController::markAllAsRead
 * @see app/Http/Controllers/NotificationController.php:60
 * @route '/notifications/read-all'
 */
export const markAllAsRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

markAllAsRead.definition = {
    methods: ["post"],
    url: '/notifications/read-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificationController::markAllAsRead
 * @see app/Http/Controllers/NotificationController.php:60
 * @route '/notifications/read-all'
 */
markAllAsRead.url = (options?: RouteQueryOptions) => {
    return markAllAsRead.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::markAllAsRead
 * @see app/Http/Controllers/NotificationController.php:60
 * @route '/notifications/read-all'
 */
markAllAsRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\NotificationController::unreadCount
 * @see app/Http/Controllers/NotificationController.php:76
 * @route '/notifications/unread-count'
 */
export const unreadCount = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unreadCount.url(options),
    method: 'get',
})

unreadCount.definition = {
    methods: ["get","head"],
    url: '/notifications/unread-count',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\NotificationController::unreadCount
 * @see app/Http/Controllers/NotificationController.php:76
 * @route '/notifications/unread-count'
 */
unreadCount.url = (options?: RouteQueryOptions) => {
    return unreadCount.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::unreadCount
 * @see app/Http/Controllers/NotificationController.php:76
 * @route '/notifications/unread-count'
 */
unreadCount.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unreadCount.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\NotificationController::unreadCount
 * @see app/Http/Controllers/NotificationController.php:76
 * @route '/notifications/unread-count'
 */
unreadCount.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: unreadCount.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\NotificationController::registerDevice
 * @see app/Http/Controllers/NotificationController.php:88
 * @route '/notifications/register-device'
 */
export const registerDevice = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registerDevice.url(options),
    method: 'post',
})

registerDevice.definition = {
    methods: ["post"],
    url: '/notifications/register-device',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificationController::registerDevice
 * @see app/Http/Controllers/NotificationController.php:88
 * @route '/notifications/register-device'
 */
registerDevice.url = (options?: RouteQueryOptions) => {
    return registerDevice.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::registerDevice
 * @see app/Http/Controllers/NotificationController.php:88
 * @route '/notifications/register-device'
 */
registerDevice.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registerDevice.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\NotificationController::unregisterDevice
 * @see app/Http/Controllers/NotificationController.php:114
 * @route '/notifications/unregister-device'
 */
export const unregisterDevice = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unregisterDevice.url(options),
    method: 'post',
})

unregisterDevice.definition = {
    methods: ["post"],
    url: '/notifications/unregister-device',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\NotificationController::unregisterDevice
 * @see app/Http/Controllers/NotificationController.php:114
 * @route '/notifications/unregister-device'
 */
unregisterDevice.url = (options?: RouteQueryOptions) => {
    return unregisterDevice.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\NotificationController::unregisterDevice
 * @see app/Http/Controllers/NotificationController.php:114
 * @route '/notifications/unregister-device'
 */
unregisterDevice.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unregisterDevice.url(options),
    method: 'post',
})
const NotificationController = { index, markAsRead, markAllAsRead, unreadCount, registerDevice, unregisterDevice }

export default NotificationController