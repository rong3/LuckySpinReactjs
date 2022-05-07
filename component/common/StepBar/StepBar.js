import React, { useState, useEffect } from "react";

const StepBar = (props) => {
    const { containerData, isInternalModeParent } = props;
    const [stepLevel, setStepLevel] = useState([]);

    useEffect(() => {
        stepLevel?.forEach(element => {
            if (element.step > containerData?.step) {
                element.active = false
            }
            else {
                element.active = true
            }
        });
        setStepLevel([...stepLevel])
    }, [containerData])

    useEffect(() => {
        if (isInternalModeParent) {
            setStepLevel(
                [
                    {
                        step: 1,
                        stepName: "Bước 1",
                        stepDesc: "Tạo chiến lược",
                        iconCreated: "/asset/images/icons/c-1.svg",
                        iconDisabled: "/asset/images/icons/d-1.svg",
                        iconFinished: "/asset/images/icons/f-1.svg",
                        active: true
                    },

                    {
                        step: 2,
                        stepName: "Bước 2",
                        stepDesc: "Chọn nhóm Giải thưởng",
                        iconCreated: "/asset/images/icons/c-3.svg",
                        iconDisabled: "/asset/images/icons/d-3.svg",
                        iconFinished: "/asset/images/icons/f-3.svg",
                        active: false
                    },
                    {
                        step: 3,
                        stepName: "Bước 3",
                        stepDesc: "Chọn giao diện vòng quay",
                        iconCreated: "/asset/images/icons/c-4.svg",
                        iconDisabled: "/asset/images/icons/d-4.svg",
                        iconFinished: "/asset/images/icons/f-4.svg",
                        active: false
                    }
                ]
            )
        }
        else {
            setStepLevel([
                {
                    step: 1,
                    stepName: "Bước 1",
                    stepDesc: "Tạo chiến lược",
                    iconCreated: "/asset/images/icons/c-1.svg",
                    iconDisabled: "/asset/images/icons/d-1.svg",
                    iconFinished: "/asset/images/icons/f-1.svg",
                    active: true
                },
                {
                    step: 2,
                    stepName: "Bước 2",
                    stepDesc: "Chọn nhóm Khách hàng",
                    iconCreated: "/asset/images/icons/c-2.svg",
                    iconDisabled: "/asset/images/icons/d-2.svg",
                    iconFinished: "/asset/images/icons/f-2.svg",
                    active: false
                },
                {
                    step: 3,
                    stepName: "Bước 3",
                    stepDesc: "Chọn nhóm Giải thưởng",
                    iconCreated: "/asset/images/icons/c-3.svg",
                    iconDisabled: "/asset/images/icons/d-3.svg",
                    iconFinished: "/asset/images/icons/f-3.svg",
                    active: false
                },
                {
                    step: 4,
                    stepName: "Bước 4",
                    stepDesc: "Chọn giao diện vòng quay",
                    iconCreated: "/asset/images/icons/c-4.svg",
                    iconDisabled: "/asset/images/icons/d-4.svg",
                    iconFinished: "/asset/images/icons/f-4.svg",
                    active: false
                }
            ])
        }
    }, [isInternalModeParent])

    return (
        <section class="step-section">
            <div class="wrapper-container">
                <ul class="progress-wrap">
                    {
                        stepLevel?.map((item, i) => {
                            return (
                                <li class={`step ${item.active ? 'active' : ''}`}>
                                    <a class="icon created">
                                        <img src={item.iconCreated} alt="" />
                                    </a>
                                    <a class="icon disable">
                                        <img src={item.iconDisabled} alt="" />
                                    </a>
                                    <a class="icon finished">
                                        <img src={item.iconFinished} alt="" />
                                    </a>
                                    <a class="content">
                                        <p><b>{item.stepName}</b></p>
                                        <p>{item.stepDesc}</p>
                                    </a>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </section>

    );
}
export default StepBar;