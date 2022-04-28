import React, { useEffect } from "react";
import { masterConfig } from "../../../config/master"
import Head from "next/head";
import withAuth from "../hocs/authHOC";
import DynamicLink from "../../../component/common/DynamicLink/DynamicLink";

const CommonLayout = ({ children }) => {
    const commonProps = {}
    return (
        <React.Fragment>
            <body class="homepage">
                {React.cloneElement(masterConfig.themeNavbar, { ...commonProps })}
                <main>
                    <div class="wrapper-main">
                        <div id="sidebar-nav">
                            <div class="open-sidebar"> <em class="material-icons">keyboard_arrow_right</em></div>
                            <div class="sidebar">
                                <ul class="side-nav">
                                    <li class="side-item active">
                                        <DynamicLink href="/" as="/">
                                            <a>
                                                <img class="icon" src="/asset/images/icons/side-2.svg" alt="" />
                                                <span>Chiến lược</span>
                                            </a>
                                        </DynamicLink>
                                    </li>
                                    <li class="side-item">
                                        <DynamicLink href="/" as="/">
                                            <a>
                                                <img class="icon" src="/asset/images/icons/side-3.svg" alt="" />
                                                <span>Tập khách hàng</span>
                                            </a>
                                        </DynamicLink>
                                    </li>
                                    <li class="side-item">
                                        <DynamicLink href="/" as="/">
                                            <a>
                                                <img class="icon" src="/asset/images/icons/side-4.svg" alt="" />
                                                <span>Giao diện & Giải thưởng</span>
                                            </a>
                                        </DynamicLink>
                                    </li>
                                    <li class="side-item">
                                        <DynamicLink href="/" as="/">
                                            <a>
                                                <img class="icon" src="/asset/images/icons/side-5.svg" alt="" />
                                                <span>Lịch sử chiến lược</span>
                                            </a>
                                        </DynamicLink>
                                    </li>
                                    <hr />
                                    <li class="side-item">
                                        <DynamicLink href="/strategySpin" as="/strategySpin">
                                            <a>
                                                <img class="icon" src="/asset/images/icons/side-5.svg" alt="" />
                                                <span>Chiến lược cũ</span>
                                            </a>
                                        </DynamicLink>
                                    </li>
                                    <li class="side-item">
                                        <DynamicLink href="/proxyAllocationGroup" as="/proxyAllocationGroup">
                                            <a>
                                                <img class="icon" src="/asset/images/icons/side-5.svg" alt="" />
                                                <span>Tập khách hàng cũ</span>
                                            </a>
                                        </DynamicLink>
                                    </li>
                                    <li class="side-item">
                                        <DynamicLink href="/wheelSpin" as="/wheelSpin">
                                            <a>
                                                <img class="icon" src="/asset/images/icons/side-5.svg" alt="" />
                                                <span>Giao diện và giải thưởng cũ</span>
                                            </a>
                                        </DynamicLink>
                                    </li>
                                    <li class="side-item">
                                        <DynamicLink href="/logSpin" as="/logSpin">
                                            <a>
                                                <img class="icon" src="/asset/images/icons/side-5.svg" alt="" />
                                                <span>Lịch sử cũ</span>
                                            </a>
                                        </DynamicLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {children}
                    </div>
                </main>
                <div id="overlay"></div>
            </body>
        </React.Fragment>
    );
}
export default withAuth(CommonLayout);