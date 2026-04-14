import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::store
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:26
 * @route '/admin/login'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::store
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:26
 * @route '/admin/login'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\Auth\LoginController::store
 * @see app/Http/Controllers/Admin/Auth/LoginController.php:26
 * @route '/admin/login'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})
const login = {
    store: Object.assign(store, store),
}

export default login