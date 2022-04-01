import { all } from "redux-saga/effects";
import { watchDemoDataTableSaga } from "../saga/demoData.saga"
import { watchStrategySaga } from "../saga/strategy.saga"
import { watchChannelSpinSaga } from "../saga/channelSpin.saga"
import { watchWheelInstanceSaga } from "../saga/wheelInstance.saga"
import { watchThemeInstanceSaga } from "../saga/themeInstance.saga"
import { watchProxyAllocationGroupSaga } from "../saga/proxyAllocationGroup.saga"
import { watchCategoryClientSaga } from "../saga/categoryClient.saga"
import {watchGroupAllocationSaga} from "./groupAllocation.saga"
import {watchMasterObjSaga} from "./masterObjectAllocation.saga"

export default function* rootSaga() {
    yield all([
        //all listener watches
        watchDemoDataTableSaga(),
        watchStrategySaga(),
        watchChannelSpinSaga(),
        watchWheelInstanceSaga(),
        watchThemeInstanceSaga(),
        watchProxyAllocationGroupSaga(),
        watchCategoryClientSaga(),
        watchGroupAllocationSaga(),
        watchMasterObjSaga()
    ]);
}
