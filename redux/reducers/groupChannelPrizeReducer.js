import { actionTypes } from "../actions/groupChannelPrizeAction";

export const initialState = {
    groupChannelPrizeList: [],
}

const groupChannelPrizeReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_DATA_GROUPCHANNELPRIZE_SUCCESS: {
            return {
                ...state,
                groupChannelPrizeList: action.payload?.data?.data ?? []
            }
        }
        default:
            return state;
    }
};

export default groupChannelPrizeReducer;
