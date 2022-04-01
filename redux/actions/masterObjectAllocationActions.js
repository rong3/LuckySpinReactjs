export const actionTypes = {
    LOAD_DATA_TABLE_MASTEROBJECT: "LOAD_DATA_TABLE_MASTEROBJECT",
    LOAD_DATA_MASTEROBJECT_SUCCESS: "LOAD_DATA_MASTEROBJECT_SUCCESS",
};


export function loadDataTableMasterObj(payload) {
    return {
        type: actionTypes.LOAD_DATA_TABLE_MASTEROBJECT,
        payload
    };
}


export function loadDataTableMasterObjSuccess(data) {
    return {
        type: actionTypes.LOAD_DATA_MASTEROBJECT_SUCCESS,
        payload: data
    };
}