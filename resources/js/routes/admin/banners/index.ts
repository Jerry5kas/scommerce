import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\BannerController::index
 * @see app/Http/Controllers/Admin/BannerController.php:23
 * @route '/admin/banners'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/banners',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BannerController::index
 * @see app/Http/Controllers/Admin/BannerController.php:23
 * @route '/admin/banners'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BannerController::index
 * @see app/Http/Controllers/Admin/BannerController.php:23
 * @route '/admin/banners'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BannerController::index
 * @see app/Http/Controllers/Admin/BannerController.php:23
 * @route '/admin/banners'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BannerController::create
 * @see app/Http/Controllers/Admin/BannerController.php:61
 * @route '/admin/banners/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/banners/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BannerController::create
 * @see app/Http/Controllers/Admin/BannerController.php:61
 * @route '/admin/banners/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BannerController::create
 * @see app/Http/Controllers/Admin/BannerController.php:61
 * @route '/admin/banners/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BannerController::create
 * @see app/Http/Controllers/Admin/BannerController.php:61
 * @route '/admin/banners/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BannerController::store
 * @see app/Http/Controllers/Admin/BannerController.php:74
 * @route '/admin/banners'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/banners',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BannerController::store
 * @see app/Http/Controllers/Admin/BannerController.php:74
 * @route '/admin/banners'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BannerController::store
 * @see app/Http/Controllers/Admin/BannerController.php:74
 * @route '/admin/banners'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BannerController::show
 * @see app/Http/Controllers/Admin/BannerController.php:126
 * @route '/admin/banners/{banner}'
 */
export const show = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/banners/{banner}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BannerController::show
 * @see app/Http/Controllers/Admin/BannerController.php:126
 * @route '/admin/banners/{banner}'
 */
show.url = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { banner: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { banner: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    banner: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        banner: typeof args.banner === 'object'
                ? args.banner.id
                : args.banner,
                }

    return show.definition.url
            .replace('{banner}', parsedArgs.banner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BannerController::show
 * @see app/Http/Controllers/Admin/BannerController.php:126
 * @route '/admin/banners/{banner}'
 */
show.get = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BannerController::show
 * @see app/Http/Controllers/Admin/BannerController.php:126
 * @route '/admin/banners/{banner}'
 */
show.head = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BannerController::edit
 * @see app/Http/Controllers/Admin/BannerController.php:138
 * @route '/admin/banners/{banner}/edit'
 */
export const edit = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/banners/{banner}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BannerController::edit
 * @see app/Http/Controllers/Admin/BannerController.php:138
 * @route '/admin/banners/{banner}/edit'
 */
edit.url = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { banner: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { banner: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    banner: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        banner: typeof args.banner === 'object'
                ? args.banner.id
                : args.banner,
                }

    return edit.definition.url
            .replace('{banner}', parsedArgs.banner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BannerController::edit
 * @see app/Http/Controllers/Admin/BannerController.php:138
 * @route '/admin/banners/{banner}/edit'
 */
edit.get = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BannerController::edit
 * @see app/Http/Controllers/Admin/BannerController.php:138
 * @route '/admin/banners/{banner}/edit'
 */
edit.head = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BannerController::update
 * @see app/Http/Controllers/Admin/BannerController.php:152
 * @route '/admin/banners/{banner}'
 */
export const update = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/banners/{banner}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\BannerController::update
 * @see app/Http/Controllers/Admin/BannerController.php:152
 * @route '/admin/banners/{banner}'
 */
update.url = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { banner: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { banner: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    banner: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        banner: typeof args.banner === 'object'
                ? args.banner.id
                : args.banner,
                }

    return update.definition.url
            .replace('{banner}', parsedArgs.banner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BannerController::update
 * @see app/Http/Controllers/Admin/BannerController.php:152
 * @route '/admin/banners/{banner}'
 */
update.put = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\BannerController::update
 * @see app/Http/Controllers/Admin/BannerController.php:152
 * @route '/admin/banners/{banner}'
 */
update.patch = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\BannerController::destroy
 * @see app/Http/Controllers/Admin/BannerController.php:208
 * @route '/admin/banners/{banner}'
 */
export const destroy = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/banners/{banner}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\BannerController::destroy
 * @see app/Http/Controllers/Admin/BannerController.php:208
 * @route '/admin/banners/{banner}'
 */
destroy.url = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { banner: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { banner: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    banner: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        banner: typeof args.banner === 'object'
                ? args.banner.id
                : args.banner,
                }

    return destroy.definition.url
            .replace('{banner}', parsedArgs.banner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BannerController::destroy
 * @see app/Http/Controllers/Admin/BannerController.php:208
 * @route '/admin/banners/{banner}'
 */
destroy.delete = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\BannerController::toggleStatus
 * @see app/Http/Controllers/Admin/BannerController.php:219
 * @route '/admin/banners/{banner}/toggle-status'
 */
export const toggleStatus = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/admin/banners/{banner}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BannerController::toggleStatus
 * @see app/Http/Controllers/Admin/BannerController.php:219
 * @route '/admin/banners/{banner}/toggle-status'
 */
toggleStatus.url = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { banner: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { banner: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    banner: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        banner: typeof args.banner === 'object'
                ? args.banner.id
                : args.banner,
                }

    return toggleStatus.definition.url
            .replace('{banner}', parsedArgs.banner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BannerController::toggleStatus
 * @see app/Http/Controllers/Admin/BannerController.php:219
 * @route '/admin/banners/{banner}/toggle-status'
 */
toggleStatus.post = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BannerController::reorder
 * @see app/Http/Controllers/Admin/BannerController.php:231
 * @route '/admin/banners/reorder'
 */
export const reorder = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(options),
    method: 'post',
})

reorder.definition = {
    methods: ["post"],
    url: '/admin/banners/reorder',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BannerController::reorder
 * @see app/Http/Controllers/Admin/BannerController.php:231
 * @route '/admin/banners/reorder'
 */
reorder.url = (options?: RouteQueryOptions) => {
    return reorder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BannerController::reorder
 * @see app/Http/Controllers/Admin/BannerController.php:231
 * @route '/admin/banners/reorder'
 */
reorder.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reorder.url(options),
    method: 'post',
})
const banners = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
toggleStatus: Object.assign(toggleStatus, toggleStatus),
reorder: Object.assign(reorder, reorder),
}

export default banners