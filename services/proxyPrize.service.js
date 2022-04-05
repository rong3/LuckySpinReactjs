
import { request } from '../shared/packages/service-adapter/axios';

export const getProxyPrize = (data) => {
    return request(
        'POST',
        `ProxyStrategyPrize/findKey`,
        'vi', data
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
