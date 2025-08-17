<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Traits\HasJsonResourcefulData;
use App\Traits\Multitenantable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * App\Models\Brand
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $image_url
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection|Media[] $media
 * @property-read int|null $media_count
 *
 * @method static \Illuminate\Database\Eloquent\Builder|Brand newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Brand newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Brand query()
 * @method static \Illuminate\Database\Eloquent\Builder|Brand whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Brand whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Brand whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Brand whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Brand whereUpdatedAt($value)
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Product> $products
 * @property-read int|null $products_count
 *
 * @mixin \Eloquent
 */
class Brand extends BaseModel implements HasMedia, JsonResourceful
{
    use HasFactory, InteractsWithMedia, HasJsonResourcefulData, BelongsToTenant, Multitenantable;

    protected $table = 'brands';

    const JSON_API_TYPE = 'brands';

    protected $fillable = [
        'tenant_id',
        'name',
        'description',
    ];

    public const PATH = 'brand_image';

    protected $appends = ['image_url'];

    public static function rules(): array
    {
        return [
            'name' => 'required|unique:brands,name,NULL,id,tenant_id,' . Auth::user()->tenant_id,
            'image' => 'image|mimes:jpg,jpeg,png,svg',
        ];
    }

    public function getImageUrlAttribute(): string
    {
        /** @var Media $media */
        $media = $this->getMedia(Brand::PATH)->first();
        if (! empty($media)) {
            return $media->getFullUrl();
        }

        return '';
    }

    public function prepareLinks(): array
    {
        return [
            'self' => route('brands.show', $this->id),
        ];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'name' => $this->name,
            'description' => $this->description,
            'image' => $this->image_url,
            'product_count' => $this->products_count,
        ];

        return $fields;
    }

    public function prepareBrands(): array
    {
        $fields = [
            'id' => $this->id,
            'name' => $this->name,
        ];

        return $fields;
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'brand_id', 'id');
    }
}
