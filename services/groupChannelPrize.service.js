import { request } from '../shared/packages/service-adapter/axios';

export const getListGroupChannelPrize = (param) => {
    return request(
        'GET',
        `GroupChannelPrize`,
        'vi', param?.payload?.header
    );
};

export const createGroupChannelPrize = (data) => {
    return request(
        'POST',
        `GroupChannelPrize`,
        'vi',
        data
    );
};

export const updateGroupChannelPrize = (data) => {
    return request(
        'POST',
        `GroupChannelPrize/update`,
        'vi',
        data
    );
};

export const removeGroupChannelPrize = (id) => {
    return request(
        'DELETE',
        `GroupChannelPrize/${id}`,
        'vi',
    );
};