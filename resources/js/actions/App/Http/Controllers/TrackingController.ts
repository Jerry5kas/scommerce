import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\TrackingController::pageView
 * @see app/Http/Controllers/TrackingController.php:43
 * @route '/track/pageview'
 */
export const pageView = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pageView.url(options),
    method: 'post',
})

pageView.definition = {
    methods: ["post"],
    url: '/track/pageview',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TrackingController::pageView
 * @see app/Http/Controllers/TrackingController.php:43
 * @route '/track/pageview'
 */
pageView.url = (options?: RouteQueryOptions) => {
    return pageView.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TrackingController::pageView
 * @see app/Http/Controllers/TrackingController.php:43
 * @route '/track/pageview'
 */
pageView.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pageView.url(options),
    method: 'post',
})
const TrackingController = { track, pageView }

export default TrackingController