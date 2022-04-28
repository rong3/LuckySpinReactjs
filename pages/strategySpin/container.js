import Head from "next/head";
import React from "react";
import { useTranslation } from "react-i18next";
import CommonLayout from "../../shared/packages/layout/root-layout.package";
import StrategyContainer from "../../component/dashboard/subcomponent/strategyContainer/strategyContainer"

export default function StrategySpinPage(props) {
    const { t } = useTranslation('common');
    return (
        <React.Fragment>
            <Head>
                <title>{t('mainMenu.dashboard')}</title>
            </Head>
            <StrategyContainer {...props} />
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


StrategySpinPage.Layout = CommonLayout;
StrategySpinPage.Title = "Chiến lược";
StrategySpinPage.Href = "/strategySpin/container";
