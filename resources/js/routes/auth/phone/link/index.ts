import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AuthController::verifyOtp
 * @see app/Http/Controllers/AuthController.php:312
 * @route '/auth/link-phone/verify-otp'
 */
export const verifyOtp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtp.url(options),
    method: 'post',
})

verifyOtp.definition = {
    methods: ["post"],
    url: '/auth/link-phone/verify-otp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::verifyOtp
 * @see app/Http/Controllers/AuthController.php:312
 * @route '/auth/link-phone/verify-otp'
 */
verifyOtp.url = (options?: RouteQueryOptions) => {
    return verifyOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::verifyOtp
 * @see app/Http/Controllers/AuthController.php:312
 * @route '/auth/link-phone/verify-otp'
 */
verifyOtp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtp.url(options),
    method: 'post',
})
const link = {
    verifyOtp: Object.assign(verifyOtp, verifyOtp),
}

export default link