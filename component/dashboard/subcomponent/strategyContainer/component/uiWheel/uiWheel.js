import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import Modal from "../../../../../../shared/packages/control/modal/index";
import { InputControl } from "../../../../../../shared/packages/control/input/inputControl"
import showConfirm from "../../../../../../shared/packages/control/dialog/confirmation"
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import SelectBoxv2 from "../../../../../../shared/packages/control/selectBoxv2/selectBoxv2"
import DataGridControl from '../../../../../../shared/packages/control/grid/datagrid';
import WheelUI from "./component/wheel/wheel"
import BackGroundUI from "./component/background/background"
import { updateStrategySpin, createStrategySpin, removeStrategySpin } from "../../../../../../services/strategySpin.service"

const UIWheel = (props) => {
    const { material } = props
    const router = useRouter();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }
    const [selectTab, setSelectTab] = useState(0)
    const [tabData, setTabData] = useState({
        wheelUI: {
            data: null
        },
        backgroundUI: {
            data: null
        }
    })

    const updateStrategyCommand = (data) => {
        updateStrategySpin(data).then((res) => {
            addToast(<div className="text-center">Cập nhật chiến lược thành công</div>, { appearance: 'success' });
            changeRoute("/");
        }).catch((err) => {
            addToast(<div className="text-center">Cập nhật chiến lược thất bại</div>, { appearance: 'error' });
        })
    }

    return (
        <section class="choice-layout">
            <div class="wrapper-container d-flex">
                <div class="wrap-left wrap-tabs">
                    <ul class="tab-list d-flex align-items-center">
                        <li onClick={() => setSelectTab(0)}> <a class={`b-nav-tab ${selectTab === 0 ? 'active' : ''}`} href="javascript:;" data-tab="tab-1">Giao diện vòng quay</a></li>
                        <li onClick={() => setSelectTab(1)}> <a class={`b-nav-tab ${selectTab === 1 ? 'active' : ''}`} href="javascript:;" data-tab="tab-2">Giao diện hình nền </a></li>
                    </ul>
                    <div class="tab-content">
                        <div class={`b-tab ${selectTab === 0 ? 'active' : ''}`} id="tab-1">
                            <WheelUI {...props} func={{
                                tabData: tabData,
                                setTabData: setTabData
                            }} />
                        </div>
                        <div class={`b-tab ${selectTab === 1 ? 'active' : ''}`} id="tab-2">
                            <BackGroundUI {...props} func={{
                                tabData: tabData,
                                setTabData: setTabData
                            }} />
                        </div>
                    </div>
                </div>
                <div class="wrap-right">
                    <div class="wrap-right_img">
                        <figure style={{ backgroundSize: 'cover', backgroundImage: `url(${tabData?.backgroundUI?.data?.configJson?.main_bg?.value})` }}>
                            <img style={{ width: '250px', height: '250px' }}
                                src={tabData?.wheelUI?.data?.configJson?.wheel_bg?.value} alt="" />
                        </figure>
                        <figcaption>
                            {
                                selectTab === 0 ?
                                    <ul>
                                        <li>
                                            <h2>Tên giao diện</h2>
                                            <p>{tabData?.wheelUI?.data?.name}</p>
                                        </li>
                                        <li>
                                            <h2>Mô tả</h2>
                                            <p>{tabData?.wheelUI?.data?.desc}</p>
                                        </li>
                                    </ul>
                                    :
                                    <ul>
                                        <li>
                                            <h2>Tên hình ảnh</h2>
                                            <p>{tabData?.backgroundUI?.data?.name}</p>
                                        </li>
                                        <li>
                                            <h2>Mô tả</h2>
                                            <p>{tabData?.backgroundUI?.data?.desc}</p>
                                        </li>
                                    </ul>
                            }
                        </figcaption>
                    </div>
                    <div class="wrap-right_button">
                        <button class="btn btn-backstep" type="button" onClick={() => {
                            material?.updateStepValue(3);
                        }}> <img src="/asset/images/icons/back.svg" alt="" /><span>Quay lại</span></button>
                        <button class="btn btn-submit" type="button"
                            onClick={() => {
                                if (material?.strategySSR) {
                                    const wheelSelectedId = tabData.wheelUI?.data?.id ?? null;
                                    const themeSelectedId = tabData.backgroundUI?.data?.id ?? null;
                                    var clone = { ...material?.strategySSR }
                                    clone.wheelInstanceId = wheelSelectedId;
                                    clone.themeInstanceId = themeSelectedId;
                                    updateStrategyCommand(clone);
                                }
                            }}
                        > <span>Hoàn thành</span><em class="material-icons">check</em></button>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default UIWheel;