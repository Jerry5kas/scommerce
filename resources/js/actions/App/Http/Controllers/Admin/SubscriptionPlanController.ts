import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::index
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:17
 * @route '/admin/subscription-plans'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/subscription-plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::index
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:17
 * @route '/admin/subscription-plans'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::index
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:17
 * @route '/admin/subscription-plans'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::index
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:17
 * @route '/admin/subscription-plans'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::create
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:38
 * @route '/admin/subscription-plans/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/subscription-plans/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::create
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:38
 * @route '/admin/subscription-plans/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::create
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:38
 * @route '/admin/subscription-plans/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::create
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:38
 * @route '/admin/subscription-plans/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::store
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:59
 * @route '/admin/subscription-plans'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/subscription-plans',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::store
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:59
 * @route '/admin/subscription-plans'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::store
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:59
 * @route '/admin/subscription-plans'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::show
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:0
 * @route '/admin/subscription-plans/{subscription_plan}'
 */
export const show = (args: { subscription_plan: string | number } | [subscription_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/subscription-plans/{subscription_plan}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::show
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:0
 * @route '/admin/subscription-plans/{subscription_plan}'
 */
show.url = (args: { subscription_plan: string | number } | [subscription_plan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription_plan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    subscription_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription_plan: args.subscription_plan,
                }

    return show.definition.url
            .replace('{subscription_plan}', parsedArgs.subscription_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::show
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:0
 * @route '/admin/subscription-plans/{subscription_plan}'
 */
show.get = (args: { subscription_plan: string | number } | [subscription_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::show
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:0
 * @route '/admin/subscription-plans/{subscription_plan}'
 */
show.head = (args: { subscription_plan: string | number } | [subscription_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::edit
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:106
 * @route '/admin/subscription-plans/{subscription_plan}/edit'
 */
export const edit = (args: { subscription_plan: number | { id: number } } | [subscription_plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/subscription-plans/{subscription_plan}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::edit
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:106
 * @route '/admin/subscription-plans/{subscription_plan}/edit'
 */
edit.url = (args: { subscription_plan: number | { id: number } } | [subscription_plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription_plan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subscription_plan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscription_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription_plan: typeof args.subscription_plan === 'object'
                ? args.subscription_plan.id
                : args.subscription_plan,
                }

    return edit.definition.url
            .replace('{subscription_plan}', parsedArgs.subscription_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::edit
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:106
 * @route '/admin/subscription-plans/{subscription_plan}/edit'
 */
edit.get = (args: { subscription_plan: number | { id: number } } | [subscription_plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::edit
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:106
 * @route '/admin/subscription-plans/{subscription_plan}/edit'
 */
edit.head = (args: { subscription_plan: number | { id: number } } | [subscription_plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::update
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:128
 * @route '/admin/subscription-plans/{subscription_plan}'
 */
export const update = (args: { subscription_plan: number | { id: number } } | [subscription_plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/subscription-plans/{subscription_plan}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::update
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:128
 * @route '/admin/subscription-plans/{subscription_plan}'
 */
update.url = (args: { subscription_plan: number | { id: number } } | [subscription_plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription_plan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subscription_plan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscription_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription_plan: typeof args.subscription_plan === 'object'
                ? args.subscription_plan.id
                : args.subscription_plan,
                }

    return update.definition.url
            .replace('{subscription_plan}', parsedArgs.subscription_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::update
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:128
 * @route '/admin/subscription-plans/{subscription_plan}'
 */
update.put = (args: { subscription_plan: number | { id: number } } | [subscription_plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::update
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:128
 * @route '/admin/subscription-plans/{subscription_plan}'
 */
update.patch = (args: { subscription_plan: number | { id: number } } | [subscription_plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::destroy
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:179
 * @route '/admin/subscription-plans/{subscription_plan}'
 */
export const destroy = (args: { subscription_plan: number | { id: number } } | [subscription_plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/subscription-plans/{subscription_plan}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::destroy
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:179
 * @route '/admin/subscription-plans/{subscription_plan}'
 */
destroy.url = (args: { subscription_plan: number | { id: number } } | [subscription_plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscription_plan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subscription_plan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscription_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscription_plan: typeof args.subscription_plan === 'object'
                ? args.subscription_plan.id
                : args.subscription_plan,
                }

    return destroy.definition.url
            .replace('{subscription_plan}', parsedArgs.subscription_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::destroy
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:179
 * @route '/admin/subscription-plans/{subscription_plan}'
 */
destroy.delete = (args: { subscription_plan: number | { id: number } } | [subscription_plan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::toggleStatus
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:197
 * @route '/admin/subscription-plans/{subscriptionPlan}/toggle-status'
 */
export const toggleStatus = (args: { subscriptionPlan: number | { id: number } } | [subscriptionPlan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/admin/subscription-plans/{subscriptionPlan}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::toggleStatus
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:197
 * @route '/admin/subscription-plans/{subscriptionPlan}/toggle-status'
 */
toggleStatus.url = (args: { subscriptionPlan: number | { id: number } } | [subscriptionPlan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { subscriptionPlan: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { subscriptionPlan: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    subscriptionPlan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        subscriptionPlan: typeof args.subscriptionPlan === 'object'
                ? args.subscriptionPlan.id
                : args.subscriptionPlan,
                }

    return toggleStatus.definition.url
            .replace('{subscriptionPlan}', parsedArgs.subscriptionPlan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\SubscriptionPlanController::toggleStatus
 * @see app/Http/Controllers/Admin/SubscriptionPlanController.php:197
 * @route '/admin/subscription-plans/{subscriptionPlan}/toggle-status'
 */
toggleStatus.post = (args: { subscriptionPlan: number | { id: number } } | [subscriptionPlan: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})
const SubscriptionPlanController = { index, create, store, show, edit, update, destroy, toggleStatus }

export default SubscriptionPlanController