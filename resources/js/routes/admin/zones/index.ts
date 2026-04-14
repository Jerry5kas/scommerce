import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
import overrides from './overrides'
/**
* @see \App\Http\Controllers\Admin\ZoneController::index
 * @see app/Http/Controllers/Admin/ZoneController.php:18
 * @route '/admin/zones'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/zones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ZoneController::index
 * @see app/Http/Controllers/Admin/ZoneController.php:18
 * @route '/admin/zones'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ZoneController::index
 * @see app/Http/Controllers/Admin/ZoneController.php:18
 * @route '/admin/zones'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ZoneController::index
 * @see app/Http/Controllers/Admin/ZoneController.php:18
 * @route '/admin/zones'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ZoneController::create
 * @see app/Http/Controllers/Admin/ZoneController.php:44
 * @route '/admin/zones/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/zones/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ZoneController::create
 * @see app/Http/Controllers/Admin/ZoneController.php:44
 * @route '/admin/zones/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ZoneController::create
 * @see app/Http/Controllers/Admin/ZoneController.php:44
 * @route '/admin/zones/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ZoneController::create
 * @see app/Http/Controllers/Admin/ZoneController.php:44
 * @route '/admin/zones/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ZoneController::store
 * @see app/Http/Controllers/Admin/ZoneController.php:52
 * @route '/admin/zones'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/zones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ZoneController::store
 * @see app/Http/Controllers/Admin/ZoneController.php:52
 * @route '/admin/zones'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ZoneController::store
 * @see app/Http/Controllers/Admin/ZoneController.php:52
 * @route '/admin/zones'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ZoneController::show
 * @see app/Http/Controllers/Admin/ZoneController.php:31
 * @route '/admin/zones/{zone}'
 */
export const show = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/zones/{zone}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ZoneController::show
 * @see app/Http/Controllers/Admin/ZoneController.php:31
 * @route '/admin/zones/{zone}'
 */
show.url = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{zone}', parsedArgs.zone.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ZoneController::show
 * @see app/Http/Controllers/Admin/ZoneController.php:31
 * @route '/admin/zones/{zone}'
 */
show.get = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ZoneController::show
 * @see app/Http/Controllers/Admin/ZoneController.php:31
 * @route '/admin/zones/{zone}'
 */
show.head = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ZoneController::edit
 * @see app/Http/Controllers/Admin/ZoneController.php:61
 * @route '/admin/zones/{zone}/edit'
 */
export const edit = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/zones/{zone}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ZoneController::edit
 * @see app/Http/Controllers/Admin/ZoneController.php:61
 * @route '/admin/zones/{zone}/edit'
 */
edit.url = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{zone}', parsedArgs.zone.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ZoneController::edit
 * @see app/Http/Controllers/Admin/ZoneController.php:61
 * @route '/admin/zones/{zone}/edit'
 */
edit.get = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ZoneController::edit
 * @see app/Http/Controllers/Admin/ZoneController.php:61
 * @route '/admin/zones/{zone}/edit'
 */
edit.head = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ZoneController::update
 * @see app/Http/Controllers/Admin/ZoneController.php:70
 * @route '/admin/zones/{zone}'
 */
export const update = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/zones/{zone}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\ZoneController::update
 * @see app/Http/Controllers/Admin/ZoneController.php:70
 * @route '/admin/zones/{zone}'
 */
update.url = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{zone}', parsedArgs.zone.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ZoneController::update
 * @see app/Http/Controllers/Admin/ZoneController.php:70
 * @route '/admin/zones/{zone}'
 */
update.put = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\ZoneController::update
 * @see app/Http/Controllers/Admin/ZoneController.php:70
 * @route '/admin/zones/{zone}'
 */
update.patch = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\ZoneController::destroy
 * @see app/Http/Controllers/Admin/ZoneController.php:77
 * @route '/admin/zones/{zone}'
 */
export const destroy = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/zones/{zone}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\ZoneController::destroy
 * @see app/Http/Controllers/Admin/ZoneController.php:77
 * @route '/admin/zones/{zone}'
 */
destroy.url = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{zone}', parsedArgs.zone.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ZoneController::destroy
 * @see app/Http/Controllers/Admin/ZoneController.php:77
 * @route '/admin/zones/{zone}'
 */
destroy.delete = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\ZoneController::toggleStatus
 * @see app/Http/Controllers/Admin/ZoneController.php:84
 * @route '/admin/zones/{zone}/toggle-status'
 */
export const toggleStatus = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/admin/zones/{zone}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ZoneController::toggleStatus
 * @see app/Http/Controllers/Admin/ZoneController.php:84
 * @route '/admin/zones/{zone}/toggle-status'
 */
toggleStatus.url = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return toggleStatus.definition.url
            .replace('{zone}', parsedArgs.zone.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ZoneController::toggleStatus
 * @see app/Http/Controllers/Admin/ZoneController.php:84
 * @route '/admin/zones/{zone}/toggle-status'
 */
toggleStatus.post = (args: { zone: number | { id: number } } | [zone: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})
const zones = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
toggleStatus: Object.assign(toggleStatus, toggleStatus),
overrides: Object.assign(overrides, overrides),
}

export default zones