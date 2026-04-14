import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ActivityLogController::index
 * @see app/Http/Controllers/Admin/ActivityLogController.php:12
 * @route '/admin/activity-logs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/activity-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ActivityLogController::index
 * @see app/Http/Controllers/Admin/ActivityLogController.php:12
 * @route '/admin/activity-logs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ActivityLogController::index
 * @see app/Http/Controllers/Admin/ActivityLogController.php:12
 * @route '/admin/activity-logs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ActivityLogController::index
 * @see app/Http/Controllers/Admin/ActivityLogController.php:12
 * @route '/admin/activity-logs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const activityLogs = {
    index: Object.assign(index, index),
}

export default activityLogs