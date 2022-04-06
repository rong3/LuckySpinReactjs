import { request } from '../shared/packages/service-adapter/axios';

export const getListTheme = (param) => {
    return request(
        'GET',
        `ThemeInstance`,
        'vi', param?.payload?.header
    );
};

export const createTheme= (data) => {
    return request(
        'POST',
        `ThemeInstance`,
        'vi',
        data
    );
};

export const updateTheme = (data) => {
    return request(
        'POST',
        `ThemeInstance/update`,
        'vi',
        data
    );
};

export const removeTheme = (id) => {
    return request(
        'DELETE',
        `ThemeInstance/${id}`,
        'vi',
    );
};