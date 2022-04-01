export const actionTypes = {
    LOAD_DATA_TABLE_STRATEGY: "LOAD_DATA_TABLE_STRATEGY",
    LOAD_DATA_STRATEGY_SUCCESS: "LOAD_DATA_STRATEGY_SUCCESS",
};


export function loadDataTable(payload) {
    return {
        type: actionTypes.LOAD_DATA_TABLE_STRATEGY,
        payload
    };
}


export function loadDataTableSuccess(data) {
    return {
        type: actionTypes.LOAD_DATA_STRATEGY_SUCCESS,
        payload: data
    };
}