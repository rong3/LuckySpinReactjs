import { actionTypes } from "../actions/groupAllocationActions";

export const initialState = {
    groupAllocationsList: [],
}

const groupAllocationReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_DATA_GROUPALLOCATION_SUCCESS: {
            return {
                ...state,
                groupAllocationsList: action.payload?.data?.data ?? []
            }
        }
        default:
            return state;
    }
};

export default groupAllocationReducer;
