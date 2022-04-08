import { request } from '../shared/packages/service-adapter/axios';


export const authGateWayMasterSelected = (data) => {
    return request(
        'POST',
        `MasterAllocationSelected/authGatewaySelected`,
        'vi', data
    );
};

export const getListMasterAllocationSelected = (param) => {
    return request(
        'GET',
        `MasterAllocationSelected`,
        'vi', param?.payload?.header
    );
};

export const createMasterAllocationSelected = (data) => {
    return request(
        'POST',
        `MasterAllocationSelected`,
        'vi',
        data
    );
};

export const updateMasterAllocationSelected = (data) => {
    return request(
        'POST',
        `MasterAllocationSelected/update`,
        'vi',
        data
    );
};

export const removeMasterAllocationSelected= (id) => {
    return request(
        'DELETE',
        `MasterAllocationSelected/${id}`,
        'vi',
    );
};