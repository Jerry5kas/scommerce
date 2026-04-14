import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ZoneOverrideController::create
 * @see app/Http/Controllers/Admin/ZoneOverrideController.php:18
 * @route '/admin/zones/{zone}/overrides/create'
 */
export const create = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/zones/{zone}/overrides/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ZoneOverrideController::create
 * @see app/Http/Controllers/Admin/ZoneOverrideController.php:18
 * @route '/admin/zones/{zone}/overrides/create'
 */
create.url = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { zone: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { zone: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    zone: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        zone: typeof args.zone === 'object'
                ? args.zone.id
                : args.zone,
                }

    return create.definition.url
            .replace('{zone}', parsedArgs.zone.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ZoneOverrideController::create
 * @see app/Http/Controllers/Admin/ZoneOverrideController.php:18
 * @route '/admin/zones/{zone}/overrides/create'
 */
create.get = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ZoneOverrideController::create
 * @see app/Http/Controllers/Admin/ZoneOverrideController.php:18
 * @route '/admin/zones/{zone}/overrides/create'
 */
create.head = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ZoneOverrideController::store
 * @see app/Http/Controllers/Admin/ZoneOverrideController.php:37
 * @route '/admin/zones/{zone}/overrides'
 */
export const store = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/zones/{zone}/overrides',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ZoneOverrideController::store
 * @see app/Http/Controllers/Admin/ZoneOverrideController.php:37
 * @route '/admin/zones/{zone}/overrides'
 */
store.url = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { zone: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { zone: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    zone: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        zone: typeof args.zone === 'object'
                ? args.zone.id
                : args.zone,
                }

    return store.definition.url
            .replace('{zone}', parsedArgs.zone.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ZoneOverrideController::store
 * @see app/Http/Controllers/Admin/ZoneOverrideController.php:37
 * @route '/admin/zones/{zone}/overrides'
 */
store.post = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

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
const ZoneOverrideController = { create, store, edit, update, destroy }

export default ZoneOverrideController