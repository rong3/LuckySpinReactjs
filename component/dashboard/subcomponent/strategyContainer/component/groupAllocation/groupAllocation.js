import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import SelectBoxv2 from "../../../../../../shared/packages/control/selectBoxv2/selectBoxv2"
import DataGridControl from '../../../../../../shared/packages/control/grid/datagrid';
import { loadDataTableGroupAllocation } from "../../../../../../redux/actions/groupAllocationActions"
import { getProxyAllocationStrategy } from "../../../../../../services/proxyAllocationStrategy.service"
import { strategyConfig, prizeConfig } from "../../../../../luckyspin/module/strategySpin/config/strategyConfig"
import Modal from "../../../../../../shared/packages/control/modal/index";
import { InputControl } from "../../../../../../shared/packages/control/input/inputControl"
import showConfirm from "../../../../../../shared/packages/control/dialog/confirmation"
import { createMasterAllocationSelected, updateMasterAllocationSelected, uploadMasterAllocationSelected, removeMasterAllocationSelected } from "../../../../../../services/masterAllocationSelected.service"
import { createGroupAllocation, updateGroupAllocation, removeGroupAllocation } from "../../../../../../services/groupAllocation.service"
import { updateStrategySpin, createStrategySpin, removeStrategySpin } from "../../../../../../services/strategySpin.service"
import SelectBox from "../../../../../../shared/packages/control/selectBox/selectBox"
import { updateProxyStrategy } from "../../../../../../services/proxyAllocationStrategy.service"

const GroupAllocation = (props) => {
    const { material } = props
    const router = useRouter();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }
    const [modalCustomGroupAllocation, setModalCustomGroupAllocation] = useState({
        isOpen: false,
        data: null,
        type: null
    })

    const [modalCustomAllocationSelected, setModalCustomAllocationSelected] = useState({
        isOpen: false,
        data: null,
        type: null
    })

    const sendUpdateGroupAllocationCommand = (data) => {
        setModalCustomGroupAllocation({ ...modalCustomGroupAllocation, type: 'edit', data: data, isOpen: true })
    }

    const resetModalAllocationSelected = () => {
        setModalCustomAllocationSelected({ ...modalCustomAllocationSelected, isOpen: false, data: null, type: null })
    }

    const resetModalGroupAllocation = () => {
        setModalCustomGroupAllocation({ ...modalCustomGroupAllocation, isOpen: false, data: null, type: null })
    }

    const overwriteDataAllocationSelectedModal = (prefix, value) => {
        if (!["quantity", "disabled"].includes(prefix)) {
            modalCustomAllocationSelected.data[prefix] = value;
        }
        else {
            modalCustomAllocationSelected.data.attributes[prefix].value = value;
        }
        setModalCustomAllocationSelected({ ...modalCustomAllocationSelected });
    }


    const overwriteDataGroupAllocationModal = (prefix, value) => {
        modalCustomGroupAllocation.data[prefix] = value;
        setModalCustomGroupAllocation({ ...modalCustomGroupAllocation });
    }

    const convertEditAttributeUI = (data) => {
        let maskCopyEdit = _.cloneDeep(strategyConfig.maskEditModel);
        if (data === null) {
            return maskCopyEdit;
        }
        else {
            try {
                const parse = JSON.parse(data);
                const patch = { ...maskCopyEdit, ...parse }
                return patch;
            }
            catch {
                return {}
            }
        }
    }

    function getAttribute(params) {
        if (params.field === 'quantity')
            return params.row?.attributes?.quantity?.value;
        if (params.field === 'disabled')
            return params.row?.attributes?.disabled?.value;
        else
            return ""
    }

    const columns = [
        {
            field: 'masterId',
            headerName: 'T??n kh??ch h??ng',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'masterCode',
            headerName: 'M?? kh??ch h??ng',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'quantity',
            headerName: 'S??? l?????t quay',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
            valueGetter: getAttribute,
        },
        {
            field: 'disabled',
            headerName: 'V?? hi???u ho??',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            valueGetter: getAttribute,
            editable: false,
        },
        {
            field: 'action',
            headerName: 'Thao t??c',
            sortable: false,
            headerClassName: 'headerColumn',
            headerAlign: 'center',
            minWidth: 200,
            flex: 1,
            disableClickEventBubbling: true,
            renderCell: (cell) => {
                return renderActionGrid(cell)
            }
        },
    ]

    const renderActionGrid = (params) => {
        return (
            <div className="box-action-container">
                <div>
                    <img src="/asset/images/icons/pencle.svg"
                        onClick={() => {
                            setModalCustomAllocationSelected({ ...modalCustomAllocationSelected, type: 'edit', data: { ...params?.row }, isOpen: true })
                        }}
                        alt="" />
                </div>
                <div>
                    <i className="fas fa-trash text-danger" onClick={async (e) => {
                        const confirm = await showConfirm("X??c nh???n", `B???n c?? ch???c ch???n mu???n xo?? ?????i t?????ng ${params?.row?.masterId} ?`, "Xo??", "Tr??? v???");
                        if (confirm && params?.row?.id) {
                            removeAllocationSelectedCommand(params?.row?.id);
                        }
                    }}></i>
                </div>
            </div>
        )
    }

    const [selectedGroupAllocation, setSelectedGroupAllocation] = useState(material?.strategySSR?.groupAllocation);

    const { groupAllocationsList } = useSelector((state) => state.groupAllocation);

    useEffect(() => {
        dispatch(loadDataTableGroupAllocation({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
    }, [])

    // useEffect(() => {
    //     if (material?.strategySSR) {
    //         setSelectedGroupAllocation(material?.strategySSR?.groupAllocation)
    //     }
    // }, [material?.strategySSR])

    useEffect(() => {
        if (selectedGroupAllocation && groupAllocationsList?.length > 0) {
            findSelectedGroupAllocation(selectedGroupAllocation?.id)
        }
    }, [groupAllocationsList])

    const findSelectedGroupAllocation = (id) => {
        const find = groupAllocationsList?.find(x => x.id === id)
        if (find) {
            const masterIds = find?.masterAllocationSelecteds?.map(x => x.id) ?? [];
            getProxyAllocationStrategy({
                "strategySpinId": material?.strategySSR?.id,
                "masterAllocationSelectedIds": masterIds
            }).then((res) => {
                console.log({ res });
                const resData = res?.data?.data;
                const mergeData = {
                    ...find,
                    masterAllocationSelecteds: find.masterAllocationSelecteds?.map((item) => ({
                        ...item,
                        idProxy: resData?.find(x => x?.masterAllocationSelectedId === item?.id)?.id,
                        attributes: convertEditAttributeUI(resData?.find(x => x?.masterAllocationSelectedId === item?.id)?.attributes)
                    }))
                }
                setSelectedGroupAllocation({ ...mergeData })
            });

        }
        else
            setSelectedGroupAllocation(null)
    }

    //func allocation selected
    const createAllocationSelectedCommand = (data) => {
        if (selectedGroupAllocation?.id) {
            createMasterAllocationSelected({ ...data, groupAllocationId: selectedGroupAllocation?.id }).then((res) => {
                addToast(<div className="text-center">C???p nh???t th??nh c??ng</div>, { appearance: 'success' });
                const convert = ({
                    "id": data?.idProxy,
                    "strategySpinId": material?.strategySSR?.id,
                    "masterAllocationSelectedId": data?.id,
                    "attributes": JSON.stringify(data?.attributes)
                });
                updateProxyStrategy(convert).then((res) => {
                    dispatch(loadDataTableGroupAllocation({
                        header: {
                            pageNumber: 1,
                            pageSize: 999
                        }
                    }))
                }).catch((err) => {
                })
            }).catch((err) => {
                addToast(<div className="text-center">Th??m th???t b???i</div>, { appearance: 'error' });
            })
        }
    }

    const removeAllocationSelectedCommand = (data) => {
        removeMasterAllocationSelected(data).then((res) => {
            dispatch(loadDataTableGroupAllocation({
                header: {
                    pageNumber: 1,
                    pageSize: 999
                }
            }))
            addToast(<div className="text-center">Xo?? th??nh c??ng</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Xo?? th???t b???i</div>, { appearance: 'error' });
        })
    }


    const updateAllocationSelectedCommand = (data) => {
        updateMasterAllocationSelected(data).then((res) => {
            addToast(<div className="text-center">C???p nh???t th??nh c??ng</div>, { appearance: 'success' });
            const convert = ({
                "id": data?.idProxy,
                "strategySpinId": material?.strategySSR?.id,
                "masterAllocationSelectedId": data?.id,
                "attributes": JSON.stringify(data?.attributes)
            });
            updateProxyStrategy(convert).then((res) => {
                dispatch(loadDataTableGroupAllocation({
                    header: {
                        pageNumber: 1,
                        pageSize: 999
                    }
                }))
            }).catch((err) => {
            })
        }).catch((err) => {
            addToast(<div className="text-center">C???p nh???t th???t b???i</div>, { appearance: 'error' });
        })
    }
    //end

    //
    const updateGroupAllocationCommand = (data) => {
        updateGroupAllocation(data).then((res) => {
            dispatch(loadDataTableGroupAllocation({
                header: {
                    pageNumber: 1,
                    pageSize: 999
                }
            }))
            addToast(<div className="text-center">C???p nh???t th??nh c??ng</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">C???p nh???t th???t b???i</div>, { appearance: 'error' });
        })
    }

    const createGroupAllocationCommand = (data) => {
        createGroupAllocation(data).then((res) => {
            dispatch(loadDataTableGroupAllocation({
                header: {
                    pageNumber: 1,
                    pageSize: 999
                }
            }))
            addToast(<div className="text-center">Th??m th??nh c??ng</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Th??m th???t b???i</div>, { appearance: 'error' });
        })
    }

    const removeGroupAllocationCommand = (data) => {
        removeGroupAllocation(data).then((res) => {
            if (res?.data?.succeeded) {
                dispatch(loadDataTableGroupAllocation({
                    header: {
                        pageNumber: 1,
                        pageSize: 999
                    }
                }))
                addToast(<div className="text-center">Xo?? th??nh c??ng</div>, { appearance: 'success' });
            }
            else {
                addToast(<div className="text-center">Xo?? th???t b???i</div>, { appearance: 'error' });
            }
        }).catch((err) => {
            addToast(<div className="text-center">Xo?? th???t b???i</div>, { appearance: 'error' });
        })
    }
    //
    //
    const updateStrategyCommand = (data) => {
        updateStrategySpin(data).then((res) => {
            // addToast(<div className="text-center">C???p nh???t chi???n l?????c th??nh c??ng</div>, { appearance: 'success' });
            material?.refreshStrategyData(material?.strategySSR?.id).then((res2) => {
                material?.updateStepValue(3);
            })
        }).catch((err) => {
            addToast(<div className="text-center">C???p nh???t chi???n l?????c th???t b???i</div>, { appearance: 'error' });
        })
    }
    //


    return (
        <section class="choice-customer">
            <div class="wrapper-container">
                <div class="wrap-sort d-flex align-items-center">
                    <h1 class="title-small">Nh??m Kh??ch h??ng</h1>
                    <SelectBoxv2
                        id="selectbox"
                        style={{ width: "353px", marginLeft: "16px" }}
                        optionLabel="name"
                        optionValue="id"
                        onChange={(data) => {
                            findSelectedGroupAllocation(data)
                        }}
                        value={selectedGroupAllocation?.id}
                        options={groupAllocationsList ?? []}
                    />
                    {
                        selectedGroupAllocation &&
                        <>
                            <a class="edit"
                                onClick={() => {
                                    sendUpdateGroupAllocationCommand(selectedGroupAllocation)
                                }}
                                style={{ marginLeft: "-25px", cursor: "pointer" }}> <img src="/asset/images/icons/pencle.svg" alt="" /></a>
                        </>
                    }
                    <button class="edit ms-3 btn btn-add" onClick={() => {
                        setModalCustomGroupAllocation({ ...modalCustomGroupAllocation, type: 'new', data: { disabled: false }, isOpen: true })
                    }}>
                        <img src="/asset/images/icons/add.svg" alt="" />
                    </button>
                </div>
                <div class="wrap-body">
                    {
                        selectedGroupAllocation &&
                        <div class="wrap-body_header d-flex align-items-center justify-content-between">
                            <h1 class="title-small">Danh s??ch Kh??ch h??ng</h1>
                            <div class="wrap-button d-flex align-items-center">
                                {/* <button class="btn btn-search"> <img src="/asset/images/icons/search.svg" alt="" /></button> */}
                                <button class="btn btn-add" onClick={() => {
                                    setModalCustomAllocationSelected({ ...modalCustomAllocationSelected, type: 'new', data: { disabled: false, attributes: strategyConfig.maskEditModel }, isOpen: true })
                                }}>
                                    <img src="/asset/images/icons/add.svg" alt="" />
                                    <span>&nbsp;Th??m m???i</span>
                                </button>
                                <button class="btn btn-upload" type="button" onClick={() => {
                                    document.getElementById('input_file_template').click();
                                }}>
                                    <img src="/asset/images/icons/cloud-upload.svg" alt="" /><span>&nbsp;T???i l??n</span>
                                </button>
                                <input type="file" id="input_file_template"
                                    onChange={(e) => {
                                        const file = e.target.files[0] ?? null;
                                        if (file) {
                                            const formData = new FormData();
                                            formData.append("Templates", file);
                                            formData.append("GroupAllocationId", selectedGroupAllocation?.id);
                                            formData.append("StrategySpinId", material?.strategySSR?.id);
                                            uploadMasterAllocationSelected(formData).then(() => {
                                                dispatch(loadDataTableGroupAllocation({
                                                    header: {
                                                        pageNumber: 1,
                                                        pageSize: 999
                                                    }
                                                }))
                                                addToast(<div className="text-center">C???p nh???t th??nh c??ng</div>, { appearance: 'success' });
                                            }).catch((err) => {
                                                addToast(<div className="text-center">C???p nh???t th???t b???i</div>, { appearance: 'error' });
                                            })
                                        }
                                        e.target.value = '';
                                    }}
                                    accept=".xls,.xlsx" style={{ display: 'none' }} />
                                {/*  <button class="btn btn-setting" type="submit" data-fancybox="" data-src="#dialog-content"> <img src="/asset/images/icons/setting.svg" alt="" /><span>&nbsp;C???u h??nh chung</span></button> */}
                            </div>
                        </div>
                    }
                    <div class="wrap-body_table">
                        {
                            selectedGroupAllocation &&
                            <DataGridControl
                                rows={selectedGroupAllocation?.masterAllocationSelecteds}
                                columns={columns}
                                count={selectedGroupAllocation?.masterAllocationSelecteds?.length ?? 0}
                                disableSelectionOnClick
                            />
                        }

                        {/*                        
                           <nav class="pagination-nav d-flex align-items-center">
                               <ul class="pagination d-flex align-items-center ms-auto">
                                   <li class="page-item"><a class="page-link" href="#"><em class="material-icons">navigate_before</em></a></li>
                                   <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                   <li class="page-item"><a class="page-link" href="#">2</a></li>
                                   <li class="page-item"><a class="page-link" href="#">3</a></li>
                                   <li class="page-item"><a class="page-link" href="#"><em class="material-icons">navigate_next</em></a></li>
                               </ul>
                           </nav> */}
                        <div class="wrap-button d-flex align-items-center">
                            <button class="btn btn-backstep" onClick={() => {
                                material?.updateStepValue(1);
                            }} type="button">
                                <img src="/asset/images/icons/back.svg" alt="" /><span>Quay l???i</span></button>
                            <button class="btn btn-submit" type="button"
                                onClick={() => {
                                    if (material?.strategySSR) {
                                        const groupSelectedId = selectedGroupAllocation?.id;
                                        var clone = { ...material?.strategySSR }
                                        clone.groupAllocationId = groupSelectedId;
                                        updateStrategyCommand(clone)
                                    }
                                }}
                            > <span>Ti???p t???c t???o chi???n l?????c</span><em class="material-icons">arrow_forward</em></button>
                        </div>
                    </div>

                </div>

            </div>
            {/* //modal danh sacsh khach hang */}
            {
                <Modal
                    isOpen={modalCustomAllocationSelected.isOpen}
                    modalName="role-modal"
                    showOverlay={true}
                    onClose={() => resetModalAllocationSelected()}
                    title="?????i t?????ng ph??n b???"
                    size="md"
                    centered
                >
                    <Modal.Body>
                        {
                            ['edit', 'new'].includes(modalCustomAllocationSelected.type) ?
                                <div className="row">
                                    <div className="col-md-6">
                                        <span>T??n kh??ch h??ng</span>
                                        <InputControl type="text" id="name" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('masterId', value)
                                        }} defaultValue={modalCustomAllocationSelected.data?.masterId} />
                                    </div>
                                    <div className="col-md-6">
                                        <span>M?? kh??ch h??ng</span>
                                        <InputControl type="text" id="name" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('masterCode', value)
                                        }} defaultValue={modalCustomAllocationSelected.data?.masterCode} />
                                    </div>
                                    <div className="col-md-6">
                                        <span>S??? l?????t quay</span>
                                        <InputControl type="text" id="name" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('quantity', Number.parseInt(value))
                                        }} defaultValue={modalCustomAllocationSelected.data?.attributes?.quantity?.value} />
                                    </div>
                                    <div className="col-md-6">
                                        <span>V?? hi???u ho??</span>
                                        <SelectBox id="selectbox"
                                            optionLabel="label"
                                            optionValue="value"
                                            onChange={(data) => {
                                                overwriteDataAllocationSelectedModal('disabled', data)
                                            }}
                                            value={modalCustomAllocationSelected.data?.attributes?.disabled?.value}
                                            isPortal
                                            options={[{ label: "True", value: true }, { label: "False", value: false }]}
                                        />
                                    </div>
                                </div>
                                :
                                <>
                                    data
                                </>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-outline-danger mr-25" onClick={() => {
                            resetModalAllocationSelected()
                        }}>????ng</button>

                        <button className="btn btn-outline-primary mr-25" onClick={() => {
                            if (modalCustomAllocationSelected.type === 'new') {
                                createAllocationSelectedCommand(modalCustomAllocationSelected.data)
                            }
                            if (modalCustomAllocationSelected.type === 'edit') {
                                updateAllocationSelectedCommand(modalCustomAllocationSelected.data)
                                console.log({ data: modalCustomAllocationSelected.data });
                            }
                            resetModalAllocationSelected();
                        }}>
                            {(() => {
                                if (modalCustomAllocationSelected.type === 'new') {
                                    return "T???o m???i"
                                }
                                if (modalCustomAllocationSelected.type === 'edit') {
                                    return "C???p nh???t"
                                }
                            })()}
                        </button>
                    </Modal.Footer>
                </Modal>
            }

            {/* //modal nhom khach hang */}
            {
                <Modal
                    isOpen={modalCustomGroupAllocation.isOpen}
                    modalName="role-modal"
                    showOverlay={true}
                    onClose={() => resetModalGroupAllocation()}
                    title="Nh??m kh??ch h??ng"
                    size="md"
                    centered
                >
                    <Modal.Body>
                        {
                            ['edit', 'new'].includes(modalCustomGroupAllocation.type) ?
                                <>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <span>T??n nh??m kh??ch h??ng</span>
                                            <InputControl type="text" id="name" onChange={(e) => {
                                                const value = e.target.value ?? '';
                                                overwriteDataGroupAllocationModal('name', value)
                                            }} defaultValue={modalCustomGroupAllocation.data?.name} />
                                        </div>
                                    </div>
                                </>
                                :
                                <>
                                    data
                                </>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-outline-danger mr-25" onClick={() => {
                            resetModalGroupAllocation()
                        }}>????ng</button>

                        <button className="btn btn-outline-primary mr-25" onClick={() => {
                            if (modalCustomGroupAllocation.type === 'new') {
                                createGroupAllocationCommand(modalCustomGroupAllocation.data)
                            }
                            if (modalCustomGroupAllocation.type === 'edit') {
                                updateGroupAllocationCommand(modalCustomGroupAllocation.data)
                            }
                            resetModalGroupAllocation();
                        }}>
                            {(() => {
                                if (modalCustomGroupAllocation.type === 'new') {
                                    return "T???o m???i"
                                }
                                if (modalCustomGroupAllocation.type === 'edit') {
                                    return "C???p nh???t"
                                }
                            })()}
                        </button>
                    </Modal.Footer>
                </Modal>
            }
        </section>
    );
}
export default GroupAllocation;