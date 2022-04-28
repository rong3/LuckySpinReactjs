
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
        <section class="login-section">
            <div class="wrapper-container d-flex align-items-center justify-content-center">
                <div class="wrap-login d-flex align-items-center justify-content-center">
                    <div class="wrap-left">
                        <figure>
                            <img src="/asset/images/login-bg.png" alt="" />
                            <figcaption>
                                <p class="desc">Amet minim mollit non deserunt ullamco <br />est sit aliqua dolor do amet sint.</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="wrap-right">
                        <form class="wrap-form">
                            <div class="caption">
                                <h1>Chào mừng đến &nbsp;<span>Admin panel</span></h1>
                                <p>Nhập thông tin đăng nhập</p>
                            </div>
                            <div class="form-group">
                                <input class="form-control" type="text" placeholder="User name" onChange={(e) => {
                                    const value = e?.target?.value;
                                    credential.email = value;
                                    setCredential({ ...credential });
                                }} />
                            </div>
                            <div class="form-group">
                                <input class="form-control" id="core" type="password" placeholder="Password"
                                    onChange={(e) => {
                                        const value = e?.target?.value;
                                        credential.password = value;
                                        setCredential({ ...credential });
                                    }}
                                />
                                <img class="show-pass" src="/asset/images/icons/eye.svg" alt="" />
                            </div>
                            <div class="form-group">
                                <input id="remember" type="checkbox" />
                                <label class="label-remember" for="remember">Nhớ trạng thái đăng nhập</label>
                            </div>
                            <button type="button" class="btn btn-submit" onClick={login}> <span>Đăng nhập</span></button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="footer-section">
                <div class="footer-content">
                    <div class="flower"> <img src="/asset/images/flower.png" alt="" /></div>
                </div>
            </div>
        </section>
    );
}

export default Login;
