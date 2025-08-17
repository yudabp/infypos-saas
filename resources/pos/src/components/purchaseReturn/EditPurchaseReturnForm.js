import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom'
import { fetchAllWarehouses } from '../../store/action/warehouseAction';
import HeaderTitle from '../header/HeaderTitle';
import MasterLayout from '../MasterLayout';
import PurchaseReturnForm from './PurchaseReturnForm';
import { fetchAllSuppliers } from '../../store/action/supplierAction';
import { fetchPurchaseReturn } from '../../store/action/purchaseReturnAction';
import { getFormattedMessage, getFormattedOptions } from '../../shared/sharedMethod';
import { editPurchaseReturnArray } from './editPurchaseReturnArray';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import { saleStatusOptions } from '../../constants';

const EditPurchaseReturnForm = ( props ) => {
    const { fetchPurchaseReturn, purchaseReturn, warehouses, fetchAllSuppliers, suppliers, fetchAllWarehouses } = props;
    const { id } = useParams();
    
    useEffect( () => {
        fetchAllWarehouses();
        fetchAllSuppliers();
        fetchPurchaseReturn( id, false );
    }, [] );

    const supplierId = purchaseReturn && purchaseReturn.attributes && purchaseReturn.attributes.supplier_id
    const warehouseId = purchaseReturn && purchaseReturn.attributes && purchaseReturn.attributes.warehouse_id
    const supplier = suppliers && suppliers.filter( ( supplier ) => supplier.id === supplierId );
    const supplierName = supplier[ 0 ] && supplier[ 0 ].attributes && supplier[ 0 ].attributes.name
    const warehouse = warehouses.filter( ( warehouse ) => warehouse.id === warehouseId );
    const warehouseName = warehouse[ 0 ] && warehouse[ 0 ].attributes && warehouse[ 0 ].attributes.name

    const statusFilterOptions = getFormattedOptions( saleStatusOptions )
    const statusDefaultValue = purchaseReturn && purchaseReturn.attributes && purchaseReturn.attributes.status && statusFilterOptions.filter( ( item ) => item.id === purchaseReturn.attributes.status );

    const itemsValue = purchaseReturn && purchaseReturn.attributes && {
        date: purchaseReturn.attributes.date,
        warehouse_id: {
            value: purchaseReturn.attributes.warehouse_id,
            label: warehouseName,
        },
        supplier_id: {
            value: purchaseReturn.attributes.supplier_id,
            label: supplierName,
        },
        discount: purchaseReturn.attributes.discount,
        orderTax: purchaseReturn.attributes.tax_rate,
        shipping: purchaseReturn.attributes.shipping,
        notes: purchaseReturn.attributes.notes,
        purchase_return_items: editPurchaseReturnArray( purchaseReturn.attributes.purchase_return_items, purchaseReturn.attributes.warehouse_id ),
        newItem: '',
        id: purchaseReturn.id,
        status_id: {
            label: statusDefaultValue[ 0 ] && statusDefaultValue[ 0 ].name,
            value: statusDefaultValue[ 0 ] && statusDefaultValue[ 0 ].id
        }
    };
    return (
        <MasterLayout>
            <TopProgressBar />
            <HeaderTitle title={getFormattedMessage( 'purchase.return.edit.title' )} to='/user/purchase-return' />
            {purchaseReturn && supplierName && warehouseName &&
                <PurchaseReturnForm singlePurchase={itemsValue} id={id} warehouses={warehouses}
                    suppliers={suppliers} />}
        </MasterLayout>
    )
};

const mapStateToProps = ( state ) => {
    const { purchaseReturn, warehouses, suppliers } = state;
    return { purchaseReturn, warehouses, suppliers }
};

export default connect( mapStateToProps, { fetchPurchaseReturn, fetchAllSuppliers, fetchAllWarehouses } )( EditPurchaseReturnForm );

