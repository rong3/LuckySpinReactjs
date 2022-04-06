import { request } from '../shared/packages/service-adapter/axios';

export const loginGateway = (data) => {
    return request(
        'POST',
        `Account/authenticate`,
        'vi',
        data, {}, process.env.BASE_AUTH_URL
    );
};