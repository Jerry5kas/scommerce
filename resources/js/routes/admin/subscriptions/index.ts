import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SubscriptionController::index
 * @see app/Http/Controllers/Admin/SubscriptionController.php:31
 * @route '/admin/subscriptions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/subscriptions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::index
 * @see app/Http/Controllers/Admin/SubscriptionController.php:31
 * @route '/admin/subscriptions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::index
 * @see app/Http/Controllers/Admin/SubscriptionController.php:31
 * @route '/admin/subscriptions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SubscriptionController::index
 * @see app/Http/Controllers/Admin/SubscriptionController.php:31
 * @route '/admin/subscriptions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::create
 * @see app/Http/Controllers/Admin/SubscriptionController.php:0
 * @route '/admin/subscriptions/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/subscriptions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::create
 * @see app/Http/Controllers/Admin/SubscriptionController.php:0
 * @route '/admin/subscriptions/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::create
 * @see app/Http/Controllers/Admin/SubscriptionController.php:0
 * @route '/admin/subscriptions/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SubscriptionController::create
 * @see app/Http/Controllers/Admin/SubscriptionController.php:0
 * @route '/admin/subscriptions/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::store
 * @see app/Http/Controllers/Admin/SubscriptionController.php:0
 * @route '/admin/subscriptions'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/subscriptions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::store
 * @see app/Http/Controllers/Admin/SubscriptionController.php:0
 * @route '/admin/subscriptions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::store
 * @see app/Http/Controllers/Admin/SubscriptionController.php:0
 * @route '/admin/subscriptions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::show
 * @see app/Http/Controllers/Admin/SubscriptionController.php:83
 * @route '/admin/subscriptions/{subscription}'
 */
export const show = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/subscriptions/{subscription}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::show
 * @see app/Http/Controllers/Admin/SubscriptionController.php:83
 * @route '/admin/subscriptions/{subscription}'
 */
show.url = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subscription: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.id
                : args.subscription,
                }

    return show.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::show
 * @see app/Http/Controllers/Admin/SubscriptionController.php:83
 * @route '/admin/subscriptions/{subscription}'
 */
show.get = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SubscriptionController::show
 * @see app/Http/Controllers/Admin/SubscriptionController.php:83
 * @route '/admin/subscriptions/{subscription}'
 */
show.head = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::edit
 * @see app/Http/Controllers/Admin/SubscriptionController.php:117
 * @route '/admin/subscriptions/{subscription}/edit'
 */
export const edit = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/subscriptions/{subscription}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::edit
 * @see app/Http/Controllers/Admin/SubscriptionController.php:117
 * @route '/admin/subscriptions/{subscription}/edit'
 */
edit.url = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subscription: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.id
                : args.subscription,
                }

    return edit.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::edit
 * @see app/Http/Controllers/Admin/SubscriptionController.php:117
 * @route '/admin/subscriptions/{subscription}/edit'
 */
edit.get = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SubscriptionController::edit
 * @see app/Http/Controllers/Admin/SubscriptionController.php:117
 * @route '/admin/subscriptions/{subscription}/edit'
 */
edit.head = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::update
 * @see app/Http/Controllers/Admin/SubscriptionController.php:150
 * @route '/admin/subscriptions/{subscription}'
 */
export const update = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/subscriptions/{subscription}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::update
 * @see app/Http/Controllers/Admin/SubscriptionController.php:150
 * @route '/admin/subscriptions/{subscription}'
 */
update.url = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subscription: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.id
                : args.subscription,
                }

    return update.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::update
 * @see app/Http/Controllers/Admin/SubscriptionController.php:150
 * @route '/admin/subscriptions/{subscription}'
 */
update.put = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\SubscriptionController::update
 * @see app/Http/Controllers/Admin/SubscriptionController.php:150
 * @route '/admin/subscriptions/{subscription}'
 */
update.patch = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::destroy
 * @see app/Http/Controllers/Admin/SubscriptionController.php:0
 * @route '/admin/subscriptions/{subscription}'
 */
export const destroy = (args: { subscription: string | number } | [subscription: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/subscriptions/{subscription}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::destroy
 * @see app/Http/Controllers/Admin/SubscriptionController.php:0
 * @route '/admin/subscriptions/{subscription}'
 */
destroy.url = (args: { subscription: string | number } | [subscription: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: args.subscription,
                }

    return destroy.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::destroy
 * @see app/Http/Controllers/Admin/SubscriptionController.php:0
 * @route '/admin/subscriptions/{subscription}'
 */
destroy.delete = (args: { subscription: string | number } | [subscription: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::pause
 * @see app/Http/Controllers/Admin/SubscriptionController.php:215
 * @route '/admin/subscriptions/{subscription}/pause'
 */
export const pause = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pause.url(args, options),
    method: 'post',
})

pause.definition = {
    methods: ["post"],
    url: '/admin/subscriptions/{subscription}/pause',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::pause
 * @see app/Http/Controllers/Admin/SubscriptionController.php:215
 * @route '/admin/subscriptions/{subscription}/pause'
 */
pause.url = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subscription: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.id
                : args.subscription,
                }

    return pause.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::pause
 * @see app/Http/Controllers/Admin/SubscriptionController.php:215
 * @route '/admin/subscriptions/{subscription}/pause'
 */
pause.post = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pause.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::resume
 * @see app/Http/Controllers/Admin/SubscriptionController.php:239
 * @route '/admin/subscriptions/{subscription}/resume'
 */
export const resume = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resume.url(args, options),
    method: 'post',
})

resume.definition = {
    methods: ["post"],
    url: '/admin/subscriptions/{subscription}/resume',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::resume
 * @see app/Http/Controllers/Admin/SubscriptionController.php:239
 * @route '/admin/subscriptions/{subscription}/resume'
 */
resume.url = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subscription: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.id
                : args.subscription,
                }

    return resume.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::resume
 * @see app/Http/Controllers/Admin/SubscriptionController.php:239
 * @route '/admin/subscriptions/{subscription}/resume'
 */
resume.post = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resume.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::cancel
 * @see app/Http/Controllers/Admin/SubscriptionController.php:255
 * @route '/admin/subscriptions/{subscription}/cancel'
 */
export const cancel = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/admin/subscriptions/{subscription}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::cancel
 * @see app/Http/Controllers/Admin/SubscriptionController.php:255
 * @route '/admin/subscriptions/{subscription}/cancel'
 */
cancel.url = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subscription: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: typeof args.subscription === 'object'
                ? args.subscription.id
                : args.subscription,
                }

    return cancel.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::cancel
 * @see app/Http/Controllers/Admin/SubscriptionController.php:255
 * @route '/admin/subscriptions/{subscription}/cancel'
 */
cancel.post = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::schedule
 * @see app/Http/Controllers/Admin/SubscriptionController.php:0
 * @route '/admin/subscriptions/{subscription}/schedule'
 */
export const schedule = (args: { subscription: string | number } | [subscription: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: schedule.url(args, options),
    method: 'get',
})

schedule.definition = {
    methods: ["get","head"],
    url: '/admin/subscriptions/{subscription}/schedule',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::schedule
 * @see app/Http/Controllers/Admin/SubscriptionController.php:0
 * @route '/admin/subscriptions/{subscription}/schedule'
 */
schedule.url = (args: { subscription: string | number } | [subscription: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    subscription: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription: args.subscription,
                }

    return schedule.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::schedule
 * @see app/Http/Controllers/Admin/SubscriptionController.php:0
 * @route '/admin/subscriptions/{subscription}/schedule'
 */
schedule.get = (args: { subscription: string | number } | [subscription: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: schedule.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SubscriptionController::schedule
 * @see app/Http/Controllers/Admin/SubscriptionController.php:0
 * @route '/admin/subscriptions/{subscription}/schedule'
 */
schedule.head = (args: { subscription: string | number } | [subscription: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: schedule.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::upcomingDeliveries
 * @see app/Http/Controllers/Admin/SubscriptionController.php:289
 * @route '/admin/subscriptions/upcoming-deliveries'
 */
export const upcomingDeliveries = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: upcomingDeliveries.url(options),
    method: 'get',
})

upcomingDeliveries.definition = {
    methods: ["get","head"],
    url: '/admin/subscriptions/upcoming-deliveries',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::upcomingDeliveries
 * @see app/Http/Controllers/Admin/SubscriptionController.php:289
 * @route '/admin/subscriptions/upcoming-deliveries'
 */
upcomingDeliveries.url = (options?: RouteQueryOptions) => {
    return upcomingDeliveries.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::upcomingDeliveries
 * @see app/Http/Controllers/Admin/SubscriptionController.php:289
 * @route '/admin/subscriptions/upcoming-deliveries'
 */
upcomingDeliveries.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: upcomingDeliveries.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SubscriptionController::upcomingDeliveries
 * @see app/Http/Controllers/Admin/SubscriptionController.php:289
 * @route '/admin/subscriptions/upcoming-deliveries'
 */
upcomingDeliveries.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: upcomingDeliveries.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::generateOrders
 * @see app/Http/Controllers/Admin/SubscriptionController.php:314
 * @route '/admin/subscriptions/generate-orders'
 */
export const generateOrders = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateOrders.url(options),
    method: 'post',
})

generateOrders.definition = {
    methods: ["post"],
    url: '/admin/subscriptions/generate-orders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::generateOrders
 * @see app/Http/Controllers/Admin/SubscriptionController.php:314
 * @route '/admin/subscriptions/generate-orders'
 */
generateOrders.url = (options?: RouteQueryOptions) => {
    return generateOrders.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionController::generateOrders
 * @see app/Http/Controllers/Admin/SubscriptionController.php:314
 * @route '/admin/subscriptions/generate-orders'
 */
generateOrders.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateOrders.url(options),
    method: 'post',
})
const subscriptions = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
pause: Object.assign(pause, pause),
resume: Object.assign(resume, resume),
cancel: Object.assign(cancel, cancel),
schedule: Object.assign(schedule, schedule),
upcomingDeliveries: Object.assign(upcomingDeliveries, upcomingDeliveries),
generateOrders: Object.assign(generateOrders, generateOrders),
}

export default subscriptions