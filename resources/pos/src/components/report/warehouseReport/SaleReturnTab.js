import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import {
    currencySymbolHandling,
    getFormattedDate,
    getFormattedMessage,
} from "../../../shared/sharedMethod";
import { fetchSalesReturn } from "../../../store/action/salesReturnAction";
import { saleReturnExcelAction } from "../../../store/action/salesReturnExcelAction";
import moment from "moment";

const SaleReturnTab = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchSalesReturn,
        salesReturn,
        frontSetting,
        warehouseValue,
        saleReturnExcelAction,
        allConfigData,
    } = props;
    const currencySymbol =
        frontSetting &&
        frontSetting.value &&
        frontSetting.value.currency_symbol;
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);

    useEffect(() => {
        if (isWarehouseValue === true) {
            saleReturnExcelAction(warehouseValue.value, setIsWarehouseValue);
        }
    }, [isWarehouseValue]);

    const columns = [
        {
            name: getFormattedMessage(
                "globally.react-table.column.created-date.label"
            ),
            selector: (row) => row.date,
            sortField: "created_at",
            sortable: true,
            cell: (row) => {
                return (
                    <span className="badge bg-light-primary">
                        <div className="mb-1">{row.time}</div>
                        <div>{row.date}</div>
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("globally.detail.reference"),
            sortField: "reference_code",
            sortable: false,
            cell: (row) => {
                return (
                    <span className="badge bg-light-danger">
                        <span>{row.reference_code}</span>
                    </span>
                );
            },
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
            name: getFormattedMessage("globally.detail.grand.total"),
            selector: (row) =>
                currencySymbolHandling(
                    allConfigData,
                    row.currency,
                    row.grand_total
                ),
            sortField: "grand_total",
            sortable: true,
        },
        {
            name: getFormattedMessage("globally.detail.paid"),
            selector: (row) =>
                currencySymbolHandling(
                    allConfigData,
                    row.currency,
                    row.paid_amount
                ),
            sortField: "paid_amount",
            sortable: true,
        },
        {
            name: getFormattedMessage("globally.detail.due"),
            selector: (row) =>
                currencySymbolHandling(
                    allConfigData,
                    row.currency,
                    parseFloat(row?.due_amount)
                ),
            sortField: "due",
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
                                    "status.filter.received.label"
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
    ];

    const itemsValue =
        currencySymbol &&
        salesReturn.length >= 0 &&
        salesReturn.map((sale) => ({
            date: getFormattedDate(sale.attributes.date, allConfigData),
            time: moment(sale.attributes.created_at).format("LT"),
            reference_code: sale.attributes.reference_code,
            customer_name: sale.attributes.customer_name,
            warehouse_name: sale.attributes.warehouse_name,
            status: sale.attributes.status,
            payment_status: sale.attributes.payment_status,
            grand_total: sale.attributes.grand_total,
            paid_amount: sale.attributes.paid_amount,
            due_amount: sale.attributes.due_amount
                ? sale.attributes.paid_amount
                : (0.0).toFixed(2),
            id: sale.id,
            currency: currencySymbol,
        }));

    const onChange = (filter) => {
        fetchSalesReturn(filter, true);
    };

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };

    return (
        <ReactDataTable
            columns={columns}
            isEXCEL={itemsValue && itemsValue.length > 0}
            items={itemsValue}
            onChange={onChange}
            isLoading={isLoading}
            warehouseValue={warehouseValue}
            totalRows={totalRecord}
            onExcelClick={onExcelClick}
            isStatus
            isShowFilterField
        />
    );
};

const mapStateToProps = (state) => {
    const { isLoading, totalRecord, salesReturn, frontSetting } = state;
    return { isLoading, totalRecord, salesReturn, frontSetting };
};

export default connect(mapStateToProps, {
    fetchSalesReturn,
    saleReturnExcelAction,
})(SaleReturnTab);
