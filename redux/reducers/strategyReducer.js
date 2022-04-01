import { actionTypes } from "../actions/strategyActions";

export const initialState = {
    strategyList: [],
}

const strategyReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_DATA_STRATEGY_SUCCESS: {
            return {
                ...state,
                strategyList: action.payload?.data?.data ?? []
            }
        }
        default:
            return state;
    }
};

export default strategyReducer;
