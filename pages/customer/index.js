import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import CommonLayout from "../../shared/packages/layout/root-layout.package";
import CustomerComponent from "../../component/customer/customer"
import { useRouter } from 'next/router'
import Script from 'next/script'

export default function CustomerPage(props) {
    const { t } = useTranslation('common');
    const router = useRouter()

    return (
        <React.Fragment>
            <Head>
                <title>{"Nhóm khách hàng"}</title>
            </Head>
            <CustomerComponent {...props} />
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


CustomerPage.Layout = CommonLayout;
CustomerPage.Title = "Quản lý nhóm khách hàng";
