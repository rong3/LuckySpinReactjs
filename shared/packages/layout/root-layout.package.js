import React, { useEffect } from "react";
import { masterConfig } from "../../../config/master"
import Head from "next/head";
import withAuth from "../hocs/authHOC";
import SideBarComponent from "./sidebar/sidebar"

const CommonLayout = ({ children }) => {
    const commonProps = {}
    return (
        <React.Fragment>
            <body class="homepage">
                {React.cloneElement(masterConfig.themeNavbar, { ...commonProps })}
                <main>
                    <div class="wrapper-main">
                        <div id="sidebar-nav">
                            {
                                <SideBarComponent />
                            }
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