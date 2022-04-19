import { put, takeLatest, select } from "redux-saga/effects";
import {  loadDataTableGroupChannelPrizeSuccess, actionTypes } from "../actions/groupChannelPrizeAction"
import { getListGroupChannelPrize } from "../../services/groupChannelPrize.service"

function* loadDataTableChannelPrizeSaga(payload) {
    try {
        const data = yield getListGroupChannelPrize(payload);
        yield put(loadDataTableGroupChannelPrizeSuccess(data));
    }
    catch (err) {
        console.log({err});
        yield put(loadDataTableGroupChannelPrizeSuccess([]));
    }
}

export function* watchGroupChannelPrizeSaga() {
    yield takeLatest(actionTypes.LOAD_DATA_TABLE_GROUPCHANNELPRIZE, loadDataTableChannelPrizeSaga);
}
