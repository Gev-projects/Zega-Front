import { SET_LANGUAGES, SET_B_ORDER } from './generalActionTypes';

export function setLanguages(languages) {
    return (dispatch) => (
        dispatch({
            type: SET_LANGUAGES,
            payload: languages
        })
    )
}
export function setBOrder(bOrder) {
    return (dispatch) => (
        dispatch({
            type: SET_B_ORDER,
            payload: bOrder
        })
    )
}
