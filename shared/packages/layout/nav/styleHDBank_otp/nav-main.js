import React, { useEffect, useState } from 'react';
import { masterConfig } from "../../../../../config/master"
import { useAuth } from "../../../provider/authBase"
import { useRouter } from 'next/router'
import DynamicLink from "../../../../../component/common/DynamicLink/DynamicLink"

function NavBarStyle360(props) {
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
        var e = document.querySelector(".btn-hamburger-lines"),
            t = document.querySelector("#sidebar-nav"),
            s = document.querySelector("#overlay"),
            i = document.querySelector("#btn-search"),
            n = document.querySelector(".wrap-form .close");
        e.onclick = function () {
            console.log("test"), e.classList.toggle("is-active"), t.classList.toggle("is-open"), s.classList.toggle("active")
        }, s.onclick = function () {
            e.classList.remove("is-active"), t.classList.remove("is-open"), s.classList.remove("active")
        }, i && (i.onclick = function () {
            document.querySelector(".wrap-form").classList.toggle("is-open"), i.classList.toggle("active")
        }, n.onclick = function () {
            document.querySelector(".wrap-form").classList.remove("is-open"), i.classList.remove("active")
        })
    }, [])

    return (
        <header>
            <div class="wrap-header d-flex align-items-center">
                <div class="wrap-header-left d-flex align-items-center">
                    <a class="wrap-header-left_icon d-flex align-items-center justify-content-center" href="/">
                        <img src="/asset/images/icons/window.svg" alt="" />
                    </a>
                    <h1>
                        <DynamicLink href="/" as="/">
                            <a class="wrap-header-left_logo" href="/">
                                <img src="/asset/images/logo.svg" alt="" />
                            </a>
                        </DynamicLink>
                    </h1>
                </div>
                <div class="wrap-header-center">
                    <div class="caption">
                        <p>Quản lý vòng quay may mắn</p>
                    </div>
                </div>
                <div class="wrap-header-right d-flex align-items-center ms-auto">
                    <div class="wrap-list-user">
                        <ul class="d-flex align-items-center">
                            {/* <li class="nav-item">
                                <DynamicLink href="/" as="/">
                                    <a class="username d-flex align-items-center">
                                        <p>Khoa </p><img src="/asset/images/avatar.png" alt="" />
                                    </a>
                                </DynamicLink>
                            </li> */}
                            <li class="nav-item">
                                <a class="logout" onClick={() => {
                                    auth.signout().then((res) => {
                                        setTimeout(() => {
                                            router.push("/login");
                                        }, 2000);
                                    });
                                }}>
                                    <img src="/asset/images/icons/logout.svg" alt="" />
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="menu-toggle d-flex align-items-center">
                        <div class="btn btn-hamburger-lines"><span> </span><span> </span><span> </span><span></span></div>
                    </div>
                </div>
            </div>
        </header>
    )
}

NavBarStyle360.propTypes = {
};

NavBarStyle360.defaultProps = {
};

export default NavBarStyle360;
