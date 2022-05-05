import React, { useState, useEffect } from "react";
import DynamicLink from "../../../common/DynamicLink/DynamicLink";
import StepBar from "../../../common/StepBar/StepBar"
import { useRouter } from 'next/router'
import CreateStrategy from "./component/createStrategy/createStrategy"
import GroupAllocation from "./component/groupAllocation/groupAllocation"
import { masterData } from "../../masterData";

const StrategyContainer = (props) => {
    const { id, strategySSR } = props;
    const router = useRouter()
    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }
    const [containerData, setContainerData] = useState({
        step: 1,
        strategySpin: null,
    })

    const updateStepValue = (value) => {
        containerData.step = value;
        setContainerData({ ...containerData })
    }


    const stepDirectComponent = (step, extensionData = null) => {
        switch (step) {
            case 1: return <CreateStrategy material={{
                masterData: masterData,
                strategySSR: strategySSR,
                containerData: containerData,
                updateStepValue: updateStepValue
            }} />
            case 2: return <GroupAllocation material={{
                masterData: masterData,
                strategySSR: strategySSR,
                containerData: containerData,
                updateStepValue: updateStepValue
            }} />
            default: return <></>
        }
    }

    return (
        <>
            <StepBar containerData={containerData} {...props} />
            {
                stepDirectComponent(containerData.step)
            }
        </>
    );
}
export default StrategyContainer;