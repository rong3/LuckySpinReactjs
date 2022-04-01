import Head from "next/head";
import React from "react";
import { useTranslation } from "react-i18next";
import CommonLayout from "../../shared/packages/layout/root-layout.package";
import { STRATEGY_SPIN } from "../../utils/constant";
import StrategySpinComponent from "../../component/luckyspin/module/strategySpin/strategySpinComponent"

export default function StrategySpinPage(props) {
    const { t } = useTranslation('common');
    return (
        <React.Fragment>
            <Head>
                <title>{t('mainMenu.dashboard')}</title>
            </Head>
            <StrategySpinComponent {...props} />
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

//TODO: find a solution to connect SSR to redux store
// export const getServerSideProps = wrapper.getServerSideProps(async ({ req, res, store, router }) => {
//     // const state = store.getState();
//     const { id } = router.query;
//     console.log("SSR Example-Page id: " + id);
//     console.log('state', state);
//     return {
//         props: {
//             id: id ?? null,
//         }
//     };
// });

StrategySpinPage.Layout = CommonLayout;
StrategySpinPage.Title = "Chiến lược";
StrategySpinPage.Href = STRATEGY_SPIN;
