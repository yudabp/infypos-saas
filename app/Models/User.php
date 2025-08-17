<?php

namespace App\Models;

use App\Models\Contracts\JsonResourceful;
use App\Notifications\ResetPasswordNotification;
use App\Traits\HasJsonResourcefulData;
use App\Traits\Multitenantable;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Permission\Traits\HasRoles;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * App\Models\User
 *
 * @property int $id
 * @property string $first_name
 * @property string|null $last_name
 * @property string $email
 * @property string|null $phone
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $status
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection|\Illuminate\Notifications\DatabaseNotification[] $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\Spatie\Permission\Models\Permission[] $permissions
 * @property-read int|null $permissions_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\Spatie\Permission\Models\Role[] $roles
 * @property-read int|null $roles_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\Laravel\Sanctum\PersonalAccessToken[] $tokens
 * @property-read int|null $tokens_count
 *
 * @method static \Database\Factories\UserFactory factory(...$parameters)
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User permission($permissions)
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User role($roles, $guard = null)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereFirstName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereLastName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 *
 * @property-read string $image_url
 * @property-read \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection|Media[] $media
 * @property-read int|null $media_count
 * @property string $language
 *
 * @method static \Illuminate\Database\Eloquent\Builder|User whereLanguage($value)
 *
 * @mixin \Eloquent
 */
class User extends Authenticatable implements HasMedia, JsonResourceful, CanResetPassword, MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, InteractsWithMedia, HasJsonResourcefulData, BelongsToTenant, Multitenantable;

    const JSON_API_TYPE = 'users';

    public const PATH = 'user_image';

    protected $appends = ['image_url'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'region',
        'password',
        'tenant_id',
        'language',
        'status',
        'email_verified_at',
    ];

    public static $rules = [
        'first_name' => 'required',
        'last_name' => 'required',
        'email' => 'required|email|unique:users',
        'phone' => 'required|numeric|unique:users',
        'password' => 'required|min:6',
        'confirm_password' => 'required|min:6|same:password',
        'image' => 'image|mimes:jpg,jpeg,png,svg',
    ];

    public function getImageUrlAttribute(): string
    {
        /** @var Media $media */
        $media = $this->getMedia(User::PATH)->first();
        if (! empty($media)) {
            return $media->getFullUrl();
        }

        return '';
    }

    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function prepareLinks(): array
    {
        return [
            'self' => route('users.show', $this->id),
        ];
    }

    public function prepareAttributes(): array
    {
        $fields = [
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'plan' => $this->subscriptions ? ($this->subscriptions->where('status', Subscription::ACTIVE)->first() ? $this->subscriptions->where('status', Subscription::ACTIVE)->first()->plan->name : null) : null,
            'plan_id' => $this->subscriptions ? ($this->subscriptions->where('status', Subscription::ACTIVE)->first() ? $this->subscriptions->where('status', Subscription::ACTIVE)->first()->plan->id : null) : null,
            'email_verified' => $this->email_verified_at ? true : false,
            'phone' => $this->phone,
            'region' => $this->region,
            'image' => $this->image_url,
            'role' => $this->roles ? ['id' => $this->roles->pluck('id')->first(), 'name' => $this->roles->pluck('name')->first()] : null,
            'created_at' => $this->created_at,
            'language' => $this->language,
            'status' => $this->status ? true : false,
            'stores' => $this->stores ? $this->stores->pluck('store_id')->toArray() : null,
        ];

        return $fields;
    }

    public function sendPasswordResetNotification($token)
    {
        $url = url('/app/#/reset-password/' . $token);

        $this->notify(new ResetPasswordNotification($url));
    }

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function stores()
    {
        return $this->hasMany(UserStore::class);
    }

    public function tenant()
    {
        return $this->belongsTo(MultiTenant::class);
    }
}
