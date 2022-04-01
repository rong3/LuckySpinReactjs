import { put, takeLatest, select } from "redux-saga/effects";
import {  loadDataTableCategoryClientSuccess, actionTypes } from "../actions/categoryClientActions"
import { getListCategoryClient } from "../../services/categoryClient.service"

function* loadDataTableCategoryClientSaga(payload) {
    try {
        const data = yield getListCategoryClient(payload);
        yield put(loadDataTableCategoryClientSuccess(data));
    }
    catch (err) {
        console.log({err});
        yield put(loadDataTableCategoryClientSuccess([]));
    }
}

export function* watchCategoryClientSaga() {
    yield takeLatest(actionTypes.LOAD_DATA_TABLE_CATEGORYCLIENT, loadDataTableCategoryClientSaga);
}
