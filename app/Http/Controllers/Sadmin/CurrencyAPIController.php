<?php

namespace App\Http\Controllers\Sadmin;

use App\Http\Controllers\AppBaseController;
use App\Http\Requests\CreateCurrencyRequest;
use App\Http\Requests\UpdateCurrencyRequest;
use App\Http\Resources\CurrencyCollection;
use App\Http\Resources\CurrencyResource;
use App\Models\Plan;
use App\Models\Setting;
use App\Repositories\CurrencyRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Prettus\Validator\Exceptions\ValidatorException;

class CurrencyAPIController extends AppBaseController
{
    /**
     * @var CurrencyRepository
     */
    private $currencyRepository;

    public function __construct(CurrencyRepository $currencyRepository)
    {
        $this->currencyRepository = $currencyRepository;
    }

    public function index(Request $request): CurrencyCollection
    {
        $perPage = getPageSize($request);
        $currencies = $this->currencyRepository->paginate($perPage);

        CurrencyResource::usingWithCollection();

        return new CurrencyCollection($currencies);
    }

    /**
     * @throws ValidatorException
     */
    public function store(CreateCurrencyRequest $request): CurrencyResource
    {

        $input = $request->all();
        $currency = $this->currencyRepository->create($input);

        return new CurrencyResource($currency);
    }

    public function show($id): CurrencyResource
    {
        $currency = $this->currencyRepository->find($id);

        return new CurrencyResource($currency);
    }

    /**
     * @throws ValidatorException
     */
    public function update(UpdateCurrencyRequest $request, $id): CurrencyResource
    {

        $input = $request->all();
        $currency = $this->currencyRepository->update($input, $id);

        return new CurrencyResource($currency);
    }

    public function destroy($id): JsonResponse
    {
        $userSetting = Setting::withoutGlobalScope('tenant')->where('key', 'currency')->where('value', $id)->exists();
        $plans = Plan::where('currency_id', $id)->exists();

        if ($userSetting || $plans) {
            return $this->sendError(__('messages.error.currency_in_use'));
        }

        $this->currencyRepository->delete($id);

        return $this->sendSuccess('Currency deleted successfully');
    }
}
