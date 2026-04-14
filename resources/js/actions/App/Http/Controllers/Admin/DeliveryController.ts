import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\DeliveryController::index
 * @see app/Http/Controllers/Admin/DeliveryController.php:34
 * @route '/admin/deliveries'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/deliveries',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DeliveryController::index
 * @see app/Http/Controllers/Admin/DeliveryController.php:34
 * @route '/admin/deliveries'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeliveryController::index
 * @see app/Http/Controllers/Admin/DeliveryController.php:34
 * @route '/admin/deliveries'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DeliveryController::index
 * @see app/Http/Controllers/Admin/DeliveryController.php:34
 * @route '/admin/deliveries'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DeliveryController::calendar
 * @see app/Http/Controllers/Admin/DeliveryController.php:0
 * @route '/admin/deliveries/calendar'
 */
export const calendar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendar.url(options),
    method: 'get',
})

calendar.definition = {
    methods: ["get","head"],
    url: '/admin/deliveries/calendar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DeliveryController::calendar
 * @see app/Http/Controllers/Admin/DeliveryController.php:0
 * @route '/admin/deliveries/calendar'
 */
calendar.url = (options?: RouteQueryOptions) => {
    return calendar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeliveryController::calendar
 * @see app/Http/Controllers/Admin/DeliveryController.php:0
 * @route '/admin/deliveries/calendar'
 */
calendar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: calendar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DeliveryController::calendar
 * @see app/Http/Controllers/Admin/DeliveryController.php:0
 * @route '/admin/deliveries/calendar'
 */
calendar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: calendar.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DeliveryController::stats
 * @see app/Http/Controllers/Admin/DeliveryController.php:304
 * @route '/admin/deliveries/stats'
 */
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/admin/deliveries/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DeliveryController::stats
 * @see app/Http/Controllers/Admin/DeliveryController.php:304
 * @route '/admin/deliveries/stats'
 */
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeliveryController::stats
 * @see app/Http/Controllers/Admin/DeliveryController.php:304
 * @route '/admin/deliveries/stats'
 */
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DeliveryController::stats
 * @see app/Http/Controllers/Admin/DeliveryController.php:304
 * @route '/admin/deliveries/stats'
 */
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DeliveryController::autoAssign
 * @see app/Http/Controllers/Admin/DeliveryController.php:246
 * @route '/admin/deliveries/auto-assign'
 */
export const autoAssign = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoAssign.url(options),
    method: 'post',
})

autoAssign.definition = {
    methods: ["post"],
    url: '/admin/deliveries/auto-assign',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DeliveryController::autoAssign
 * @see app/Http/Controllers/Admin/DeliveryController.php:246
 * @route '/admin/deliveries/auto-assign'
 */
autoAssign.url = (options?: RouteQueryOptions) => {
    return autoAssign.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeliveryController::autoAssign
 * @see app/Http/Controllers/Admin/DeliveryController.php:246
 * @route '/admin/deliveries/auto-assign'
 */
autoAssign.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: autoAssign.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DeliveryController::bulkAssign
 * @see app/Http/Controllers/Admin/DeliveryController.php:268
 * @route '/admin/deliveries/bulk-assign'
 */
export const bulkAssign = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkAssign.url(options),
    method: 'post',
})

bulkAssign.definition = {
    methods: ["post"],
    url: '/admin/deliveries/bulk-assign',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DeliveryController::bulkAssign
 * @see app/Http/Controllers/Admin/DeliveryController.php:268
 * @route '/admin/deliveries/bulk-assign'
 */
bulkAssign.url = (options?: RouteQueryOptions) => {
    return bulkAssign.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeliveryController::bulkAssign
 * @see app/Http/Controllers/Admin/DeliveryController.php:268
 * @route '/admin/deliveries/bulk-assign'
 */
bulkAssign.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkAssign.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DeliveryController::show
 * @see app/Http/Controllers/Admin/DeliveryController.php:118
 * @route '/admin/deliveries/{delivery}'
 */
export const show = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/deliveries/{delivery}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\DeliveryController::show
 * @see app/Http/Controllers/Admin/DeliveryController.php:118
 * @route '/admin/deliveries/{delivery}'
 */
show.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { delivery: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { delivery: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    delivery: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        delivery: typeof args.delivery === 'object'
                ? args.delivery.id
                : args.delivery,
                }

    return show.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeliveryController::show
 * @see app/Http/Controllers/Admin/DeliveryController.php:118
 * @route '/admin/deliveries/{delivery}'
 */
show.get = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\DeliveryController::show
 * @see app/Http/Controllers/Admin/DeliveryController.php:118
 * @route '/admin/deliveries/{delivery}'
 */
show.head = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\DeliveryController::assignDriver
 * @see app/Http/Controllers/Admin/DeliveryController.php:138
 * @route '/admin/deliveries/{delivery}/assign-driver'
 */
export const assignDriver = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignDriver.url(args, options),
    method: 'post',
})

assignDriver.definition = {
    methods: ["post"],
    url: '/admin/deliveries/{delivery}/assign-driver',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DeliveryController::assignDriver
 * @see app/Http/Controllers/Admin/DeliveryController.php:138
 * @route '/admin/deliveries/{delivery}/assign-driver'
 */
assignDriver.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { delivery: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { delivery: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    delivery: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        delivery: typeof args.delivery === 'object'
                ? args.delivery.id
                : args.delivery,
                }

    return assignDriver.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeliveryController::assignDriver
 * @see app/Http/Controllers/Admin/DeliveryController.php:138
 * @route '/admin/deliveries/{delivery}/assign-driver'
 */
assignDriver.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignDriver.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DeliveryController::updateStatus
 * @see app/Http/Controllers/Admin/DeliveryController.php:153
 * @route '/admin/deliveries/{delivery}/status'
 */
export const updateStatus = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.definition = {
    methods: ["post"],
    url: '/admin/deliveries/{delivery}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DeliveryController::updateStatus
 * @see app/Http/Controllers/Admin/DeliveryController.php:153
 * @route '/admin/deliveries/{delivery}/status'
 */
updateStatus.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { delivery: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { delivery: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    delivery: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        delivery: typeof args.delivery === 'object'
                ? args.delivery.id
                : args.delivery,
                }

    return updateStatus.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeliveryController::updateStatus
 * @see app/Http/Controllers/Admin/DeliveryController.php:153
 * @route '/admin/deliveries/{delivery}/status'
 */
updateStatus.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DeliveryController::verifyProof
 * @see app/Http/Controllers/Admin/DeliveryController.php:167
 * @route '/admin/deliveries/{delivery}/verify-proof'
 */
export const verifyProof = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyProof.url(args, options),
    method: 'post',
})

verifyProof.definition = {
    methods: ["post"],
    url: '/admin/deliveries/{delivery}/verify-proof',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DeliveryController::verifyProof
 * @see app/Http/Controllers/Admin/DeliveryController.php:167
 * @route '/admin/deliveries/{delivery}/verify-proof'
 */
verifyProof.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { delivery: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { delivery: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    delivery: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        delivery: typeof args.delivery === 'object'
                ? args.delivery.id
                : args.delivery,
                }

    return verifyProof.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeliveryController::verifyProof
 * @see app/Http/Controllers/Admin/DeliveryController.php:167
 * @route '/admin/deliveries/{delivery}/verify-proof'
 */
verifyProof.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyProof.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\DeliveryController::overrideProof
 * @see app/Http/Controllers/Admin/DeliveryController.php:187
 * @route '/admin/deliveries/{delivery}/override-proof'
 */
export const overrideProof = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: overrideProof.url(args, options),
    method: 'post',
})

overrideProof.definition = {
    methods: ["post"],
    url: '/admin/deliveries/{delivery}/override-proof',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\DeliveryController::overrideProof
 * @see app/Http/Controllers/Admin/DeliveryController.php:187
 * @route '/admin/deliveries/{delivery}/override-proof'
 */
overrideProof.url = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { delivery: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { delivery: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    delivery: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        delivery: typeof args.delivery === 'object'
                ? args.delivery.id
                : args.delivery,
                }

    return overrideProof.definition.url
            .replace('{delivery}', parsedArgs.delivery.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\DeliveryController::overrideProof
 * @see app/Http/Controllers/Admin/DeliveryController.php:187
 * @route '/admin/deliveries/{delivery}/override-proof'
 */
overrideProof.post = (args: { delivery: number | { id: number } } | [delivery: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: overrideProof.url(args, options),
    method: 'post',
})
const DeliveryController = { index, calendar, stats, autoAssign, bulkAssign, show, assignDriver, updateStatus, verifyProof, overrideProof }

export default DeliveryController