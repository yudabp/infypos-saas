import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { connect, useDispatch, useSelector } from "react-redux";
import MasterLayout from "../MasterLayout";
import TabTitle from "../../shared/tab-title/TabTitle";
import ReactDataTable from "../../shared/table/ReactDataTable";
import { fetchSales } from "../../store/action/salesAction";
import DeleteSale from "./DeleteSale";
import {
    currencySymbolHandling,
    getFormattedDate,
    getFormattedMessage,
    getPermission,
    paymentMethodName,
    placeholderText,
} from "../../shared/sharedMethod";
import { salePdfAction } from "../../store/action/salePdfAction";
import ActionDropDownButton from "../../shared/action-buttons/ActionDropDownButton";
import ShowPayment from "../../shared/showPayment/ShowPayment";
import CreatePaymentModal from "./CreatePaymentModal";
import { fetchSalePayments } from "../../store/action/salePaymentAction";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { fetchSetting } from "../../store/action/settingAction";
import { fetchTax } from "../../store/action/taxAction";
import { saleDetailsAction } from "../../store/action/saleDetailsAction";
import SalePaymentSlipModal from "../../frontend/components/paymentSlipModal/SalePaymentSlipModal";
import PrintDataSales from "./PrintDataSales";
import { useReactToPrint } from "react-to-print";
import { Permissions } from "../../constants";
import { fetchPaymentMethods } from "../../store/action/paymentMethodAction";

const Sales = (props) => {
    const {
        sales,
        fetchSales,
        totalRecord,
        isLoading,
        salePdfAction,
        frontSetting,
        isCallSaleApi,
        allConfigData,
        isCallFetchDataApi,
        fetchSetting,
        settings,
        saleDetailsAction,
        saleDetails,
        taxes,
        fetchTax,
        fetchPaymentMethods,
        paymentMethods
    } = props;
    const [deleteModel, setDeleteModel] = useState(false);
    const [isShowPaymentModel, setIsShowPaymentModel] = useState(false);
    const [isCreatePaymentOpen, setIsCreatePaymentOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [createPaymentItem, setCreatePaymentItem] = useState({});
    const { allSalePayments } = useSelector((state) => state);
    const [tableArray, setTableArray] = useState([]);
    const [modalShowPaymentSlip, setModalShowPaymentSlip] = useState(false);
    const [isShowPdf, setIsShowPdf] = useState(false);
    const componentRef = useRef();

    useEffect(() => {
        fetchSetting();
        fetchPaymentMethods();
        fetchTax();
    }, []);

    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;

    const onChange = (filter) => {
        fetchSales(filter, true);
    };

    //sale edit function
    const goToEdit = (item) => {
        const id = item.id;
        window.location.href = "#/user/sales/edit/" + id;
    };

    // delete sale function
    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };
    const dispatch = useDispatch();

    const onShowPaymentClick = (item) => {
        setIsShowPaymentModel(!isShowPaymentModel);
        setCreatePaymentItem(item);
        if (item) {
            dispatch(fetchSalePayments(item.id));
        }
    };

    const onCreatePaymentClick = (item) => {
        setIsCreatePaymentOpen(!isCreatePaymentOpen);
        setCreatePaymentItem(item);
        if (item) {
            dispatch(fetchSalePayments(item.id));
        }
    };

    //sale details function
    const goToDetailScreen = (ProductId) => {
        window.location.href = "#/user/sales/detail/" + ProductId;
    };

    const [paymentPrint, setPaymentPrint] = useState({});
    const [salesId, setSalesId] = useState(null);

    //onClick pdf function
    const onPdfClick = (id) => {
        salePdfAction(id);
    };

    const onReceiptClick = (id) => {
        setModalShowPaymentSlip(true);
        setSalesId(id);
    };

    useEffect(() => {
        if (salesId) {
            saleDetailsAction(salesId);
        }
    }, [salesId]);

    useEffect(() => {
        setPaymentPrint(saleDetails);
    }, [saleDetails]);

    const onCreateSaleReturnClick = (item) => {
        const id = item.id;
        window.location.href =
            item.is_return === 1
                ? "#/user/sales/return/edit/" + id
                : "#/user/sales/return/" + id;
    };

    const printPaymentReceiptPdf = () => {
        setIsShowPdf(true);
        setTimeout(() => {
            document.getElementById("printReceipt")?.click();
        }, 0);
    };

    const loadPrintBlock = () => (
        <div className="d-none">
            <button id="printReceipt" onClick={handlePrint}>
                Print this out!
            </button>
            <PrintDataSales
                ref={componentRef}
                allConfigData={allConfigData}
                updateProducts={paymentPrint}
                settings={settings}
                taxes={taxes}
                frontSetting={frontSetting}
                paymentMethods={paymentMethods}
            />
        </div>
    );

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const itemsValue =
        currencySymbol &&
        sales.length >= 0 &&
        sales.map((sale) => ({
            date: getFormattedDate(
                sale.attributes.created_at,
                allConfigData && allConfigData
            ),
            time: moment(sale.attributes.created_at).format("LT"),
            reference_code: sale.attributes.reference_code,
            customer_name: sale.attributes.customer_name,
            user_name: sale.attributes.user_name,
            warehouse_name: sale.attributes.warehouse_name,
            status: sale.attributes.status,
            payment_status: sale.attributes.payment_status,
            payment_type: sale.attributes.payment_type,
            payment_type_name: {
                value: sale.attributes.payment_type,
                label: paymentMethodName(paymentMethods, sale && sale.attributes)
            },
            grand_total: sale.attributes.grand_total,
            paid_amount: sale.attributes.paid_amount
                ? sale.attributes.paid_amount
                : (0.0).toFixed(2),
            id: sale.id,
            currency: currencySymbol,
            is_return: sale.attributes.is_return,
        }));

    useEffect(() => {
        const grandTotalSum = () => {
            let x = 0;
            itemsValue.length &&
                itemsValue.map((item) => {
                    x = x + Number(item.grand_total);
                    return x;
                });
            return x;
        };
        const paidTotalSum = (itemsValue) => {
            let x = 0;
            itemsValue.length &&
                itemsValue.map((item) => {
                    x = x + Number(item.paid_amount);
                    return x;
                });
            return x;
        };
        if (sales.length) {
            const newObject = itemsValue.length && {
                date: "",
                time: "",
                reference_code: "Total",
                customer_name: "",
                warehouse_name: "",
                status: "",
                payment_status: "",
                payment_type: "",
                grand_total: grandTotalSum(itemsValue),
                paid_amount: paidTotalSum(itemsValue),
                id: "totalRows",
                currency: currencySymbol,
            };
            const newItemValue =
            itemsValue.length && newObject && itemsValue.concat(newObject);
            const latestArray = newItemValue.map((item) => item);
            newItemValue.length && setTableArray(latestArray);
        } else {
            setTableArray([]);

        } 
    }, [sales]);

    const columns = [
        {
            name: getFormattedMessage("globally.detail.reference"),
            sortField: "reference_code",
            sortable: false,
            cell: (row) => {
                return row.reference_code === "Total" ? (
                    <span className="fw-bold fs-4">
                        {getFormattedMessage("pos-total.title")}
                    </span>
                ) : (
                    <span className="badge bg-light-danger">
                        <span>{row.reference_code}</span>
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("users.table.user.column.title"),
            selector: (row) => row.user_name,
            sortField: "user_name",
            sortable: false,
        },
        {
            name: getFormattedMessage("customer.title"),
            selector: (row) => row.customer_name,
            sortField: "customer_name",
            sortable: false,
        },
        {
            name: getFormattedMessage("warehouse.title"),
            selector: (row) => row.warehouse_name,
            sortField: "warehouse_name",
            sortable: false,
        },
        {
            name: getFormattedMessage("globally.detail.status"),
            sortField: "status",
            sortable: false,
            cell: (row) => {
                return (
                    (row.status === 1 && (
                        <span className="badge bg-light-success">
                            <span>
                                {getFormattedMessage(
                                    "status.filter.complated.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status === 2 && (
                        <span className="badge bg-light-primary">
                            <span>
                                {getFormattedMessage(
                                    "status.filter.pending.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.status === 3 && (
                        <span className="badge bg-light-warning">
                            <span>
                                {getFormattedMessage(
                                    "status.filter.ordered.label"
                                )}
                            </span>
                        </span>
                    ))
                );
            },
        },
        {
            name: getFormattedMessage("globally.detail.grand.total"),
            sortField: "grand_total",
            cell: (row) => {
                return row.reference_code === "Total" ? (
                    <span className="fw-bold fs-4">
                        {currencySymbolHandling(
                            allConfigData,
                            row.currency,
                            row.grand_total
                        )}
                    </span>
                ) : (
                    <span>
                        {currencySymbolHandling(
                            allConfigData,
                            row.currency,
                            row.grand_total
                        )}
                    </span>
                );
            },
            sortable: true,
        },
        {
            name: getFormattedMessage("globally.detail.paid"),
            sortField: "paid_amount",
            cell: (row) => {
                return row.reference_code === "Total" ? (
                    <span className="fw-bold fs-4">
                        {currencySymbolHandling(
                            allConfigData,
                            row.currency,
                            row.paid_amount
                        )}
                    </span>
                ) : (
                    <span>
                        {currencySymbolHandling(
                            allConfigData,
                            row.currency,
                            row.paid_amount
                        )}
                    </span>
                );
            },
            sortable: true,
        },
        {
            name: getFormattedMessage(
                "globally.detail.payment.status"
            ),
            sortField: "payment_status",
            sortable: false,
            cell: (row) => {
                return (
                    (row.payment_status === 1 && (
                        <span className="badge bg-light-success">
                            <span>
                                {getFormattedMessage(
                                    "globally.detail.paid"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.payment_status === 2 && (
                        <span className="badge bg-light-danger">
                            <span>
                                {getFormattedMessage(
                                    "payment-status.filter.unpaid.label"
                                )}
                            </span>
                        </span>
                    )) ||
                    (row.payment_status === 3 && (
                        <span className="badge bg-light-warning">
                            <span>
                                {getFormattedMessage(
                                    "payment-status.filter.partial.label"
                                )}
                            </span>
                        </span>
                    ))
                );
            },
        },
        {
            name: getFormattedMessage("select.payment-type.label"),
            sortField: "payment_type",
            sortable: false,
            cell: (row) => {
                return (
                    ((row.payment_type === 0 || row.payment_type === null) && (
                        <span className="w-50 fw-bold text-center">
                            <span>-</span>
                        </span>
                    )) ||
                    (row.payment_status !== 2 && row.payment_type >= 1 && (
                        <span className="badge bg-light-primary">
                            <span>{row?.payment_type_name?.label}</span>
                        </span>
                    ))
                );
            },
        },
        {
            name: getFormattedMessage(
                "globally.react-table.column.created-date.label"
            ),
            selector: (row) => row.date,
            sortField: "date",
            sortable: true,
            cell: (row) => {
                return (
                    row.date && (
                        <span className="badge bg-light-info">
                            <div className="mb-1">{row.time}</div>
                            <div>{row.date}</div>
                        </span>
                    )
                );
            },
        },
        {
            name: getFormattedMessage("react-data-table.action.column.label"),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: (row) =>
                row.reference_code === "Total" ? null : (
                    <ActionDropDownButton
                        item={row}
                        goToEditProduct={getPermission(allConfigData?.permissions, Permissions.EDIT_SALES) && goToEdit}
                        isEditMode={true}
                        isPdfIcon={true}
                        onClickDeleteModel={onClickDeleteModel}
                        onPdfClick={onPdfClick}
                        isReceiptIcon={true}
                        onReceiptClick={onReceiptClick}
                        title={getFormattedMessage("sale.title")}
                        isPaymentShow={getPermission(allConfigData?.permissions, Permissions.EDIT_SALES) ||
                            getPermission(allConfigData?.permissions, Permissions.CREATE_SALES)}
                        isCreatePayment={getPermission(allConfigData?.permissions, Permissions.EDIT_SALES) ||
                            getPermission(allConfigData?.permissions, Permissions.CREATE_SALES)}
                        isViewIcon={getPermission(allConfigData?.permissions, Permissions.VIEW_SALES)}
                        goToDetailScreen={goToDetailScreen}
                        onShowPaymentClick={onShowPaymentClick}
                        isCreateSaleReturn={getPermission(allConfigData?.permissions, Permissions.EDIT_SALE_RETURN) || 
                            getPermission(allConfigData?.permissions, Permissions.CREATE_SALE_RETURN)}
                        onCreatePaymentClick={onCreatePaymentClick}
                        onCreateSaleReturnClick={onCreateSaleReturnClick}
                        isDeleteMode={getPermission(allConfigData?.permissions, Permissions.DELETE_SALES)}
                    />
                ),
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            {isShowPdf && loadPrintBlock()}
            <TabTitle title={placeholderText("sales.title")} />
            <div className="sale_table">
                <ReactDataTable
                    columns={columns}
                    items={tableArray}
                    {...(getPermission(allConfigData?.permissions, Permissions.CREATE_SALES) &&
                    {
                        to: "#/user/sales/create",
                        buttonValue: getFormattedMessage("sale.create.title")
                    }
                    )}
                    isShowPaymentModel={isShowPaymentModel}
                    isCallSaleApi={isCallSaleApi}
                    isShowDateRangeField
                    onChange={onChange}
                    totalRows={totalRecord}
                    goToEdit={goToEdit}
                    isLoading={isLoading}
                    isShowFilterField
                    isPaymentStatus
                    isStatus
                    isPaymentType
                    isCallFetchDataApi={isCallFetchDataApi}
                />
            </div>
            <DeleteSale
                onClickDeleteModel={onClickDeleteModel}
                deleteModel={deleteModel}
                onDelete={isDelete}
            />
            <ShowPayment
                allConfigData={allConfigData}
                setIsShowPaymentModel={setIsShowPaymentModel}
                currencySymbol={currencySymbol}
                allSalePayments={allSalePayments}
                createPaymentItem={createPaymentItem}
                onShowPaymentClick={onShowPaymentClick}
                isShowPaymentModel={isShowPaymentModel}
                paymentMethods={paymentMethods}
            />
            <CreatePaymentModal
                setIsCreatePaymentOpen={setIsCreatePaymentOpen}
                onCreatePaymentClick={onCreatePaymentClick}
                isCreatePaymentOpen={isCreatePaymentOpen}
                createPaymentItem={createPaymentItem}
            />
            {salesId && (
                <SalePaymentSlipModal
                    modalShowPaymentSlip={modalShowPaymentSlip}
                    setModalShowPaymentSlip={setModalShowPaymentSlip}
                    printPaymentReceiptPdf={printPaymentReceiptPdf}
                    settings={settings}
                    updateProducts={paymentPrint}
                    frontSetting={frontSetting}
                    allConfigData={allConfigData}
                    setIsShowPdf={setIsShowPdf}
                    taxes={taxes}
                    paymentMethods={paymentMethods}
                />
            )}
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const {
        sales,
        totalRecord,
        isLoading,
        frontSetting,
        isCallSaleApi,
        allConfigData,
        isCallFetchDataApi,
        settings,
        saleDetails,
        taxes,
        paymentMethods
    } = state;
    return {
        sales,
        totalRecord,
        isLoading,
        frontSetting,
        isCallSaleApi,
        allConfigData,
        isCallFetchDataApi,
        settings,
        saleDetails,
        taxes,
        paymentMethods
    };
};

export default connect(mapStateToProps, {
    fetchSales,
    salePdfAction,
    fetchSetting,
    saleDetailsAction,
    fetchTax,
    fetchPaymentMethods
})(Sales);
