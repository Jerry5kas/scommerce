import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\SubscriptionController::plans
 * @see app/Http/Controllers/SubscriptionController.php:36
 * @route '/subscription'
 */
export const plans = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: plans.url(options),
    method: 'get',
})

plans.definition = {
    methods: ["get","head"],
    url: '/subscription',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SubscriptionController::plans
 * @see app/Http/Controllers/SubscriptionController.php:36
 * @route '/subscription'
 */
plans.url = (options?: RouteQueryOptions) => {
    return plans.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::plans
 * @see app/Http/Controllers/SubscriptionController.php:36
 * @route '/subscription'
 */
plans.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: plans.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SubscriptionController::plans
 * @see app/Http/Controllers/SubscriptionController.php:36
 * @route '/subscription'
 */
plans.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: plans.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SubscriptionController::index
 * @see app/Http/Controllers/SubscriptionController.php:96
 * @route '/subscriptions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/subscriptions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SubscriptionController::index
 * @see app/Http/Controllers/SubscriptionController.php:96
 * @route '/subscriptions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::index
 * @see app/Http/Controllers/SubscriptionController.php:96
 * @route '/subscriptions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SubscriptionController::index
 * @see app/Http/Controllers/SubscriptionController.php:96
 * @route '/subscriptions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SubscriptionController::create
 * @see app/Http/Controllers/SubscriptionController.php:149
 * @route '/subscriptions/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/subscriptions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SubscriptionController::create
 * @see app/Http/Controllers/SubscriptionController.php:149
 * @route '/subscriptions/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::create
 * @see app/Http/Controllers/SubscriptionController.php:149
 * @route '/subscriptions/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SubscriptionController::create
 * @see app/Http/Controllers/SubscriptionController.php:149
 * @route '/subscriptions/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SubscriptionController::store
 * @see app/Http/Controllers/SubscriptionController.php:177
 * @route '/subscriptions'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/subscriptions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SubscriptionController::store
 * @see app/Http/Controllers/SubscriptionController.php:177
 * @route '/subscriptions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::store
 * @see app/Http/Controllers/SubscriptionController.php:177
 * @route '/subscriptions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SubscriptionController::show
 * @see app/Http/Controllers/SubscriptionController.php:115
 * @route '/subscriptions/{subscription}'
 */
export const show = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/subscriptions/{subscription}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SubscriptionController::show
 * @see app/Http/Controllers/SubscriptionController.php:115
 * @route '/subscriptions/{subscription}'
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
* @see \App\Http\Controllers\SubscriptionController::show
 * @see app/Http/Controllers/SubscriptionController.php:115
 * @route '/subscriptions/{subscription}'
 */
show.get = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SubscriptionController::show
 * @see app/Http/Controllers/SubscriptionController.php:115
 * @route '/subscriptions/{subscription}'
 */
show.head = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SubscriptionController::edit
 * @see app/Http/Controllers/SubscriptionController.php:243
 * @route '/subscriptions/{subscription}/edit'
 */
export const edit = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/subscriptions/{subscription}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SubscriptionController::edit
 * @see app/Http/Controllers/SubscriptionController.php:243
 * @route '/subscriptions/{subscription}/edit'
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
* @see \App\Http\Controllers\SubscriptionController::edit
 * @see app/Http/Controllers/SubscriptionController.php:243
 * @route '/subscriptions/{subscription}/edit'
 */
edit.get = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SubscriptionController::edit
 * @see app/Http/Controllers/SubscriptionController.php:243
 * @route '/subscriptions/{subscription}/edit'
 */
edit.head = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SubscriptionController::update
 * @see app/Http/Controllers/SubscriptionController.php:278
 * @route '/subscriptions/{subscription}'
 */
export const update = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/subscriptions/{subscription}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\SubscriptionController::update
 * @see app/Http/Controllers/SubscriptionController.php:278
 * @route '/subscriptions/{subscription}'
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
* @see \App\Http\Controllers\SubscriptionController::update
 * @see app/Http/Controllers/SubscriptionController.php:278
 * @route '/subscriptions/{subscription}'
 */
update.put = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\SubscriptionController::pause
 * @see app/Http/Controllers/SubscriptionController.php:343
 * @route '/subscriptions/{subscription}/pause'
 */
export const pause = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pause.url(args, options),
    method: 'post',
})

pause.definition = {
    methods: ["post"],
    url: '/subscriptions/{subscription}/pause',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SubscriptionController::pause
 * @see app/Http/Controllers/SubscriptionController.php:343
 * @route '/subscriptions/{subscription}/pause'
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
* @see \App\Http\Controllers\SubscriptionController::pause
 * @see app/Http/Controllers/SubscriptionController.php:343
 * @route '/subscriptions/{subscription}/pause'
 */
pause.post = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pause.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SubscriptionController::resume
 * @see app/Http/Controllers/SubscriptionController.php:370
 * @route '/subscriptions/{subscription}/resume'
 */
export const resume = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resume.url(args, options),
    method: 'post',
})

resume.definition = {
    methods: ["post"],
    url: '/subscriptions/{subscription}/resume',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SubscriptionController::resume
 * @see app/Http/Controllers/SubscriptionController.php:370
 * @route '/subscriptions/{subscription}/resume'
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
* @see \App\Http\Controllers\SubscriptionController::resume
 * @see app/Http/Controllers/SubscriptionController.php:370
 * @route '/subscriptions/{subscription}/resume'
 */
resume.post = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resume.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SubscriptionController::cancel
 * @see app/Http/Controllers/SubscriptionController.php:393
 * @route '/subscriptions/{subscription}/cancel'
 */
export const cancel = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/subscriptions/{subscription}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SubscriptionController::cancel
 * @see app/Http/Controllers/SubscriptionController.php:393
 * @route '/subscriptions/{subscription}/cancel'
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
* @see \App\Http\Controllers\SubscriptionController::cancel
 * @see app/Http/Controllers/SubscriptionController.php:393
 * @route '/subscriptions/{subscription}/cancel'
 */
cancel.post = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SubscriptionController::setVacation
 * @see app/Http/Controllers/SubscriptionController.php:417
 * @route '/subscriptions/{subscription}/vacation'
 */
export const setVacation = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setVacation.url(args, options),
    method: 'post',
})

setVacation.definition = {
    methods: ["post"],
    url: '/subscriptions/{subscription}/vacation',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SubscriptionController::setVacation
 * @see app/Http/Controllers/SubscriptionController.php:417
 * @route '/subscriptions/{subscription}/vacation'
 */
setVacation.url = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return setVacation.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::setVacation
 * @see app/Http/Controllers/SubscriptionController.php:417
 * @route '/subscriptions/{subscription}/vacation'
 */
setVacation.post = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setVacation.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SubscriptionController::clearVacation
 * @see app/Http/Controllers/SubscriptionController.php:445
 * @route '/subscriptions/{subscription}/vacation'
 */
export const clearVacation = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clearVacation.url(args, options),
    method: 'delete',
})

clearVacation.definition = {
    methods: ["delete"],
    url: '/subscriptions/{subscription}/vacation',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\SubscriptionController::clearVacation
 * @see app/Http/Controllers/SubscriptionController.php:445
 * @route '/subscriptions/{subscription}/vacation'
 */
clearVacation.url = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return clearVacation.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::clearVacation
 * @see app/Http/Controllers/SubscriptionController.php:445
 * @route '/subscriptions/{subscription}/vacation'
 */
clearVacation.delete = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clearVacation.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\SubscriptionController::getSchedule
 * @see app/Http/Controllers/SubscriptionController.php:464
 * @route '/subscriptions/{subscription}/schedule'
 */
export const getSchedule = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSchedule.url(args, options),
    method: 'get',
})

getSchedule.definition = {
    methods: ["get","head"],
    url: '/subscriptions/{subscription}/schedule',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SubscriptionController::getSchedule
 * @see app/Http/Controllers/SubscriptionController.php:464
 * @route '/subscriptions/{subscription}/schedule'
 */
getSchedule.url = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return getSchedule.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::getSchedule
 * @see app/Http/Controllers/SubscriptionController.php:464
 * @route '/subscriptions/{subscription}/schedule'
 */
getSchedule.get = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getSchedule.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SubscriptionController::getSchedule
 * @see app/Http/Controllers/SubscriptionController.php:464
 * @route '/subscriptions/{subscription}/schedule'
 */
getSchedule.head = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getSchedule.url(args, options),
    method: 'head',
})
const SubscriptionController = { plans, index, create, store, show, edit, update, pause, resume, cancel, setVacation, clearVacation, getSchedule }

export default SubscriptionController