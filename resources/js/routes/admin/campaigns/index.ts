import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\CampaignController::index
 * @see app/Http/Controllers/Admin/CampaignController.php:23
 * @route '/admin/campaigns'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/campaigns',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CampaignController::index
 * @see app/Http/Controllers/Admin/CampaignController.php:23
 * @route '/admin/campaigns'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CampaignController::index
 * @see app/Http/Controllers/Admin/CampaignController.php:23
 * @route '/admin/campaigns'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CampaignController::index
 * @see app/Http/Controllers/Admin/CampaignController.php:23
 * @route '/admin/campaigns'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CampaignController::create
 * @see app/Http/Controllers/Admin/CampaignController.php:60
 * @route '/admin/campaigns/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/campaigns/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CampaignController::create
 * @see app/Http/Controllers/Admin/CampaignController.php:60
 * @route '/admin/campaigns/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CampaignController::create
 * @see app/Http/Controllers/Admin/CampaignController.php:60
 * @route '/admin/campaigns/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CampaignController::create
 * @see app/Http/Controllers/Admin/CampaignController.php:60
 * @route '/admin/campaigns/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CampaignController::store
 * @see app/Http/Controllers/Admin/CampaignController.php:71
 * @route '/admin/campaigns'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/campaigns',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CampaignController::store
 * @see app/Http/Controllers/Admin/CampaignController.php:71
 * @route '/admin/campaigns'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CampaignController::store
 * @see app/Http/Controllers/Admin/CampaignController.php:71
 * @route '/admin/campaigns'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CampaignController::show
 * @see app/Http/Controllers/Admin/CampaignController.php:95
 * @route '/admin/campaigns/{campaign}'
 */
export const show = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/campaigns/{campaign}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CampaignController::show
 * @see app/Http/Controllers/Admin/CampaignController.php:95
 * @route '/admin/campaigns/{campaign}'
 */
show.url = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { campaign: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { campaign: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    campaign: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        campaign: typeof args.campaign === 'object'
                ? args.campaign.id
                : args.campaign,
                }

    return show.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CampaignController::show
 * @see app/Http/Controllers/Admin/CampaignController.php:95
 * @route '/admin/campaigns/{campaign}'
 */
show.get = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CampaignController::show
 * @see app/Http/Controllers/Admin/CampaignController.php:95
 * @route '/admin/campaigns/{campaign}'
 */
show.head = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CampaignController::edit
 * @see app/Http/Controllers/Admin/CampaignController.php:108
 * @route '/admin/campaigns/{campaign}/edit'
 */
export const edit = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/campaigns/{campaign}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\CampaignController::edit
 * @see app/Http/Controllers/Admin/CampaignController.php:108
 * @route '/admin/campaigns/{campaign}/edit'
 */
edit.url = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { campaign: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { campaign: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    campaign: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        campaign: typeof args.campaign === 'object'
                ? args.campaign.id
                : args.campaign,
                }

    return edit.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CampaignController::edit
 * @see app/Http/Controllers/Admin/CampaignController.php:108
 * @route '/admin/campaigns/{campaign}/edit'
 */
edit.get = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\CampaignController::edit
 * @see app/Http/Controllers/Admin/CampaignController.php:108
 * @route '/admin/campaigns/{campaign}/edit'
 */
edit.head = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\CampaignController::update
 * @see app/Http/Controllers/Admin/CampaignController.php:125
 * @route '/admin/campaigns/{campaign}'
 */
export const update = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/admin/campaigns/{campaign}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Admin\CampaignController::update
 * @see app/Http/Controllers/Admin/CampaignController.php:125
 * @route '/admin/campaigns/{campaign}'
 */
update.url = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { campaign: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { campaign: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    campaign: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        campaign: typeof args.campaign === 'object'
                ? args.campaign.id
                : args.campaign,
                }

    return update.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CampaignController::update
 * @see app/Http/Controllers/Admin/CampaignController.php:125
 * @route '/admin/campaigns/{campaign}'
 */
update.put = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Admin\CampaignController::update
 * @see app/Http/Controllers/Admin/CampaignController.php:125
 * @route '/admin/campaigns/{campaign}'
 */
update.patch = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Admin\CampaignController::destroy
 * @see app/Http/Controllers/Admin/CampaignController.php:154
 * @route '/admin/campaigns/{campaign}'
 */
export const destroy = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/campaigns/{campaign}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\CampaignController::destroy
 * @see app/Http/Controllers/Admin/CampaignController.php:154
 * @route '/admin/campaigns/{campaign}'
 */
destroy.url = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { campaign: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { campaign: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    campaign: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        campaign: typeof args.campaign === 'object'
                ? args.campaign.id
                : args.campaign,
                }

    return destroy.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CampaignController::destroy
 * @see app/Http/Controllers/Admin/CampaignController.php:154
 * @route '/admin/campaigns/{campaign}'
 */
destroy.delete = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\CampaignController::send
 * @see app/Http/Controllers/Admin/CampaignController.php:169
 * @route '/admin/campaigns/{campaign}/send'
 */
export const send = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/admin/campaigns/{campaign}/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CampaignController::send
 * @see app/Http/Controllers/Admin/CampaignController.php:169
 * @route '/admin/campaigns/{campaign}/send'
 */
send.url = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { campaign: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { campaign: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    campaign: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        campaign: typeof args.campaign === 'object'
                ? args.campaign.id
                : args.campaign,
                }

    return send.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CampaignController::send
 * @see app/Http/Controllers/Admin/CampaignController.php:169
 * @route '/admin/campaigns/{campaign}/send'
 */
send.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\CampaignController::cancel
 * @see app/Http/Controllers/Admin/CampaignController.php:220
 * @route '/admin/campaigns/{campaign}/cancel'
 */
export const cancel = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/admin/campaigns/{campaign}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\CampaignController::cancel
 * @see app/Http/Controllers/Admin/CampaignController.php:220
 * @route '/admin/campaigns/{campaign}/cancel'
 */
cancel.url = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { campaign: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { campaign: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    campaign: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        campaign: typeof args.campaign === 'object'
                ? args.campaign.id
                : args.campaign,
                }

    return cancel.definition.url
            .replace('{campaign}', parsedArgs.campaign.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\CampaignController::cancel
 * @see app/Http/Controllers/Admin/CampaignController.php:220
 * @route '/admin/campaigns/{campaign}/cancel'
 */
cancel.post = (args: { campaign: number | { id: number } } | [campaign: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})
const campaigns = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
send: Object.assign(send, send),
cancel: Object.assign(cancel, cancel),
}

export default campaigns