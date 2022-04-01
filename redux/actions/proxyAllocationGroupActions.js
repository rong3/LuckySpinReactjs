export const actionTypes = {
    LOAD_DATA_TABLE_PROXYALLOCATIONGROUP: "LOAD_DATA_TABLE_PROXYALLOCATIONGROUP",
    LOAD_DATA_PROXYALLOCATIONGROUP_SUCCESS: "LOAD_DATA_PROXYALLOCATIONGROUP_SUCCESS",
};


export function loadDataTableProxyAllocationGroup(payload) {
    return {
        type: actionTypes.LOAD_DATA_TABLE_PROXYALLOCATIONGROUP,
        payload
    };
}


export function loadDataTableProxyAllocationGroupSuccess(data) {
    return {
        type: actionTypes.LOAD_DATA_PROXYALLOCATIONGROUP_SUCCESS,
        payload: data
    };
}