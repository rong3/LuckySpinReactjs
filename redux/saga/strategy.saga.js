import { put, takeLatest, select } from "redux-saga/effects";
import {  loadDataTableSuccess, actionTypes } from "../actions/strategyActions"
import { getListStrategySpin } from "../../services/strategySpin.service"

function* loadDataTableStrategySaga() {
    try {
        const data = yield getListStrategySpin();
        yield put(loadDataTableSuccess(data));
    }
    catch (err) {
        console.log({err});
        yield put(loadDataTableSuccess([]));
    }
}

export function* watchStrategySaga() {
    yield takeLatest(actionTypes.LOAD_DATA_TABLE_STRATEGY, loadDataTableStrategySaga);
}
