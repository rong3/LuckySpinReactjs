import { request } from '../shared/packages/service-adapter/axios';

export const getListWheel = (param) => {
    return request(
        'GET',
        `WheelInstance`,
        'vi', param?.payload?.header
    );
};

export const createWheelSpin = (data) => {
    return request(
        'POST',
        `WheelInstance`,
        'vi',
        data
    );
};

export const updateWheelSpin = (data) => {
    return request(
        'POST',
        `WheelInstance/update`,
        'vi',
        data
    );
};

export const removeWheelSpin = (id) => {
    return request(
        'DELETE',
        `WheelInstance/${id}`,
        'vi',
    );
};