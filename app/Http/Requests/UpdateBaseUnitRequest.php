<?php

namespace App\Http\Requests;

use App\Models\BaseUnit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

/**
 * Class UpdateBaseUnitRequest
 */
class UpdateBaseUnitRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'name' => 'required|unique:base_units,name,' . $this->route('base_unit') . ',id,tenant_id,' . Auth::user()->tenant_id,
        ];
    }
}
