# ImageKit Integration Setup

This project uses ImageKit for all file storage (images, videos, PDFs, documents, etc.) with CDN support, compression, and transformations.

## Environment Variables

Add the following to your `.env` file:

```env
# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=public_2A0pqkjuGD6Pd6Seq2tGcxCuEHY=
IMAGEKIT_PRIVATE_KEY=private_t+FPuCBCTFVQs5L+fGfP2+dMxZg=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/imagestoragetech/

# Optional Configuration
IMAGEKIT_UPLOAD_FOLDER=scommerce
IMAGEKIT_USE_UNIQUE_FILENAME=true
IMAGEKIT_DEFAULT_QUALITY=80
IMAGEKIT_AUTO_FORMAT=true
IMAGEKIT_COMPRESSION_ENABLED=true
IMAGEKIT_COMPRESSION_QUALITY=80
IMAGEKIT_CDN_ENABLED=true
IMAGEKIT_CDN_URL=https://ik.imagekit.io/imagestoragetech/
IMAGEKIT_MAX_FILE_SIZE=10485760
```

## Features

### 1. File Upload
- Supports all file types: images (JPEG, PNG, GIF, WebP, SVG), videos (MP4, WebM, OGG), PDFs, documents
- Automatic compression and optimization
- Unique filename generation
- Folder organization

### 2. CDN Support
- All files are served via ImageKit CDN
- Fast global delivery
- Automatic format conversion (WebP when supported)

### 3. Image Transformations
- On-the-fly resizing
- Quality adjustment
- Format conversion
- Thumbnail generation

### 4. File Management
- Upload single or multiple files
- Delete files by ID or URL
- List files
- Get file details

## Usage

### In Controllers

Controllers use the `HandlesImageUploads` trait for easy file handling:

```php
use App\Traits\HandlesImageUploads;

class YourController extends Controller
{
    use HandlesImageUploads;

    public function store(Request $request)
    {
        $data = $request->validated();
        
        // Handle file upload
        if ($request->hasFile('image_file')) {
            $data['image'] = $this->handleImageUpload(
                null, 
                $request->file('image_file'), 
                'folder-name'
            );
        }
        
        // Delete old image when updating
        if ($request->hasFile('new_image_file')) {
            $this->deleteOldImage($model->image);
            $data['image'] = $this->handleImageUpload(
                null, 
                $request->file('new_image_file'), 
                'folder-name'
            );
        }
    }
}
```

### Direct Service Usage

```php
use App\Services\ImageService;

$imageService = app(ImageService::class);

// Upload single file
$result = $imageService->uploadImage($file, 'products');
// Returns: ['url' => '...', 'fileId' => '...', 'filePath' => '...']

// Upload multiple files
$results = $imageService->uploadMultiple($files, 'products');

// Get transformed URL (resize, compress)
$thumbnailUrl = $imageService->getThumbnailUrl($url, 300, 300);
$compressedUrl = $imageService->getCompressedUrl($url, 80);

// Delete file
$imageService->deleteImage($fileId);
$imageService->deleteImageByUrl($url);
```

### API Endpoints (Admin)

- `POST /admin/files/upload` - Upload single file
- `POST /admin/files/upload-multiple` - Upload multiple files
- `DELETE /admin/files/delete` - Delete file by ID
- `DELETE /admin/files/delete-by-url` - Delete file by URL
- `GET /admin/files/transform` - Get transformed URL

## Form Request Validation

Form requests support both file uploads and URLs:

```php
'image' => ['nullable', 'string', 'max:500'],
'image_file' => ['nullable', 'file', 'mimes:jpeg,jpg,png,gif,webp', 'max:10240'],
```

Controllers automatically handle both - if a file is uploaded, it's sent to ImageKit; otherwise, the URL is used.

## Image Transformations

ImageKit supports URL-based transformations:

```php
// Resize
$resized = $imageService->resizeImage($url, [
    'width' => 800,
    'height' => 600,
    'quality' => 85,
    'format' => 'auto'
]);

// Thumbnail
$thumbnail = $imageService->getThumbnailUrl($url, 300, 300);

// Compress
$compressed = $imageService->getCompressedUrl($url, 80);
```

## Configuration

All settings are in `config/imagekit.php`:

- **Allowed MIME types**: Configure which file types are allowed
- **Max file size**: Default 10MB (configurable)
- **Upload folder**: Default folder structure
- **Compression**: Automatic compression settings
- **CDN**: CDN URL and settings

## Best Practices

1. Always use the `HandlesImageUploads` trait in controllers
2. Delete old images when updating to save storage
3. Use appropriate folders for organization (e.g., 'products', 'categories', 'collections')
4. Leverage ImageKit transformations for thumbnails instead of storing multiple sizes
5. Use compression for web delivery to improve performance

