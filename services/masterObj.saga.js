import { request } from '../shared/packages/service-adapter/axios';

export const getListMasterObj = (param) => {
    return request(
        'GET',
        `MasterObjectAllocation`,
        'vi', param?.payload?.header
    );
};

export const createMasterObj= (data) => {
    return request(
        'POST',
        `MasterObjectAllocation`,
        'vi',
        data
    );
};

export const updateMasterObj= (data) => {
    return request(
        'POST',
        `MasterObjectAllocation/update`,
        'vi',
        data
    );
};

export const removeMasterObj = (id) => {
    return request(
        'DELETE',
        `MasterObjectAllocation/${id}`,
        'vi',
    );
};