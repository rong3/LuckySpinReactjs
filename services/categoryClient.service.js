import { request } from '../shared/packages/service-adapter/axios';

export const getListCategoryClient = (param) => {
    return request(
        'GET',
        `CategoryClient`,
        'vi', param?.payload?.header
    );
};

export const createCategoryClient = (data) => {
    return request(
        'POST',
        `CategoryClient`,
        'vi',
        data
    );
};

export const updateCategoryClient = (data) => {
    return request(
        'POST',
        `CategoryClient/update`,
        'vi',
        data
    );
};

export const removeCategoryClient = (id) => {
    return request(
        'DELETE',
        `CategoryClient/${id}`,
        'vi',
    );
};