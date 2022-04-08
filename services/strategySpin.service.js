
import { request } from '../shared/packages/service-adapter/axios';

export const getListStrategySpin = () => {
    return request(
        'GET',
        `StrategySpin`
    );
};

export const getListStrategySpinbyId = (id) => {
    return request(
        'GET',
        `StrategySpin/data/${id}`
    );
};

export const updateStrategySpin = (data) => {
    return request(
        'POST',
        `StrategySpin/update`,
        'vi',
        data
    );
};

export const createStrategySpin = (data) => {
    return request(
        'POST',
        `StrategySpin`,
        'vi',
        data
    );
};

export const removeStrategySpin = (id) => {
    return request(
        'DELETE',
        `StrategySpin/${id}`,
        'vi',
    );
};