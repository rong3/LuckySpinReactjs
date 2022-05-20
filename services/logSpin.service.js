
import { request } from '../shared/packages/service-adapter/axios';

export const getLogSpin = (data) => {
    return request(
        'POST',
        `LogSpin/findKey`,
        'vi', data
    );
};


export const spinService = (data) => {
    return request(
        'POST',
        `LogSpin/spin`,
        'vi', data
    );
};

export const deleteLogSpinService = (id) => {
    return request(
        'DELETE',
        `LogSpin/${id}`,
        'vi'
    );
};

