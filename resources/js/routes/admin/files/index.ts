import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\FileUploadController::upload
 * @see app/Http/Controllers/Admin/FileUploadController.php:20
 * @route '/admin/files/upload'
 */
export const upload = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

upload.definition = {
    methods: ["post"],
    url: '/admin/files/upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\FileUploadController::upload
 * @see app/Http/Controllers/Admin/FileUploadController.php:20
 * @route '/admin/files/upload'
 */
upload.url = (options?: RouteQueryOptions) => {
    return upload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FileUploadController::upload
 * @see app/Http/Controllers/Admin/FileUploadController.php:20
 * @route '/admin/files/upload'
 */
upload.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: upload.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\FileUploadController::uploadMultiple
 * @see app/Http/Controllers/Admin/FileUploadController.php:56
 * @route '/admin/files/upload-multiple'
 */
export const uploadMultiple = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadMultiple.url(options),
    method: 'post',
})

uploadMultiple.definition = {
    methods: ["post"],
    url: '/admin/files/upload-multiple',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\FileUploadController::uploadMultiple
 * @see app/Http/Controllers/Admin/FileUploadController.php:56
 * @route '/admin/files/upload-multiple'
 */
uploadMultiple.url = (options?: RouteQueryOptions) => {
    return uploadMultiple.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FileUploadController::uploadMultiple
 * @see app/Http/Controllers/Admin/FileUploadController.php:56
 * @route '/admin/files/upload-multiple'
 */
uploadMultiple.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadMultiple.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\FileUploadController::deleteMethod
 * @see app/Http/Controllers/Admin/FileUploadController.php:89
 * @route '/admin/files/delete'
 */
export const deleteMethod = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(options),
    method: 'delete',
})

deleteMethod.definition = {
    methods: ["delete"],
    url: '/admin/files/delete',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\FileUploadController::deleteMethod
 * @see app/Http/Controllers/Admin/FileUploadController.php:89
 * @route '/admin/files/delete'
 */
deleteMethod.url = (options?: RouteQueryOptions) => {
    return deleteMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FileUploadController::deleteMethod
 * @see app/Http/Controllers/Admin/FileUploadController.php:89
 * @route '/admin/files/delete'
 */
deleteMethod.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteMethod.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\FileUploadController::deleteByUrl
 * @see app/Http/Controllers/Admin/FileUploadController.php:113
 * @route '/admin/files/delete-by-url'
 */
export const deleteByUrl = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteByUrl.url(options),
    method: 'delete',
})

deleteByUrl.definition = {
    methods: ["delete"],
    url: '/admin/files/delete-by-url',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\FileUploadController::deleteByUrl
 * @see app/Http/Controllers/Admin/FileUploadController.php:113
 * @route '/admin/files/delete-by-url'
 */
deleteByUrl.url = (options?: RouteQueryOptions) => {
    return deleteByUrl.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FileUploadController::deleteByUrl
 * @see app/Http/Controllers/Admin/FileUploadController.php:113
 * @route '/admin/files/delete-by-url'
 */
deleteByUrl.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteByUrl.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\FileUploadController::transform
 * @see app/Http/Controllers/Admin/FileUploadController.php:137
 * @route '/admin/files/transform'
 */
export const transform = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transform.url(options),
    method: 'get',
})

transform.definition = {
    methods: ["get","head"],
    url: '/admin/files/transform',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\FileUploadController::transform
 * @see app/Http/Controllers/Admin/FileUploadController.php:137
 * @route '/admin/files/transform'
 */
transform.url = (options?: RouteQueryOptions) => {
    return transform.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\FileUploadController::transform
 * @see app/Http/Controllers/Admin/FileUploadController.php:137
 * @route '/admin/files/transform'
 */
transform.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transform.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\FileUploadController::transform
 * @see app/Http/Controllers/Admin/FileUploadController.php:137
 * @route '/admin/files/transform'
 */
transform.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: transform.url(options),
    method: 'head',
})
const files = {
    upload: Object.assign(upload, upload),
uploadMultiple: Object.assign(uploadMultiple, uploadMultiple),
delete: Object.assign(deleteMethod, deleteMethod),
deleteByUrl: Object.assign(deleteByUrl, deleteByUrl),
transform: Object.assign(transform, transform),
}

export default files