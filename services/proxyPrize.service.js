
import { request } from '../shared/packages/service-adapter/axios';

export const getProxyPrize = (data) => {
    return request(
        'POST',
        `ProxyStrategyPrize/findKey`,
        'vi', data
    );
};



export const getProxyPrizeAdmin = (data) => {
    return request(
        'POST',
        `ProxyStrategyPrize/admin/findKey`,
        'vi', data
    );
};


export const createProxyPrize = (data) => {
    return request(
        'POST',
        `ProxyStrategyPrize`,
        'vi',
        data
    );
};

export const updateProxyPrize = (data) => {
    return request(
        'POST',
        `ProxyStrategyPrize/update`,
        'vi',
        data
    );
};
