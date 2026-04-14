import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DriverController::index
 * @see app/Http/Controllers/Admin/DriverController.php:19
 * @route '/admin/drivers'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/drivers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DriverController::index
 * @see app/Http/Controllers/Admin/DriverController.php:19
 * @route '/admin/drivers'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DriverController::index
 * @see app/Http/Controllers/Admin/DriverController.php:19
 * @route '/admin/drivers'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DriverController::index
 * @see app/Http/Controllers/Admin/DriverController.php:19
 * @route '/admin/drivers'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DriverController::create
 * @see app/Http/Controllers/Admin/DriverController.php:40
 * @route '/admin/drivers/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/drivers/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DriverController::create
 * @see app/Http/Controllers/Admin/DriverController.php:40
 * @route '/admin/drivers/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DriverController::create
 * @see app/Http/Controllers/Admin/DriverController.php:40
 * @route '/admin/drivers/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DriverController::create
 * @see app/Http/Controllers/Admin/DriverController.php:40
 * @route '/admin/drivers/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DriverController::store
 * @see app/Http/Controllers/Admin/DriverController.php:56
 * @route '/admin/drivers'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/drivers',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DriverController::store
 * @see app/Http/Controllers/Admin/DriverController.php:56
 * @route '/admin/drivers'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DriverController::store
 * @see app/Http/Controllers/Admin/DriverController.php:56
 * @route '/admin/drivers'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DriverController::show
 * @see app/Http/Controllers/Admin/DriverController.php:31
 * @route '/admin/drivers/{driver}'
 */
export const show = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/drivers/{driver}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DriverController::show
 * @see app/Http/Controllers/Admin/DriverController.php:31
 * @route '/admin/drivers/{driver}'
 */
show.url = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { driver: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { driver: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    driver: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        driver: typeof args.driver === 'object'
                ? args.driver.id
                : args.driver,
                }

    return show.definition.url
            .replace('{driver}', parsedArgs.driver.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DriverController::show
 * @see app/Http/Controllers/Admin/DriverController.php:31
 * @route '/admin/drivers/{driver}'
 */
show.get = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DriverController::show
 * @see app/Http/Controllers/Admin/DriverController.php:31
 * @route '/admin/drivers/{driver}'
 */
show.head = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DriverController::edit
 * @see app/Http/Controllers/Admin/DriverController.php:63
 * @route '/admin/drivers/{driver}/edit'
 */
export const edit = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/drivers/{driver}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DriverController::edit
 * @see app/Http/Controllers/Admin/DriverController.php:63
 * @route '/admin/drivers/{driver}/edit'
 */
edit.url = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { driver: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { driver: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    driver: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        driver: typeof args.driver === 'object'
                ? args.driver.id
                : args.driver,
                }

    return edit.definition.url
            .replace('{driver}', parsedArgs.driver.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DriverController::edit
 * @see app/Http/Controllers/Admin/DriverController.php:63
 * @route '/admin/drivers/{driver}/edit'
 */
edit.get = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DriverController::edit
 * @see app/Http/Controllers/Admin/DriverController.php:63
 * @route '/admin/drivers/{driver}/edit'
 */
edit.head = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DriverController::update
 * @see app/Http/Controllers/Admin/DriverController.php:74
 * @route '/admin/drivers/{driver}'
 */
export const update = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/drivers/{driver}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\DriverController::update
 * @see app/Http/Controllers/Admin/DriverController.php:74
 * @route '/admin/drivers/{driver}'
 */
update.url = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { driver: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { driver: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    driver: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        driver: typeof args.driver === 'object'
                ? args.driver.id
                : args.driver,
                }

    return update.definition.url
            .replace('{driver}', parsedArgs.driver.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DriverController::update
 * @see app/Http/Controllers/Admin/DriverController.php:74
 * @route '/admin/drivers/{driver}'
 */
update.put = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\DriverController::update
 * @see app/Http/Controllers/Admin/DriverController.php:74
 * @route '/admin/drivers/{driver}'
 */
update.patch = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\DriverController::destroy
 * @see app/Http/Controllers/Admin/DriverController.php:81
 * @route '/admin/drivers/{driver}'
 */
export const destroy = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/drivers/{driver}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\DriverController::destroy
 * @see app/Http/Controllers/Admin/DriverController.php:81
 * @route '/admin/drivers/{driver}'
 */
destroy.url = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { driver: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { driver: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    driver: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        driver: typeof args.driver === 'object'
                ? args.driver.id
                : args.driver,
                }

    return destroy.definition.url
            .replace('{driver}', parsedArgs.driver.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DriverController::destroy
 * @see app/Http/Controllers/Admin/DriverController.php:81
 * @route '/admin/drivers/{driver}'
 */
destroy.delete = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\DriverController::assignZone
 * @see app/Http/Controllers/Admin/DriverController.php:88
 * @route '/admin/drivers/{driver}/assign-zone'
 */
export const assignZone = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignZone.url(args, options),
    method: 'post',
})

assignZone.definition = {
    methods: ["post"],
    url: '/admin/drivers/{driver}/assign-zone',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DriverController::assignZone
 * @see app/Http/Controllers/Admin/DriverController.php:88
 * @route '/admin/drivers/{driver}/assign-zone'
 */
assignZone.url = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { driver: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { driver: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    driver: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        driver: typeof args.driver === 'object'
                ? args.driver.id
                : args.driver,
                }

    return assignZone.definition.url
            .replace('{driver}', parsedArgs.driver.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DriverController::assignZone
 * @see app/Http/Controllers/Admin/DriverController.php:88
 * @route '/admin/drivers/{driver}/assign-zone'
 */
assignZone.post = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignZone.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DriverController::toggleStatus
 * @see app/Http/Controllers/Admin/DriverController.php:95
 * @route '/admin/drivers/{driver}/toggle-status'
 */
export const toggleStatus = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/admin/drivers/{driver}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DriverController::toggleStatus
 * @see app/Http/Controllers/Admin/DriverController.php:95
 * @route '/admin/drivers/{driver}/toggle-status'
 */
toggleStatus.url = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { driver: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { driver: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    driver: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        driver: typeof args.driver === 'object'
                ? args.driver.id
                : args.driver,
                }

    return toggleStatus.definition.url
            .replace('{driver}', parsedArgs.driver.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DriverController::toggleStatus
 * @see app/Http/Controllers/Admin/DriverController.php:95
 * @route '/admin/drivers/{driver}/toggle-status'
 */
toggleStatus.post = (args: { driver: number | { id: number } } | [driver: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})
const DriverController = { index, create, store, show, edit, update, destroy, assignZone, toggleStatus }

export default DriverController