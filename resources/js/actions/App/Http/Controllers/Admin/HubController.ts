import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\HubController::index
 * @see app/Http/Controllers/Admin/HubController.php:17
 * @route '/admin/hubs'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/hubs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\HubController::index
 * @see app/Http/Controllers/Admin/HubController.php:17
 * @route '/admin/hubs'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HubController::index
 * @see app/Http/Controllers/Admin/HubController.php:17
 * @route '/admin/hubs'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\HubController::index
 * @see app/Http/Controllers/Admin/HubController.php:17
 * @route '/admin/hubs'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\HubController::create
 * @see app/Http/Controllers/Admin/HubController.php:28
 * @route '/admin/hubs/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/hubs/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\HubController::create
 * @see app/Http/Controllers/Admin/HubController.php:28
 * @route '/admin/hubs/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HubController::create
 * @see app/Http/Controllers/Admin/HubController.php:28
 * @route '/admin/hubs/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\HubController::create
 * @see app/Http/Controllers/Admin/HubController.php:28
 * @route '/admin/hubs/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\HubController::store
 * @see app/Http/Controllers/Admin/HubController.php:35
 * @route '/admin/hubs'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/hubs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\HubController::store
 * @see app/Http/Controllers/Admin/HubController.php:35
 * @route '/admin/hubs'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HubController::store
 * @see app/Http/Controllers/Admin/HubController.php:35
 * @route '/admin/hubs'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\HubController::show
 * @see app/Http/Controllers/Admin/HubController.php:0
 * @route '/admin/hubs/{hub}'
 */
export const show = (args: { hub: string | number } | [hub: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/hubs/{hub}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\HubController::show
 * @see app/Http/Controllers/Admin/HubController.php:0
 * @route '/admin/hubs/{hub}'
 */
show.url = (args: { hub: string | number } | [hub: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hub: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    hub: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hub: args.hub,
                }

    return show.definition.url
            .replace('{hub}', parsedArgs.hub.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HubController::show
 * @see app/Http/Controllers/Admin/HubController.php:0
 * @route '/admin/hubs/{hub}'
 */
show.get = (args: { hub: string | number } | [hub: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\HubController::show
 * @see app/Http/Controllers/Admin/HubController.php:0
 * @route '/admin/hubs/{hub}'
 */
show.head = (args: { hub: string | number } | [hub: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\HubController::edit
 * @see app/Http/Controllers/Admin/HubController.php:44
 * @route '/admin/hubs/{hub}/edit'
 */
export const edit = (args: { hub: number | { id: number } } | [hub: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/hubs/{hub}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\HubController::edit
 * @see app/Http/Controllers/Admin/HubController.php:44
 * @route '/admin/hubs/{hub}/edit'
 */
edit.url = (args: { hub: number | { id: number } } | [hub: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hub: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hub: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hub: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hub: typeof args.hub === 'object'
                ? args.hub.id
                : args.hub,
                }

    return edit.definition.url
            .replace('{hub}', parsedArgs.hub.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HubController::edit
 * @see app/Http/Controllers/Admin/HubController.php:44
 * @route '/admin/hubs/{hub}/edit'
 */
edit.get = (args: { hub: number | { id: number } } | [hub: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\HubController::edit
 * @see app/Http/Controllers/Admin/HubController.php:44
 * @route '/admin/hubs/{hub}/edit'
 */
edit.head = (args: { hub: number | { id: number } } | [hub: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\HubController::update
 * @see app/Http/Controllers/Admin/HubController.php:52
 * @route '/admin/hubs/{hub}'
 */
export const update = (args: { hub: number | { id: number } } | [hub: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/hubs/{hub}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\HubController::update
 * @see app/Http/Controllers/Admin/HubController.php:52
 * @route '/admin/hubs/{hub}'
 */
update.url = (args: { hub: number | { id: number } } | [hub: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hub: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hub: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hub: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hub: typeof args.hub === 'object'
                ? args.hub.id
                : args.hub,
                }

    return update.definition.url
            .replace('{hub}', parsedArgs.hub.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HubController::update
 * @see app/Http/Controllers/Admin/HubController.php:52
 * @route '/admin/hubs/{hub}'
 */
update.put = (args: { hub: number | { id: number } } | [hub: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\HubController::update
 * @see app/Http/Controllers/Admin/HubController.php:52
 * @route '/admin/hubs/{hub}'
 */
update.patch = (args: { hub: number | { id: number } } | [hub: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\HubController::destroy
 * @see app/Http/Controllers/Admin/HubController.php:59
 * @route '/admin/hubs/{hub}'
 */
export const destroy = (args: { hub: number | { id: number } } | [hub: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/hubs/{hub}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\HubController::destroy
 * @see app/Http/Controllers/Admin/HubController.php:59
 * @route '/admin/hubs/{hub}'
 */
destroy.url = (args: { hub: number | { id: number } } | [hub: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hub: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hub: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hub: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hub: typeof args.hub === 'object'
                ? args.hub.id
                : args.hub,
                }

    return destroy.definition.url
            .replace('{hub}', parsedArgs.hub.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HubController::destroy
 * @see app/Http/Controllers/Admin/HubController.php:59
 * @route '/admin/hubs/{hub}'
 */
destroy.delete = (args: { hub: number | { id: number } } | [hub: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\HubController::toggleStatus
 * @see app/Http/Controllers/Admin/HubController.php:66
 * @route '/admin/hubs/{hub}/toggle-status'
 */
export const toggleStatus = (args: { hub: number | { id: number } } | [hub: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/admin/hubs/{hub}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\HubController::toggleStatus
 * @see app/Http/Controllers/Admin/HubController.php:66
 * @route '/admin/hubs/{hub}/toggle-status'
 */
toggleStatus.url = (args: { hub: number | { id: number } } | [hub: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { hub: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { hub: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    hub: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        hub: typeof args.hub === 'object'
                ? args.hub.id
                : args.hub,
                }

    return toggleStatus.definition.url
            .replace('{hub}', parsedArgs.hub.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\HubController::toggleStatus
 * @see app/Http/Controllers/Admin/HubController.php:66
 * @route '/admin/hubs/{hub}/toggle-status'
 */
toggleStatus.post = (args: { hub: number | { id: number } } | [hub: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})
const HubController = { index, create, store, show, edit, update, destroy, toggleStatus }

export default HubController