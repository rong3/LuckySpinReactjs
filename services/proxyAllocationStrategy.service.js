
import { request } from '../shared/packages/service-adapter/axios';

export const getProxyAllocationStrategy = (data) => {
    return request(
        'POST',
        `ProxyAllocationStrategy/findKey`,
        'vi', data
    );
};

export const updateProxyStrategy = (data) => {
    return request(
        'POST',
        `ProxyAllocationStrategy/update`,
        'vi',
        data
    );
};
