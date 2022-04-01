import { put, takeLatest, select } from "redux-saga/effects";
import {  loadDataTableChannelSpinSuccess, actionTypes } from "../actions/channelActions"
import { getListChannelSpin } from "../../services/channelSpin.service"

function* loadDataTableChannelSpinSaga(payload) {
    try {
        const data = yield getListChannelSpin(payload);
        yield put(loadDataTableChannelSpinSuccess(data));
    }
    catch (err) {
        console.log({err});
        yield put(loadDataTableChannelSpinSuccess([]));
    }
}

export function* watchChannelSpinSaga() {
    yield takeLatest(actionTypes.LOAD_DATA_TABLE_CHANNELSPIN, loadDataTableChannelSpinSaga);
}
