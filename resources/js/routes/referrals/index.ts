import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ReferralController::index
 * @see app/Http/Controllers/ReferralController.php:21
 * @route '/referrals'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/referrals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReferralController::index
 * @see app/Http/Controllers/ReferralController.php:21
 * @route '/referrals'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReferralController::index
 * @see app/Http/Controllers/ReferralController.php:21
 * @route '/referrals'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReferralController::index
 * @see app/Http/Controllers/ReferralController.php:21
 * @route '/referrals'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReferralController::stats
 * @see app/Http/Controllers/ReferralController.php:36
 * @route '/referrals/stats'
 */
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/referrals/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReferralController::stats
 * @see app/Http/Controllers/ReferralController.php:36
 * @route '/referrals/stats'
 */
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReferralController::stats
 * @see app/Http/Controllers/ReferralController.php:36
 * @route '/referrals/stats'
 */
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReferralController::stats
 * @see app/Http/Controllers/ReferralController.php:36
 * @route '/referrals/stats'
 */
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReferralController::list
 * @see app/Http/Controllers/ReferralController.php:50
 * @route '/referrals/list'
 */
export const list = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})

list.definition = {
    methods: ["get","head"],
    url: '/referrals/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReferralController::list
 * @see app/Http/Controllers/ReferralController.php:50
 * @route '/referrals/list'
 */
list.url = (options?: RouteQueryOptions) => {
    return list.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReferralController::list
 * @see app/Http/Controllers/ReferralController.php:50
 * @route '/referrals/list'
 */
list.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: list.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReferralController::list
 * @see app/Http/Controllers/ReferralController.php:50
 * @route '/referrals/list'
 */
list.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: list.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReferralController::apply
 * @see app/Http/Controllers/ReferralController.php:63
 * @route '/referrals/apply'
 */
export const apply = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(options),
    method: 'post',
})

apply.definition = {
    methods: ["post"],
    url: '/referrals/apply',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReferralController::apply
 * @see app/Http/Controllers/ReferralController.php:63
 * @route '/referrals/apply'
 */
apply.url = (options?: RouteQueryOptions) => {
    return apply.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReferralController::apply
 * @see app/Http/Controllers/ReferralController.php:63
 * @route '/referrals/apply'
 */
apply.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReferralController::validate
 * @see app/Http/Controllers/ReferralController.php:88
 * @route '/referrals/validate'
 */
export const validate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validate.url(options),
    method: 'post',
})

validate.definition = {
    methods: ["post"],
    url: '/referrals/validate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReferralController::validate
 * @see app/Http/Controllers/ReferralController.php:88
 * @route '/referrals/validate'
 */
validate.url = (options?: RouteQueryOptions) => {
    return validate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReferralController::validate
 * @see app/Http/Controllers/ReferralController.php:88
 * @route '/referrals/validate'
 */
validate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validate.url(options),
    method: 'post',
})
const referrals = {
    index: Object.assign(index, index),
stats: Object.assign(stats, stats),
list: Object.assign(list, list),
apply: Object.assign(apply, apply),
validate: Object.assign(validate, validate),
}

export default referrals