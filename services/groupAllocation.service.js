import { request } from '../shared/packages/service-adapter/axios';

export const getListGroupAllocation = (param) => {
    return request(
        'GET',
        `GroupAllocation`,
        'vi', param?.payload?.header
    );
};

export const getGroupAllocationById = (id) => {
    return request(
        'GET',
        `GroupAllocation/${id}`,
        'vi'
    );
};


export const createGroupAllocation= (data) => {
    return request(
        'POST',
        `GroupAllocation`,
        'vi',
        data
    );
};

export const updateGroupAllocation = (data) => {
    return request(
        'POST',
        `GroupAllocation/update`,
        'vi',
        data
    );
};

export const removeGroupAllocation = (id) => {
    return request(
        'DELETE',
        `GroupAllocation/${id}`,
        'vi',
    );
};