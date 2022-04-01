import Head from "next/head";
import React from "react";
import { useTranslation } from "react-i18next";
import CommonLayout from "../../shared/packages/layout/root-layout.package";
import { CHANNEL_SPIN } from "../../utils/constant";
import ChannelSpinComponent from "../../component/luckyspin/module/channel/channelSpinComponent"

export default function ChannelSpinPage(props) {
    const { t } = useTranslation('common');
    return (
        <React.Fragment>
            <Head>
                <title>{t('mainMenu.dashboard')}</title>
            </Head>
            <ChannelSpinComponent {...props} />
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

ChannelSpinPage.Layout = CommonLayout;
ChannelSpinPage.Title = "Chiến lược";
ChannelSpinPage.Href = CHANNEL_SPIN;
