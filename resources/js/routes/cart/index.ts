import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CartController::show
 * @see app/Http/Controllers/CartController.php:32
 * @route '/cart'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/cart',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CartController::show
 * @see app/Http/Controllers/CartController.php:32
 * @route '/cart'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::show
 * @see app/Http/Controllers/CartController.php:32
 * @route '/cart'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CartController::show
 * @see app/Http/Controllers/CartController.php:32
 * @route '/cart'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CartController::index
 * @see app/Http/Controllers/CartController.php:70
 * @route '/cart/data'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cart/data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CartController::index
 * @see app/Http/Controllers/CartController.php:70
 * @route '/cart/data'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::index
 * @see app/Http/Controllers/CartController.php:70
 * @route '/cart/data'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CartController::index
 * @see app/Http/Controllers/CartController.php:70
 * @route '/cart/data'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CartController::mini
 * @see app/Http/Controllers/CartController.php:317
 * @route '/cart/mini'
 */
export const mini = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mini.url(options),
    method: 'get',
})

mini.definition = {
    methods: ["get","head"],
    url: '/cart/mini',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CartController::mini
 * @see app/Http/Controllers/CartController.php:317
 * @route '/cart/mini'
 */
mini.url = (options?: RouteQueryOptions) => {
    return mini.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::mini
 * @see app/Http/Controllers/CartController.php:317
 * @route '/cart/mini'
 */
mini.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mini.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CartController::mini
 * @see app/Http/Controllers/CartController.php:317
 * @route '/cart/mini'
 */
mini.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mini.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CartController::add
 * @see app/Http/Controllers/CartController.php:88
 * @route '/cart/add'
 */
export const add = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: add.url(options),
    method: 'post',
})

add.definition = {
    methods: ["post"],
    url: '/cart/add',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CartController::add
 * @see app/Http/Controllers/CartController.php:88
 * @route '/cart/add'
 */
add.url = (options?: RouteQueryOptions) => {
    return add.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::add
 * @see app/Http/Controllers/CartController.php:88
 * @route '/cart/add'
 */
add.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: add.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CartController::update
 * @see app/Http/Controllers/CartController.php:144
 * @route '/cart/items/{cartItem}'
 */
export const update = (args: { cartItem: number | { id: number } } | [cartItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/cart/items/{cartItem}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CartController::update
 * @see app/Http/Controllers/CartController.php:144
 * @route '/cart/items/{cartItem}'
 */
update.url = (args: { cartItem: number | { id: number } } | [cartItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cartItem: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cartItem: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cartItem: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cartItem: typeof args.cartItem === 'object'
                ? args.cartItem.id
                : args.cartItem,
                }

    return update.definition.url
            .replace('{cartItem}', parsedArgs.cartItem.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::update
 * @see app/Http/Controllers/CartController.php:144
 * @route '/cart/items/{cartItem}'
 */
update.put = (args: { cartItem: number | { id: number } } | [cartItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CartController::remove
 * @see app/Http/Controllers/CartController.php:191
 * @route '/cart/items/{cartItem}'
 */
export const remove = (args: { cartItem: number | { id: number } } | [cartItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: remove.url(args, options),
    method: 'delete',
})

remove.definition = {
    methods: ["delete"],
    url: '/cart/items/{cartItem}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CartController::remove
 * @see app/Http/Controllers/CartController.php:191
 * @route '/cart/items/{cartItem}'
 */
remove.url = (args: { cartItem: number | { id: number } } | [cartItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cartItem: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cartItem: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cartItem: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cartItem: typeof args.cartItem === 'object'
                ? args.cartItem.id
                : args.cartItem,
                }

    return remove.definition.url
            .replace('{cartItem}', parsedArgs.cartItem.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::remove
 * @see app/Http/Controllers/CartController.php:191
 * @route '/cart/items/{cartItem}'
 */
remove.delete = (args: { cartItem: number | { id: number } } | [cartItem: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: remove.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CartController::clear
 * @see app/Http/Controllers/CartController.php:218
 * @route '/cart/clear'
 */
export const clear = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clear.url(options),
    method: 'delete',
})

clear.definition = {
    methods: ["delete"],
    url: '/cart/clear',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CartController::clear
 * @see app/Http/Controllers/CartController.php:218
 * @route '/cart/clear'
 */
clear.url = (options?: RouteQueryOptions) => {
    return clear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::clear
 * @see app/Http/Controllers/CartController.php:218
 * @route '/cart/clear'
 */
clear.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clear.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CartController::addToTomorrowDelivery
 * @see app/Http/Controllers/CartController.php:240
 * @route '/cart/add-to-tomorrow-delivery'
 */
export const addToTomorrowDelivery = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addToTomorrowDelivery.url(options),
    method: 'post',
})

addToTomorrowDelivery.definition = {
    methods: ["post"],
    url: '/cart/add-to-tomorrow-delivery',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CartController::addToTomorrowDelivery
 * @see app/Http/Controllers/CartController.php:240
 * @route '/cart/add-to-tomorrow-delivery'
 */
addToTomorrowDelivery.url = (options?: RouteQueryOptions) => {
    return addToTomorrowDelivery.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CartController::addToTomorrowDelivery
 * @see app/Http/Controllers/CartController.php:240
 * @route '/cart/add-to-tomorrow-delivery'
 */
addToTomorrowDelivery.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addToTomorrowDelivery.url(options),
    method: 'post',
})
const cart = {
    show: Object.assign(show, show),
index: Object.assign(index, index),
mini: Object.assign(mini, mini),
add: Object.assign(add, add),
update: Object.assign(update, update),
remove: Object.assign(remove, remove),
clear: Object.assign(clear, clear),
addToTomorrowDelivery: Object.assign(addToTomorrowDelivery, addToTomorrowDelivery),
}

export default cart