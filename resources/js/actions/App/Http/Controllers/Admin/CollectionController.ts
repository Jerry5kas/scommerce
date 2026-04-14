import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\CollectionController::index
 * @see app/Http/Controllers/Admin/CollectionController.php:22
 * @route '/admin/collections'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/collections',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CollectionController::index
 * @see app/Http/Controllers/Admin/CollectionController.php:22
 * @route '/admin/collections'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CollectionController::index
 * @see app/Http/Controllers/Admin/CollectionController.php:22
 * @route '/admin/collections'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CollectionController::index
 * @see app/Http/Controllers/Admin/CollectionController.php:22
 * @route '/admin/collections'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CollectionController::create
 * @see app/Http/Controllers/Admin/CollectionController.php:65
 * @route '/admin/collections/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/collections/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CollectionController::create
 * @see app/Http/Controllers/Admin/CollectionController.php:65
 * @route '/admin/collections/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CollectionController::create
 * @see app/Http/Controllers/Admin/CollectionController.php:65
 * @route '/admin/collections/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CollectionController::create
 * @see app/Http/Controllers/Admin/CollectionController.php:65
 * @route '/admin/collections/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CollectionController::store
 * @see app/Http/Controllers/Admin/CollectionController.php:76
 * @route '/admin/collections'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/collections',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CollectionController::store
 * @see app/Http/Controllers/Admin/CollectionController.php:76
 * @route '/admin/collections'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CollectionController::store
 * @see app/Http/Controllers/Admin/CollectionController.php:76
 * @route '/admin/collections'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CollectionController::show
 * @see app/Http/Controllers/Admin/CollectionController.php:99
 * @route '/admin/collections/{collection}'
 */
export const show = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/collections/{collection}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CollectionController::show
 * @see app/Http/Controllers/Admin/CollectionController.php:99
 * @route '/admin/collections/{collection}'
 */
show.url = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { collection: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { collection: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    collection: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        collection: typeof args.collection === 'object'
                ? args.collection.id
                : args.collection,
                }

    return show.definition.url
            .replace('{collection}', parsedArgs.collection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CollectionController::show
 * @see app/Http/Controllers/Admin/CollectionController.php:99
 * @route '/admin/collections/{collection}'
 */
show.get = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CollectionController::show
 * @see app/Http/Controllers/Admin/CollectionController.php:99
 * @route '/admin/collections/{collection}'
 */
show.head = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CollectionController::edit
 * @see app/Http/Controllers/Admin/CollectionController.php:117
 * @route '/admin/collections/{collection}/edit'
 */
export const edit = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/collections/{collection}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CollectionController::edit
 * @see app/Http/Controllers/Admin/CollectionController.php:117
 * @route '/admin/collections/{collection}/edit'
 */
edit.url = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { collection: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { collection: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    collection: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        collection: typeof args.collection === 'object'
                ? args.collection.id
                : args.collection,
                }

    return edit.definition.url
            .replace('{collection}', parsedArgs.collection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CollectionController::edit
 * @see app/Http/Controllers/Admin/CollectionController.php:117
 * @route '/admin/collections/{collection}/edit'
 */
edit.get = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CollectionController::edit
 * @see app/Http/Controllers/Admin/CollectionController.php:117
 * @route '/admin/collections/{collection}/edit'
 */
edit.head = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CollectionController::update
 * @see app/Http/Controllers/Admin/CollectionController.php:129
 * @route '/admin/collections/{collection}'
 */
export const update = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/collections/{collection}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\CollectionController::update
 * @see app/Http/Controllers/Admin/CollectionController.php:129
 * @route '/admin/collections/{collection}'
 */
update.url = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { collection: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { collection: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    collection: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        collection: typeof args.collection === 'object'
                ? args.collection.id
                : args.collection,
                }

    return update.definition.url
            .replace('{collection}', parsedArgs.collection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CollectionController::update
 * @see app/Http/Controllers/Admin/CollectionController.php:129
 * @route '/admin/collections/{collection}'
 */
update.put = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\CollectionController::update
 * @see app/Http/Controllers/Admin/CollectionController.php:129
 * @route '/admin/collections/{collection}'
 */
update.patch = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\CollectionController::destroy
 * @see app/Http/Controllers/Admin/CollectionController.php:170
 * @route '/admin/collections/{collection}'
 */
export const destroy = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/collections/{collection}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\CollectionController::destroy
 * @see app/Http/Controllers/Admin/CollectionController.php:170
 * @route '/admin/collections/{collection}'
 */
destroy.url = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { collection: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { collection: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    collection: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        collection: typeof args.collection === 'object'
                ? args.collection.id
                : args.collection,
                }

    return destroy.definition.url
            .replace('{collection}', parsedArgs.collection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CollectionController::destroy
 * @see app/Http/Controllers/Admin/CollectionController.php:170
 * @route '/admin/collections/{collection}'
 */
destroy.delete = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\CollectionController::toggleStatus
 * @see app/Http/Controllers/Admin/CollectionController.php:177
 * @route '/admin/collections/{collection}/toggle-status'
 */
export const toggleStatus = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/admin/collections/{collection}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CollectionController::toggleStatus
 * @see app/Http/Controllers/Admin/CollectionController.php:177
 * @route '/admin/collections/{collection}/toggle-status'
 */
toggleStatus.url = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { collection: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { collection: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    collection: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        collection: typeof args.collection === 'object'
                ? args.collection.id
                : args.collection,
                }

    return toggleStatus.definition.url
            .replace('{collection}', parsedArgs.collection.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CollectionController::toggleStatus
 * @see app/Http/Controllers/Admin/CollectionController.php:177
 * @route '/admin/collections/{collection}/toggle-status'
 */
toggleStatus.post = (args: { collection: number | { id: number } } | [collection: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})
const CollectionController = { index, create, store, show, edit, update, destroy, toggleStatus }

export default CollectionController