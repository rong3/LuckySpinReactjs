import { put, takeLatest, select } from "redux-saga/effects";
import {  loadDataTableGroupAllocationSuccess, actionTypes } from "../actions/groupAllocationActions"
import { getListGroupAllocation } from "../../services/groupAllocation.service"

function* loadDataTableGroupAllocationSaga(payload) {
    try {
        const data = yield getListGroupAllocation(payload);
        yield put(loadDataTableGroupAllocationSuccess(data));
    }
    catch (err) {
        console.log({err});
        yield put(loadDataTableGroupAllocationSuccess([]));
    }
}

export function* watchGroupAllocationSaga() {
    yield takeLatest(actionTypes.LOAD_DATA_TABLE_GROUPALLOCATION, loadDataTableGroupAllocationSaga);
}
