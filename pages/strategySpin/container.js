import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import CommonLayout from "../../shared/packages/layout/root-layout.package";
import StrategyContainer from "../../component/dashboard/subcomponent/strategyContainer/strategyContainer"
import { getListStrategySpinAdminbyId } from "../../services/strategySpin.service"
import { useRouter } from 'next/router'

export default function StrategySpinPage(props) {
    const { t } = useTranslation('common');
    const [data, setData] = useState(null);
    const router = useRouter()
    useEffect(() => {
        async function fetchMyAPI() {
            let res = await getListStrategySpinAdminbyId(router?.query?.id);
            const dataRes = res?.data?.data;
            setData(dataRes)
        }
        fetchMyAPI()
    }, [])

    return (
        <React.Fragment>
            <Head>
                <title>{t('mainMenu.dashboard')}</title>
            </Head>
            <StrategyContainer {...props} strategySSR={data} />
        </React.Fragment>
    );
}

export async function getServerSideProps(router) {
    try {
        const { id } = router.query;
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
