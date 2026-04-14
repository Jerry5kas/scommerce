import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\OrderController::index
 * @see app/Http/Controllers/Admin/OrderController.php:25
 * @route '/admin/orders'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\OrderController::index
 * @see app/Http/Controllers/Admin/OrderController.php:25
 * @route '/admin/orders'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrderController::index
 * @see app/Http/Controllers/Admin/OrderController.php:25
 * @route '/admin/orders'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\OrderController::index
 * @see app/Http/Controllers/Admin/OrderController.php:25
 * @route '/admin/orders'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\OrderController::create
 * @see app/Http/Controllers/Admin/OrderController.php:0
 * @route '/admin/orders/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/orders/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\OrderController::create
 * @see app/Http/Controllers/Admin/OrderController.php:0
 * @route '/admin/orders/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrderController::create
 * @see app/Http/Controllers/Admin/OrderController.php:0
 * @route '/admin/orders/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\OrderController::create
 * @see app/Http/Controllers/Admin/OrderController.php:0
 * @route '/admin/orders/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\OrderController::store
 * @see app/Http/Controllers/Admin/OrderController.php:0
 * @route '/admin/orders'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/orders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\OrderController::store
 * @see app/Http/Controllers/Admin/OrderController.php:0
 * @route '/admin/orders'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrderController::store
 * @see app/Http/Controllers/Admin/OrderController.php:0
 * @route '/admin/orders'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OrderController::show
 * @see app/Http/Controllers/Admin/OrderController.php:91
 * @route '/admin/orders/{order}'
 */
export const show = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/orders/{order}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\OrderController::show
 * @see app/Http/Controllers/Admin/OrderController.php:91
 * @route '/admin/orders/{order}'
 */
show.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return show.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrderController::show
 * @see app/Http/Controllers/Admin/OrderController.php:91
 * @route '/admin/orders/{order}'
 */
show.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\OrderController::show
 * @see app/Http/Controllers/Admin/OrderController.php:91
 * @route '/admin/orders/{order}'
 */
show.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\OrderController::edit
 * @see app/Http/Controllers/Admin/OrderController.php:0
 * @route '/admin/orders/{order}/edit'
 */
export const edit = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/orders/{order}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\OrderController::edit
 * @see app/Http/Controllers/Admin/OrderController.php:0
 * @route '/admin/orders/{order}/edit'
 */
edit.url = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: args.order,
                }

    return edit.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrderController::edit
 * @see app/Http/Controllers/Admin/OrderController.php:0
 * @route '/admin/orders/{order}/edit'
 */
edit.get = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\OrderController::edit
 * @see app/Http/Controllers/Admin/OrderController.php:0
 * @route '/admin/orders/{order}/edit'
 */
edit.head = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\OrderController::update
 * @see app/Http/Controllers/Admin/OrderController.php:136
 * @route '/admin/orders/{order}'
 */
export const update = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/orders/{order}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\OrderController::update
 * @see app/Http/Controllers/Admin/OrderController.php:136
 * @route '/admin/orders/{order}'
 */
update.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return update.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrderController::update
 * @see app/Http/Controllers/Admin/OrderController.php:136
 * @route '/admin/orders/{order}'
 */
update.put = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\OrderController::update
 * @see app/Http/Controllers/Admin/OrderController.php:136
 * @route '/admin/orders/{order}'
 */
update.patch = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\OrderController::destroy
 * @see app/Http/Controllers/Admin/OrderController.php:0
 * @route '/admin/orders/{order}'
 */
export const destroy = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/orders/{order}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\OrderController::destroy
 * @see app/Http/Controllers/Admin/OrderController.php:0
 * @route '/admin/orders/{order}'
 */
destroy.url = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: args.order,
                }

    return destroy.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrderController::destroy
 * @see app/Http/Controllers/Admin/OrderController.php:0
 * @route '/admin/orders/{order}'
 */
destroy.delete = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\OrderController::cancel
 * @see app/Http/Controllers/Admin/OrderController.php:168
 * @route '/admin/orders/{order}/cancel'
 */
export const cancel = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/admin/orders/{order}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\OrderController::cancel
 * @see app/Http/Controllers/Admin/OrderController.php:168
 * @route '/admin/orders/{order}/cancel'
 */
cancel.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return cancel.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrderController::cancel
 * @see app/Http/Controllers/Admin/OrderController.php:168
 * @route '/admin/orders/{order}/cancel'
 */
cancel.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OrderController::assignDriver
 * @see app/Http/Controllers/Admin/OrderController.php:153
 * @route '/admin/orders/{order}/assign-driver'
 */
export const assignDriver = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignDriver.url(args, options),
    method: 'post',
})

assignDriver.definition = {
    methods: ["post"],
    url: '/admin/orders/{order}/assign-driver',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\OrderController::assignDriver
 * @see app/Http/Controllers/Admin/OrderController.php:153
 * @route '/admin/orders/{order}/assign-driver'
 */
assignDriver.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return assignDriver.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrderController::assignDriver
 * @see app/Http/Controllers/Admin/OrderController.php:153
 * @route '/admin/orders/{order}/assign-driver'
 */
assignDriver.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignDriver.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\OrderController::updateStatus
 * @see app/Http/Controllers/Admin/OrderController.php:113
 * @route '/admin/orders/{order}/status'
 */
export const updateStatus = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.definition = {
    methods: ["post"],
    url: '/admin/orders/{order}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\OrderController::updateStatus
 * @see app/Http/Controllers/Admin/OrderController.php:113
 * @route '/admin/orders/{order}/status'
 */
updateStatus.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return updateStatus.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\OrderController::updateStatus
 * @see app/Http/Controllers/Admin/OrderController.php:113
 * @route '/admin/orders/{order}/status'
 */
updateStatus.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})
const OrderController = { index, create, store, show, edit, update, destroy, cancel, assignDriver, updateStatus }

export default OrderController