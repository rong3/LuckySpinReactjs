import { request } from '../shared/packages/service-adapter/axios';

export const getListWheel = (param) => {
    return request(
        'GET',
        `WheelInstance`,
        'vi', param?.payload?.header
    );
};