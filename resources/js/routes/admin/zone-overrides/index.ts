import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ZoneOverrideController::edit
 * @see app/Http/Controllers/Admin/ZoneOverrideController.php:50
 * @route '/admin/zone-overrides/{zoneOverride}/edit'
 */
export const edit = (args: { zoneOverride: number | { id: number } } | [zoneOverride: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/zone-overrides/{zoneOverride}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ZoneOverrideController::edit
 * @see app/Http/Controllers/Admin/ZoneOverrideController.php:50
 * @route '/admin/zone-overrides/{zoneOverride}/edit'
 */
edit.url = (args: { zoneOverride: number | { id: number } } | [zoneOverride: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { zoneOverride: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { zoneOverride: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    zoneOverride: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        zoneOverride: typeof args.zoneOverride === 'object'
                ? args.zoneOverride.id
                : args.zoneOverride,
                }

    return edit.definition.url
            .replace('{zoneOverride}', parsedArgs.zoneOverride.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ZoneOverrideController::edit
 * @see app/Http/Controllers/Admin/ZoneOverrideController.php:50
 * @route '/admin/zone-overrides/{zoneOverride}/edit'
 */
edit.get = (args: { zoneOverride: number | { id: number } } | [zoneOverride: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ZoneOverrideController::edit
 * @see app/Http/Controllers/Admin/ZoneOverrideController.php:50
 * @route '/admin/zone-overrides/{zoneOverride}/edit'
 */
edit.head = (args: { zoneOverride: number | { id: number } } | [zoneOverride: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ZoneOverrideController::update
 * @see app/Http/Controllers/Admin/ZoneOverrideController.php:59
 * @route '/admin/zone-overrides/{zoneOverride}'
 */
export const update = (args: { zoneOverride: number | { id: number } } | [zoneOverride: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/zone-overrides/{zoneOverride}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\ZoneOverrideController::update
 * @see app/Http/Controllers/Admin/ZoneOverrideController.php:59
 * @route '/admin/zone-overrides/{zoneOverride}'
 */
update.url = (args: { zoneOverride: number | { id: number } } | [zoneOverride: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { zoneOverride: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { zoneOverride: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    zoneOverride: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        zoneOverride: typeof args.zoneOverride === 'object'
                ? args.zoneOverride.id
                : args.zoneOverride,
                }

    return update.definition.url
            .replace('{zoneOverride}', parsedArgs.zoneOverride.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ZoneOverrideController::update
 * @see app/Http/Controllers/Admin/ZoneOverrideController.php:59
 * @route '/admin/zone-overrides/{zoneOverride}'
 */
update.put = (args: { zoneOverride: number | { id: number } } | [zoneOverride: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\ZoneOverrideController::destroy
 * @see app/Http/Controllers/Admin/ZoneOverrideController.php:68
 * @route '/admin/zone-overrides/{zoneOverride}'
 */
export const destroy = (args: { zoneOverride: number | { id: number } } | [zoneOverride: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/zone-overrides/{zoneOverride}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ZoneOverrideController::destroy
 * @see app/Http/Controllers/Admin/ZoneOverrideController.php:68
 * @route '/admin/zone-overrides/{zoneOverride}'
 */
destroy.url = (args: { zoneOverride: number | { id: number } } | [zoneOverride: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { zoneOverride: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { zoneOverride: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    zoneOverride: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        zoneOverride: typeof args.zoneOverride === 'object'
                ? args.zoneOverride.id
                : args.zoneOverride,
                }

    return destroy.definition.url
            .replace('{zoneOverride}', parsedArgs.zoneOverride.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ZoneOverrideController::destroy
 * @see app/Http/Controllers/Admin/ZoneOverrideController.php:68
 * @route '/admin/zone-overrides/{zoneOverride}'
 */
destroy.delete = (args: { zoneOverride: number | { id: number } } | [zoneOverride: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const zoneOverrides = {
    edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default zoneOverrides