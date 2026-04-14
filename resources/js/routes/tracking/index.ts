import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TrackingController::track
 * @see app/Http/Controllers/TrackingController.php:18
 * @route '/track'
 */
export const track = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: track.url(options),
    method: 'post',
})

track.definition = {
    methods: ["post"],
    url: '/track',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TrackingController::track
 * @see app/Http/Controllers/TrackingController.php:18
 * @route '/track'
 */
track.url = (options?: RouteQueryOptions) => {
    return track.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TrackingController::track
 * @see app/Http/Controllers/TrackingController.php:18
 * @route '/track'
 */
track.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: track.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TrackingController::pageview
 * @see app/Http/Controllers/TrackingController.php:43
 * @route '/track/pageview'
 */
export const pageview = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pageview.url(options),
    method: 'post',
})

pageview.definition = {
    methods: ["post"],
    url: '/track/pageview',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TrackingController::pageview
 * @see app/Http/Controllers/TrackingController.php:43
 * @route '/track/pageview'
 */
pageview.url = (options?: RouteQueryOptions) => {
    return pageview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TrackingController::pageview
 * @see app/Http/Controllers/TrackingController.php:43
 * @route '/track/pageview'
 */
pageview.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pageview.url(options),
    method: 'post',
})
const tracking = {
    track: Object.assign(track, track),
pageview: Object.assign(pageview, pageview),
}

export default tracking