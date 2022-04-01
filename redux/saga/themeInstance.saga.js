import { put, takeLatest, select } from "redux-saga/effects";
import {  loadDataTableThemeSpinSuccess, actionTypes } from "../actions/themeAction"
import { getListTheme } from "../../services/themeInstance.service"

function* loadDataTableThemeSaga(payload) {
    try {
        const data = yield getListTheme(payload);
        yield put(loadDataTableThemeSpinSuccess(data));
    }
    catch (err) {
        console.log({err});
        yield put(loadDataTableThemeSpinSuccess([]));
    }
}

export function* watchThemeInstanceSaga() {
    yield takeLatest(actionTypes.LOAD_DATA_TABLE_THEME, loadDataTableThemeSaga);
}
