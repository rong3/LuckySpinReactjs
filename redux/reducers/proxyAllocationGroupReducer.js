import { actionTypes } from "../actions/proxyAllocationGroupActions";

export const initialState = {
    proxyAllocationGroupList: [],
}

const proxyAllocationGroupReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_DATA_PROXYALLOCATIONGROUP_SUCCESS: {
            return {
                ...state,
                proxyAllocationGroupList: action.payload?.data?.data ?? []
            }
        }
        default:
            return state;
    }
};

export default proxyAllocationGroupReducer;
