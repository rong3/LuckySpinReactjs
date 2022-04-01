export const actionTypes = {
    LOAD_DATA_TABLE_THEME: "LOAD_DATA_TABLE_THEME",
    LOAD_DATA_CHANNELTHEME_SUCCESS: "LOAD_DATA_CHANNELTHEME_SUCCESS",
};


export function loadDataTableThemeSpin(payload) {
    return {
        type: actionTypes.LOAD_DATA_TABLE_THEME,
        payload
    };
}


export function loadDataTableThemeSpinSuccess(data) {
    return {
        type: actionTypes.LOAD_DATA_CHANNELTHEME_SUCCESS,
        payload: data
    };
}