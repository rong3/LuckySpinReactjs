import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { loadDataTable } from "../../redux/actions/strategyActions"
// import { loadDataTableGroupAllocation } from "../../redux/actions/groupAllocationActions"
// import { loadDataTableMasterObj } from "../../redux/actions/masterObjectAllocationActions"
// import { loadDataTableWheel } from "../../redux/actions/wheelInstanceAction"
// import { loadDataTableThemeSpin } from "../../redux/actions/themeAction"
// import { loadDataTableGroupChannelPrize } from "../../redux/actions/groupChannelPrizeAction"
import { masterData } from "./masterData"
import { updateStrategySpin, createStrategySpin, removeStrategySpin } from "../../services/strategySpin.service"
import showConfirm from "../../shared/packages/control/dialog/confirmation"
import { CookieHelper } from "../../shared/packages/utils/cookie"

function DashBoardComponent(props) {
    const router = useRouter();
    const dispatch = useDispatch();
    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }
    const { addToast } = useToasts();
    const { strategyList } = useSelector((state) => state.strategy);
    // const { groupAllocationsList } = useSelector((state) => state.groupAllocation);
    // const { wheelInstanceList } = useSelector((state) => state.wheelInstance);
    // const { themeInstanceList } = useSelector((state) => state.themeInstance);
    // const { masterObjectAllocationList } = useSelector((state) => state.masterObjectAllocation);
    // const { groupChannelPrizeList } = useSelector((state) => state.groupChannelPrize);

    const [selectedStrategy, setSelectedStrategy] = useState(null);

    useEffect(() => {
        dispatch(loadDataTable());
        // dispatch(loadDataTableGroupAllocation({
        //     header: {
        //         pageNumber: 1,
        //         pageSize: 999
        //     }
        // }))
        // dispatch(loadDataTableWheel({
        //     header: {
        //         pageNumber: 1,
        //         pageSize: 999
        //     }
        // }))
        // dispatch(loadDataTableThemeSpin({
        //     header: {
        //         pageNumber: 1,
        //         pageSize: 999
        //     }
        // }))
        // dispatch(loadDataTableGroupChannelPrize({
        //     header: {
        //         pageNumber: 1,
        //         pageSize: 999
        //     }
        // }))
    }, [])

    useEffect(() => {
        console.log({ selectedStrategy });
    }, [selectedStrategy])

    const removeStrategyCommand = (data) => {
        removeStrategySpin(data).then((res) => {
            if (res?.Succeeded === false) {
                addToast(<div className="text-center">Xo?? th???t b???i</div>, { appearance: 'error' });
            }
            else {
                dispatch(loadDataTable());
                addToast(<div className="text-center">Xo?? th??nh c??ng</div>, { appearance: 'success' });
            }
        }).catch((err) => {
            addToast(<div className="text-center">Xo?? th???t b???i</div>, { appearance: 'error' });
        })
    }


    return (
        <section class="home-1">
            <div class="wrapper-container d-flex align-items">
                <div class="wrap-left">
                    <div class="wrap-left_header d-flex align-items justify-content-between">
                        <h1 class="section-title"><img src="/asset/images/icons/side-2.svg" alt="" />&nbsp; Chi???n l?????c</h1>
                        <a class="btn-add" onClick={() => {
                            changeRoute('/strategySpin/container')
                        }}>
                            <em class="material-icons">add &nbsp;</em>
                            <span>Th??m m???i</span>
                        </a>
                    </div>
                    <div class="wrap-left_body">
                        <ul>
                            {
                                strategyList?.map((item, i) => {
                                    return (
                                        <li className={item?.id === selectedStrategy?.id ? 'active' : ''}
                                            onClick={() => setSelectedStrategy(item)}
                                        >
                                            <div class="title-item">
                                                <a target={'_blank'} href={`https://webuat.hdbank.com.vn/luckydraw/vongquay/${item?.urlPublic ?? item?.id}`} class="title">
                                                    {item?.name}
                                                </a>
                                            </div>
                                            <div class="action-item">
                                                <a class="edit" onClick={() => {
                                                    changeRoute(`/strategySpin/container?id=${item?.id}`)
                                                }}>
                                                    <img src="/asset/images/icons/edit.svg" alt="" />
                                                </a>
                                                <a class="delete" onClick={async () => {
                                                    const confirm = await showConfirm("X??c nh???n", `B???n c?? ch???c ch???n mu???n xo?? ?????i t?????ng ${item?.name} ?`, "Xo??", "Tr??? v???");
                                                    if (confirm && item?.id) {
                                                        removeStrategyCommand(item.id);
                                                    }
                                                }}>
                                                    <img src="/asset/images/icons/trash.svg" alt="" />
                                                </a>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
                {
                    <div class="wrap-right">
                        <div class="wrap-right_header">
                            {/* href={`/embedded/lucky-spin?id=${selectedStrategy?.id}`} target={"_blank"} */}
                            {
                                selectedStrategy ?
                                    <div class="wrap-right_img" onClick={() => {
                                        CookieHelper.removeCookie("access_token");
                                        setTimeout(() => {
                                            window.location.href = `/embedded/lucky-spin?id=${selectedStrategy?.id}`;
                                        }, 0);
                                        // window.open(`/embedded/lucky-spin?id=${selectedStrategy?.id}`, '_blank', 'toolbar=0,location=0,menubar=0,fullscreen=yes');
                                    }}>
                                        <figure style={{ alignItems: 'center', height: '250px', display: 'flex', justifyContent: 'center', backgroundSize: 'cover', backgroundImage: `url(${JSON.parse(selectedStrategy?.themeInstance && selectedStrategy?.themeInstance?.configJson)?.main_bg?.value})` }}>
                                            <img style={{ width: '150px', height: '150px' }}
                                                src={JSON.parse(selectedStrategy?.wheelInstance && selectedStrategy?.wheelInstance?.configJson)?.wheel_bg?.value} alt="" />
                                        </figure>

                                    </div>
                                    :
                                    <img src="/asset/images/default.png" alt="" />
                            }
                        </div>
                        <div class="wrap-right_body">
                            <ul>
                                <li>
                                    <div class="title">
                                        <p>T??n chi???n l?????c</p>
                                    </div>
                                    <div class="content">
                                        <p>{selectedStrategy?.name}</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="title">
                                        <p>Lo???i chi???n l?????c</p>
                                    </div>
                                    <div class="content">
                                        <p>{selectedStrategy?.masterObjectAllocation?.objectName}</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="title">
                                        <p>C???u h??nh l?????t quay</p>
                                    </div>
                                    <div class="content">
                                        <p>{masterData.quantitySpin?.find(x => x.id === selectedStrategy?.quantitySpinEnum)?.name}</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="title">
                                        <p>C???u h??nh ???????ng d???n</p>
                                    </div>
                                    <div class="content">
                                        <p>{selectedStrategy?.urlPublic}</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="title">
                                        <p>Ng??y t???o</p>
                                    </div>
                                    <div class="content">
                                        <p>{selectedStrategy?.created}</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="title">
                                        <p>Ng??y b???t ?????u</p>
                                    </div>
                                    <div class="content">
                                        <p>{selectedStrategy?.startDate}</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="title">
                                        <p>Ng??y k???t th??c</p>
                                    </div>
                                    <div class="content">
                                        <p>{selectedStrategy?.endDate}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                }

            </div>
        </section>
    );
}

export default DashBoardComponent;