import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import {useNavigate} from 'react-router-dom';
import {fetchAllWarehouses} from '../../store/action/warehouseAction';
import {fetchAllSuppliers} from '../../store/action/supplierAction';
import PurchaseForm from './PurchaseForm';
import {addPurchase} from '../../store/action/purchaseAction';
import {getFormattedMessage} from "../../shared/sharedMethod";
import { fetchPaymentMethods } from '../../store/action/paymentMethodAction';

const CreatePurchase = (props) => {
    const {addPurchase, warehouses, fetchAllWarehouses, fetchAllSuppliers, suppliers, fetchPaymentMethods, paymentMethods} = props;
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllWarehouses();
        fetchAllSuppliers();
        fetchPaymentMethods();
    }, []);

    const addPurchaseData = (formValue) => {
        addPurchase(formValue, navigate);
    };

    return (
        <MasterLayout>
            <HeaderTitle title={getFormattedMessage("purchase.create.title")} to='/user/purchases'/>
            <PurchaseForm addPurchaseData={addPurchaseData} warehouses={warehouses}
                          suppliers={suppliers} paymentMethods={paymentMethods}/>
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const {warehouses, suppliers, totalRecord, paymentMethods} = state;
    return {warehouses, suppliers, totalRecord, paymentMethods}
};

export default connect(mapStateToProps, {addPurchase, fetchAllWarehouses, fetchAllSuppliers, fetchPaymentMethods})(CreatePurchase);
