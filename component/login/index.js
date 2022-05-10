
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../../shared/packages/provider/authBase";
import LoadingButton from "../../shared/packages/control/button/loadingButton";
import { useRouter } from 'next/router'
import Utility from "../../shared/packages/utils/common"
import { ROOT } from "../../utils/constant"
import { useToasts } from "react-toast-notifications";

const Login = () => {
    const { language } = useSelector((state) => state.app);
    const auth = useAuth();
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);
    const { addToast } = useToasts();
    const [credential, setCredential] = useState({
        email: null,
        password: null
    })

    useEffect(() => {
        if (auth.isAuthenticated) {
            Utility.redirect(ROOT)
        }
    }, [])

    let login = () => {
        setIsLoading(true);
        auth.signin(credential).then((res) => {
            addToast(<div className="text-center">
                Đăng nhập thành công
            </div>, { appearance: 'success' });
            setTimeout(() => {
                router.push("/");
                setIsLoading(false);
            }, 2000);

        }).catch((err) => {
            setIsLoading(false);
            console.log({ err });
            addToast(<div className="text-center">
                {err}
            </div>, { appearance: 'error' });
        });
    };

    let logout = () => {
        setIsLoading(true);
        auth.signout().then((res) => {
            setTimeout(() => {
                router.push("/login");
                setIsLoading(false);
            }, 2000);
        });
    };

    return (
        <section class="login-bg">
            {
                isLoading ?
                    <div id="loading-container">
                        <div class="loading-wrapper">
                            <div id="loading-logo">
                                <div class="loading-spinner-rolling">
                                    <div class="ldio">
                                        <div></div>
                                    </div>
                                </div>
                            </div>
                            <div class="progress-status">Đang đăng nhập</div>
                        </div>
                    </div>
                    :
                    <div class="wrapper-container d-flex align-items-center">
                        <div class="wrapper-left">
                            <div class="logo"> <a href=""><img src="/asset/images/logo.png" alt="" /></a></div>
                            <div class="img-bg"><img src="/asset/images/login-bg.png" alt="" /></div>
                        </div>
                        <div class="wrapper-right">
                            <div class="wrapper-content">
                                <div class="wrap-header d-flex">
                                    <div class="title-login">
                                        <p>Chào mừng bạn đến với </p>
                                        <h1>Admin Lucky Draw</h1>
                                    </div>
                                </div>
                                <form class="wrap-form">
                                    <div class="form-group d-flex">
                                        <label for="">Tên Đăng Nhập</label>
                                        <input class="form-control" type="text" onChange={(e) => {
                                            const value = e?.target?.value;
                                            credential.email = value;
                                            setCredential({ ...credential });
                                        }}
                                            onKeyPress={event => {
                                                if (event.key === 'Enter') {
                                                    login();
                                                }
                                            }}
                                            placeholder="Nhập tên user" />
                                    </div>
                                    <div class="form-group d-flex">
                                        <label for="">Nhập Mật khẩu</label>
                                        <input class="form-control" type="password" placeholder="Nhập mật khẩu"
                                            onChange={(e) => {
                                                const value = e?.target?.value;
                                                credential.password = value;
                                                setCredential({ ...credential });
                                            }}
                                            onKeyPress={event => {
                                                if (event.key === 'Enter') {
                                                    login();
                                                }
                                            }}
                                        />
                                        <img class="icon" src="/asset/images/icons/eye.svg" alt="" />
                                    </div>
                                    <button class="btn btn-submit" onClick={login} type="button">
                                        <span>Đăng Nhập</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
            }

        </section>
    );
}

export default Login;
