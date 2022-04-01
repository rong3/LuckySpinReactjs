/**
 * We purposely added 2 reducers for the example of combineReducers method.
 * There can be only 1 or even more than 2 reducers.
 * combineReducers defines the structure of the store object.
 */
import { combineReducers } from "redux";
import { appReducer } from "./appReducer";
import { userReducer } from "./userReducer";
import fetchDataReducer from "./fetchDataReducer"
import strategyReducer from "./strategyReducer"
import channelSpinReducer from "./channelSpinReducer"
import wheelInstanceReducer from "./wheelInstanceReducer"
import themeInstanceReducer from "./themeInstanceReducer"
import proxyAllocationGroupReducer from "./proxyAllocationGroupReducer"
import categoryClientReducer from "./categoryClientReducer"
import groupAllocationReducer from "./groupAllocationReducer"
import masterObjectAllocationReducer from "./masterObjectAllocationReducer"

export const rootReducer = combineReducers({
    app: appReducer,
    user: userReducer,
    fetchData: fetchDataReducer,
    strategy: strategyReducer,
    channelSpin: channelSpinReducer,
    wheelInstance: wheelInstanceReducer,
    themeInstance: themeInstanceReducer,
    proxyAllocationGroup: proxyAllocationGroupReducer,
    categoryClient: categoryClientReducer,
    groupAllocation: groupAllocationReducer,
    masterObjectAllocation: masterObjectAllocationReducer
})
