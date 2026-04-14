import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\UserController::update
 * @see app/Http/Controllers/Admin/UserController.php:70
 * @route '/admin/users/{user}/addresses/{address}'
 */
export const update = (args: { user: number | { id: number }, address: number | { id: number } } | [user: number | { id: number }, address: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/users/{user}/addresses/{address}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\UserController::update
 * @see app/Http/Controllers/Admin/UserController.php:70
 * @route '/admin/users/{user}/addresses/{address}'
 */
update.url = (args: { user: number | { id: number }, address: number | { id: number } } | [user: number | { id: number }, address: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                    address: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                                address: typeof args.address === 'object'
                ? args.address.id
                : args.address,
                }

    return update.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace('{address}', parsedArgs.address.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\UserController::update
 * @see app/Http/Controllers/Admin/UserController.php:70
 * @route '/admin/users/{user}/addresses/{address}'
 */
update.put = (args: { user: number | { id: number }, address: number | { id: number } } | [user: number | { id: number }, address: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
const addresses = {
    update: Object.assign(update, update),
}

export default addresses