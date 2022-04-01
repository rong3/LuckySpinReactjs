
import { request } from '../shared/packages/service-adapter/axios';

export const getListSProxyAllocationGroup = (param) => {
    return request(
        'GET',
        `ProxyAllocationGroup`,
        'vi', param?.payload?.header
    );
};

export const updateProxyGroup = (data) => {
    return request(
        'POST',
        `ProxyAllocationGroup/update`,
        'vi',
        data
    );
};
export const createProxyGroup = (data) => {
    return request(
        'POST',
        `ProxyAllocationGroup`,
        'vi',
        data
    );
};

export const deleteProxyGroup = (id) => {
    return request(
        'DELETE',
        `ProxyAllocationGroup/${id}`,
        'vi'
    );
};