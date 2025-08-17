import {
    apiBaseURL,
    posCashPaymentActionType,
    toastType,
} from "../../../constants";
import apiConfig from "../../../config/apiConfig";
import { addToast } from "../toastAction";
import { fetchBrandClickable } from "./posAllProductAction";
import { getFormattedMessage } from "../../../shared/sharedMethod";
import { setLoading } from "../loadingAction";
import { fetchHoldLists } from "./HoldListAction";

export const posCashPaymentAction =
    (
        detailsCash,
        setUpdateProducts,
        setModalShowPaymentSlip,
        filterData,
        printSlip = false,
        isLoading = true
    ) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.CASH_PAYMENT;
        apiConfig
            .post(url, detailsCash)
            .then((response) => {
                dispatch({
                    type: posCashPaymentActionType.POS_CASH_PAYMENT,
                    payload: response.data.data,
                });
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "sale.success.create.message"
                        ),
                    })
                );
                setUpdateProducts([]);
                if (printSlip) {
                    setModalShowPaymentSlip(true);
                }
                dispatch(
                    fetchBrandClickable(
                        filterData.brandId,
                        filterData.categoryId,
                        filterData.selectedOption.value
                    )
                );
                if (isLoading) {
                    dispatch(setLoading(false));
                    dispatch(fetchHoldLists());
                }
            })
            .catch((response) => {
                dispatch(
                    addToast({
                        text: response?.response?.data?.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };
