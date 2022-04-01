export const actionTypes = {
    LOAD_DATA_TABLE_WHEELINSTANCE: "LOAD_DATA_TABLE_WHEELINSTANCE",
    LOAD_DATA_WHEELINSTANCE_SUCCESS: "LOAD_DATA_WHEELINSTANCE_SUCCESS",
};


export function loadDataTableWheel(payload) {
    return {
        type: actionTypes.LOAD_DATA_TABLE_WHEELINSTANCE,
        payload
    };
}


export function loadDataTableWheelSuccess(data) {
    return {
        type: actionTypes.LOAD_DATA_WHEELINSTANCE_SUCCESS,
        payload: data
    };
}