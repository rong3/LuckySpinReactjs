import { actionTypes } from "../actions/categoryClientActions";

export const initialState = {
    categoryClientList: [],
}

const categoryClientReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_DATA_CATEGORYCLIENT_SUCCESS: {
            return {
                ...state,
                categoryClientList: action.payload?.data?.data ?? []
            }
        }
        default:
            return state;
    }
};

export default categoryClientReducer;
