<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CompleteDeliveryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'proof_image' => ['required', 'image', 'max:10240', 'mimes:jpeg,jpg,png,webp'],
            'notes' => ['nullable', 'string', 'max:500'],
            'customer_signature' => ['nullable', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'proof_image.required' => 'Delivery proof image is required.',
            'proof_image.image' => 'Please upload a valid image.',
            'proof_image.max' => 'Image size cannot exceed 10MB.',
            'proof_image.mimes' => 'Allowed formats: JPEG, PNG, WebP.',
        ];
    }
}
