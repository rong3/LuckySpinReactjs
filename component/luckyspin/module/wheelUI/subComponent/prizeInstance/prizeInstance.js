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
            headerName: 'Tên giải thưởng',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'image',
            headerName: 'Hình ảnh',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'color',
            headerName: 'Màu',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'created',
            headerName: 'Ngày tạo',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'lastModified',
            headerName: 'Ngày sửa lần cuối',
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
                        const confirm = await showConfirm("Xác nhận", `Bạn có chắc chắn muốn xoá đối tượng ${params?.row?.name} ?`, "Xoá", "Trở về");
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
            addToast(<div className="text-center">Cập nhật thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Cập nhật thất bại</div>, { appearance: 'error' });
        })
    }

    const createPrizeCommand = (data) => {
        createChannelPrize(data).then((res) => {
            dispatch(loadDataTableGroupChannelPrize());
            addToast(<div className="text-center">Thêm thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Thêm thất bại</div>, { appearance: 'error' });
        })
    }

    const removePrizeCommand = (data) => {
        removeChannelPrize(data).then((res) => {
            dispatch(loadDataTableGroupChannelPrize());
            addToast(<div className="text-center">Xoá thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Xoá thất bại</div>, { appearance: 'error' });
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
            addToast(<div className="text-center">Thêm thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Thêm thất bại</div>, { appearance: 'error' });
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
            addToast(<div className="text-center">Cập nhật thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Cập nhật thất bại</div>, { appearance: 'error' });
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
                addToast(<div className="text-center">Xoá thành công</div>, { appearance: 'success' });
            }
            else {
                addToast(<div className="text-center">Xoá thất bại</div>, { appearance: 'error' });
            }
        }).catch((err) => {
            addToast(<div className="text-center">Xoá thất bại</div>, { appearance: 'error' });
        })
    }

    const sendUpdateGroupPrizeCommand = (data) => {
        setModalCustomGroupPrize({ ...modalCustomGroupPrize, type: 'edit', data: data, isOpen: true })
    }

    const sendRemoveGroupPrizeCommand = async (data) => {
        const confirm = await showConfirm("Xác nhận", `Bạn có chắc chắn muốn xoá đối tượng ${data?.name} ?`, "Xoá", "Trở về");
        if (confirm && data?.id) {
            removeGroupPrizeCommand(data?.id);
        }
    }


    return (
        <div className='content'>
            <div className="row">
                <div className='col-md-2'>
                    <ListBoxComponent
                        title={"Nhóm giải thưởng"}
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
                            title="Nhóm khách hàng"
                            size="md"
                            centered
                        >
                            <Modal.Body>
                                {
                                    ['edit', 'new'].includes(modalCustomGroupPrize.type) ?
                                        <>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <span>Tên nhóm khách hàng</span>
                                                    <InputControl type="text" id="name" onChange={(e) => {
                                                        const value = e.target.value ?? '';
                                                        overwriteDataGroupPrizeModal('name', value)
                                                    }} defaultValue={modalCustomGroupPrize.data?.name} />
                                                </div>
                                                <div className="col-md-12">
                                                    <span>Mô tả</span>
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
                                }}>Đóng</button>

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
                                            return "Tạo mới"
                                        }
                                        if (modalCustomGroupPrize.type === 'edit') {
                                            return "Cập nhật"
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
                                <span>&nbsp;Danh sách giải thưởng&nbsp;</span>
                            </i>
                            <br />
                            <hr />
                            <div className="strategy-btn-add">
                                <i className='fa fa-plus'
                                    title='Thêm mới'
                                    onClick={(e) => {
                                        setModalCustom({ ...modalCustom, type: 'new', data: { groupChannelPrizeId: selectedGroupPrize?.id }, isOpen: true })
                                    }}>
                                    Thêm mới
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
                                    title="Tập khách hàng"
                                    size="md"
                                    centered
                                >
                                    <Modal.Body>
                                        {
                                            ['edit', 'new'].includes(modalCustom.type) ?
                                                <>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <span>Tên giải thưởng</span>
                                                            <InputControl type="text" id="name" onChange={(e) => {
                                                                const value = e.target.value ?? '';
                                                                overwriteDataModal('name', value)
                                                            }} defaultValue={modalCustom.data?.name} />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>Địa chỉ ảnh giải thưởng</span>
                                                            <InputControl type="text" id="name" onChange={(e) => {
                                                                const value = e.target.value ?? '';
                                                                overwriteDataModal('image', value)
                                                            }} defaultValue={modalCustom.data?.image} />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>Màu nền giải thưởng</span>
                                                            <InputControl type="text" id="name" onChange={(e) => {
                                                                const value = e.target.value ?? '';
                                                                overwriteDataModal('color', value)
                                                            }} defaultValue={modalCustom.data?.color} />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>Màu đường kẻ</span>
                                                            <InputControl type="text" id="name" onChange={(e) => {
                                                                const value = e.target.value ?? null;
                                                                overwriteDataModal('strokeStyle', value)
                                                            }} defaultValue={modalCustom.data?.strokeStyle} />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>Màu chữ</span>
                                                            <InputControl type="text" id="name" onChange={(e) => {
                                                                const value = e.target.value ?? null;
                                                                overwriteDataModal('textFillStyle', value)
                                                            }} defaultValue={modalCustom.data?.textFillStyle} />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>Font size giải</span>
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
                                        }}>Đóng</button>

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
                                                    return "Tạo mới"
                                                }
                                                if (modalCustom.type === 'edit') {
                                                    return "Cập nhật"
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