import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::showLoginForm
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:15
 * @route '/admin/login'
 */
export const showLoginForm = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showLoginForm.url(options),
    method: 'get',
})

showLoginForm.definition = {
    methods: ["get","head"],
    url: '/admin/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::showLoginForm
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:15
 * @route '/admin/login'
 */
showLoginForm.url = (options?: RouteQueryOptions) => {
    return showLoginForm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::showLoginForm
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:15
 * @route '/admin/login'
 */
showLoginForm.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showLoginForm.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::showLoginForm
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:15
 * @route '/admin/login'
 */
showLoginForm.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showLoginForm.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::login
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:26
 * @route '/admin/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

login.definition = {
    methods: ["post"],
    url: '/admin/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::login
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:26
 * @route '/admin/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::login
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:26
 * @route '/admin/login'
 */
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::logout
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:44
 * @route '/admin/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/admin/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::logout
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:44
 * @route '/admin/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::logout
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:44
 * @route '/admin/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})
const LoginController = { showLoginForm, login, logout }

export default LoginController