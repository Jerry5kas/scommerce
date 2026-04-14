import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\CouponController::index
 * @see app/Http/Controllers/Admin/CouponController.php:28
 * @route '/admin/coupons'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/coupons',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CouponController::index
 * @see app/Http/Controllers/Admin/CouponController.php:28
 * @route '/admin/coupons'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CouponController::index
 * @see app/Http/Controllers/Admin/CouponController.php:28
 * @route '/admin/coupons'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CouponController::index
 * @see app/Http/Controllers/Admin/CouponController.php:28
 * @route '/admin/coupons'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CouponController::create
 * @see app/Http/Controllers/Admin/CouponController.php:76
 * @route '/admin/coupons/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/coupons/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CouponController::create
 * @see app/Http/Controllers/Admin/CouponController.php:76
 * @route '/admin/coupons/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CouponController::create
 * @see app/Http/Controllers/Admin/CouponController.php:76
 * @route '/admin/coupons/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CouponController::create
 * @see app/Http/Controllers/Admin/CouponController.php:76
 * @route '/admin/coupons/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CouponController::store
 * @see app/Http/Controllers/Admin/CouponController.php:90
 * @route '/admin/coupons'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/coupons',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CouponController::store
 * @see app/Http/Controllers/Admin/CouponController.php:90
 * @route '/admin/coupons'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CouponController::store
 * @see app/Http/Controllers/Admin/CouponController.php:90
 * @route '/admin/coupons'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CouponController::show
 * @see app/Http/Controllers/Admin/CouponController.php:105
 * @route '/admin/coupons/{coupon}'
 */
export const show = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/coupons/{coupon}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CouponController::show
 * @see app/Http/Controllers/Admin/CouponController.php:105
 * @route '/admin/coupons/{coupon}'
 */
show.url = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { coupon: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { coupon: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    coupon: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        coupon: typeof args.coupon === 'object'
                ? args.coupon.id
                : args.coupon,
                }

    return show.definition.url
            .replace('{coupon}', parsedArgs.coupon.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CouponController::show
 * @see app/Http/Controllers/Admin/CouponController.php:105
 * @route '/admin/coupons/{coupon}'
 */
show.get = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CouponController::show
 * @see app/Http/Controllers/Admin/CouponController.php:105
 * @route '/admin/coupons/{coupon}'
 */
show.head = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CouponController::edit
 * @see app/Http/Controllers/Admin/CouponController.php:124
 * @route '/admin/coupons/{coupon}/edit'
 */
export const edit = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/coupons/{coupon}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CouponController::edit
 * @see app/Http/Controllers/Admin/CouponController.php:124
 * @route '/admin/coupons/{coupon}/edit'
 */
edit.url = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { coupon: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { coupon: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    coupon: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        coupon: typeof args.coupon === 'object'
                ? args.coupon.id
                : args.coupon,
                }

    return edit.definition.url
            .replace('{coupon}', parsedArgs.coupon.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CouponController::edit
 * @see app/Http/Controllers/Admin/CouponController.php:124
 * @route '/admin/coupons/{coupon}/edit'
 */
edit.get = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CouponController::edit
 * @see app/Http/Controllers/Admin/CouponController.php:124
 * @route '/admin/coupons/{coupon}/edit'
 */
edit.head = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CouponController::update
 * @see app/Http/Controllers/Admin/CouponController.php:139
 * @route '/admin/coupons/{coupon}'
 */
export const update = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/coupons/{coupon}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\CouponController::update
 * @see app/Http/Controllers/Admin/CouponController.php:139
 * @route '/admin/coupons/{coupon}'
 */
update.url = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { coupon: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { coupon: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    coupon: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        coupon: typeof args.coupon === 'object'
                ? args.coupon.id
                : args.coupon,
                }

    return update.definition.url
            .replace('{coupon}', parsedArgs.coupon.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CouponController::update
 * @see app/Http/Controllers/Admin/CouponController.php:139
 * @route '/admin/coupons/{coupon}'
 */
update.put = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\CouponController::update
 * @see app/Http/Controllers/Admin/CouponController.php:139
 * @route '/admin/coupons/{coupon}'
 */
update.patch = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\CouponController::destroy
 * @see app/Http/Controllers/Admin/CouponController.php:154
 * @route '/admin/coupons/{coupon}'
 */
export const destroy = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/coupons/{coupon}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\CouponController::destroy
 * @see app/Http/Controllers/Admin/CouponController.php:154
 * @route '/admin/coupons/{coupon}'
 */
destroy.url = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { coupon: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { coupon: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    coupon: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        coupon: typeof args.coupon === 'object'
                ? args.coupon.id
                : args.coupon,
                }

    return destroy.definition.url
            .replace('{coupon}', parsedArgs.coupon.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CouponController::destroy
 * @see app/Http/Controllers/Admin/CouponController.php:154
 * @route '/admin/coupons/{coupon}'
 */
destroy.delete = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\CouponController::toggleStatus
 * @see app/Http/Controllers/Admin/CouponController.php:170
 * @route '/admin/coupons/{coupon}/toggle-status'
 */
export const toggleStatus = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/admin/coupons/{coupon}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CouponController::toggleStatus
 * @see app/Http/Controllers/Admin/CouponController.php:170
 * @route '/admin/coupons/{coupon}/toggle-status'
 */
toggleStatus.url = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { coupon: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { coupon: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    coupon: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        coupon: typeof args.coupon === 'object'
                ? args.coupon.id
                : args.coupon,
                }

    return toggleStatus.definition.url
            .replace('{coupon}', parsedArgs.coupon.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CouponController::toggleStatus
 * @see app/Http/Controllers/Admin/CouponController.php:170
 * @route '/admin/coupons/{coupon}/toggle-status'
 */
toggleStatus.post = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CouponController::usages
 * @see app/Http/Controllers/Admin/CouponController.php:182
 * @route '/admin/coupons/{coupon}/usages'
 */
export const usages = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: usages.url(args, options),
    method: 'get',
})

usages.definition = {
    methods: ["get","head"],
    url: '/admin/coupons/{coupon}/usages',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CouponController::usages
 * @see app/Http/Controllers/Admin/CouponController.php:182
 * @route '/admin/coupons/{coupon}/usages'
 */
usages.url = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { coupon: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { coupon: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    coupon: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        coupon: typeof args.coupon === 'object'
                ? args.coupon.id
                : args.coupon,
                }

    return usages.definition.url
            .replace('{coupon}', parsedArgs.coupon.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CouponController::usages
 * @see app/Http/Controllers/Admin/CouponController.php:182
 * @route '/admin/coupons/{coupon}/usages'
 */
usages.get = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: usages.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CouponController::usages
 * @see app/Http/Controllers/Admin/CouponController.php:182
 * @route '/admin/coupons/{coupon}/usages'
 */
usages.head = (args: { coupon: number | { id: number } } | [coupon: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: usages.url(args, options),
    method: 'head',
})
const coupons = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
toggleStatus: Object.assign(toggleStatus, toggleStatus),
usages: Object.assign(usages, usages),
}

export default coupons