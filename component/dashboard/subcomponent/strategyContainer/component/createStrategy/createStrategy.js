import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import SelectBoxv2 from "../../../../../../shared/packages/control/selectBoxv2/selectBoxv2"
import { updateStrategySpin, createStrategySpin, removeStrategySpin } from "../../../../../../services/strategySpin.service"
import { loadDataTableMasterObj } from "../../../../../../redux/actions/masterObjectAllocationActions"
import { createGroupAllocation, updateGroupAllocation, removeGroupAllocation } from "../../../../../../services/groupAllocation.service"

const CreateStrategy = (props) => {
    const { material } = props
    const router = useRouter();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [strategySpinModel, setStrategySpinModel] = useState({});
    const [isInternalMode, setIsInternalMode] = useState(false);
    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }

    useEffect(() => {
        dispatch(loadDataTableMasterObj({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
    }, [])

    useEffect(() => {
        material?.setIsInternalModeParent(isInternalMode);
    }, [isInternalMode])

    useEffect(() => {
        if (material?.strategySSR) {
            setStrategySpinModel(material?.strategySSR)
        }
    }, [material?.strategySSR])

    useEffect(() => {
        if (strategySpinModel?.masterObjectAllocation) {
            setIsInternalMode(strategySpinModel?.masterObjectAllocation?.objectKey === "in-system");
        }
    }, [strategySpinModel?.masterObjectAllocation])

    const { masterObjectAllocationList } = useSelector((state) => state.masterObjectAllocation);

    const overwriteDataModal = (prefix, value) => {
        strategySpinModel[prefix] = value;
        setStrategySpinModel({ ...strategySpinModel });
    }

    const createStrategyCommand = (data) => {
        createStrategySpin(data).then((res) => {
            if (material?.isInternalModeParent) {
                //neu la noi bo thi tu tao nhom KH va xoa khi xoa chien luoc
                const autoGroupAssign = {
                    name: 'Nh??m n???i b??? ' + res?.data?.data?.id,
                    desc: 'D??? li???u n???i b???'
                }
                createGroupAllocation(autoGroupAssign).then((res2) => {
                    var clone = { ...res?.data?.data }
                    clone.groupAllocationId = res2?.data?.data;
                    updateStrategyCommand(clone)
                    changeRoute(`/strategySpin/container?id=${res?.data?.data?.id}`)
                })
            }
            else {
                changeRoute(`/strategySpin/container?id=${res?.data?.data?.id}`)
                setTimeout(() => {
                    material?.updateStepValue(2);
                }, 0);
            }
            addToast(<div className="text-center">???? t???o chi???n l?????c</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">T???o chi???n l?????c th???t b???i</div>, { appearance: 'error' });
        })
    }

    const updateStrategyCommand = (data) => {
        updateStrategySpin(data).then((res) => {
            addToast(<div className="text-center">C???p nh???t chi???n l?????c th??nh c??ng</div>, { appearance: 'success' });
            material?.refreshStrategyData(material?.strategySSR?.id).then((res2) => {
                material?.updateStepValue(2);
            })
        }).catch((err) => {
            addToast(<div className="text-center">C???p nh???t chi???n l?????c th???t b???i</div>, { appearance: 'error' });
        })
    }

    return (
        <section class="create-strategy">
            <div class="wrapper-container">
                <div class="row no-gutters">
                    <div class="wrap-left">
                        <h1 class="section-title">H??y thi???p l???p chi???n l?????c <br />v??ng quay may m???n</h1>
                        <p class="desc">
                            Thi???t l???p c??c th??ng s??? qua c??c b?????c th???c hi???n tr??n m??n h??nh ph?? h???p v???i chi???n l?????c v??ng quay may m???n m??
                            b???n mong mu???n
                        </p>
                        <figure> <img src="/asset/images/image_chienluoc.png" alt="" /></figure>
                    </div>
                    <div class="wrap-right">
                        <h2>T???o chi???n l?????c</h2>
                        <form class="wrap-form">
                            <div class="row">
                                <div class="form-group col-lg-6">
                                    <label for="">T??n chi???n l?????c</label>
                                    <input class="form-control" onChange={(e) => {
                                        const value = e.target.value ?? '';
                                        overwriteDataModal('name', value)
                                    }}
                                        defaultValue={strategySpinModel?.name}
                                        type="text" />
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="">Lo???i chi???n l?????c</label>
                                    <SelectBoxv2
                                        id="selectbox"
                                        optionLabel="objectName"
                                        optionValue="id"
                                        onChange={(data) => {
                                            if (masterObjectAllocationList?.find(x => x.id === data)?.objectKey === 'in-system') {
                                                setIsInternalMode(true)
                                            }
                                            else {
                                                setIsInternalMode(false)
                                            }
                                            overwriteDataModal('masterObjectAllocationId', data)
                                        }}
                                        value={strategySpinModel?.masterObjectAllocationId}
                                        options={masterObjectAllocationList ?? []}
                                    />
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="">C???u h??nh l?????t quay</label>
                                    <SelectBoxv2
                                        id="selectbox2"
                                        optionLabel="name"
                                        optionValue="id"
                                        onChange={(data) => {
                                            overwriteDataModal('quantitySpinEnum', data)
                                        }}
                                        value={strategySpinModel?.quantitySpinEnum}
                                        options={
                                            isInternalMode ?
                                                material?.masterData?.quantitySpin?.filter(x => x?.id !== "Config") ?? []
                                                :
                                                material?.masterData?.quantitySpin ?? []}
                                    />
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="">C???u h??nh ???????ng d???n</label>
                                    <input class="form-control"
                                        onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataModal('urlPublic', value)
                                        }} defaultValue={strategySpinModel?.urlPublic}
                                        type="text" placeholder="url" />
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="">Ng??y b???t ?????u</label>
                                    <input class="form-control" type="datetime-local"
                                        onChange={(e) => {
                                            const value = e.target?.value ?? null;
                                            overwriteDataModal('startDate', value)
                                        }}
                                        value={strategySpinModel?.startDate}
                                        name="" />
                                </div>
                                <div class="form-group col-lg-6">
                                    <label for="">Ng??y k???t th??c</label>
                                    <input class="form-control" type="datetime-local"
                                        onChange={(e) => {
                                            const value = e.target?.value ?? null;
                                            overwriteDataModal('endDate', value)
                                        }}
                                        value={strategySpinModel?.endDate}
                                        name="" />
                                </div>
                                <div class="form-group col-lg-6">
                                    <input id="check" type="checkbox"
                                        onChange={(e) => {
                                            const checked = e.target?.checked;
                                            overwriteDataModal('freeMode', checked);
                                        }}
                                        checked={strategySpinModel?.freeMode}
                                        name="disabeldWheel" />
                                    <label class="check-label" for="check">T??? l??? quay tr??ng chia ?????u</label>
                                </div>
                                <div class="form-group col-lg-12">
                                    <button class="btn btn-backstep" onClick={() => {
                                        changeRoute('/')
                                    }} type="button"> <img src="/asset/images/icons/back.svg" alt="" /><span>Quay l???i</span></button>
                                    <button class="btn btn-submit"
                                        onClick={() => {
                                            if (material?.strategySSR) {
                                                updateStrategyCommand(strategySpinModel)
                                            }
                                            else {
                                                createStrategyCommand(strategySpinModel)
                                            }
                                        }}
                                        type="button"> <span>Ti???p t???c t???o chi???n l?????c</span><em class="material-icons">arrow_forward</em></button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default CreateStrategy;