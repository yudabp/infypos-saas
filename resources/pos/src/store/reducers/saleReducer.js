import {saleActionType} from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case saleActionType.FETCH_SALES:
            return action.meta?.append ? [...state, ...action.payload] : action.payload;
        case saleActionType.FETCH_SALE:
            return action.payload;
        case saleActionType.ADD_SALE:
            return action.payload;
        case saleActionType.DELETE_SALE:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
