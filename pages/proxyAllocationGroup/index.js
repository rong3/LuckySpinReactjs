import Head from "next/head";
import React from "react";
import { useTranslation } from "react-i18next";
import CommonLayout from "../../shared/packages/layout/root-layout.package";
import { PROXY_ALLOCATION_GROUP } from "../../utils/constant";
import ProxyAllocationComponent from "../../component/luckyspin/module/proxyAllocationGroup/proxyAllocationGroup"

export default function ProxyAllocationPage(props) {
    const { t } = useTranslation('common');
    return (
        <React.Fragment>
            <Head>
                <title>{t('mainMenu.dashboard')}</title>
            </Head>
            <ProxyAllocationComponent {...props} />
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

ProxyAllocationPage.Layout = CommonLayout;
ProxyAllocationPage.Title = "Chiến lược";
ProxyAllocationPage.Href = PROXY_ALLOCATION_GROUP;
