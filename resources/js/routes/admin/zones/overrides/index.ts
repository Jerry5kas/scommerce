import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
const overrides = {
    create: Object.assign(create, create),
store: Object.assign(store, store),
}

export default overrides