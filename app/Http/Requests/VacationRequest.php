<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VacationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $subscription = $this->route('subscription');

        return $this->user() !== null &&
               $subscription &&
               $subscription->user_id === $this->user()->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'vacation_start' => ['required', 'date', 'after_or_equal:today'],
            'vacation_end' => ['required', 'date', 'after:vacation_start'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'vacation_start.required' => 'Vacation start date is required.',
            'vacation_start.after_or_equal' => 'Vacation start date must be today or a future date.',
            'vacation_end.required' => 'Vacation end date is required.',
            'vacation_end.after' => 'Vacation end date must be after the start date.',
        ];
    }
}
