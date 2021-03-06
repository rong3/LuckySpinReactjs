import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { loadDataTableGroupAllocation } from "../../redux/actions/groupAllocationActions"
import showConfirm from "../../shared/packages/control/dialog/confirmation"
import { CookieHelper } from "../../shared/packages/utils/cookie"
import DataGridControl from '../../shared/packages/control/grid/datagrid';
import Modal from "../../shared/packages/control/modal/index";
import { InputControl } from "../../shared/packages/control/input/inputControl"
import SelectBoxv2 from "../../shared/packages/control/selectBoxv2/selectBoxv2"
import { createGroupAllocation, updateGroupAllocation, removeGroupAllocation } from "../../services/groupAllocation.service"
import { createMasterAllocationSelected, updateMasterAllocationSelected, removeMasterAllocationSelected } from "../../services/masterAllocationSelected.service"
import SelectBox from "../../shared/packages/control/selectBox/selectBox"

function CustomerComponent(props) {
    const router = useRouter();
    const dispatch = useDispatch();
    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }
    const { addToast } = useToasts();
    const [selectedGroupAllocation, setSelectedGroupAllocation] = useState(null);
    const { groupAllocationsList } = useSelector((state) => state.groupAllocation);
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
    const overwriteDataGroupAllocationModal = (prefix, value) => {
        modalCustomGroupAllocation.data[prefix] = value;
        setModalCustomGroupAllocation({ ...modalCustomGroupAllocation });
    }
    const overwriteDataAllocationSelectedModal = (prefix, value) => {
        modalCustomAllocationSelected.data[prefix] = value;
        setModalCustomAllocationSelected({ ...modalCustomAllocationSelected });
    }

    useEffect(() => {
        dispatch(loadDataTableGroupAllocation({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
    }, [])

    useEffect(() => {
        if (selectedGroupAllocation && groupAllocationsList && groupAllocationsList?.length > 0) {
            findSelectedGroupAllocation(selectedGroupAllocation?.id)
        }
    }, [groupAllocationsList])

    const findSelectedGroupAllocation = (id) => {
        const find = groupAllocationsList?.find(x => x.id === id)
        if (find) {
            setSelectedGroupAllocation({ ...find })
        }
        else
            setSelectedGroupAllocation(null)
    }


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

    //func group allocation selected
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

    //func allocation selected
    const createAllocationSelectedCommand = (data) => {
        if (selectedGroupAllocation?.id) {
            createMasterAllocationSelected({ ...data, groupAllocationId: selectedGroupAllocation?.id }).then((res) => {
                addToast(<div className="text-center">C???p nh???t th??nh c??ng</div>, { appearance: 'success' });
                dispatch(loadDataTableGroupAllocation({
                    header: {
                        pageNumber: 1,
                        pageSize: 999
                    }
                }))
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
            dispatch(loadDataTableGroupAllocation({
                header: {
                    pageNumber: 1,
                    pageSize: 999
                }
            }))
        }).catch((err) => {
            addToast(<div className="text-center">C???p nh???t th???t b???i</div>, { appearance: 'error' });
        })
    }

    return (
        <section class="history-section section-main">
            <h1 class="section-title d-flex align-items-center"> <img class="icon" src="/asset/images/icons/side-3.svg" alt="" />&nbsp; Qu???n l?? nh??m kh??ch h??ng</h1>
            <div class="wrapper-container d-flex">
                <div class="wrap-left">
                    <div class="wrap-left_header d-flex">
                        <h2>Nh??m kh??ch h??ng</h2>
                        <button class="btn btn-add ms-auto" onClick={() => setModalCustomGroupAllocation({ ...modalCustomGroupAllocation, type: 'new', data: { disabled: false }, isOpen: true })}>
                            <img src="/asset/images/icons/add.svg" alt="" /><span>&nbsp;T???o m???i</span></button>
                    </div>
                    <div class="wrap-left_body">
                        <ul>
                            {
                                groupAllocationsList?.map(item => {
                                    return (
                                        <li onClick={() => setSelectedGroupAllocation(item)} class={`${item?.id === selectedGroupAllocation?.id ? 'active' : ''}`}>
                                            <div class="title-item">
                                                <a class="title">{item?.name}</a>
                                            </div>
                                            <div class="wrap-button">
                                                <a onClick={() => sendUpdateGroupAllocationCommand(item)}>
                                                    <img src="/asset/images/icons/edit.svg" alt="" />
                                                </a>
                                                <a onClick={async () => {
                                                    const confirm = await showConfirm("X??c nh???n", `B???n c?? ch???c ch???n mu???n xo?? ?????i t?????ng ${item?.name} ?`, "Xo??", "Tr??? v???");
                                                    if (confirm && item?.id) {
                                                        removeGroupAllocationCommand(item?.id);
                                                    }
                                                }}>
                                                    <img src="/asset/images/icons/delete2.svg" alt="" />
                                                </a>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div class="wrap-right">
                    <div class="wrap-right_header d-flex align-items-center justify-content-between">
                        <div class="wrap-right_header--title d-flex align-items-center"><img class="icon" src="/asset/images/icons/list.svg" alt="" />
                            <h2>&nbsp; Danh s??ch kh??ch h??ng</h2>
                        </div>
                        <div class="wrap-right_header--sort d-flex align-items-center">
                            <button class="btn btn-add ms-auto" onClick={() => setModalCustomAllocationSelected({ ...modalCustomAllocationSelected, type: 'new', data: {}, isOpen: true })}>
                                <img src="/asset/images/icons/add.svg" alt="" />
                                <span>&nbsp;Th??m m???i</span>
                            </button>
                            <button class="btn btn-upload ms-3" type="submit"> <img src="/asset/images/icons/cloud-upload.svg" alt="" /><span>T???i l??n</span></button>
                        </div>
                    </div>
                    <div class="wrap-right_body">
                        {
                            selectedGroupAllocation &&
                            <DataGridControl
                                rows={selectedGroupAllocation?.masterAllocationSelecteds}
                                columns={columns}
                                count={selectedGroupAllocation?.masterAllocationSelecteds?.length ?? 0}
                                disableSelectionOnClick
                            />
                        }
                    </div>

                </div>
            </div>

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
        </section>
    );
}

export default CustomerComponent;