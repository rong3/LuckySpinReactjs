import { put, takeLatest, select } from "redux-saga/effects";
import {  loadDataTableProxyAllocationGroupSuccess, actionTypes } from "../actions/proxyAllocationGroupActions"
import { getListSProxyAllocationGroup } from "../../services/proxyAllocationGroup.service"

function* loadDataTableProxyAllocationGroupSaga(payload) {
    try {
        const data = yield getListSProxyAllocationGroup(payload);
        yield put(loadDataTableProxyAllocationGroupSuccess(data));
    }
    catch (err) {
        console.log({err});
        yield put(loadDataTableProxyAllocationGroupSuccess([]));
    }
}

export function* watchProxyAllocationGroupSaga() {
    yield takeLatest(actionTypes.LOAD_DATA_TABLE_PROXYALLOCATIONGROUP, loadDataTableProxyAllocationGroupSaga);
}
