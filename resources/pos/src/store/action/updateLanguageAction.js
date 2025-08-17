import apiConfig from '../../config/apiConfig';
import { apiBaseURL, toastType, languageActionType, Tokens, adminApiBaseURL } from '../../constants';
import { addToast } from './toastAction';
import { getFormattedMessage } from '../../shared/sharedMethod';
import { setLoading } from "./loadingAction";

export const fetchSelectedLanguageData = (languageId) => async (dispatch) => {
    apiConfig.get(adminApiBaseURL.LANGUAGES + '/translation/' + languageId)
        .then((response) => {
            dispatch({ type: languageActionType.UPDATED_LANGUAGE, payload: response.data.data })
            setTimeout(() => {
                window.location.reload()
            }, 100)
        })
        .catch(({ response }) => {
            dispatch(addToast(
                { text: response?.data?.message, type: toastType.ERROR }));
        });
}

export const updateLanguage = (language, language_id, isFromLogin = false) => async (dispatch) => {
    apiConfig.post(apiBaseURL.CHANGE_LANGUAGE, language)
        .then((response) => {
            localStorage.setItem(Tokens.UPDATED_LANGUAGE, response.data.data)
            if(!isFromLogin){
                dispatch(addToast({ text: getFormattedMessage('change-language.update.success.message') }));
            }
            dispatch(fetchSelectedLanguageData(language_id))
        })
        .catch(({ response }) => {
            dispatch(addToast(
                { text: response?.data?.message, type: toastType.ERROR }));
            dispatch(setLoading(false));
        });
};


export const fetchLanguageData = (languageId) => async (dispatch) => {
    try {
        const response = await apiConfig.get(adminApiBaseURL.LANGUAGES + '/translation/' + languageId);
        dispatch({ type: languageActionType.UPDATED_LANGUAGE, payload: response.data.data });
        return true;
    } catch (error) {
        dispatch(addToast(
            { text: error?.response?.data?.message, type: toastType.ERROR }));
        return false;
    }
}
