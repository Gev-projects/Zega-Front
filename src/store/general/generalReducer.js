import { SET_LANGUAGES, SET_B_ORDER } from './generalActionTypes';

const initialState = [];

export default function generalReducer(state = initialState, action) {
    switch (action.type) {
        case SET_LANGUAGES:
            return {
                ...state,
                languages: action.payload
            }
            
        case SET_B_ORDER:
            return {
                ...state,
                bOrder: action.payload
            }
        default:
            return state;
    }
}
