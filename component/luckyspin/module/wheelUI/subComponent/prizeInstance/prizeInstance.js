import React, { useState, useEffect } from 'react'
import { Typography, FormControl, Data, Button } from '@material-ui/core'
import { InputControl } from "../../../../../../shared/packages/control/input/inputControl"
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { loadDataTableGroupChannelPrize } from "../../../../../../redux/actions/groupChannelPrizeAction"
import DataGridControl from '../../../../../../shared/packages/control/grid/datagrid';
import Modal from "../../../../../../shared/packages/control/modal/index";
import { createChannelPrize, updateChannelPrize, removeChannelPrize } from "../../../../../../services/channelPrize.service"
import { createGroupChannelPrize, updateGroupChannelPrize, removeGroupChannelPrize } from "../../../../../../services/groupChannelPrize.service"
import showConfirm from "../../../../../../shared/packages/control/dialog/confirmation"
import ListBoxComponent from "../../../../../../shared/packages/control/listBox/listBox"

function PrizeInstanceComponent(props) {
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [modalCustom, setModalCustom] = useState({
        isOpen: false,
        data: null,
        type: null
    })

    const [modalCustomGroupPrize, setModalCustomGroupPrize] = useState({
        isOpen: false,
        data: null,
        type: null
    })
    const { t } = useTranslation('common');
    const { groupChannelPrizeList } = useSelector((state) => state.groupChannelPrize);
    const [selectedGroupPrize, setSelectedGroupPrize] = useState(null);

    useEffect(() => {
        dispatch(loadDataTableGroupChannelPrize({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
    }, [])

    useEffect(() => {
        const find = groupChannelPrizeList?.find(x => x.id === selectedGroupPrize?.id)
        if (find) {
            setSelectedGroupPrize({ ...find })
        }
    }, [groupChannelPrizeList])

    const columns = [
        {
            field: 'name',
            headerName: 'T??n gi???i th?????ng',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'image',
            headerName: 'H??nh ???nh',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'color',
            headerName: 'M??u',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'created',
            headerName: 'Ng??y t???o',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'lastModified',
            headerName: 'Ng??y s???a l???n cu???i',
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

    const editWheelModalAction = (params) => {
        setModalCustom({ ...modalCustom, type: 'edit', data: params?.row, isOpen: true })
    }

    const renderActionGrid = (params) => {
        return (
            <div className="box-action-container">
                <div>
                    <i className="fas fa-edit text-info" onClick={() => {
                        editWheelModalAction(params)
                    }}></i>
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

    //update strategy command
    const resetModal = () => {
        setModalCustom({ ...modalCustom, isOpen: false, data: null, type: null })
    }

    const updatePrizeCommand = (data) => {
        updateChannelPrize(data).then((res) => {
            dispatch(loadDataTableGroupChannelPrize());
            addToast(<div className="text-center">C???p nh???t th??nh c??ng</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">C???p nh???t th???t b???i</div>, { appearance: 'error' });
        })
    }

    const createPrizeCommand = (data) => {
        createChannelPrize(data).then((res) => {
            dispatch(loadDataTableGroupChannelPrize());
            addToast(<div className="text-center">Th??m th??nh c??ng</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Th??m th???t b???i</div>, { appearance: 'error' });
        })
    }

    const removePrizeCommand = (data) => {
        removeChannelPrize(data).then((res) => {
            dispatch(loadDataTableGroupChannelPrize());
            addToast(<div className="text-center">Xo?? th??nh c??ng</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Xo?? th???t b???i</div>, { appearance: 'error' });
        })
    }

    const overwriteDataModal = (prefix, value) => {
        modalCustom.data[prefix] = value === "" ? null : value;
        setModalCustom({ ...modalCustom });
    }

    //quan ly nhom KH

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

    const overwriteDataGroupPrizeModal = (prefix, value) => {
        modalCustomGroupPrize.data[prefix] = value;
        setModalCustomGroupPrize({ ...modalCustomGroupPrize });
    }
    const resetModalGroupPrize = () => {
        setModalCustomGroupPrize({ ...modalCustomGroupPrize, isOpen: false, data: null, type: null })
    }

    const removeGroupPrizeCommand = (data) => {
        removeGroupChannelPrize(data).then((res) => {
            if (res?.data?.succeeded) {
                dispatch(loadDataTableGroupChannelPrize({
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

    const sendUpdateGroupPrizeCommand = (data) => {
        setModalCustomGroupPrize({ ...modalCustomGroupPrize, type: 'edit', data: data, isOpen: true })
    }

    const sendRemoveGroupPrizeCommand = async (data) => {
        const confirm = await showConfirm("X??c nh???n", `B???n c?? ch???c ch???n mu???n xo?? ?????i t?????ng ${data?.name} ?`, "Xo??", "Tr??? v???");
        if (confirm && data?.id) {
            removeGroupPrizeCommand(data?.id);
        }
    }


    return (
        <div className='content'>
            <div className="row">
                <div className='col-md-2'>
                    <ListBoxComponent
                        title={"Nh??m gi???i th?????ng"}
                        onClickItem={(e) => {
                            setSelectedGroupPrize(e);
                        }}
                        onAddNew={() => {
                            setModalCustomGroupPrize({ ...modalCustomGroupPrize, type: 'new', data: {}, isOpen: true })
                        }}
                        onUpdate={(data) => sendUpdateGroupPrizeCommand(data)}
                        onDelete={async (data) => await sendRemoveGroupPrizeCommand(data)}
                        options={groupChannelPrizeList?.map(x => ({ ...x, label: x?.name, value: x?.id }))} />
                    {
                        <Modal
                            isOpen={modalCustomGroupPrize.isOpen}
                            modalName="role-modal"
                            showOverlay={true}
                            onClose={() => resetModalGroupPrize()}
                            title="Nh??m kh??ch h??ng"
                            size="md"
                            centered
                        >
                            <Modal.Body>
                                {
                                    ['edit', 'new'].includes(modalCustomGroupPrize.type) ?
                                        <>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <span>T??n nh??m kh??ch h??ng</span>
                                                    <InputControl type="text" id="name" onChange={(e) => {
                                                        const value = e.target.value ?? '';
                                                        overwriteDataGroupPrizeModal('name', value)
                                                    }} defaultValue={modalCustomGroupPrize.data?.name} />
                                                </div>
                                                <div className="col-md-12">
                                                    <span>M?? t???</span>
                                                    <InputControl type="text" id="name" onChange={(e) => {
                                                        const value = e.target.value ?? '';
                                                        overwriteDataGroupPrizeModal('desc', value)
                                                    }} defaultValue={modalCustomGroupPrize.data?.desc} />
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
                </div>
                {
                    selectedGroupPrize &&
                    <div className="col-md-10">
                        <div className="row">
                            <i className='fa fa-list'>
                                <span>&nbsp;Danh s??ch gi???i th?????ng&nbsp;</span>
                            </i>
                            <br />
                            <hr />
                            <div className="strategy-btn-add">
                                <i className='fa fa-plus'
                                    title='Th??m m???i'
                                    onClick={(e) => {
                                        setModalCustom({ ...modalCustom, type: 'new', data: { groupChannelPrizeId: selectedGroupPrize?.id }, isOpen: true })
                                    }}>
                                    Th??m m???i
                                </i>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <DataGridControl
                                    rows={selectedGroupPrize?.channelPrizes}
                                    columns={columns}
                                    count={selectedGroupPrize?.channelPrizes?.length}
                                    disableSelectionOnClick
                                />
                                <Modal
                                    isOpen={modalCustom.isOpen}
                                    modalName="role-modal"
                                    showOverlay={true}
                                    onClose={() => resetModal()}
                                    title="T???p kh??ch h??ng"
                                    size="md"
                                    centered
                                >
                                    <Modal.Body>
                                        {
                                            ['edit', 'new'].includes(modalCustom.type) ?
                                                <>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <span>T??n gi???i th?????ng</span>
                                                            <InputControl type="text" id="name" onChange={(e) => {
                                                                const value = e.target.value ?? '';
                                                                overwriteDataModal('name', value)
                                                            }} defaultValue={modalCustom.data?.name} />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>?????a ch??? ???nh gi???i th?????ng</span>
                                                            <InputControl type="text" id="name" onChange={(e) => {
                                                                const value = e.target.value ?? '';
                                                                overwriteDataModal('image', value)
                                                            }} defaultValue={modalCustom.data?.image} />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>M??u n???n gi???i th?????ng</span>
                                                            <InputControl type="text" id="name" onChange={(e) => {
                                                                const value = e.target.value ?? '';
                                                                overwriteDataModal('color', value)
                                                            }} defaultValue={modalCustom.data?.color} />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>M??u ???????ng k???</span>
                                                            <InputControl type="text" id="name" onChange={(e) => {
                                                                const value = e.target.value ?? null;
                                                                overwriteDataModal('strokeStyle', value)
                                                            }} defaultValue={modalCustom.data?.strokeStyle} />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>M??u ch???</span>
                                                            <InputControl type="text" id="name" onChange={(e) => {
                                                                const value = e.target.value ?? null;
                                                                overwriteDataModal('textFillStyle', value)
                                                            }} defaultValue={modalCustom.data?.textFillStyle} />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>Font size gi???i</span>
                                                            <InputControl type="text" id="name" onChange={(e) => {
                                                                const value = e.target.value ?? null;
                                                                overwriteDataModal('textFontSize', value)
                                                            }} defaultValue={modalCustom.data?.textFontSize} />
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
                                            resetModal()
                                        }}>????ng</button>

                                        <button className="btn btn-outline-primary mr-25" onClick={() => {
                                            if (modalCustom.type === 'new') {
                                                createPrizeCommand(modalCustom.data)
                                            }
                                            if (modalCustom.type === 'edit') {
                                                updatePrizeCommand(modalCustom.data)
                                            }
                                            resetModal();
                                        }}>
                                            {(() => {
                                                if (modalCustom.type === 'new') {
                                                    return "T???o m???i"
                                                }
                                                if (modalCustom.type === 'edit') {
                                                    return "C???p nh???t"
                                                }
                                            })()}
                                        </button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

PrizeInstanceComponent.propTypes = {
};

export default PrizeInstanceComponent;