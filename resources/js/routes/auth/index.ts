import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
import google from './google'
import phone from './phone'
/**
* @see \App\Http\Controllers\AuthController::sendOtp
 * @see app/Http/Controllers/AuthController.php:215
 * @route '/auth/send-otp'
 */
export const sendOtp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendOtp.url(options),
    method: 'post',
})

sendOtp.definition = {
    methods: ["post"],
    url: '/auth/send-otp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::sendOtp
 * @see app/Http/Controllers/AuthController.php:215
 * @route '/auth/send-otp'
 */
sendOtp.url = (options?: RouteQueryOptions) => {
    return sendOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::sendOtp
 * @see app/Http/Controllers/AuthController.php:215
 * @route '/auth/send-otp'
 */
sendOtp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendOtp.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::resendOtp
 * @see app/Http/Controllers/AuthController.php:241
 * @route '/auth/resend-otp'
 */
export const resendOtp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resendOtp.url(options),
    method: 'post',
})

resendOtp.definition = {
    methods: ["post"],
    url: '/auth/resend-otp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::resendOtp
 * @see app/Http/Controllers/AuthController.php:241
 * @route '/auth/resend-otp'
 */
resendOtp.url = (options?: RouteQueryOptions) => {
    return resendOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::resendOtp
 * @see app/Http/Controllers/AuthController.php:241
 * @route '/auth/resend-otp'
 */
resendOtp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: resendOtp.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::verifyOtp
 * @see app/Http/Controllers/AuthController.php:268
 * @route '/auth/verify-otp'
 */
export const verifyOtp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtp.url(options),
    method: 'post',
})

verifyOtp.definition = {
    methods: ["post"],
    url: '/auth/verify-otp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::verifyOtp
 * @see app/Http/Controllers/AuthController.php:268
 * @route '/auth/verify-otp'
 */
verifyOtp.url = (options?: RouteQueryOptions) => {
    return verifyOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::verifyOtp
 * @see app/Http/Controllers/AuthController.php:268
 * @route '/auth/verify-otp'
 */
verifyOtp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtp.url(options),
    method: 'post',
})
const auth = {
    google: Object.assign(google, google),
sendOtp: Object.assign(sendOtp, sendOtp),
resendOtp: Object.assign(resendOtp, resendOtp),
verifyOtp: Object.assign(verifyOtp, verifyOtp),
phone: Object.assign(phone, phone),
}

export default auth