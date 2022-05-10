import axios from 'axios'
import { authenticationConstant } from "../globalConstant/authenticationConstant"
import { CookieHelper } from "../utils/cookie"
import { trackPromise } from 'react-promise-tracker';
import Emitter from "./emit"
import Utility from "../utils/common"

axios.interceptors.request.use(function (config) {
    const token = CookieHelper.getCookie(authenticationConstant.tokenKey);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export function request(method,
    url,
    locale = 'vi',
    data,
    headers = {},
    prefixHost = process.env.BASE_URL,
    isCheck = true,
    responseType = '',
    isTracking = true,
) {
    const defaultHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "local": locale,
        ...headers
    }

    const params = {
        method: method,
        url: `${prefixHost}${url}`,
        headers: defaultHeaders,
    };

    const isGet = (method) => {
        return method.toUpperCase() === 'GET'
    }

    if (responseType) {
        params['responseType'] = responseType
    }

    if (isGet(method)) {
        params['params'] = data || {};
    } else {
        params['data'] = data;
    }

    const promise = axios(params).then(response => {
        return response;
    }).catch(error => {
        //execute the status code enum and operation like logout , remove cookie when expired
        //Emitter.emit(EMITTER_EVENT.ACCESS_DENIED, error?.response?.data);
        if (error?.response?.status === 401 || error?.response?.status === 403) {
            CookieHelper.removeCookie(authenticationConstant.tokenKey);
            Utility.redirect('/login')
        }
        return error?.response?.data;
    });

    if (isGet(method) && isTracking) {
        trackPromise(promise)
    }

    return promise
}