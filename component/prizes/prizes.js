import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { loadDataTableGroupChannelPrize } from "../../redux/actions/groupChannelPrizeAction"
import showConfirm from "../../shared/packages/control/dialog/confirmation"
import { CookieHelper } from "../../shared/packages/utils/cookie"
import DataGridControl from '../../shared/packages/control/grid/datagrid';
import Modal from "../../shared/packages/control/modal/index";
import { InputControl } from "../../shared/packages/control/input/inputControl"
import SelectBoxv2 from "../../shared/packages/control/selectBoxv2/selectBoxv2"
import { createGroupChannelPrize, updateGroupChannelPrize, removeGroupChannelPrize } from "../../services/groupChannelPrize.service"
import { createChannelPrize, updateChannelPrize, removeChannelPrize } from "../../services/channelPrize.service"
import SelectBox from "../../shared/packages/control/selectBox/selectBox"

function PrizingComponent(props) {
    const router = useRouter();
    const dispatch = useDispatch();
    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }
    const { addToast } = useToasts();
    const { groupChannelPrizeList } = useSelector((state) => state.groupChannelPrize);
    const [selectedGroupPrize, setSelectedGroupPrize] = useState(null);

    const [modalCustomGroupPrize, setModalCustomGroupPrize] = useState({
        isOpen: false,
        data: null,
        type: null
    })

    const [modalCustomPrizeSelected, setModalCustomPrizeSelected] = useState({
        isOpen: false,
        data: null,
        type: null
    })

    const sendUpdateGroupPrizeCommand = (data) => {
        setModalCustomGroupPrize({ ...modalCustomGroupPrize, type: 'edit', data: data, isOpen: true })
    }

    const resetModalPrizeSelected = () => {
        setModalCustomPrizeSelected({ ...modalCustomPrizeSelected, isOpen: false, data: null, type: null })
    }

    const resetModalGroupPrize = () => {
        setModalCustomGroupPrize({ ...modalCustomGroupPrize, isOpen: false, data: null, type: null })
    }

    const overwriteDataAllocationSelectedModal = (prefix, value) => {
        modalCustomPrizeSelected.data[prefix] = value;
        setModalCustomPrizeSelected({ ...modalCustomPrizeSelected });
    }


    const overwriteDataGroupAllocationModal = (prefix, value) => {
        modalCustomGroupPrize.data[prefix] = value;
        setModalCustomGroupPrize({ ...modalCustomGroupPrize });
    }

    useEffect(() => {
        dispatch(loadDataTableGroupChannelPrize({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
    }, [])

    useEffect(() => {
        if (selectedGroupPrize && groupChannelPrizeList?.length > 0) {
            findSelectedGroupPrize(selectedGroupPrize?.id)
        }
    }, [groupChannelPrizeList])

    const findSelectedGroupPrize = (id) => {
        const find = groupChannelPrizeList?.find(x => x.id === id)
        if (find) {
            setSelectedGroupPrize({ ...find })
        }
        else
            setSelectedGroupPrize(null)
    }


    const renderActionGrid = (params) => {
        return (
            <div className="box-action-container">
                <div>
                    <img src="/asset/images/icons/pencle.svg"
                        onClick={() => {
                            setModalCustomPrizeSelected({ ...modalCustomPrizeSelected, type: 'edit', data: { ...params?.row }, isOpen: true })
                        }}
                        alt="" />
                </div>
                <div>
                    <i className="fas fa-trash text-danger" onClick={async (e) => {
                        const confirm = await showConfirm("X??c nh???n", `B???n c?? ch???c ch???n mu???n xo?? ?????i t?????ng ${params?.row?.name} ?`, "Xo??", "Tr??? v???");
                        if (confirm && params?.row?.id) {
                            removePrizeCommand(params?.row?.id);
                        }
                    }}></i>
                </div>
            </div>
        )
    }

    const columns = [
        {
            field: 'name',
            headerName: 'T??n gi???i th?????ng',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        // {
        //     field: 'image',
        //     headerName: 'H??nh ???nh',
        //     headerClassName: 'headerColumn',
        //     minWidth: 200,
        //     flex: 1,
        //     editable: false,
        // },
        {
            field: 'color',
            headerName: 'M??u n???n',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
            renderCell: (cell) => {
                return <>
                    <button class="edit ms-3 btn" style={{
                        height: '25px',
                        background: cell?.row?.color
                    }}>
                    </button>
                    <p>&nbsp;{cell?.row?.color}</p>
                </>
            }
        },
        {
            field: 'strokeStyle',
            headerName: 'M??u ???????ng k???',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
            renderCell: (cell) => {
                return <>
                    <button class="edit ms-3 btn" style={{
                        height: '25px',
                        background: cell?.row?.strokeStyle
                    }}>
                    </button>
                    <p>&nbsp;{cell?.row?.strokeStyle}</p>
                </>
            }
        },
        {
            field: 'textFillStyle',
            headerName: 'M??u ch???',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
            renderCell: (cell) => {
                return <>
                    <button class="edit ms-3 btn" style={{
                        height: '25px',
                        background: cell?.row?.textFillStyle
                    }}>
                    </button>
                    <p>&nbsp;{cell?.row?.textFillStyle}</p>
                </>
            }
        },
        {
            field: 'textFontSize',
            headerName: 'Font size gi???i',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'action',
            headerName: 'Action',
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

    const createPrizeCommand = (data) => {
        if (selectedGroupPrize?.id) {
            createChannelPrize({ ...data, groupChannelPrizeId: selectedGroupPrize?.id }).then((res) => {
                dispatch(loadDataTableGroupChannelPrize({
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

    const removePrizeCommand = (data) => {
        removeChannelPrize(data).then((res) => {
            dispatch(loadDataTableGroupChannelPrize({
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

    const updatePrizeCommand = (data) => {
        updateChannelPrize(data).then((res) => {
            addToast(<div className="text-center">C???p nh???t th??nh c??ng</div>, { appearance: 'success' });
            dispatch(loadDataTableGroupChannelPrize({
                header: {
                    pageNumber: 1,
                    pageSize: 999
                }
            }))
        }).catch((err) => {
            addToast(<div className="text-center">C???p nh???t th???t b???i</div>, { appearance: 'error' });
        })
    }
    //end

    //
    const updateGroupPrizeCommand = (data) => {
        updateGroupChannelPrize(data).then((res) => {
            dispatch(loadDataTableGroupChannelPrize({
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

    const removeGroupPrizeCommand = (data) => {
        removeGroupChannelPrize(data).then((res) => {
            dispatch(loadDataTableGroupChannelPrize({
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

    const createGroupPrizeCommand = (data) => {
        createGroupChannelPrize(data).then((res) => {
            dispatch(loadDataTableGroupChannelPrize({
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


    return (
        <section class="history-section section-main">
            <h1 class="section-title d-flex align-items-center"> <img class="icon" src="/asset/images/icons/side-4.svg" alt="" />&nbsp; Qu???n l?? nh??m gi???i th?????ng</h1>
            <div class="wrapper-container d-flex">
                <div class="wrap-left">
                    <div class="wrap-left_header d-flex">
                        <h2>Nh??m gi???i th?????ng</h2>
                        <button class="btn btn-add ms-auto" onClick={() => setModalCustomGroupPrize({ ...modalCustomGroupPrize, type: 'new', data: { disabled: false }, isOpen: true })}>
                            <img src="/asset/images/icons/add.svg" alt="" /><span>&nbsp;T???o m???i</span></button>
                    </div>
                    <div class="wrap-left_body">
                        <ul>
                            {
                                groupChannelPrizeList?.map(item => {
                                    return (
                                        <li onClick={() => setSelectedGroupPrize(item)} class={`${item?.id === selectedGroupPrize?.id ? 'active' : ''}`}>
                                            <div class="title-item">
                                                <a class="title">{item?.name}</a>
                                            </div>
                                            <div class="wrap-button">
                                                <a onClick={() => sendUpdateGroupPrizeCommand(item)}>
                                                    <img src="/asset/images/icons/edit.svg" alt="" />
                                                </a>
                                                <a onClick={async () => {
                                                    const confirm = await showConfirm("X??c nh???n", `B???n c?? ch???c ch???n mu???n xo?? ?????i t?????ng ${item?.name} ?`, "Xo??", "Tr??? v???");
                                                    if (confirm && item?.id) {
                                                        removeGroupPrizeCommand(item?.id);
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
                            <h2>&nbsp; Danh s??ch gi???i th?????ng</h2>
                        </div>
                        <div class="wrap-right_header--sort d-flex align-items-center">
                            <button class="btn btn-add ms-auto" onClick={() => setModalCustomPrizeSelected({ ...modalCustomPrizeSelected, type: 'new', data: {}, isOpen: true })}>
                                <img src="/asset/images/icons/add.svg" alt="" />
                                <span>&nbsp;Th??m m???i</span>
                            </button>
                            <button class="btn btn-upload ms-3" type="submit"> <img src="/asset/images/icons/cloud-upload.svg" alt="" /><span>T???i l??n</span></button>
                        </div>
                    </div>
                    <div class="wrap-right_body">
                        {
                            selectedGroupPrize &&
                            <DataGridControl
                                rows={selectedGroupPrize?.channelPrizes}
                                columns={columns}
                                count={selectedGroupPrize?.channelPrizes?.length ?? 0}
                                disableSelectionOnClick
                            />
                        }
                    </div>

                </div>
            </div>

            {/* //modal danh sacsh giai thuong */}
            {
                <Modal
                    isOpen={modalCustomPrizeSelected.isOpen}
                    modalName="role-modal"
                    showOverlay={true}
                    onClose={() => resetModalPrizeSelected()}
                    title="?????i t?????ng ph??n b???"
                    size="md"
                    centered
                >
                    <Modal.Body>
                        {
                            ['edit', 'new'].includes(modalCustomPrizeSelected.type) ?
                                <div className="row">
                                    <div className="col-md-6">
                                        <span>T??n gi???i th?????ng</span>
                                        <InputControl type="text" id="name" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('name', value)
                                        }} defaultValue={modalCustomPrizeSelected.data?.name} />
                                    </div>
                                    <div className="col-md-6">
                                        <span>M??u n???n gi???i th?????ng</span>
                                        <InputControl type="text" id="color" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('color', value)
                                        }} defaultValue={modalCustomPrizeSelected.data?.color} />
                                    </div>
                                    <div className="col-md-6">
                                        <span>M??u ???????ng k???</span>
                                        <InputControl type="text" id="strokeStyle" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('strokeStyle', value)
                                        }} defaultValue={modalCustomPrizeSelected.data?.strokeStyle} />
                                    </div>
                                    <div className="col-md-6">
                                        <span>M??u ch???</span>
                                        <InputControl type="text" id="textFillStyle" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('textFillStyle', value)
                                        }} defaultValue={modalCustomPrizeSelected.data?.textFillStyle} />
                                    </div>
                                    <div className="col-md-6">
                                        <span>Font size gi???i</span>
                                        <InputControl type="text" id="textFontSize" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('textFontSize', value)
                                        }} defaultValue={modalCustomPrizeSelected.data?.textFontSize} />
                                    </div>
                                    {/* <div className="col-md-12">
                                        <span>H??nh ???nh</span>
                                        <InputControl type="text" id="image" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('image', value)
                                        }} defaultValue={modalCustomPrizeSelected.data?.image} />
                                    </div> */}
                                </div>
                                :
                                <>
                                    data
                                </>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-outline-danger mr-25" onClick={() => {
                            resetModalPrizeSelected()
                        }}>????ng</button>

                        <button className="btn btn-outline-primary mr-25" onClick={() => {
                            if (modalCustomPrizeSelected.type === 'new') {
                                createPrizeCommand(modalCustomPrizeSelected.data)
                            }
                            if (modalCustomPrizeSelected.type === 'edit') {
                                updatePrizeCommand(modalCustomPrizeSelected.data)
                            }
                            resetModalPrizeSelected();
                        }}>
                            {(() => {
                                if (modalCustomPrizeSelected.type === 'new') {
                                    return "T???o m???i"
                                }
                                if (modalCustomPrizeSelected.type === 'edit') {
                                    return "C???p nh???t"
                                }
                            })()}
                        </button>
                    </Modal.Footer>
                </Modal>
            }

            {/* //modal nhom giai thuong*/}
            {
                <Modal
                    isOpen={modalCustomGroupPrize.isOpen}
                    modalName="role-modal"
                    showOverlay={true}
                    onClose={() => resetModalGroupPrize()}
                    title="Nh??m gi???i th?????ng"
                    size="md"
                    centered
                >
                    <Modal.Body>
                        {
                            ['edit', 'new'].includes(modalCustomGroupPrize.type) ?
                                <>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <span>T??n nh??m gi???i th?????ng</span>
                                            <InputControl type="text" id="name" onChange={(e) => {
                                                const value = e.target.value ?? '';
                                                overwriteDataGroupAllocationModal('name', value)
                                            }} defaultValue={modalCustomGroupPrize.data?.name} />
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
                            resetModalGroupPrize()
                        }}>????ng</button>

                        <button className="btn btn-outline-primary mr-25" onClick={() => {
                            if (modalCustomGroupPrize.type === 'new') {
                                createGroupPrizeCommand(modalCustomGroupPrize.data)
                            }
                            if (modalCustomGroupPrize.type === 'edit') {
                                updateGroupPrizeCommand(modalCustomGroupPrize.data)
                            }
                            resetModalGroupPrize();
                        }}>
                            {(() => {
                                if (modalCustomGroupPrize.type === 'new') {
                                    return "T???o m???i"
                                }
                                if (modalCustomGroupPrize.type === 'edit') {
                                    return "C???p nh???t"
                                }
                            })()}
                        </button>
                    </Modal.Footer>
                </Modal>
            }
        </section >
    );
}

export default PrizingComponent;