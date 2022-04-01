import { put, takeLatest, select } from "redux-saga/effects";
import {  loadDataTableWheelSuccess, actionTypes } from "../actions/wheelInstanceAction"
import { getListWheel } from "../../services/wheelInstance.service"

function* loadDataTableWheelSaga(payload) {
    try {
        const data = yield getListWheel(payload);
        yield put(loadDataTableWheelSuccess(data));
    }
    catch (err) {
        console.log({err});
        yield put(loadDataTableWheelSuccess([]));
    }
}

export function* watchWheelInstanceSaga() {
    yield takeLatest(actionTypes.LOAD_DATA_TABLE_WHEELINSTANCE, loadDataTableWheelSaga);
}
