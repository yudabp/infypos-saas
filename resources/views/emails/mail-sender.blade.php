@component('mail::layout')
    {{-- Header --}}
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
            <img src="{{ getSadminSettingValue('logo') }}" class="logo" alt="{{ getActiveStoreName() }}"
                style="position:relative !important;width: 270px !important;right: -7px; !important;">
        @endcomponent
    @endslot


    {{-- Body --}}
    <div>
        {!! $data !!}
    </div>


    {{-- Footer --}}
    @slot('footer')
        @component('mail::footer')
            <h6>© {{ date('Y') }} {{ getActiveStoreName() }}.</h6>
        @endcomponent
    @endslot
@endcomponent
