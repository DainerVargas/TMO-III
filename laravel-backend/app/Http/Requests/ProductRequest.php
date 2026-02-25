<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Set to true for now, should be restricted based on role later
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');

        return [
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:product,sku' . ($isUpdate ? ',' . $this->route('product') : ''),
            'categoryId' => 'required|string|exists:category,id',
            'price' => 'required|numeric|min:0',
            'unit' => 'required|string',
            'stock' => 'required|integer|min:0',
            'stockStatus' => 'required|string',
            'image' => 'required|string',
            'description' => 'required|string',
            'deliveryDays' => 'integer|min:1',
            'brand' => 'required|string',
            'minOrder' => 'integer|min:1',
            'isRecurring' => 'boolean',
            'tags' => 'required|string',
            'unitPrice' => 'nullable|numeric|min:0',
            'unitPriceUnit' => 'nullable|string',
            'isActive' => 'boolean',
        ];
    }
}
