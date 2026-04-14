import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\ReferralController::index
 * @see app/Http/Controllers/Admin/ReferralController.php:22
 * @route '/admin/referrals'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/referrals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReferralController::index
 * @see app/Http/Controllers/Admin/ReferralController.php:22
 * @route '/admin/referrals'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReferralController::index
 * @see app/Http/Controllers/Admin/ReferralController.php:22
 * @route '/admin/referrals'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ReferralController::index
 * @see app/Http/Controllers/Admin/ReferralController.php:22
 * @route '/admin/referrals'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReferralController::show
 * @see app/Http/Controllers/Admin/ReferralController.php:79
 * @route '/admin/referrals/{referral}'
 */
export const show = (args: { referral: number | { id: number } } | [referral: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/referrals/{referral}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReferralController::show
 * @see app/Http/Controllers/Admin/ReferralController.php:79
 * @route '/admin/referrals/{referral}'
 */
show.url = (args: { referral: number | { id: number } } | [referral: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { referral: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { referral: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    referral: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        referral: typeof args.referral === 'object'
                ? args.referral.id
                : args.referral,
                }

    return show.definition.url
            .replace('{referral}', parsedArgs.referral.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReferralController::show
 * @see app/Http/Controllers/Admin/ReferralController.php:79
 * @route '/admin/referrals/{referral}'
 */
show.get = (args: { referral: number | { id: number } } | [referral: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ReferralController::show
 * @see app/Http/Controllers/Admin/ReferralController.php:79
 * @route '/admin/referrals/{referral}'
 */
show.head = (args: { referral: number | { id: number } } | [referral: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\ReferralController::approve
 * @see app/Http/Controllers/Admin/ReferralController.php:102
 * @route '/admin/referrals/{referral}/approve'
 */
export const approve = (args: { referral: number | { id: number } } | [referral: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/admin/referrals/{referral}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ReferralController::approve
 * @see app/Http/Controllers/Admin/ReferralController.php:102
 * @route '/admin/referrals/{referral}/approve'
 */
approve.url = (args: { referral: number | { id: number } } | [referral: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { referral: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { referral: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    referral: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        referral: typeof args.referral === 'object'
                ? args.referral.id
                : args.referral,
                }

    return approve.definition.url
            .replace('{referral}', parsedArgs.referral.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReferralController::approve
 * @see app/Http/Controllers/Admin/ReferralController.php:102
 * @route '/admin/referrals/{referral}/approve'
 */
approve.post = (args: { referral: number | { id: number } } | [referral: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ReferralController::reject
 * @see app/Http/Controllers/Admin/ReferralController.php:117
 * @route '/admin/referrals/{referral}/reject'
 */
export const reject = (args: { referral: number | { id: number } } | [referral: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/admin/referrals/{referral}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ReferralController::reject
 * @see app/Http/Controllers/Admin/ReferralController.php:117
 * @route '/admin/referrals/{referral}/reject'
 */
reject.url = (args: { referral: number | { id: number } } | [referral: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { referral: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { referral: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    referral: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        referral: typeof args.referral === 'object'
                ? args.referral.id
                : args.referral,
                }

    return reject.definition.url
            .replace('{referral}', parsedArgs.referral.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReferralController::reject
 * @see app/Http/Controllers/Admin/ReferralController.php:117
 * @route '/admin/referrals/{referral}/reject'
 */
reject.post = (args: { referral: number | { id: number } } | [referral: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ReferralController::processRewards
 * @see app/Http/Controllers/Admin/ReferralController.php:135
 * @route '/admin/referrals/{referral}/process-rewards'
 */
export const processRewards = (args: { referral: number | { id: number } } | [referral: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processRewards.url(args, options),
    method: 'post',
})

processRewards.definition = {
    methods: ["post"],
    url: '/admin/referrals/{referral}/process-rewards',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\ReferralController::processRewards
 * @see app/Http/Controllers/Admin/ReferralController.php:135
 * @route '/admin/referrals/{referral}/process-rewards'
 */
processRewards.url = (args: { referral: number | { id: number } } | [referral: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { referral: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { referral: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    referral: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        referral: typeof args.referral === 'object'
                ? args.referral.id
                : args.referral,
                }

    return processRewards.definition.url
            .replace('{referral}', parsedArgs.referral.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReferralController::processRewards
 * @see app/Http/Controllers/Admin/ReferralController.php:135
 * @route '/admin/referrals/{referral}/process-rewards'
 */
processRewards.post = (args: { referral: number | { id: number } } | [referral: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processRewards.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\ReferralController::reports
 * @see app/Http/Controllers/Admin/ReferralController.php:153
 * @route '/admin/referrals/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/admin/referrals/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\ReferralController::reports
 * @see app/Http/Controllers/Admin/ReferralController.php:153
 * @route '/admin/referrals/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\ReferralController::reports
 * @see app/Http/Controllers/Admin/ReferralController.php:153
 * @route '/admin/referrals/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\ReferralController::reports
 * @see app/Http/Controllers/Admin/ReferralController.php:153
 * @route '/admin/referrals/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})
const referrals = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
processRewards: Object.assign(processRewards, processRewards),
reports: Object.assign(reports, reports),
}

export default referrals