import { actionTypes } from "../actions/masterObjectAllocationActions";

export const initialState = {
    masterObjectAllocationList: [],
}

const masterObjectAllocationReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_DATA_MASTEROBJECT_SUCCESS: {
            return {
                ...state,
                masterObjectAllocationList: action.payload?.data?.data ?? []
            }
        }
        default:
            return state;
    }
};

export default masterObjectAllocationReducer;
