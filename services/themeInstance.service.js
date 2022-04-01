import { request } from '../shared/packages/service-adapter/axios';

export const getListTheme = (param) => {
    return request(
        'GET',
        `ThemeInstance`,
        'vi', param?.payload?.header
    );
};