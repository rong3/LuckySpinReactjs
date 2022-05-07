import React, { useState, useEffect } from "react";
import DynamicLink from "../../../common/DynamicLink/DynamicLink";
import StepBar from "../../../common/StepBar/StepBar"
import { useRouter } from 'next/router'
import CreateStrategy from "./component/createStrategy/createStrategy"
import GroupAllocation from "./component/groupAllocation/groupAllocation"
import GroupChannelPrize from "./component/groupChannelPrize/groupChannelPrize"
import UIWheel from "./component/uiWheel/uiWheel"
import { masterData } from "../../masterData";
import { getListStrategySpinAdminbyId } from "../../../../services/strategySpin.service"

const StrategyContainer = (props) => {
    const { id } = props;
    const router = useRouter()
    const [data, setData] = useState(null);
    const [isInternalModeParent, setIsInternalModeParent] = useState(false);

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

    async function loadDataStrategy(id) {
        if (id) {
            let res = await getListStrategySpinAdminbyId(id);
            const dataRes = res?.data?.data;
            setData(dataRes)
        }
    }

    useEffect(() => {
        async function fetchMyAPI() {
            await loadDataStrategy(id)
        }
        fetchMyAPI()
    }, [id])

    const stepDirectComponent = (step, extensionData = null) => {
        const genericProps = {
            masterData: masterData,
            strategySSR: data,
            containerData: containerData,
            isInternalModeParent: isInternalModeParent,
            updateStepValue: updateStepValue,
            refreshStrategyData: loadDataStrategy,
            setIsInternalModeParent: setIsInternalModeParent,
        }
        if (isInternalModeParent) {
            switch (step) {
                case 1: return <CreateStrategy material={{ ...genericProps }} />
                case 2: return <GroupChannelPrize material={{ ...genericProps }} />
                case 3: return <UIWheel material={{ ...genericProps }} />
                default: return <></>
            }
        }
        else {
            switch (step) {
                case 1: return <CreateStrategy material={{ ...genericProps }} />
                case 2: return <GroupAllocation material={{ ...genericProps }} />
                case 3: return <GroupChannelPrize material={{ ...genericProps }} />
                case 4: return <UIWheel material={{ ...genericProps }} />
                default: return <></>
            }
        }
    }

    return (
        <>
            <StepBar containerData={containerData}
                isInternalModeParent={isInternalModeParent}
                {...props} />
            {
                stepDirectComponent(containerData.step)
            }
        </>
    );
}
export default StrategyContainer;