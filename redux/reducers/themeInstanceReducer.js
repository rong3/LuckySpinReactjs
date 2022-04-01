import { actionTypes } from "../actions/themeAction";

export const initialState = {
    themeInstanceList: [],
}

const themeInstanceReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_DATA_CHANNELTHEME_SUCCESS: {
            return {
                ...state,
                themeInstanceList: action.payload?.data?.data ?? []
            }
        }
        default:
            return state;
    }
};

export default themeInstanceReducer;
