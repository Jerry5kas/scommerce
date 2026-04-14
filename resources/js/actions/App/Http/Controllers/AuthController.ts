import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AuthController::showLoginForm
 * @see app/Http/Controllers/AuthController.php:28
 * @route '/login'
 */
export const showLoginForm = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showLoginForm.url(options),
    method: 'get',
})

showLoginForm.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuthController::showLoginForm
 * @see app/Http/Controllers/AuthController.php:28
 * @route '/login'
 */
showLoginForm.url = (options?: RouteQueryOptions) => {
    return showLoginForm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::showLoginForm
 * @see app/Http/Controllers/AuthController.php:28
 * @route '/login'
 */
showLoginForm.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showLoginForm.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuthController::showLoginForm
 * @see app/Http/Controllers/AuthController.php:28
 * @route '/login'
 */
showLoginForm.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showLoginForm.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuthController::redirectToGoogle
 * @see app/Http/Controllers/AuthController.php:44
 * @route '/auth/google/redirect'
 */
export const redirectToGoogle = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToGoogle.url(options),
    method: 'get',
})

redirectToGoogle.definition = {
    methods: ["get","head"],
    url: '/auth/google/redirect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuthController::redirectToGoogle
 * @see app/Http/Controllers/AuthController.php:44
 * @route '/auth/google/redirect'
 */
redirectToGoogle.url = (options?: RouteQueryOptions) => {
    return redirectToGoogle.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::redirectToGoogle
 * @see app/Http/Controllers/AuthController.php:44
 * @route '/auth/google/redirect'
 */
redirectToGoogle.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: redirectToGoogle.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuthController::redirectToGoogle
 * @see app/Http/Controllers/AuthController.php:44
 * @route '/auth/google/redirect'
 */
redirectToGoogle.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: redirectToGoogle.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuthController::handleGoogleCallback
 * @see app/Http/Controllers/AuthController.php:75
 * @route '/auth/google/callback'
 */
export const handleGoogleCallback = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: handleGoogleCallback.url(options),
    method: 'get',
})

handleGoogleCallback.definition = {
    methods: ["get","head"],
    url: '/auth/google/callback',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuthController::handleGoogleCallback
 * @see app/Http/Controllers/AuthController.php:75
 * @route '/auth/google/callback'
 */
handleGoogleCallback.url = (options?: RouteQueryOptions) => {
    return handleGoogleCallback.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::handleGoogleCallback
 * @see app/Http/Controllers/AuthController.php:75
 * @route '/auth/google/callback'
 */
handleGoogleCallback.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: handleGoogleCallback.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuthController::handleGoogleCallback
 * @see app/Http/Controllers/AuthController.php:75
 * @route '/auth/google/callback'
 */
handleGoogleCallback.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: handleGoogleCallback.url(options),
    method: 'head',
})

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

/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:354
 * @route '/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:354
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::logout
 * @see app/Http/Controllers/AuthController.php:354
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::linkPhoneWithOtp
 * @see app/Http/Controllers/AuthController.php:312
 * @route '/auth/link-phone/verify-otp'
 */
export const linkPhoneWithOtp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: linkPhoneWithOtp.url(options),
    method: 'post',
})

linkPhoneWithOtp.definition = {
    methods: ["post"],
    url: '/auth/link-phone/verify-otp',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::linkPhoneWithOtp
 * @see app/Http/Controllers/AuthController.php:312
 * @route '/auth/link-phone/verify-otp'
 */
linkPhoneWithOtp.url = (options?: RouteQueryOptions) => {
    return linkPhoneWithOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::linkPhoneWithOtp
 * @see app/Http/Controllers/AuthController.php:312
 * @route '/auth/link-phone/verify-otp'
 */
linkPhoneWithOtp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: linkPhoneWithOtp.url(options),
    method: 'post',
})
const AuthController = { showLoginForm, redirectToGoogle, handleGoogleCallback, sendOtp, resendOtp, verifyOtp, logout, linkPhoneWithOtp }

export default AuthController