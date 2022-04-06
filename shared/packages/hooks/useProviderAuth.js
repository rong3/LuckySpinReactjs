import React, { useEffect, useState } from "react";
import { getUserDetails } from "../../../services";
import { authenticationConstant } from "../globalConstant/authenticationConstant"
import { CookieHelper } from "../utils/cookie"
import { TYPELAYOUT } from "../globalConstant/common"
import { masterConfig } from "../../../config/master"
import { loginGateway } from "../../../services/auth.service"

export function useProvideAuth(props) {
    const [user, setUser] = useState(null);

    const checkTokenMiddleWare = () => {
        if (masterConfig.type === TYPELAYOUT.WEB_APP) {
            const token = CookieHelper.getCookie(authenticationConstant.tokenKey);
            if (token) {
                setUser(null);
                return true
            }
            else {
                setUser([]);
                return false
            }
        }
        else {
            setUser(null);
            return true;
        }
    }

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return checkTokenMiddleWare();
    });


    // signin method: It can either return a promise or execute a callback function.
    // You can prefer to keep this in userServices.js
    const signin = (credentials) => {
        console.log("SS:: PrivateRoute > useProviderAuth > signin() called...");
        return new Promise((resolve, reject) => {
            try {
                loginGateway(credentials).then((res) => {
                    if (res?.data?.succeeded) {
                        const data = res?.data?.data;
                        const accessToken = data?.jwToken;
                        CookieHelper.setCookie(authenticationConstant.tokenKey, accessToken);
                        setUser({
                            id: data?.id,
                            userName: data?.userName,
                            email: data?.email,
                            roles: data?.roles
                        });
                        setIsAuthenticated(true)
                        resolve(res);
                    }
                    else {
                        setUser([]);
                        setIsAuthenticated(false)
                        reject(res?.Message);
                    }
                })
            } catch (error) {
                console.error("signin error!==", error);
                setIsAuthenticated(false);
                reject("signin error!");
            }
        });
    };
    const signout = () => {
        return new Promise((resolve, reject) => {
            try {
                // do API endpoint axios call here and return the promise.
                setUser(null);
                setIsAuthenticated(false)
                CookieHelper.removeCookie(authenticationConstant.tokenKey);
                resolve(true);
            } catch (error) {
                console.error("signout error!==", error);
                reject("signout error!");
            }
        });
    };

    return {
        user,
        isAuthenticated,
        signin,
        signout,
    };
}
