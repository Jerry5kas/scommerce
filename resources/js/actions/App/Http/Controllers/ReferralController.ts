import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\ReferralController::referrals
 * @see app/Http/Controllers/ReferralController.php:50
 * @route '/referrals/list'
 */
export const referrals = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: referrals.url(options),
    method: 'get',
})

referrals.definition = {
    methods: ["get","head"],
    url: '/referrals/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReferralController::referrals
 * @see app/Http/Controllers/ReferralController.php:50
 * @route '/referrals/list'
 */
referrals.url = (options?: RouteQueryOptions) => {
    return referrals.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReferralController::referrals
 * @see app/Http/Controllers/ReferralController.php:50
 * @route '/referrals/list'
 */
referrals.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: referrals.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReferralController::referrals
 * @see app/Http/Controllers/ReferralController.php:50
 * @route '/referrals/list'
 */
referrals.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: referrals.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReferralController::applyCode
 * @see app/Http/Controllers/ReferralController.php:63
 * @route '/referrals/apply'
 */
export const applyCode = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: applyCode.url(options),
    method: 'post',
})

applyCode.definition = {
    methods: ["post"],
    url: '/referrals/apply',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReferralController::applyCode
 * @see app/Http/Controllers/ReferralController.php:63
 * @route '/referrals/apply'
 */
applyCode.url = (options?: RouteQueryOptions) => {
    return applyCode.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReferralController::applyCode
 * @see app/Http/Controllers/ReferralController.php:63
 * @route '/referrals/apply'
 */
applyCode.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: applyCode.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ReferralController::validateCode
 * @see app/Http/Controllers/ReferralController.php:88
 * @route '/referrals/validate'
 */
export const validateCode = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validateCode.url(options),
    method: 'post',
})

validateCode.definition = {
    methods: ["post"],
    url: '/referrals/validate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ReferralController::validateCode
 * @see app/Http/Controllers/ReferralController.php:88
 * @route '/referrals/validate'
 */
validateCode.url = (options?: RouteQueryOptions) => {
    return validateCode.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReferralController::validateCode
 * @see app/Http/Controllers/ReferralController.php:88
 * @route '/referrals/validate'
 */
validateCode.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validateCode.url(options),
    method: 'post',
})
const ReferralController = { index, stats, referrals, applyCode, validateCode }

export default ReferralController