import React, { useState } from 'react'
import MasterLayout from '../../MasterLayout'
import TopProgressBar from '../../../shared/components/loaders/TopProgressBar'
import TabTitle from '../../../shared/tab-title/TabTitle'
import { getFormattedMessage, placeholderText } from '../../../shared/sharedMethod'
import ReactDataTable from '../../../shared/table/ReactDataTable'
import { useDispatch, useSelector } from 'react-redux'
import ActionButton from '../../../shared/action-buttons/ActionButton'
import AddTaxButton from './AddTaxButton'
import TaxesForm from './TaxesForm'
import DeleteTax from './DeleteTax'
import { changeTaxStatus, fetchTax } from '../../../store/action/taxAction'

const Taxes = () => {
    const dispatch = useDispatch();
    const { taxes, isLoading } = useSelector(state => state);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState();
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);

    const itemsValue = taxes.length >= 0 && taxes.map(item => ({
        name: item.attributes.name,
        status: item.attributes.status === null ? true : item.attributes.status,
        number: item.attributes.number,
        id: item.id
    }));
    
    const onChange = (filter) => {
        dispatch(fetchTax(filter, true));
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const goToEditTax = (data) => {
        setEditData(data);
        setShowEditModal(true)
    };

    const handleStatusChange = (id) => {
        dispatch(changeTaxStatus(id));
    }

    const columns = [
        {
            name: getFormattedMessage("globally.input.name.label"),
            selector: (row) => row?.name,
            className: "",
            sortField: "name",
            sortable: false,
        },
        {
            name: getFormattedMessage("tax.show.on.receipt.pdf.title"),
            selector: (row) => row.status,
            sortable: false,
            cell: (row) => {
                return (
                    <div className="d-flex align-items-center">
                        <label className="form-check form-switch form-switch-sm">
                            <input
                                type="checkbox"
                                checked={row.status}
                                onChange={(e) =>
                                    handleStatusChange(row.id)
                                }
                                className="me-3 form-check-input cursor-pointer"
                            />
                            <div className="control__indicator" />
                        </label>
                    </div>
                );
            },
        },
        {
            name: getFormattedMessage("tax.value.title"),
            selector: (row) => row?.number,
            className: "",
            sortField: "number",
            sortable: false,
        },
        {
            name: getFormattedMessage("react-data-table.action.column.label"),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "120px",
            cell: (row) => (
                <ActionButton
                    item={row}
                    goToEditProduct={() => goToEditTax(row)}
                    isEditMode={true}
                    onClickDeleteModel={onClickDeleteModel}
                />
            ),
        },
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText("taxes.title")} />
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                isLoading={isLoading}
                isShowSearch
                pagination={false}
                AddButton={<AddTaxButton />}
            />
            <TaxesForm
                show={showEditModal}
                isEdit={true}
                data={editData}
                handleClose={() => setShowEditModal(false)}
                title={placeholderText("edit.tax.title")}
                taxes={taxes}
            />
            <DeleteTax
                onClickDeleteModel={onClickDeleteModel}
                deleteModel={deleteModel}
                onDelete={isDelete}
            />
        </MasterLayout>
    )
}

export default Taxes;