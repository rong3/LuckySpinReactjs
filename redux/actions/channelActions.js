export const actionTypes = {
    LOAD_DATA_TABLE_CHANNELSPIN: "LOAD_DATA_TABLE_CHANNELSPIN",
    LOAD_DATA_CHANNELSPIN_SUCCESS: "LOAD_DATA__CHANNELSPIN_SUCCESS",
};


export function loadDataTableChannelSpin(payload) {
    return {
        type: actionTypes.LOAD_DATA_TABLE_CHANNELSPIN,
        payload
    };
}


export function loadDataTableChannelSpinSuccess(data) {
    return {
        type: actionTypes.LOAD_DATA_CHANNELSPIN_SUCCESS,
        payload: data
    };
}