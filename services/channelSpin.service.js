import { request } from '../shared/packages/service-adapter/axios';

export const getListChannelSpin = (param) => {
    return request(
        'GET',
        `ChannelSpin`,
        'vi', param?.payload?.header
    );
};

export const createChannelSpin = (data) => {
    return request(
        'POST',
        `ChannelSpin`,
        'vi',
        data
    );
};

export const updateChannelSpin = (data) => {
    return request(
        'POST',
        `ChannelSpin/update`,
        'vi',
        data
    );
};

export const removeChannelSpin = (id) => {
    return request(
        'DELETE',
        `ChannelSpin/${id}`,
        'vi',
    );
};