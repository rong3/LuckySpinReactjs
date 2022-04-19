export const actionTypes = {
    LOAD_DATA_TABLE_GROUPCHANNELPRIZE: "LOAD_DATA_TABLE_GROUPCHANNELPRIZE",
    LOAD_DATA_GROUPCHANNELPRIZE_SUCCESS: "LOAD_DATA_GROUPCHANNELPRIZE_SUCCESS",
};


export function loadDataTableGroupChannelPrize(payload) {
    return {
        type: actionTypes.LOAD_DATA_TABLE_GROUPCHANNELPRIZE,
        payload
    };
}


export function loadDataTableGroupChannelPrizeSuccess(data) {
    return {
        type: actionTypes.LOAD_DATA_GROUPCHANNELPRIZE_SUCCESS,
        payload: data
    };
}