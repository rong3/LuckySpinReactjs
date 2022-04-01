export const actionTypes = {
    LOAD_DATA_TABLE_GROUPALLOCATION: "LOAD_DATA_TABLE_GROUPALLOCATION",
    LOAD_DATA_GROUPALLOCATION_SUCCESS: "LOAD_DATA_GROUPALLOCATION_SUCCESS",
};


export function loadDataTableGroupAllocation(payload) {
    return {
        type: actionTypes.LOAD_DATA_TABLE_GROUPALLOCATION,
        payload
    };
}


export function loadDataTableGroupAllocationSuccess(data) {
    return {
        type: actionTypes.LOAD_DATA_GROUPALLOCATION_SUCCESS,
        payload: data
    };
}