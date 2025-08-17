import React from "react";
import { Modal, Table, Image } from "react-bootstrap";
import { calculateProductCost } from "../../shared/SharedMethod";
import {
    currencySymbolHandling,
    getFormattedDate,
    getFormattedMessage,
    paymentMethodName,
} from "../../../shared/sharedMethod";

const SalePaymentSlipModal = (props) => {
    const {
        settings,
        modalShowPaymentSlip,
        setModalShowPaymentSlip,
        updateProducts,
        printPaymentReceiptPdf,
        frontSetting,
        paymentDetails,
        allConfigData,
        setIsShowPdf,
        taxes,
        paymentMethods
    } = props;
    const currency =
        settings && settings.attributes && settings.attributes.currency_symbol;

    return (
        <Modal
            show={modalShowPaymentSlip}
            onHide={() => {
                setModalShowPaymentSlip(false);
                setIsShowPdf(false);
            }}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="pos-modal"
        >
            <Modal.Header closeButton className="pb-3">
                <Modal.Title id="contained-modal-title-vcenter">
                    {getFormattedMessage("pos-sale.detail.invoice.info")} POS
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-0 pb-3">
                <div className="mt-4 mb-4 text-black text-center fs-1">
                    {settings.attributes &&
                        parseInt(settings.attributes.show_logo_in_receipt) === 1 ? (
                        <img
                            src={frontSetting.value.store_logo}
                            alt=""
                            width="100px"
                        />
                    ) : (
                        ""
                    )}
                </div>
                <div className="mt-4 mb-4 text-black text-center">
                    {updateProducts?.receipt_no}
                </div>
                <div className="mt-4 mb-4 text-black text-center fs-1">
                    {settings?.attributes?.store_name}
                </div>
                <div className="mb-2">
                    {taxes?.length > 0 && taxes
                        ?.filter((tax) => tax.attributes.status === 1)
                        ?.map((tax, index) => (
                            <div key={index} className="text-center fw-semibold ">
                                <p className="fs-6 text-body-tertiary mb-0">{tax.attributes.name}: <span className="fs-6">{tax.attributes.number}</span></p>
                            </div>
                        ))}
                </div>
                <Table>
                    <tbody>
                        <tr>
                            <td scope="row" className="p-0">
                                <span>
                                    {getFormattedMessage(
                                        "react-data-table.date.column.label"
                                    )}
                                    :
                                </span>
                                <span className="ms-2 font-label">
                                    {getFormattedDate(
                                        updateProducts?.created_at,
                                        allConfigData && allConfigData
                                    )}
                                </span>
                            </td>
                        </tr>
                        {parseInt(settings.attributes?.show_address) === 1 && (
                            <tr>
                                <td scope="row" className="p-0">
                                    <span className="address__label d-inline-block">
                                        {getFormattedMessage(
                                            "globally.input.address.label"
                                        )}
                                        :
                                    </span>
                                    <span className="ms-2 address__value d-inline-block font-label">
                                        {settings.attributes &&
                                            settings.attributes.store_address}
                                    </span>
                                </td>
                            </tr>
                        )}
                        {parseInt(settings.attributes?.show_email) === 1 && (
                            <tr>
                                <td scope="row" className="p-0">
                                    <span>
                                        {getFormattedMessage(
                                            "globally.input.email.label"
                                        )}
                                        :
                                    </span>
                                    <span className="ms-2 font-label">
                                        {settings.attributes &&
                                            settings.attributes.store_email}
                                    </span>
                                </td>
                            </tr>
                        )}
                        {parseInt(settings.attributes?.show_phone) === 1 && (
                            <tr>
                                <td scope="row" className="p-0">
                                    <span>
                                        {getFormattedMessage(
                                            "pos-sale.detail.Phone.info"
                                        )}
                                        :
                                    </span>
                                    <span className="ms-2 font-label">
                                        {settings.attributes &&
                                            settings.attributes.store_phone}
                                    </span>
                                </td>
                            </tr>
                        )}
                        {parseInt(settings.attributes?.show_customer) === 1 && (
                            <tr>
                                <td scope="row" className="p-0">
                                    <span>
                                        {" "}
                                        {getFormattedMessage(
                                            "customer.title"
                                        )}
                                        :{" "}
                                    </span>
                                    <span className="ms-2 font-label">
                                        {updateProducts?.customer?.name}
                                    </span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                {updateProducts?.sale_items &&
                    updateProducts?.sale_items?.map((productName, index) => {
                        return (
                            <div key={index + 1}>
                                <div>
                                    {productName.product.name}{" "}
                                    {parseInt(settings?.attributes?.show_product_code) === 1 ? <span>({productName.product.code})</span> : ''}
                                </div>
                                {settings?.attributes?.show_tax === "1" && <div className="d-flex justify-content-between">
                                    <p className="m-0 ws-6">{getFormattedMessage("price.title")}: {currencySymbolHandling(allConfigData, currency, productName.product.product_price)}</p>
                                    <p className="m-0 ws-6">{getFormattedMessage("globally.detail.tax")}: {currencySymbolHandling(
                                        allConfigData,
                                        currency,
                                        productName.tax_amount
                                    )} ({productName.tax_value || 0} %) </p>
                                </div>}
                                <div className="product-border">
                                    <div className="border-0 d-flex justify-content-between">
                                        <span className="">
                                            {productName.quantity}{" "}
                                            {(productName?.product
                                                ?.product_unit === "3" &&
                                                "Kg") ||
                                                (productName?.product
                                                    ?.product_unit === "1" &&
                                                    "Pc") ||
                                                (productName?.product
                                                    ?.product_unit === "2" &&
                                                    "M")}{" "}
                                            X{" "}
                                            {calculateProductCost(
                                                productName
                                            ).toFixed(2)}
                                        </span>
                                        <span className="text-end">
                                            {currencySymbolHandling(
                                                allConfigData,
                                                currency,
                                                productName?.quantity *
                                                calculateProductCost(
                                                    productName
                                                )
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                <div className="d-flex product-border">
                    <div>{getFormattedMessage("pos-total-amount.title")}:</div>
                    <div className="text-end ms-auto">
                        {currency}{" "}
                        {(
                            updateProducts?.grand_total -
                            (updateProducts?.tax_amount -
                                updateProducts?.discount) -
                            updateProducts?.shipping
                        )?.toFixed(2)}
                    </div>
                </div>

                {parseInt(settings.attributes?.show_tax_discount_shipping) ===
                    1 && (
                        <div className="d-flex product-border">
                            <div>
                                {getFormattedMessage("globally.detail.order.tax")}:
                            </div>
                            <div className="text-end ms-auto">
                                {" "}
                                {currencySymbolHandling(
                                    allConfigData,
                                    currency,
                                    updateProducts?.tax_amount
                                        ? updateProducts?.tax_amount
                                        : "0.00"
                                )}{" "}
                                (
                                {updateProducts
                                    ? parseFloat(updateProducts?.tax_rate).toFixed(2)
                                    : "0.00"}{" "}
                                %)
                            </div>
                        </div>
                    )}
                {parseInt(settings.attributes?.show_tax_discount_shipping) ===
                    1 && (
                        <div className="d-flex product-border">
                            <div>
                                {getFormattedMessage(
                                    "globally.detail.discount"
                                )}
                                :
                            </div>
                            <div className="text-end ms-auto">
                                {" "}
                                {currencySymbolHandling(
                                    allConfigData,
                                    currency,
                                    updateProducts
                                        ? updateProducts?.discount
                                        : "0.00"
                                )}
                            </div>
                        </div>
                    )}
                {parseInt(settings.attributes?.show_tax_discount_shipping) ===
                    1 && updateProducts?.shipping ? (
                    <div className="d-flex product-border">
                        <div>Shipping:</div>
                        <div className="text-end ms-auto">
                            {" "}
                            {currencySymbolHandling(
                                allConfigData,
                                currency,
                                updateProducts
                                    ? updateProducts?.shipping
                                    : "0.00"
                            )}
                        </div>
                    </div>
                ) : (
                    ""
                )}
                <div className="d-flex product-border">
                    <div>
                        {getFormattedMessage("globally.detail.grand.total")}:
                    </div>
                    <div className="text-end ms-auto">
                        {" "}
                        {currencySymbolHandling(
                            allConfigData,
                            currency,
                            updateProducts?.grand_total
                        )}
                    </div>
                </div>
                <Table striped className="mb-0">
                    <thead>
                        <tr>
                            <th className="py-2 px-0">
                                {getFormattedMessage(
                                    "pos-sale.detail.Paid-bt.title"
                                )}
                            </th>
                            <th className="text-end py-2 px-0">
                                {getFormattedMessage(
                                    "amount.title"
                                )}
                            </th>
                            <th className="text-end py-2 px-0">
                                {getFormattedMessage("pos.change-return.label")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-2 px-0">
                                {" "}
                                {paymentMethodName(paymentMethods, updateProducts)}
                            </td>
                            <td className="text-end py-2 px-0">
                                {currencySymbolHandling(
                                    allConfigData,
                                    currency,
                                    updateProducts?.grand_total
                                )}
                            </td>
                            <td className="text-end py-2 px-0">
                                {currencySymbolHandling(
                                    allConfigData,
                                    currency,
                                    updateProducts?.changeReturn || 0
                                )}
                            </td>
                        </tr>
                    </tbody>
                </Table>
                {updateProducts && updateProducts?.note ? (
                    <div className="d-flex product-border mb-5">
                        <div className="fw-bolder">
                            {getFormattedMessage(
                                "globally.input.note.label"
                            )}:
                        </div>
                        <div className="ms-2 mb-2 product-border__product-width">
                            {updateProducts && updateProducts?.note}
                        </div>
                    </div>
                ) : (
                    ""
                )}
                {parseInt(settings.attributes?.show_note) === 1 && (
                    <h5 className="text-center notes-text">
                        {settings.attributes?.notes
                            ? settings.attributes?.notes
                            : getFormattedMessage("pos-thank.you-slip.invoice")}
                    </h5>
                )}
                <div className="text-center d-block">
                    {parseInt(settings.attributes?.show_barcode_in_receipt) ===
                        1 && (
                            <Image
                                src={updateProducts && updateProducts?.barcode_url}
                                className=""
                                height={25}
                                width={100}
                            />
                        )}
                    <span className="d-block">
                        {paymentDetails &&
                            paymentDetails.attributes.reference_code}
                    </span>
                </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-center pt-2">
                <button
                    className="btn btn-primary text-white"
                    onClick={printPaymentReceiptPdf}
                >
                    {getFormattedMessage("print.title")}
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => {
                        setModalShowPaymentSlip(false);
                        setIsShowPdf(false);
                    }}
                >
                    {getFormattedMessage("pos-close-btn.title")}
                </button>
            </Modal.Footer>
        </Modal>
    );
};
export default SalePaymentSlipModal;
