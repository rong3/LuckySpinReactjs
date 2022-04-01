import React, { useEffect, useState, useRef } from "react";
import NonLayout from "/shared/packages/layout/non-layout";
import LuckySpinComponent from "../../../component/embedded/lucky-spin/luckySpin"
import $ from "jquery"

const LuckySpin = (props) => {
    const sizeBrowserCache = useRef(typeof window !== "undefined" && window.innerWidth)
    const detectMetaViewPort = (size) => {
        if (size < 768) {
            return <meta name="viewport"
                content="width=device-width; initial-scale=0.65; user-scalable=no" />
        }
        else {
            return <meta name="viewport"
                content="width=device-width; initial-scale=1.3; user-scalable=no" />
        }
    }

    const updateWindowDimensions = () => {
        clearTimeout(window.resizedFinished);
        window.resizedFinished = setTimeout(function () {
            const changeSize = window.innerWidth;
            if (sizeBrowserCache.current !== changeSize) {
                sizeBrowserCache.current = window.innerWidth
            }
        }, 0);
    };

    useEffect(() => {
        $(window).resize(updateWindowDimensions);
        return () => $(window).off("resize", updateWindowDimensions);
    }, [])

    return (
        <React.Fragment>
            <head>
                {
                    detectMetaViewPort(sizeBrowserCache.current)
                }
                <title>HDBank Lucky Spin</title>
                <link rel="stylesheet" type="text/css" href="/asset/images/luckyspin/theme/HDbank/css/hdbank_wheel.min.css" />
            </head>
            <NonLayout>
                <LuckySpinComponent />
            </NonLayout>
        </React.Fragment>
    );
}


export default LuckySpin