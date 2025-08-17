import React, { useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import MasterLayout from "../MasterLayout";
import { fetchCustomers } from "../../store/action/customerAction";
import ReactDataTable from "../../shared/table/ReactDataTable";
import DeleteCustomer from "./DeleteCustomer";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
    getFormattedDate,
    getFormattedMessage,
    getPermission,
    placeholderText,
} from "../../shared/sharedMethod";
import ActionButton from "../../shared/action-buttons/ActionButton";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import ImportCustomersModel from "./ImportCustomersModel";
import CustomerDetails from "./CustomerDetails";
import { Permissions } from "../../constants";

const Customers = (props) => {
    const { fetchCustomers, customers, totalRecord, isLoading, allConfigData, callAPIAfterImport, isCallFetchDataApi } =
        props;
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [isDetails, setIsDetails] = useState(null);
    const [showCustomerDetails, setShowCustomerDetails] = useState(false);
    const navigate = useNavigate();
    const [importCustomers, setImportCustomers] = useState(false);
    const handleClose = () => {
        setImportCustomers(!importCustomers);
    };
    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onClickDetailsModel = (isDetails = null) => {
        setShowCustomerDetails(true);
        setIsDetails(isDetails);
    };

    const onChange = (filter) => {
        fetchCustomers(filter, true);
    };

    const goToEditProduct = (item) => {
        const id = item.id;
        navigate(`/user/customers/edit/${id}`);
    };

    const itemsValue =
        customers.length >= 0 &&
        customers.map((customer) => ({
            date: getFormattedDate(
                customer.attributes.created_at,
                allConfigData && allConfigData
            ),
            time: moment(customer.attributes.created_at).format("LT"),
            name: customer.attributes.name,
            email: customer.attributes.email,
            phone: customer.attributes.phone,
            country: customer.attributes.country,
            city: customer.attributes.city,
            dob: customer.attributes.dob,
            address: customer.attributes.address,
            id: customer.id,
        }));

    const columns = [
        {
            name: getFormattedMessage("customer.title"),
            selector: (row) => row.name,
            sortField: "name",
            sortable: true,
            cell: (row) => {
                return (
                    <div>
                        <div className="text-primary">{row.name}</div>
                        <div>{row.email}</div>
                    </div>
                );
            },
        },
        {
            name: getFormattedMessage("globally.input.phone-number.label"),
            selector: (row) => row.phone,
            sortField: "phone",
            sortable: true,
        },
        {
            name: getFormattedMessage(
                "globally.react-table.column.created-date.label"
            ),
            selector: (row) => row.date,
            sortField: "created_at",
            sortable: true,
            cell: (row) => {
                return (
                    <span className="badge bg-light-info">
                        <div className="mb-1">{row.time}</div>
                        {row.date}
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage("react-data-table.action.column.label"),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: (row) => (
                <ActionButton
                    item={row}
                    goToEditProduct={goToEditProduct}
                    isEditMode={getPermission(allConfigData?.permissions, Permissions.EDIT_CUSTOMERS)}
                    onClickDeleteModel={onClickDeleteModel}
                    isViewIcon={getPermission(allConfigData?.permissions, Permissions.VIEW_CUSTOMERS)}
                    goToDetailScreen={() => onClickDetailsModel(row)}
                    isDeleteMode={getPermission(allConfigData?.permissions, Permissions.DELETE_CUSTOMERS)}
                />
            ),
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("customers.title")} />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                isLoading={isLoading}
                totalRows={totalRecord}
                buttonImport={getPermission(allConfigData?.permissions, Permissions.CREATE_CUSTOMERS)}
                goToImport={handleClose}
                importBtnTitle={"customers.import.title"}
                {...(getPermission(allConfigData?.permissions, Permissions.CREATE_CUSTOMERS) &&
                {
                    to: "#/user/customers/create",
                    buttonValue: getFormattedMessage("customer.create.title")
                }
                )}
                callAPIAfterImport={callAPIAfterImport}
                isCallFetchDataApi={isCallFetchDataApi}
            />
            <DeleteCustomer
                onClickDeleteModel={onClickDeleteModel}
                deleteModel={deleteModel}
                onDelete={isDelete}
            />
            {importCustomers && (
                <ImportCustomersModel
                    handleClose={handleClose}
                    show={importCustomers}
                />
            )}
            {showCustomerDetails && (
                <CustomerDetails
                    handleClose={() => setShowCustomerDetails(false)}
                    show={showCustomerDetails}
                    customerDetails={isDetails}
                />
            )}
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const { customers, totalRecord, isLoading, allConfigData, callAPIAfterImport, isCallFetchDataApi } = state;
    return { customers, totalRecord, isLoading, allConfigData, callAPIAfterImport, isCallFetchDataApi };
};

export default connect(mapStateToProps, { fetchCustomers })(Customers);
