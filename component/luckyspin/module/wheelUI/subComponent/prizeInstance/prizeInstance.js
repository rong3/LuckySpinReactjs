import React, { useState, useEffect } from 'react'
import { Typography, FormControl, Data, Button } from '@material-ui/core'
import { InputControl } from "../../../../../../shared/packages/control/input/inputControl"
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { loadDataTableWheel } from "../../../../../../redux/actions/wheelInstanceAction"
import DataGridControl from '../../../../../../shared/packages/control/grid/datagrid';
import Modal from "../../../../../../shared/packages/control/modal/index";
import { createChannelPrize, updateChannelPrize, removeChannelPrize } from "../../../../../../services/channelPrize.service"
import showConfirm from "../../../../../../shared/packages/control/dialog/confirmation"
import UIBuilder from "../../../../../../shared/packages/control/uiBuilder/uiBuilder"
import { wheelConfig } from "../../config/wheelUIConfig"
import ListBoxComponent from "../../../../../../shared/packages/control/listBox/listBox"

function PrizeInstanceComponent(props) {
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [modalCustom, setModalCustom] = useState({
        isOpen: false,
        data: null,
        type: null
    })
    const { t } = useTranslation('common');
    const { wheelInstanceList } = useSelector((state) => state.wheelInstance);
    const [selectedWheelInstance, setSelectedWheelInstance] = useState(null);

    useEffect(() => {
        const find = wheelInstanceList?.find(x => x.id === selectedWheelInstance?.id)
        if (find) {
            setSelectedWheelInstance({ ...find })
        }
    }, [wheelInstanceList])

    const columns = [
        {
            field: 'name',
            headerName: 'Tên giải thưởng',
            headerClassName: 'headerColumn',
            flex: 1,
            editable: false,
        },
        {
            field: 'image',
            headerName: 'Hình ảnh',
            headerClassName: 'headerColumn',
            flex: 1,
            editable: false,
        },
        {
            field: 'color',
            headerName: 'Màu',
            headerClassName: 'headerColumn',
            flex: 1,
            editable: false,
        },
        {
            field: 'created',
            headerName: 'Ngày tạo',
            headerClassName: 'headerColumn',
            flex: 1,
            editable: false,
        },
        {
            field: 'lastModified',
            headerName: 'Ngày sửa lần cuối',
            headerClassName: 'headerColumn',
            flex: 1,
            editable: false,
        },
        {
            field: 'action',
            headerName: 'Action',
            sortable: false,
            headerClassName: 'headerColumn',
            headerAlign: 'center',
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
            dispatch(loadDataTableWheel());
            addToast(<div className="text-center">Cập nhật thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Cập nhật thất bại</div>, { appearance: 'error' });
        })
    }

    const createPrizeCommand = (data) => {
        createChannelPrize(data).then((res) => {
            dispatch(loadDataTableWheel());
            addToast(<div className="text-center">Thêm thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Thêm thất bại</div>, { appearance: 'error' });
        })
    }

    const removePrizeCommand = (data) => {
        removeChannelPrize(data).then((res) => {
            dispatch(loadDataTableWheel());
            addToast(<div className="text-center">Xoá thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Xoá thất bại</div>, { appearance: 'error' });
        })
    }

    const overwriteDataModal = (prefix, value) => {
        modalCustom.data[prefix] = value === "" ? null : value;
        setModalCustom({ ...modalCustom });
    }


    return (
        <div className='content'>
            <div className="row">
                <div className='col-md-2'>
                    <ListBoxComponent
                        title={"Danh sách vòng quay"}
                        onClickItem={(e) => {
                            setSelectedWheelInstance(e);
                        }}
                        options={wheelInstanceList?.map(x => ({ ...x, label: x?.name, value: x?.id }))} />

                </div>
                {
                    selectedWheelInstance &&
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
                                        setModalCustom({ ...modalCustom, type: 'new', data: { wheelInstanceId: selectedWheelInstance?.id }, isOpen: true })
                                    }}>
                                    Thêm mới
                                </i>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <DataGridControl
                                    rows={selectedWheelInstance?.channelPrizes}
                                    columns={columns}
                                    count={selectedWheelInstance?.channelPrizes?.length}
                                    disableSelectionOnClick
                                />
                                <Modal
                                    isOpen={modalCustom.isOpen}
                                    modalName="role-modal"
                                    showOverlay={true}
                                    onClose={() => resetModal()}
                                    title="Nhóm phân bổ"
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