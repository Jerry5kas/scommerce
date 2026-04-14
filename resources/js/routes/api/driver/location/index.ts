import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::batch
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:256
 * @route '/api/v1/driver/location/batch'
 */
export const batch = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: batch.url(options),
    method: 'post',
})

batch.definition = {
    methods: ["post"],
    url: '/api/v1/driver/location/batch',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::batch
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:256
 * @route '/api/v1/driver/location/batch'
 */
batch.url = (options?: RouteQueryOptions) => {
    return batch.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\Driver\DeliveryController::batch
 * @see app/Http/Controllers/Api/V1/Driver/DeliveryController.php:256
 * @route '/api/v1/driver/location/batch'
 */
batch.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: batch.url(options),
    method: 'post',
})
const location = {
    batch: Object.assign(batch, batch),
}

export default location