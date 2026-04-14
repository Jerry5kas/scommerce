import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CouponController::validate
 * @see app/Http/Controllers/CouponController.php:21
 * @route '/coupons/validate'
 */
export const validate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validate.url(options),
    method: 'post',
})

validate.definition = {
    methods: ["post"],
    url: '/coupons/validate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CouponController::validate
 * @see app/Http/Controllers/CouponController.php:21
 * @route '/coupons/validate'
 */
validate.url = (options?: RouteQueryOptions) => {
    return validate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CouponController::validate
 * @see app/Http/Controllers/CouponController.php:21
 * @route '/coupons/validate'
 */
validate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CouponController::apply
 * @see app/Http/Controllers/CouponController.php:57
 * @route '/coupons/apply'
 */
export const apply = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(options),
    method: 'post',
})

apply.definition = {
    methods: ["post"],
    url: '/coupons/apply',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CouponController::apply
 * @see app/Http/Controllers/CouponController.php:57
 * @route '/coupons/apply'
 */
apply.url = (options?: RouteQueryOptions) => {
    return apply.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CouponController::apply
 * @see app/Http/Controllers/CouponController.php:57
 * @route '/coupons/apply'
 */
apply.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: apply.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CouponController::remove
 * @see app/Http/Controllers/CouponController.php:82
 * @route '/coupons/remove'
 */
export const remove = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: remove.url(options),
    method: 'delete',
})

remove.definition = {
    methods: ["delete"],
    url: '/coupons/remove',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CouponController::remove
 * @see app/Http/Controllers/CouponController.php:82
 * @route '/coupons/remove'
 */
remove.url = (options?: RouteQueryOptions) => {
    return remove.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CouponController::remove
 * @see app/Http/Controllers/CouponController.php:82
 * @route '/coupons/remove'
 */
remove.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: remove.url(options),
    method: 'delete',
})
const coupons = {
    validate: Object.assign(validate, validate),
apply: Object.assign(apply, apply),
remove: Object.assign(remove, remove),
}

export default coupons