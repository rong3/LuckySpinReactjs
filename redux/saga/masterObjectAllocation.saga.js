import { put, takeLatest, select } from "redux-saga/effects";
import {  loadDataTableMasterObjSuccess, actionTypes } from "../actions/masterObjectAllocationActions"
import { getListMasterObj } from "../../services/masterObj.saga"

function* loadDataTableMasterObjSaga(payload) {
    try {
        const data = yield getListMasterObj(payload);
        yield put(loadDataTableMasterObjSuccess(data));
    }
    catch (err) {
        console.log({err});
        yield put(loadDataTableMasterObjSuccess([]));
    }
}

export function* watchMasterObjSaga() {
    yield takeLatest(actionTypes.LOAD_DATA_TABLE_MASTEROBJECT, loadDataTableMasterObjSaga);
}
