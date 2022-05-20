import Head from "next/head";
import React from "react";
import { useTranslation } from "react-i18next";
import CommonLayout from "../../shared/packages/layout/root-layout.package";
import { LOGSPIN } from "../../utils/constant";
import LogSpinComponent from "../../component/luckyspin/module/logSpin/logSpinComponent"

export default function LogSpinPage(props) {
    const { t } = useTranslation('common');
    return (
        <React.Fragment>
            <Head>
                <title>Lịch sử vòng quay</title>
            </Head>
            <LogSpinComponent {...props} />
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

LogSpinPage.Layout = CommonLayout;
LogSpinPage.Title = "Chiến lược";
LogSpinPage.Href = LOGSPIN;
