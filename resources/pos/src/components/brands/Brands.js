import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import MasterLayout from '../MasterLayout';
import {fetchBrands} from '../../store/action/brandsAction';
import ReactDataTable from '../../shared/table/ReactDataTable';
import ActionButton from '../../shared/action-buttons/ActionButton';
import DeleteBrands from './DeleteBrands';
import user from '../../assets/images/brand_logo.png';
import CreateBrands from './CreateBrands.js';
import EditBrands from './EditBrands';
import TabTitle from '../../shared/tab-title/TabTitle';
import {getFormattedMessage, getPermission, placeholderText} from '../../shared/sharedMethod';
import { Permissions, Tokens } from '../../constants';
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";

const Brands = () => {
    const {brands, totalRecord, isLoading, isCallFetchDataApi, allConfigData } = useSelector(state => state);
    const dispatch = useDispatch();
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [edit, setEdit] = useState(false);
    const [brand, setBrand] = useState();
    const updatedLanguage = localStorage.getItem(Tokens.UPDATED_LANGUAGE)

    const handleClose = (item) => {
        setEdit(!edit);
        setBrand(item);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const onChange = (filter) => {
        dispatch(fetchBrands(filter, true));
    };

    const itemsValue = brands.length >= 0 && brands.map(item => ({
        name: item.attributes.name,
        image: item.attributes.image,
        product_count: item.attributes.product_count ?? 0,
        id: item.id
    }));

    const columns = [
        {
            name: getFormattedMessage('brand.table.brand-name.column.label'),
            selector: row => row.name,
            sortable: true,
            sortField: 'name',
            cell: row => {
                const imageUrl = row.image ? row.image : user;
                return (
                    <div className='d-flex align-items-center'>
                        <div className='me-2'>
                            <img src={imageUrl} height='50' width='50' alt='Brand Image'
                                 className='image image-circle image-mini'/>
                        </div>
                        <div className='d-flex flex-column'>
                            <span>{row.name}</span>
                        </div>
                    </div>
                )
            },
        },
        {
            name: getFormattedMessage('brand.table.product-count.column.label'),
            selector: row => row.product_count,
            style: updatedLanguage === 'ar' ? {paddingRight: '87px'} : {paddingLeft: '130px'},
        },
        ...((
        getPermission(allConfigData?.permissions, Permissions.EDIT_BRANDS) ||
        getPermission(allConfigData?.permissions, Permissions.DELETE_BRANDS)
    ) ? [{
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row =>
                <ActionButton
                    item={row}
                    goToEditProduct={handleClose}
                    isEditMode={getPermission(allConfigData?.permissions, Permissions.EDIT_BRANDS)}
                    onClickDeleteModel={onClickDeleteModel}
                    isDeleteMode={getPermission(allConfigData?.permissions, Permissions.DELETE_BRANDS)}
                />
        }] : [])
    ];

    return (
        <MasterLayout>
            <TopProgressBar />
            <TabTitle title={placeholderText('brands.title')}/>
            <ReactDataTable
                columns={columns}
                items={itemsValue}
                onChange={onChange}
                AddButton={getPermission(allConfigData?.permissions, Permissions.CREATE_BRANDS) && <CreateBrands />}
                totalRows={totalRecord}
                isLoading={isLoading}
                isCallFetchDataApi={isCallFetchDataApi}
            />
            <EditBrands handleClose={handleClose} show={edit} brand={brand}/>
            <DeleteBrands onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete}/>
        </MasterLayout>
    )
};

export default Brands;

