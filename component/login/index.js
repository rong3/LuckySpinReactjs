
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
        <>
            {
                auth.isAuthenticated ||
                <section className="row flexbox-container">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="row">
                            <div className="col-md-12">
                                <span>Email</span>
                                <input className="form-control" type="text" onChange={(e) => {
                                    const value = e?.target?.value;
                                    credential.email = value;
                                    setCredential({ ...credential });
                                }} />

                            </div>
                            <div className="col-md-12">
                                <span>Pass</span>
                                <input className="form-control" type="password" onChange={(e) => {
                                    const value = e?.target?.value;
                                    credential.password = value;
                                    setCredential({ ...credential });
                                }} />
                            </div>
                            <div className="col-md-12">
                                <br />
                                <LoadingButton className="btn btn-info" isLoading={isLoading} onClick={login}>Log in</LoadingButton>
                            </div>
                        </div>
                    </div>
                </section>
            }
            {
                auth.isAuthenticated &&
                <section className="row flexbox-container">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <span>Đang đăng nhập...</span>
                    </div>
                </section>
            }
        </>
    );
}

export default Login;
