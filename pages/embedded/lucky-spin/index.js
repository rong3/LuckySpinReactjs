import React, { useEffect, useState, useRef } from "react";
import NonLayout from "/shared/packages/layout/non-layout";
import LuckySpinComponent from "../../../component/embedded/lucky-spin/luckySpin"
import $ from "jquery"
import { getListStrategySpinbyId } from "../../../services/strategySpin.service"
import { getProxyPrize } from "../../../services/proxyPrize.service"
import { useRouter } from 'next/router'

export default function LuckySpin(props) {
    const sizeBrowserCache = useRef(typeof window !== "undefined" && window.innerWidth)
    const [currentSize, setCurrentSize] = useState(sizeBrowserCache.current);
    const router = useRouter()
    const [data, setData] = useState(null);
    const detectMetaViewPort = (size) => {
        if (size < 768) {
            return <meta name="viewport"
                content="width=device-width; initial-scale=0.65; user-scalable=no" />
        }
        if (size > 768 && size < 1300) {
            return <meta name="viewport"
                content="width=device-width; initial-scale=0.85; user-scalable=no" />
        }
        else {
            return <meta name="viewport"
                content="width=device-width; initial-scale=1; user-scalable=no" />
        }
    }

    const updateWindowDimensions = () => {
        clearTimeout(window.resizedFinished);
        window.resizedFinished = setTimeout(function () {
            const changeSize = window.innerWidth;
            if (sizeBrowserCache.current !== changeSize) {
                setCurrentSize(changeSize)
                sizeBrowserCache.current = window.innerWidth
            }
        }, 0);
    };

    useEffect(() => {
        async function fetchMyAPI() {
            let res = await getListStrategySpinbyId(router?.query?.id);
            const dataRes = res?.data?.data;
            const getchannelPrizesIds = dataRes?.groupChannelPrize?.channelPrizes?.map(x => x.id) ?? [];
            const getProxyPrizeAttribute = await getProxyPrize({
                "strategySpinId": router?.query?.id,
                "channelPrizeIds": getchannelPrizesIds
            })
            if (getProxyPrizeAttribute) {
                try {
                    const _mergeData = { ...dataRes, proxyPrizeAtribute: [...getProxyPrizeAttribute?.data?.data] }
                    setData(_mergeData)
                }
                catch { }
            }
        }

        fetchMyAPI()

        $(window).resize(updateWindowDimensions);
        return () => $(window).off("resize", updateWindowDimensions);
    }, [])

    return (
        <React.Fragment>
            <head>
                {
                    detectMetaViewPort(currentSize)
                }
                <title>HDBank Lucky Spin</title>
                <link rel="stylesheet" type="text/css" href="/asset/images/luckyspin/theme/HDbank/css/hdbank_wheel.min.css" />
            </head>
            <NonLayout>
                {
                    data &&
                    <LuckySpinComponent {...props} data={data} />
                }

            </NonLayout>
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

LuckySpin.Title = "Chiến lược";

