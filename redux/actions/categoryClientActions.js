export const actionTypes = {
    LOAD_DATA_TABLE_CATEGORYCLIENT: "LOAD_DATA_TABLE_CATEGORYCLIENT",
    LOAD_DATA_CATEGORYCLIENT_SUCCESS: "LOAD_DATA_CATEGORYCLIENT_SUCCESS",
};


export function loadDataTableCategoryClient(payload) {
    return {
        type: actionTypes.LOAD_DATA_TABLE_CATEGORYCLIENT,
        payload
    };
}


export function loadDataTableCategoryClientSuccess(data) {
    return {
        type: actionTypes.LOAD_DATA_CATEGORYCLIENT_SUCCESS,
        payload: data
    };
}