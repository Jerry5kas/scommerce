import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\RouteController::index
 * @see app/Http/Controllers/Admin/RouteController.php:18
 * @route '/admin/routes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/routes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\RouteController::index
 * @see app/Http/Controllers/Admin/RouteController.php:18
 * @route '/admin/routes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\RouteController::index
 * @see app/Http/Controllers/Admin/RouteController.php:18
 * @route '/admin/routes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\RouteController::index
 * @see app/Http/Controllers/Admin/RouteController.php:18
 * @route '/admin/routes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\RouteController::create
 * @see app/Http/Controllers/Admin/RouteController.php:30
 * @route '/admin/routes/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/routes/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\RouteController::create
 * @see app/Http/Controllers/Admin/RouteController.php:30
 * @route '/admin/routes/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\RouteController::create
 * @see app/Http/Controllers/Admin/RouteController.php:30
 * @route '/admin/routes/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\RouteController::create
 * @see app/Http/Controllers/Admin/RouteController.php:30
 * @route '/admin/routes/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\RouteController::store
 * @see app/Http/Controllers/Admin/RouteController.php:37
 * @route '/admin/routes'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/routes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\RouteController::store
 * @see app/Http/Controllers/Admin/RouteController.php:37
 * @route '/admin/routes'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\RouteController::store
 * @see app/Http/Controllers/Admin/RouteController.php:37
 * @route '/admin/routes'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\RouteController::show
 * @see app/Http/Controllers/Admin/RouteController.php:0
 * @route '/admin/routes/{route}'
 */
export const show = (args: { route: string | number } | [route: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/routes/{route}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\RouteController::show
 * @see app/Http/Controllers/Admin/RouteController.php:0
 * @route '/admin/routes/{route}'
 */
show.url = (args: { route: string | number } | [route: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { route: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    route: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        route: args.route,
                }

    return show.definition.url
            .replace('{route}', parsedArgs.route.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\RouteController::show
 * @see app/Http/Controllers/Admin/RouteController.php:0
 * @route '/admin/routes/{route}'
 */
show.get = (args: { route: string | number } | [route: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\RouteController::show
 * @see app/Http/Controllers/Admin/RouteController.php:0
 * @route '/admin/routes/{route}'
 */
show.head = (args: { route: string | number } | [route: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\RouteController::edit
 * @see app/Http/Controllers/Admin/RouteController.php:44
 * @route '/admin/routes/{route}/edit'
 */
export const edit = (args: { route: number | { id: number } } | [route: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/routes/{route}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\RouteController::edit
 * @see app/Http/Controllers/Admin/RouteController.php:44
 * @route '/admin/routes/{route}/edit'
 */
edit.url = (args: { route: number | { id: number } } | [route: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { route: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { route: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    route: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        route: typeof args.route === 'object'
                ? args.route.id
                : args.route,
                }

    return edit.definition.url
            .replace('{route}', parsedArgs.route.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\RouteController::edit
 * @see app/Http/Controllers/Admin/RouteController.php:44
 * @route '/admin/routes/{route}/edit'
 */
edit.get = (args: { route: number | { id: number } } | [route: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\RouteController::edit
 * @see app/Http/Controllers/Admin/RouteController.php:44
 * @route '/admin/routes/{route}/edit'
 */
edit.head = (args: { route: number | { id: number } } | [route: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\RouteController::update
 * @see app/Http/Controllers/Admin/RouteController.php:54
 * @route '/admin/routes/{route}'
 */
export const update = (args: { route: number | { id: number } } | [route: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/routes/{route}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\RouteController::update
 * @see app/Http/Controllers/Admin/RouteController.php:54
 * @route '/admin/routes/{route}'
 */
update.url = (args: { route: number | { id: number } } | [route: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { route: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { route: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    route: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        route: typeof args.route === 'object'
                ? args.route.id
                : args.route,
                }

    return update.definition.url
            .replace('{route}', parsedArgs.route.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\RouteController::update
 * @see app/Http/Controllers/Admin/RouteController.php:54
 * @route '/admin/routes/{route}'
 */
update.put = (args: { route: number | { id: number } } | [route: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\RouteController::update
 * @see app/Http/Controllers/Admin/RouteController.php:54
 * @route '/admin/routes/{route}'
 */
update.patch = (args: { route: number | { id: number } } | [route: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\RouteController::destroy
 * @see app/Http/Controllers/Admin/RouteController.php:61
 * @route '/admin/routes/{route}'
 */
export const destroy = (args: { route: number | { id: number } } | [route: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/routes/{route}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\RouteController::destroy
 * @see app/Http/Controllers/Admin/RouteController.php:61
 * @route '/admin/routes/{route}'
 */
destroy.url = (args: { route: number | { id: number } } | [route: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { route: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { route: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    route: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        route: typeof args.route === 'object'
                ? args.route.id
                : args.route,
                }

    return destroy.definition.url
            .replace('{route}', parsedArgs.route.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\RouteController::destroy
 * @see app/Http/Controllers/Admin/RouteController.php:61
 * @route '/admin/routes/{route}'
 */
destroy.delete = (args: { route: number | { id: number } } | [route: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\RouteController::toggleStatus
 * @see app/Http/Controllers/Admin/RouteController.php:68
 * @route '/admin/routes/{route}/toggle-status'
 */
export const toggleStatus = (args: { route: number | { id: number } } | [route: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/admin/routes/{route}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\RouteController::toggleStatus
 * @see app/Http/Controllers/Admin/RouteController.php:68
 * @route '/admin/routes/{route}/toggle-status'
 */
toggleStatus.url = (args: { route: number | { id: number } } | [route: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { route: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { route: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    route: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        route: typeof args.route === 'object'
                ? args.route.id
                : args.route,
                }

    return toggleStatus.definition.url
            .replace('{route}', parsedArgs.route.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\RouteController::toggleStatus
 * @see app/Http/Controllers/Admin/RouteController.php:68
 * @route '/admin/routes/{route}/toggle-status'
 */
toggleStatus.post = (args: { route: number | { id: number } } | [route: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\RouteController::updateAddresses
 * @see app/Http/Controllers/Admin/RouteController.php:75
 * @route '/admin/routes/{route}/addresses'
 */
export const updateAddresses = (args: { route: number | { id: number } } | [route: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateAddresses.url(args, options),
    method: 'put',
})

updateAddresses.definition = {
    methods: ["put"],
    url: '/admin/routes/{route}/addresses',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\RouteController::updateAddresses
 * @see app/Http/Controllers/Admin/RouteController.php:75
 * @route '/admin/routes/{route}/addresses'
 */
updateAddresses.url = (args: { route: number | { id: number } } | [route: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { route: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { route: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    route: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        route: typeof args.route === 'object'
                ? args.route.id
                : args.route,
                }

    return updateAddresses.definition.url
            .replace('{route}', parsedArgs.route.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\RouteController::updateAddresses
 * @see app/Http/Controllers/Admin/RouteController.php:75
 * @route '/admin/routes/{route}/addresses'
 */
updateAddresses.put = (args: { route: number | { id: number } } | [route: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateAddresses.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\RouteController::searchAddresses
 * @see app/Http/Controllers/Admin/RouteController.php:93
 * @route '/admin/routes-search-addresses'
 */
export const searchAddresses = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchAddresses.url(options),
    method: 'get',
})

searchAddresses.definition = {
    methods: ["get","head"],
    url: '/admin/routes-search-addresses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\RouteController::searchAddresses
 * @see app/Http/Controllers/Admin/RouteController.php:93
 * @route '/admin/routes-search-addresses'
 */
searchAddresses.url = (options?: RouteQueryOptions) => {
    return searchAddresses.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\RouteController::searchAddresses
 * @see app/Http/Controllers/Admin/RouteController.php:93
 * @route '/admin/routes-search-addresses'
 */
searchAddresses.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchAddresses.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\RouteController::searchAddresses
 * @see app/Http/Controllers/Admin/RouteController.php:93
 * @route '/admin/routes-search-addresses'
 */
searchAddresses.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: searchAddresses.url(options),
    method: 'head',
})
const RouteController = { index, create, store, show, edit, update, destroy, toggleStatus, updateAddresses, searchAddresses }

export default RouteController