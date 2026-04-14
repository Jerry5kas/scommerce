import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import vacationDc2d17 from './vacation'
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
* @see \App\Http\Controllers\SubscriptionController::vacation
 * @see app/Http/Controllers/SubscriptionController.php:417
 * @route '/subscriptions/{subscription}/vacation'
 */
export const vacation = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: vacation.url(args, options),
    method: 'post',
})

vacation.definition = {
    methods: ["post"],
    url: '/subscriptions/{subscription}/vacation',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SubscriptionController::vacation
 * @see app/Http/Controllers/SubscriptionController.php:417
 * @route '/subscriptions/{subscription}/vacation'
 */
vacation.url = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return vacation.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::vacation
 * @see app/Http/Controllers/SubscriptionController.php:417
 * @route '/subscriptions/{subscription}/vacation'
 */
vacation.post = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: vacation.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SubscriptionController::schedule
 * @see app/Http/Controllers/SubscriptionController.php:464
 * @route '/subscriptions/{subscription}/schedule'
 */
export const schedule = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: schedule.url(args, options),
    method: 'get',
})

schedule.definition = {
    methods: ["get","head"],
    url: '/subscriptions/{subscription}/schedule',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SubscriptionController::schedule
 * @see app/Http/Controllers/SubscriptionController.php:464
 * @route '/subscriptions/{subscription}/schedule'
 */
schedule.url = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return schedule.definition.url
            .replace('{subscription}', parsedArgs.subscription.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SubscriptionController::schedule
 * @see app/Http/Controllers/SubscriptionController.php:464
 * @route '/subscriptions/{subscription}/schedule'
 */
schedule.get = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: schedule.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\SubscriptionController::schedule
 * @see app/Http/Controllers/SubscriptionController.php:464
 * @route '/subscriptions/{subscription}/schedule'
 */
schedule.head = (args: { subscription: number | { id: number } } | [subscription: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: schedule.url(args, options),
    method: 'head',
})
const subscriptions = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
pause: Object.assign(pause, pause),
resume: Object.assign(resume, resume),
cancel: Object.assign(cancel, cancel),
vacation: Object.assign(vacation, vacationDc2d17),
schedule: Object.assign(schedule, schedule),
}

export default subscriptions