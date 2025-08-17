<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "//www.w3.org/TR/html4/strict.dtd">
<html lang="en">

    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
        <title>{{ __('messages.purchase_pdf') }}</title>
        <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/favicon.ico') }}">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link href="{{ asset('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css" />

        <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/font.css') }}">
        <style>
            * {
                font-family: "Arial-unicode-ms"
            }

            .icon-style {
                font-family: DejaVu Sans, sans-serif !important;
            }

            @if (getLoginUserLanguage() != 'ar')
                .fw-bold {
                    color: #333;
                }
            @else
                .fw-bold {
                    color: #333;
                }
            @endif
            @if (getLoginUserLanguage() == 'vi')
                .vi-bold-text {
                    font-size: 14px;
                    font-weight: bolder;
                    color: #333;
                }

                .vi-light-text {
                    font-size: 16px;
                }
            @endif
            .fw-light {
                color: grey;
            }
        </style>
    </head>

    <body>

        <table width="100%">
            <tr>
                <td style="vertical-align: top;padding-top: 5px;">
                    <img src="{{ $companyLogo }}" alt="Company Logo" width="80px">
                </td>
                <td align="center" style="vertical-align: top;">
                    <h2 style="color: dodgerblue; margin-top: 0px;">{{ $purchase->reference_code }}</h2>
                </td>
                <td width="34%" style="line-height: 5px;">
                    <h4 class="fw-bold vi-bold-text">
                        {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.date') : __('messages.pdf.date') }}: <span
                            class="fw-light vi-light-text">{{ \Carbon\Carbon::parse($purchase->created_at)->format('Y-m-d') }}</span>
                    </h4>
                    <h4 class="fw-bold vi-bold-text">
                        {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.number') : __('messages.pdf.number') }}:
                        <span class="fw-light vi-light-text">{{ $purchase->reference_code }}</span>
                    </h4>
                    <h4 class="fw-bold vi-bold-text">
                        {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.status') : __('messages.pdf.status') }}:
                        <span class="fw-light vi-light-text">
                            @if ($purchase->status == \App\Models\Purchase::RECEIVED)
                                {{ __('messages.pdf.received') }}
                            @elseif($purchase->status == \App\Models\Purchase::PENDING)
                                {{ __('messages.pdf.pending') }}
                            @else
                                {{ __('messages.pdf.ordered') }}
                            @endif
                        </span>
                    </h4>
                    <h4 class="fw-bold vi-bold-text">
                        {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.payment_status') : __('messages.pdf.payment_status') }}:
                        <span class="fw-light vi-light-text">
                            @if ($purchase->payment_status == \App\Models\Purchase::PAID)
                                {{ __('messages.pdf.paid') }}
                            @elseif($purchase->payment_status == \App\Models\Purchase::PARTIAL)
                                {{ __('messages.pdf.partial') }}
                            @else
                                {{ __('messages.pdf.unpaid') }}
                            @endif  
                        </span>
                    </h4>
                    @if (
                    $purchase->payment_status == \App\Models\Purchase::PAID ||
                        $purchase->payment_status == \App\Models\Purchase::PARTIAL)
                        <h4 class="fw-bold vi-bold-text">
                            {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.payment_type') : __('messages.pdf.payment_type') }}:
                            <span class="fw-light vi-light-text">
                                @if ($purchase->payment_type == \App\Models\Purchase::CASH)
                                    {{ __('messages.pdf.cash') }}
                                @elseif($purchase->payment_type == \App\Models\Purchase::CHEQUE)
                                    {{ __('messages.pdf.cheque') }}
                                @elseif($purchase->payment_type == \App\Models\Purchase::BANK_TRANSFER)
                                    {{ __('messages.pdf.bank_transfer') }}
                                @elseif($purchase->payment_type == \App\Models\Purchase::OTHER)
                                    {{ __('messages.pdf.other') }}
                                @else
                                    N/A
                                @endif
                            </span>
                        </h4>
                    @endif
                </td>
            </tr>
        </table>
        <table width="100%" style="margin-top: 40px;">
            <tr align="top" style="vertical-align: top;">
                <td style="width: 50%;">
                    <table width="95%" cellpadding="0">
                        <tr style="background-color: dodgerblue;">
                            <td style="color: #fff;padding: 10px;font-size: 18px;">
                                {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.supplier_info') : __('messages.pdf.supplier_info') }}
                            </td>
                        </tr>
                        <tr style="background-color: #f5f3f3;">
                            <td style="padding: 10px;">
                                <p class="fw-bold vi-bold-text">
                                    {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.name') : __('messages.pdf.name') }}:
                                    <span
                                        class="fw-light vi-light-text">{{ isset($purchase->supplier->name) ? $purchase->supplier->name : 'N/A' }}</span>
                                </p>
                                <p class="fw-bold vi-bold-text">
                                    {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.phone') : __('messages.pdf.phone') }}:
                                    <span
                                        class="fw-light vi-light-text">{{ isset($purchase->supplier->phone) ? $purchase->supplier->phone : 'N/A' }}</span>
                                </p>
                                <p class="fw-bold vi-bold-text">
                                    {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.address') : __('messages.pdf.address') }}:
                                    <span class="fw-light vi-light-text">
                                        {{ isset($purchase->supplier->address) ? $purchase->supplier->address : '' }}
                                        {{ isset($purchase->supplier->city) ? $purchase->supplier->city : '' }}
                                        {{ isset($purchase->supplier->country) ? $purchase->supplier->country : '' }}
                                    </span>
                                </p>
                                <p class="fw-bold vi-bold-text">
                                    {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.email') : __('messages.pdf.email') }}:
                                    <span
                                        class="fw-light vi-light-text">{{ isset($purchase->supplier->email) ? $purchase->supplier->email : '' }}</span>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="width: 50%;">
                    <table width="95%" align="right">
                        <tr style="background-color: dodgerblue;">
                            <td style="color: #fff;padding: 10px;font-size: 18px;">
                                {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.company_info') : __('messages.pdf.company_info') }}
                            </td>
                        </tr>
                        <tr style="background-color: #f5f3f3;">
                            <td style="padding: 10px;">
                                <h3 style="color: #333;">{{ getActiveStoreName() }}</h3>
                                <p class="fw-bold vi-bold-text">
                                    {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.address') : __('messages.pdf.address') }}:
                                    <span class="fw-light vi-light-text">{{ getSettingValue('store_address') }}</span>
                                </p>
                                <p class="fw-bold vi-bold-text">
                                    {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.phone') : __('messages.pdf.phone') }}:
                                    <span class="fw-light vi-light-text">{{ getSettingValue('store_phone') }}</span>
                                </p>
                                <p class="fw-bold vi-bold-text">
                                    {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.email') : __('messages.pdf.email') }}:
                                    <span class="fw-light vi-light-text">{{ getSettingValue('store_email') }}</span>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <table width="100%" cellspacing="0" cellpadding="10" style="margin-top: 40px;">
            <thead>
                <tr style="background-color: dodgerblue;">
                    <th style="color: #fff;">
                        {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.product') : __('messages.pdf.product') }}
                    </th>
                    <th style="color: #fff;">
                        {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.unit_cost') : __('messages.pdf.unit_cost') }}
                    </th>
                    <th style="color: #fff;">
                        {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.quantity') : __('messages.pdf.quantity') }}
                    </th>
                    <th style="color: #fff;">
                        {{ getLoginUserLanguage() == 'cn' ? __('messages.heading_discount') : __('messages.heading_discount') }}
                    </th>
                    <th style="color: #fff;">
                        {{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.tax') : __('messages.pdf.tax') }}</th>
                    <th style="color: #fff;">
                        {{ getLoginUserLanguage() == 'cn' ? __('messages.heading_total') : __('messages.heading_total') }}
                    </th>
                </tr>
            </thead>
            <tbody style="background-color: #f5f3f3;">
                @foreach ($purchase->purchaseItems as $purchaseItem)
                    <tr align="center">
                        <td>{{ $purchaseItem->product->name }}</td>
                        <td class="icon-style">
                            {{ currencyAlignment(number_format((float) $purchaseItem->net_unit_cost, 2)) }}</td>
                        <td class="icon-style">{{ $purchaseItem->quantity }}</td>
                        <td class="icon-style">
                            {{ currencyAlignment(number_format((float) $purchaseItem->discount_amount, 2)) }}</td>
                        <td class="icon-style">
                            {{ currencyAlignment(number_format((float) $purchaseItem->tax_amount, 2)) }}</td>
                        <td class="icon-style">
                            {{ currencyAlignment(number_format((float) $purchaseItem->sub_total, 2)) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <table width="100%" style="margin-top: 40px;">
            <tr align="top" style="vertical-align: top;">
                <td style="width: 50%; padding-right: 10px;">
                    @if ($purchase->notes)
                        <div style="background-color: #f5f3f3;padding: 10px 20px;">
                            <b>Notes : </b><br>
                            {{ $purchase->notes ?? '' }}
                        </div>
                    @endif
                </td>
                <td style="width: 40%;">
                    <table width="100%" align="right" cellspacing="0" cellpadding="10">
                        <tbody style="background-color: #f5f3f3;">
                            <tr>
                                <td>{{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.order_tax') : __('messages.pdf.order_tax') }}
                                </td>
                                <td class="icon-style">
                                    {{ currencyAlignment(number_format((float) $purchase->tax_amount, 2)) }}
                                </td>
                            </tr>
                            <tr>
                                <td>{{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.discount') : __('messages.pdf.discount') }}
                                </td>
                                <td class="icon-style">
                                    {{ currencyAlignment(number_format((float) $purchase->discount, 2)) }}</td>
                            </tr>
                            <tr>
                                <td>{{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.shipping') : __('messages.pdf.shipping') }}
                                </td>
                                <td class="icon-style">
                                    {{ currencyAlignment(number_format((float) $purchase->shipping, 2)) }}</td>
                            </tr>
                            @if($purchase->payment_status == \App\Models\Purchase::PAID || $purchase->payment_status == \App\Models\Purchase::PARTIAL)
                                <tr>
                                    <td>{{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.paid_amount') : __('messages.pdf.paid_amount') }}
                                    </td>
                                    @if($purchase->payment_status == \App\Models\Purchase::PAID)
                                    <td class="icon-style">
                                        {{ currencyAlignment(number_format((float) $purchase->grand_total, 2)) }}
                                    </td>
                                    @else
                                        <td class="icon-style">
                                            {{ currencyAlignment(number_format((float) $purchase->partial_amount, 2)) }}</td>
                                    @endif
                                </tr>
                            @endif
                            <tr>
                                <td>{{ getLoginUserLanguage() == 'cn' ? __('messages.pdf.total') : __('messages.pdf.total') }}
                                </td>
                                <td class="icon-style">
                                    {{ currencyAlignment(number_format((float) $purchase->grand_total, 2)) }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </table>
    </body>

</html>
