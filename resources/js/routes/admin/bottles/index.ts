import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\BottleController::index
 * @see app/Http/Controllers/Admin/BottleController.php:29
 * @route '/admin/bottles'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/bottles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BottleController::index
 * @see app/Http/Controllers/Admin/BottleController.php:29
 * @route '/admin/bottles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BottleController::index
 * @see app/Http/Controllers/Admin/BottleController.php:29
 * @route '/admin/bottles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BottleController::index
 * @see app/Http/Controllers/Admin/BottleController.php:29
 * @route '/admin/bottles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BottleController::create
 * @see app/Http/Controllers/Admin/BottleController.php:77
 * @route '/admin/bottles/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/bottles/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BottleController::create
 * @see app/Http/Controllers/Admin/BottleController.php:77
 * @route '/admin/bottles/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BottleController::create
 * @see app/Http/Controllers/Admin/BottleController.php:77
 * @route '/admin/bottles/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BottleController::create
 * @see app/Http/Controllers/Admin/BottleController.php:77
 * @route '/admin/bottles/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BottleController::store
 * @see app/Http/Controllers/Admin/BottleController.php:88
 * @route '/admin/bottles'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/bottles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BottleController::store
 * @see app/Http/Controllers/Admin/BottleController.php:88
 * @route '/admin/bottles'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BottleController::store
 * @see app/Http/Controllers/Admin/BottleController.php:88
 * @route '/admin/bottles'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BottleController::show
 * @see app/Http/Controllers/Admin/BottleController.php:100
 * @route '/admin/bottles/{bottle}'
 */
export const show = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/bottles/{bottle}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BottleController::show
 * @see app/Http/Controllers/Admin/BottleController.php:100
 * @route '/admin/bottles/{bottle}'
 */
show.url = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bottle: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { bottle: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    bottle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        bottle: typeof args.bottle === 'object'
                ? args.bottle.id
                : args.bottle,
                }

    return show.definition.url
            .replace('{bottle}', parsedArgs.bottle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BottleController::show
 * @see app/Http/Controllers/Admin/BottleController.php:100
 * @route '/admin/bottles/{bottle}'
 */
show.get = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BottleController::show
 * @see app/Http/Controllers/Admin/BottleController.php:100
 * @route '/admin/bottles/{bottle}'
 */
show.head = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BottleController::edit
 * @see app/Http/Controllers/Admin/BottleController.php:114
 * @route '/admin/bottles/{bottle}/edit'
 */
export const edit = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/bottles/{bottle}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BottleController::edit
 * @see app/Http/Controllers/Admin/BottleController.php:114
 * @route '/admin/bottles/{bottle}/edit'
 */
edit.url = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bottle: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { bottle: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    bottle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        bottle: typeof args.bottle === 'object'
                ? args.bottle.id
                : args.bottle,
                }

    return edit.definition.url
            .replace('{bottle}', parsedArgs.bottle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BottleController::edit
 * @see app/Http/Controllers/Admin/BottleController.php:114
 * @route '/admin/bottles/{bottle}/edit'
 */
edit.get = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BottleController::edit
 * @see app/Http/Controllers/Admin/BottleController.php:114
 * @route '/admin/bottles/{bottle}/edit'
 */
edit.head = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BottleController::update
 * @see app/Http/Controllers/Admin/BottleController.php:125
 * @route '/admin/bottles/{bottle}'
 */
export const update = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/bottles/{bottle}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\BottleController::update
 * @see app/Http/Controllers/Admin/BottleController.php:125
 * @route '/admin/bottles/{bottle}'
 */
update.url = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bottle: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { bottle: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    bottle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        bottle: typeof args.bottle === 'object'
                ? args.bottle.id
                : args.bottle,
                }

    return update.definition.url
            .replace('{bottle}', parsedArgs.bottle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BottleController::update
 * @see app/Http/Controllers/Admin/BottleController.php:125
 * @route '/admin/bottles/{bottle}'
 */
update.put = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\BottleController::update
 * @see app/Http/Controllers/Admin/BottleController.php:125
 * @route '/admin/bottles/{bottle}'
 */
update.patch = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\BottleController::destroy
 * @see app/Http/Controllers/Admin/BottleController.php:0
 * @route '/admin/bottles/{bottle}'
 */
export const destroy = (args: { bottle: string | number } | [bottle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/bottles/{bottle}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\BottleController::destroy
 * @see app/Http/Controllers/Admin/BottleController.php:0
 * @route '/admin/bottles/{bottle}'
 */
destroy.url = (args: { bottle: string | number } | [bottle: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bottle: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    bottle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        bottle: args.bottle,
                }

    return destroy.definition.url
            .replace('{bottle}', parsedArgs.bottle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BottleController::destroy
 * @see app/Http/Controllers/Admin/BottleController.php:0
 * @route '/admin/bottles/{bottle}'
 */
destroy.delete = (args: { bottle: string | number } | [bottle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\BottleController::issue
 * @see app/Http/Controllers/Admin/BottleController.php:143
 * @route '/admin/bottles/{bottle}/issue'
 */
export const issue = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: issue.url(args, options),
    method: 'post',
})

issue.definition = {
    methods: ["post"],
    url: '/admin/bottles/{bottle}/issue',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BottleController::issue
 * @see app/Http/Controllers/Admin/BottleController.php:143
 * @route '/admin/bottles/{bottle}/issue'
 */
issue.url = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bottle: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { bottle: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    bottle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        bottle: typeof args.bottle === 'object'
                ? args.bottle.id
                : args.bottle,
                }

    return issue.definition.url
            .replace('{bottle}', parsedArgs.bottle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BottleController::issue
 * @see app/Http/Controllers/Admin/BottleController.php:143
 * @route '/admin/bottles/{bottle}/issue'
 */
issue.post = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: issue.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BottleController::returnMethod
 * @see app/Http/Controllers/Admin/BottleController.php:166
 * @route '/admin/bottles/{bottle}/return'
 */
export const returnMethod = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: returnMethod.url(args, options),
    method: 'post',
})

returnMethod.definition = {
    methods: ["post"],
    url: '/admin/bottles/{bottle}/return',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BottleController::returnMethod
 * @see app/Http/Controllers/Admin/BottleController.php:166
 * @route '/admin/bottles/{bottle}/return'
 */
returnMethod.url = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bottle: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { bottle: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    bottle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        bottle: typeof args.bottle === 'object'
                ? args.bottle.id
                : args.bottle,
                }

    return returnMethod.definition.url
            .replace('{bottle}', parsedArgs.bottle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BottleController::returnMethod
 * @see app/Http/Controllers/Admin/BottleController.php:166
 * @route '/admin/bottles/{bottle}/return'
 */
returnMethod.post = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: returnMethod.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BottleController::markDamaged
 * @see app/Http/Controllers/Admin/BottleController.php:189
 * @route '/admin/bottles/{bottle}/mark-damaged'
 */
export const markDamaged = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markDamaged.url(args, options),
    method: 'post',
})

markDamaged.definition = {
    methods: ["post"],
    url: '/admin/bottles/{bottle}/mark-damaged',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BottleController::markDamaged
 * @see app/Http/Controllers/Admin/BottleController.php:189
 * @route '/admin/bottles/{bottle}/mark-damaged'
 */
markDamaged.url = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bottle: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { bottle: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    bottle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        bottle: typeof args.bottle === 'object'
                ? args.bottle.id
                : args.bottle,
                }

    return markDamaged.definition.url
            .replace('{bottle}', parsedArgs.bottle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BottleController::markDamaged
 * @see app/Http/Controllers/Admin/BottleController.php:189
 * @route '/admin/bottles/{bottle}/mark-damaged'
 */
markDamaged.post = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markDamaged.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BottleController::markLost
 * @see app/Http/Controllers/Admin/BottleController.php:210
 * @route '/admin/bottles/{bottle}/mark-lost'
 */
export const markLost = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markLost.url(args, options),
    method: 'post',
})

markLost.definition = {
    methods: ["post"],
    url: '/admin/bottles/{bottle}/mark-lost',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BottleController::markLost
 * @see app/Http/Controllers/Admin/BottleController.php:210
 * @route '/admin/bottles/{bottle}/mark-lost'
 */
markLost.url = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bottle: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { bottle: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    bottle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        bottle: typeof args.bottle === 'object'
                ? args.bottle.id
                : args.bottle,
                }

    return markLost.definition.url
            .replace('{bottle}', parsedArgs.bottle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BottleController::markLost
 * @see app/Http/Controllers/Admin/BottleController.php:210
 * @route '/admin/bottles/{bottle}/mark-lost'
 */
markLost.post = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markLost.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\BottleController::logs
 * @see app/Http/Controllers/Admin/BottleController.php:227
 * @route '/admin/bottles/{bottle}/logs'
 */
export const logs = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logs.url(args, options),
    method: 'get',
})

logs.definition = {
    methods: ["get","head"],
    url: '/admin/bottles/{bottle}/logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BottleController::logs
 * @see app/Http/Controllers/Admin/BottleController.php:227
 * @route '/admin/bottles/{bottle}/logs'
 */
logs.url = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { bottle: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { bottle: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    bottle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        bottle: typeof args.bottle === 'object'
                ? args.bottle.id
                : args.bottle,
                }

    return logs.definition.url
            .replace('{bottle}', parsedArgs.bottle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BottleController::logs
 * @see app/Http/Controllers/Admin/BottleController.php:227
 * @route '/admin/bottles/{bottle}/logs'
 */
logs.get = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logs.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BottleController::logs
 * @see app/Http/Controllers/Admin/BottleController.php:227
 * @route '/admin/bottles/{bottle}/logs'
 */
logs.head = (args: { bottle: number | { id: number } } | [bottle: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: logs.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BottleController::reports
 * @see app/Http/Controllers/Admin/BottleController.php:239
 * @route '/admin/bottles/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/admin/bottles/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\BottleController::reports
 * @see app/Http/Controllers/Admin/BottleController.php:239
 * @route '/admin/bottles/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BottleController::reports
 * @see app/Http/Controllers/Admin/BottleController.php:239
 * @route '/admin/bottles/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\BottleController::reports
 * @see app/Http/Controllers/Admin/BottleController.php:239
 * @route '/admin/bottles/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\BottleController::scanBarcode
 * @see app/Http/Controllers/Admin/BottleController.php:279
 * @route '/admin/bottles/scan-barcode'
 */
export const scanBarcode = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: scanBarcode.url(options),
    method: 'post',
})

scanBarcode.definition = {
    methods: ["post"],
    url: '/admin/bottles/scan-barcode',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\BottleController::scanBarcode
 * @see app/Http/Controllers/Admin/BottleController.php:279
 * @route '/admin/bottles/scan-barcode'
 */
scanBarcode.url = (options?: RouteQueryOptions) => {
    return scanBarcode.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\BottleController::scanBarcode
 * @see app/Http/Controllers/Admin/BottleController.php:279
 * @route '/admin/bottles/scan-barcode'
 */
scanBarcode.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: scanBarcode.url(options),
    method: 'post',
})
const bottles = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
issue: Object.assign(issue, issue),
return: Object.assign(returnMethod, returnMethod),
markDamaged: Object.assign(markDamaged, markDamaged),
markLost: Object.assign(markLost, markLost),
logs: Object.assign(logs, logs),
reports: Object.assign(reports, reports),
scanBarcode: Object.assign(scanBarcode, scanBarcode),
}

export default bottles