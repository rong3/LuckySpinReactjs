import { actionTypes } from "../actions/wheelInstanceAction";

export const initialState = {
    wheelInstanceList: [],
}

const wheelInstanceReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_DATA_WHEELINSTANCE_SUCCESS: {
            return {
                ...state,
                wheelInstanceList: action.payload?.data?.data ?? []
            }
        }
        default:
            return state;
    }
};

export default wheelInstanceReducer;
