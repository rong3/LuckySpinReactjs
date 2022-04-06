
import { request } from '../shared/packages/service-adapter/axios';

export const getLogSpin = (data) => {
    return request(
        'POST',
        `LogSpin/findKey`,
        'vi', data
    );
};
