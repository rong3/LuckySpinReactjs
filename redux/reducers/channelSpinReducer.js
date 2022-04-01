import { actionTypes } from "../actions/channelActions";

export const initialState = {
    channelSpinList: [],
}

const channelSpinReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_DATA_CHANNELSPIN_SUCCESS: {
            return {
                ...state,
                channelSpinList: action.payload?.data?.data ?? []
            }
        }
        default:
            return state;
    }
};

export default channelSpinReducer;
