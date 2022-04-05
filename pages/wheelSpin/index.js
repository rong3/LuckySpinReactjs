import Head from "next/head";
import React from "react";
import { useTranslation } from "react-i18next";
import CommonLayout from "../../shared/packages/layout/root-layout.package";
import { WHEEL_SPIN } from "../../utils/constant";
import WheelUIComponent from "../../component/luckyspin/module/wheelUI/wheelUIComponent"

export default function WheelSpinPage(props) {
    const { t } = useTranslation('common');
    return (
        <React.Fragment>
            <Head>
                <title>{t('mainMenu.dashboard')}</title>
            </Head>
            <WheelUIComponent {...props} />
        </React.Fragment>
    );
}

export async function getServerSideProps(router) {
    try {
        const { id } = router.query;
        console.log("SSR Example-Page id: " + id);
        return {
            props: {
                id: id ?? null,
            }
        };
    }
    catch (e) {
    }
}

WheelSpinPage.Layout = CommonLayout;
WheelSpinPage.Title = "Vong quay";
WheelSpinPage.Href = WHEEL_SPIN;
