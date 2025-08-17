import React, { useEffect, useRef, useState } from "react";
import { Button, Row, Table } from "react-bootstrap-v5";
import { Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import MasterLayout from "../MasterLayout";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
    decimalValidate,
    getFormattedMessage,
    placeholderText,
} from "../../shared/sharedMethod";
import ReactSelect from "../../shared/select/reactSelect";
import { fetchAllWarehouses } from "../../store/action/warehouseAction";
import {
    fetchProductsByWarehouse,
    generateBarcode,
} from "../../store/action/productAction";
import { preparePurchaseProductArray } from "../../shared/prepareArray/preparePurchaseArray";
import PrintTable from "./PrintTable";
import paperSize from "../../shared/option-lists/paperSize.json";
import { toastType } from "../../constants";
import { addToast } from "../../store/action/toastAction";
import BarcodeShow from "./BarcodeShow";
import PrintButton from "./PrintButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMoneyBill,
    faWallet,
    faCreditCard,
} from "@fortawesome/free-solid-svg-icons";
import ProductSearch from "../../shared/components/product-cart/search/ProductSearch";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const PrintBarcode = () => {
    const {
        warehouses,
        products,
        purchaseProducts,
        frontSetting,
        allConfigData,
        customProducts = preparePurchaseProductArray(products, true),
    } = useSelector((state) => state);
    const [printBarcodeValue, setPrintBarcodeValue] = useState({
        warehouse_id: "",
        paperSizeValue: "",
    });

    const printBarcodeQuantity = useSelector((state) => state.printQuantity);
    const [updateProducts, setUpdateProducts] = useState([]);
    const [isCustomBarcode, setIsCustomBarcode] = useState(false);
    const [codeDisabled, setCodeDisabled] = useState(false);
    const [customBarcodeInput, setCustomBarcodeInput] = useState({
        code: "",
        name: "",
        product_price: 0,
        quantity: 10,
    });
    const [print, setPrint] = useState([]);
    const [isPrintShow, setIsPrintShow] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const [companyName, setCompanyName] = useState(true);
    const [productName, setProductName] = useState(true);
    const [price, setPrice] = useState(true);
    const [errors, setErrors] = useState({
        warehouse_id: "",
        paperSizeValue: "",
        code: "",
    });
    const [updated, setUpdated] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const componentRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAllWarehouses());
    }, [quantity, purchaseProducts]);

    useEffect(() => {
        if (printBarcodeValue.warehouse_id) {
            dispatch(
                fetchProductsByWarehouse(printBarcodeValue.warehouse_id?.value)
            );
        }
    }, [printBarcodeValue.warehouse_id]);

    useEffect(() => {
        if (printBarcodeValue) {
            if (updateProducts.length) {
                setPrint(preparePrint);
            }
        }
    }, [updateProducts, printBarcodeValue, printBarcodeQuantity]);

    useEffect(() => {
        if(isCustomBarcode && (!updateProducts.length || !updateProducts[0].product_price || updateProducts[0].product_price <= 0)) {
            setDisabled(true);
            setPrice(false)
        } else {
            setDisabled(false);
        }
    }, [isCustomBarcode, updateProducts])

    const onWarehouseChange = (obj) => {
        setPrintBarcodeValue((inputs) => ({ ...inputs, warehouse_id: obj }));
        errors["warehouse_id"] = "";
    };

    const onPaperSizeChange = (obj) => {
        setPrintBarcodeValue((inputs) => ({ ...inputs, paperSizeValue: obj }));
        setIsPrintShow(true);
    };

    const updatedQty = (qty) => {
        setQuantity(qty);
    };

    const handleValidation = () => {
        let errorss = {};
        let isValid = false;
        if (isCustomBarcode) {
            if (!updateProducts.length || !updateProducts[0].code) {
                errorss["code"] = getFormattedMessage(
                    "product.input.code.validate.label"
                );
                setErrors(errorss);
                return;
            }
        }
        if (!isCustomBarcode && !printBarcodeValue.warehouse_id) {
            errorss["warehouse_id"] = getFormattedMessage(
                "product.input.warehouse.validate.label"
            );
        } else if (!isCustomBarcode && updateProducts.length === 0) {
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "purchase.product-list.validate.message"
                    ),
                    type: toastType.ERROR,
                })
            );
        } else if (!printBarcodeValue.paperSizeValue) {
            errorss["paperSizeValue"] = getFormattedMessage(
                "globally.paper.size.validate.label"
            );
        } else {
            isValid = true;
        }
        setErrors(errorss);
        return isValid;
    };

    const onResetClick = () => {
        setUpdateProducts([]);
        setCustomBarcodeInput({
            code: "",
            name: "",
            product_price: "",
            quantity: 10,
        });
        setCodeDisabled(false);
        setUpdated(false);
        setPrintBarcodeValue({
            warehouse_id: "",
            paperSizeValue: "",
        });
        setErrors({
            warehouse_id: "",
            paperSizeValue: "",
        });
        setProductName(false);
        setPrice(false);
    };

    const printPaymentReceiptPdf = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (isCustomBarcode && valid) {
            setCodeDisabled(true);
            onClickGenerate(updateProducts[0].code, false);
            return;
        }
        if (isPrintShow === true && valid) {
            document.getElementById("printReceipt").click();
        }
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const preparePrint = () => {
        const formValue = {
            products: updateProducts,
            paperSize: printBarcodeValue.paperSizeValue,
            printBarcodeQuantity: printBarcodeQuantity,
        };
        return formValue;
    };

    const onUpdateClick = (event) => {
        event.preventDefault();
        const valid = handleValidation();
        if (valid) {
            if (isCustomBarcode) {
                setCodeDisabled(true);
                onClickGenerate(updateProducts[0].code);
                return;
            }
            setIsPrintShow(true);
            setUpdated(true);
        }
    };

    // print barcode
    const loadPrintBlock = () => {
        return (
            <div className="d-none">
                <button id="printReceipt" onClick={handlePrint}>
                    Print this out!
                </button>
                <PrintButton
                    ref={componentRef}
                    frontSetting={frontSetting}
                    allConfigData={allConfigData}
                    barcodeOptions={barcodeOptions}
                    updateProducts={print}
                />
            </div>
        );
    };

    const handleChangedCompany = (event, targetValue) => {
        let checked = event.target.checked;
        if (targetValue === 1) {
            setCompanyName(checked);
        }
        if (targetValue === 2) {
            setProductName(checked);
        }
        if (targetValue === 3) {
            setPrice(checked);
        }
    };

    const barcodeOptions = {
        companyName: companyName,
        productName: productName,
        price: price,
    };

    const handleCustomInputChange = (event) => {
        const { name, value } = event.target;
        if(name === 'quantity' && Number(value) < 1) return
        setCustomBarcodeInput((prev) => ({
            ...prev,
            [name]: value,
        }));

        setUpdateProducts((prevProducts) => {
            const updatedProducts = [...prevProducts];

            if (updatedProducts.length > 0) {
                const lastProduct = updatedProducts[updatedProducts.length - 1];
                updatedProducts[updatedProducts.length - 1] = {
                    ...lastProduct,
                    [name]: value,
                    quantity:
                        name === "quantity"
                            ? value
                            : lastProduct.quantity || 10,
                };
            } else {
                updatedProducts.push({
                    [name]: value,
                    quantity: name === "quantity" ? value : 10,
                });
            }

            return updatedProducts;
        });
    };

    const onClickGenerate = async (code, isPreview = true) => {
        let formData = new FormData();
        formData.append("code", code);

        try {
            const response = await generateBarcode(formData);
            if (response) {
                setUpdateProducts((prevProducts) => {
                    const updatedProducts = [...prevProducts];
                    if (updatedProducts.length > 0) {
                        updatedProducts[updatedProducts.length - 1] = {
                            ...updatedProducts[updatedProducts.length - 1],
                            barcode_url: response,
                        };
                    } else {
                        updatedProducts.push({
                            barcode_url: response,
                        });
                    }
                    return updatedProducts;
                });
                if(isPreview){
                    setUpdated(true);
                    setIsPrintShow(true);
                } else {
                    document.getElementById("printReceipt").click();
                }
            }
        } catch (error) {
            console.error("Error generating barcode:", error);
        }
    };

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("print.barcode.title")} />
            {print.length !== 0 ? loadPrintBlock() : ""}
            <div className="card card-body">
                <div className="col-lg-4 mb-3">
                    <div className="form-check form-switch">
                        <label className="form-check-label">
                            {getFormattedMessage("print-custom-barcode.title")}
                        </label>
                        <input
                            className="form-check-input cursor-pointer"
                            type="checkbox"
                            checked={isCustomBarcode}
                            onChange={(event) => {
                                setPrice(false);
                                setProductName(false);
                                setIsCustomBarcode(event.target.checked);
                                setUpdateProducts([]);
                                setIsPrintShow(false);
                                setUpdated(false);
                            }}
                        />
                    </div>
                </div>
                {!isCustomBarcode ? (
                    <Col md={4} className="ml-auto mb-3 col-12">
                        <ReactSelect
                            name="warehouse_id"
                            data={warehouses}
                            onChange={onWarehouseChange}
                            title={getFormattedMessage("warehouse.title")}
                            errors={errors["warehouse_id"]}
                            defaultValue={printBarcodeValue.warehouse_id}
                            value={printBarcodeValue.warehouse_id}
                            placeholder={placeholderText(
                                "product.input.warehouse.placeholder.label"
                            )}
                        />
                    </Col>
                ) : null}
                {isCustomBarcode && (
                    <div className="mb-4">
                        <Row>
                            <Col md={3}>
                                <label>
                                    {getFormattedMessage("product.sku.label")}
                                </label>
                                :
                                <span className="required" />
                                <input
                                    type="text"
                                    className="form-control"
                                    name="code"
                                    value={customBarcodeInput.code}
                                    onChange={handleCustomInputChange}
                                    placeholder={placeholderText(
                                        "product.sku.label"
                                    )}
                                    disabled={codeDisabled}
                                />
                                <span className="text-danger d-block fw-400 fs-small mt-2">
                                    {errors["code"] ? errors["code"] : null}
                                </span>
                            </Col>
                            <Col md={3}>
                                <label>
                                    {getFormattedMessage(
                                        "globally.input.name.label"
                                    )}
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={customBarcodeInput.name}
                                    onChange={handleCustomInputChange}
                                    placeholder={placeholderText(
                                        "globally.input.name.label"
                                    )}
                                />
                            </Col>
                            <Col md={3}>
                                <label>
                                    {getFormattedMessage(
                                        "price.title"
                                    )}
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="product_price"
                                    min={0}
                                    onKeyPress={( event ) => decimalValidate( event )}
                                    value={customBarcodeInput.product_price}
                                    onChange={handleCustomInputChange}
                                    placeholder={placeholderText(
                                        "price.title"
                                    )}
                                />
                            </Col>
                            <Col md={3}>
                                <label>
                                    {getFormattedMessage(
                                        "globally.detail.quantity"
                                    )}
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    className="form-control"
                                    onKeyPress={( event ) => decimalValidate( event )}
                                    name="quantity"
                                    value={customBarcodeInput.quantity}
                                    onChange={handleCustomInputChange}
                                    placeholder={placeholderText(
                                        "globally.detail.quantity"
                                    )}
                                />
                            </Col>
                        </Row>
                    </div>
                )}
                {isCustomBarcode ? (
                    ""
                ) : (
                    <Col sm={12} className="mb-10">
                        <label className="form-label">
                            {getFormattedMessage(
                                "product.title"
                            )}
                            :<span className="required" />
                        </label>
                        <ProductSearch
                            values={printBarcodeValue}
                            products={products}
                            isAllProducts={true}
                            updateProducts={updateProducts}
                            handleValidation={handleValidation}
                            setUpdateProducts={setUpdateProducts}
                            customProducts={customProducts}
                        />
                    </Col>
                )}
                {isCustomBarcode ? (
                    ""
                ) : (
                    <div className="col-12 md-12">
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>
                                        {getFormattedMessage(
                                            "product.title"
                                        )}
                                    </th>
                                    <th>
                                        {getFormattedMessage(
                                            "pos-qty.title"
                                        )}
                                    </th>
                                    <th>
                                        {getFormattedMessage(
                                            "react-data-table.action.column.label"
                                        )}
                                    </th>
                                </tr>
                            </thead>
                            {
                                <PrintTable
                                    printBarcodeValue={printBarcodeValue}
                                    updatedQty={updatedQty}
                                    updateProducts={updateProducts}
                                    setUpdateProducts={setUpdateProducts}
                                />
                            }
                        </Table>
                    </div>
                )}
                <Row>
                    <Col xs={12} md={6} className="mb-4">
                        <ReactSelect
                            name="paperSizeValue"
                            data={paperSize}
                            onChange={onPaperSizeChange}
                            title={getFormattedMessage("paper.size.title")}
                            errors={errors["paperSizeValue"]}
                            defaultValue={printBarcodeValue.paperSizeValue}
                            value={printBarcodeValue.paperSizeValue}
                            placeholder={placeholderText(
                                "paper.size.placeholder.label"
                            )}
                        />
                    </Col>
                    <Col xs={12} md={6} className="d-md-flex justify-content-space-between align-items-center">
                        <div className="mt-4 px-2">
                            <div>
                                {getFormattedMessage(
                                    "print-barcode.show-company.label"
                                )}
                            </div>
                            <div className="d-flex align-items-center mt-2">
                                <label className="form-check form-switch form-switch-sm">
                                    <input
                                        type="checkbox"
                                        checked={companyName}
                                        name="Currency_icon_Right_side"
                                        onChange={(event) =>
                                            handleChangedCompany(event, 1)
                                        }
                                        className="me-3 form-check-input cursor-pointer"
                                    />
                                    <div className="control__indicator" />
                                </label>
                                <span
                                    className="switch-slider"
                                    data-checked="✓"
                                    data-unchecked="✕"
                                >
                                    {errors["Currency_icon_Right_side"]
                                        ? errors["Currency_icon_Right_side"]
                                        : null}
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 px-2">
                            <div>
                                {getFormattedMessage(
                                    "print-barcode.show-product-name.label"
                                )}
                            </div>
                            <div className="align-items-center mt-2">
                                <label className="form-check form-switch form-switch-sm">
                                    <input
                                        type="checkbox"
                                        checked={productName}
                                        name="Currency_icon_Right_side"
                                        onChange={(event) =>
                                            handleChangedCompany(event, 2)
                                        }
                                        className="me-3 form-check-input cursor-pointer"
                                        disabled={
                                            isCustomBarcode &&
                                            (!updateProducts.length ||
                                                !updateProducts[0].name)
                                        }
                                    />
                                    <div className="control__indicator" />
                                </label>
                                <span
                                    className="switch-slider"
                                    data-checked="✓"
                                    data-unchecked="✕"
                                >
                                    {errors["Currency_icon_Right_side"]
                                        ? errors["Currency_icon_Right_side"]
                                        : null}
                                </span>
                            </div>
                        </div>
                        <div className="mt-4 px-2">
                            <div>
                                {getFormattedMessage(
                                    "print-barcode.show-price.label"
                                )}
                            </div>
                            <div className="d-flex align-items-center mt-2">
                                <label className="form-check form-switch form-switch-sm">
                                    <input
                                        type="checkbox"
                                        checked={price}
                                        disabled={disabled}
                                        name="Currency_icon_Right_side"
                                        onChange={(event) =>
                                            handleChangedCompany(event, 3)
                                        }
                                        className="me-3 form-check-input cursor-pointer"
                                    />
                                    <div className="control__indicator" />
                                </label>
                                <span
                                    className="switch-slider"
                                    data-checked="✓"
                                    data-unchecked="✕"
                                >
                                    {errors["Currency_icon_Right_side"]
                                        ? errors["Currency_icon_Right_side"]
                                        : null}
                                </span>
                            </div>
                        </div>
                    </Col>
                </Row>
                <div className="d-xl-flex align-items-center justify-content-between">
                    <div className="d-xl-flex align-items-center justify-content-between">
                        <button
                            type="button"
                            className="btn btn-success me-5 text-white mb-2"
                            onClick={(event) => onUpdateClick(event)}
                        >
                            {getFormattedMessage("preview.title")}
                            <FontAwesomeIcon
                                icon={faMoneyBill}
                                className="ms-2"
                            />
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger me-5 mb-2"
                            onClick={() => onResetClick()}
                        >
                            {getFormattedMessage(
                                "reset.title"
                            )}
                            <FontAwesomeIcon
                                icon={faCreditCard}
                                className="ms-2"
                            />
                        </button>
                        <Button
                            type="button"
                            variant="primary"
                            className="btn btn-primary me-5 mb-2"
                            onClick={(e) => printPaymentReceiptPdf(e)}
                        >
                            {getFormattedMessage("print.title")}
                            <FontAwesomeIcon icon={faWallet} className="ms-2" />
                        </Button>
                    </div>
                </div>
                {
                    <BarcodeShow
                        updateProducts={updateProducts}
                        barcodeOptions={barcodeOptions}
                        frontSetting={frontSetting}
                        paperSize={printBarcodeValue.paperSizeValue}
                        updated={updated}
                        allConfigData={allConfigData}
                    />
                }
            </div>
        </MasterLayout>
    );
};

export default PrintBarcode;
