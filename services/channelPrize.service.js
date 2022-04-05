import { request } from '../shared/packages/service-adapter/axios';

export const createChannelPrize = (data) => {
    return request(
        'POST',
        `ChannelPrize`,
        'vi',
        data
    );
};

export const updateChannelPrize = (data) => {
    return request(
        'POST',
        `ChannelPrize/update`,
        'vi',
        data
    );
};

export const removeChannelPrize = (id) => {
    return request(
        'DELETE',
        `ChannelPrize/${id}`,
        'vi',
    );
};

export const getChannelPrizeByWheelId=(id)=>{
    return request(
        'GET',
        `ChannelPrize/${id}`,
        'vi',
    );
}