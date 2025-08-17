<?php

namespace App\Repositories;

use App\Models\Setting;
use Exception;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class SettingRepository
 */
class SettingRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'key',
        'value',
    ];

    /**
     * @var string[]
     */
    protected $allowedFields = [
        'key',
        'value',
    ];

    /**
     * Return searchable fields
     */
    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    /**
     * Configure the Model
     **/
    public function model(): string
    {
        return Setting::class;
    }

    /**
     * @return mixed
     */
    public function updateSettings($input)
    {
        try {
            DB::beginTransaction();
            if (isset($input['store_logo']) && !empty($input['store_logo'])) {
                /** @var Setting $setting */
                $setting = Setting::where('key', 'store_logo')->first();
                if (! $setting) {
                    $setting = Setting::create(['key' => 'store_logo']);
                }
                $setting->clearMediaCollection(Setting::PATH);
                $media = $setting->addMedia($input['store_logo'])->toMediaCollection(Setting::PATH, config('app.media_disc'));
                $setting = $setting->refresh();
                $input['store_logo'] = $media->getFullUrl();
            }

            $settingInputArray = Arr::only($input, [
                'store_logo',
                'store_email',
                'store_phone',
                'store_postcode',
                'store_address',
                'currency',
                'country',
                'state',
                'city',
                'is_currency_right',
                'default_customer',
                'default_warehouse',
                'date_format',
                'stripe_key',
                'stripe_secret',
                'sms_gateway',
                'twillo_sid',
                'twillo_token',
                'twillo_from',
                'smtp_host',
                'smtp_port',
                'smtp_username',
                'smtp_password',
                'smtp_Encryption',
                'purchase_code',
                'purchase_return_code',
                'sale_code',
                'sale_return_code',
                'expense_code',
                'show_logo_in_receipt',
            ]);

            foreach ($settingInputArray as $key => $value) {
                $setting = Setting::where('key', '=', $key)->where('tenant_id', '=', getActiveStore()->tenant_id)->first();
                if ($key == 'is_currency_right' || $key == 'show_logo_in_receipt') {
                    if ($setting) {
                        $setting->update(['value' => $value]);
                    } else {
                        Setting::create([
                            'key' => $key,
                            'value' => $value,
                            'tenant_id' => getActiveStore()->tenant_id,
                        ]);
                    }
                } else {
                    if ($setting) {
                        $setting->update(['value' => $value]);
                    } else {
                        Setting::create([
                            'key' => $key,
                            'value' => $value,
                            'tenant_id' => getActiveStore()->tenant_id,
                        ]);
                    }
                }
            }
            DB::commit();

            return $input;
        } catch (Exception $exception) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($exception->getMessage());
        }
    }

    public function updateReceiptSetting($input)
    {
        try {
            DB::beginTransaction();

            $settingInputArray = Arr::only($input, ['show_note', 'show_phone', 'show_customer', 'show_address', 'show_email', 'show_warehouse', 'show_tax_discount_shipping', 'show_logo_in_receipt', 'show_barcode_in_receipt', 'notes', 'show_product_code', 'show_tax']);

            foreach ($settingInputArray as $key => $value) {
                $setting = Setting::where('key', $key)->first();
                if ($setting) {
                    $setting->update(['value' => $value]);
                } else {
                    $setting = new Setting();
                    $setting->key = $key;
                    $setting->value = $value;
                    $setting->save();
                }
            }
            DB::commit();

            return $input;
        } catch (Exception $exception) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($exception->getMessage());
        }
    }

    public function updatePosSettings($input)
    {
        try {
            DB::beginTransaction();
            if (isset($input['enable_pos_click_audio']) && $input['enable_pos_click_audio'] == 'false') {
                $setting = Setting::where('key', 'click_audio')->first();
                if ($setting) {
                    $setting->clearMediaCollection(Setting::CLICK_AUDIO);
                    $setting->delete();
                }
            } else {
                if (isset($input['click_audio']) && !empty($input['click_audio'])) {
                    /** @var Setting $setting */
                    $setting = Setting::where('key', 'click_audio')->first();
                    if (! $setting) {
                        $setting = Setting::create([
                            'tenant_id' => Auth::user()->tenant_id,
                            'key' => 'click_audio'
                        ]);
                    }
                    $setting->clearMediaCollection(Setting::CLICK_AUDIO);
                    $media = $setting->addMedia($input['click_audio'])->toMediaCollection(Setting::CLICK_AUDIO, config('app.media_disc'));
                    $setting = $setting->refresh();
                    $input['click_audio'] = $media->getFullUrl();
                }
            }

            $settingInputArray = Arr::only($input, [
                'enable_pos_click_audio',
                'click_audio',
                'show_pos_stock_product',
            ]);

            foreach ($settingInputArray as $key => $value) {
                $setting = Setting::where('key', '=', $key)->first();
                if ($setting) {
                    $setting->update(['value' => $value]);
                } else {
                    Setting::create([
                        'tenant_id' => Auth::user()->tenant_id,
                        'key' => $key,
                        'value' => $value
                    ]);
                }
            }
            DB::commit();

            return $input;
        } catch (Exception $exception) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($exception->getMessage());
        }
    }

    public function updateDualScreenSettings($input)
    {
        try {
            DB::beginTransaction();

            if (!empty(array_filter([
                $input['image1'] ?? null,
                $input['image2'] ?? null,
                $input['image3'] ?? null,
                $input['image4'] ?? null,
                $input['image5'] ?? null
            ]))) {
                /** @var Setting $setting */
                $setting = Setting::firstOrCreate(['key' => 'dual_screen_images']);

                $existingMedia = $setting->getMedia(Setting::DUAL_SCREEN);
                $imageUrls = [];
                $incomingUrls = [];
                foreach (['image1', 'image2', 'image3', 'image4', 'image5'] as $field) {
                    if (!empty($input[$field])) {
                        if ($input[$field] instanceof \Illuminate\Http\UploadedFile) {
                            $media = $setting->addMedia($input[$field])
                                ->toMediaCollection(Setting::DUAL_SCREEN, config('app.media_disc'));
                            $url = $media->getFullUrl();
                            $imageUrls[] = $url;
                            $incomingUrls[] = $url;
                        } elseif (filter_var($input[$field], FILTER_VALIDATE_URL)) {
                            $imageUrls[] = $input[$field];
                            $incomingUrls[] = $input[$field];
                        }
                    }
                }
                foreach ($existingMedia as $media) {
                    if (!in_array($media->getFullUrl(), $incomingUrls)) {
                        $media->delete();
                    }
                }
                $input['dual_screen_images'] = json_encode($imageUrls);
            } else {
                /** @var Setting $setting */
                $setting = Setting::firstOrCreate(['key' => 'dual_screen_images']);
                $setting->clearMediaCollection(Setting::DUAL_SCREEN);
                $input['dual_screen_images'] = json_encode([]);
            }

            $settingInputArray = Arr::only($input, [
                'dual_screen_header_text',
                'dual_screen_images',
            ]);

            foreach ($settingInputArray as $key => $value) {
                $setting = Setting::where('key', '=', $key)->first();
                if ($setting) {
                    $setting->update(['value' => $value]);
                } else {
                    Setting::create([
                        'tenant_id' => Auth::user()->tenant_id,
                        'key' => $key,
                        'value' => $value,
                    ]);
                }
            }
            DB::commit();

            return $input;
        } catch (Exception $exception) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($exception->getMessage());
        }
    }
}
