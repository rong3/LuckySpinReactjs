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
import { createWheelSpin, updateWheelSpin, removeWheelSpin } from "../../../../../../services/wheelInstance.service"
import showConfirm from "../../../../../../shared/packages/control/dialog/confirmation"
import UIBuilder from "../../../../../../shared/packages/control/uiBuilder/uiBuilder"
import { wheelConfig } from "../../config/wheelUIConfig"

function WheelInstanceComponent(props) {
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [modalCustom, setModalCustom] = useState({
        isOpen: false,
        data: null,
        type: null
    })
    const { t } = useTranslation('common');
    const { wheelInstanceList } = useSelector((state) => state.wheelInstance);
    useEffect(() => {
        dispatch(loadDataTableWheel({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
    }, [])

    const columns = [
        {
            field: 'name',
            headerName: 'Tên',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'desc',
            headerName: 'Mô tả',
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

    const convertEditAttributeUI = (data) => {
        let maskCopyEdit = _.cloneDeep(wheelConfig.spin_config);
        if (data === null) {
            return maskCopyEdit;
        }
        else {
            const parse = JSON.parse(data);
            const patch = { ...maskCopyEdit, ...parse }
            return patch;
        }
    }

    const editWheelModalAction = (params) => {
        console.log({ params });
        const convert = { ...params?.row, configJson: convertEditAttributeUI(params?.row?.configJson) }
        setModalCustom({ ...modalCustom, type: 'edit', data: convert, isOpen: true })
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
                            removeWheelCommand(params?.row?.id);
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

    const overwriteDataModal = (prefix, value) => {
        modalCustom.data[prefix] = value;
        setModalCustom({ ...modalCustom });
    }

    const updateWheelCommand = (data) => {
        const copyData = {
            id: data?.id,
            name: data?.name,
            desc: data?.desc,
            configJson: JSON.stringify(data?.configJson)
        };

        updateWheelSpin(copyData).then((res) => {
            dispatch(loadDataTableWheel());
            addToast(<div className="text-center">Cập nhật thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Cập nhật thất bại</div>, { appearance: 'error' });
        })
    }

    const createWheelCommand = (data) => {
        createWheelSpin(data).then((res) => {
            dispatch(loadDataTableWheel());
            addToast(<div className="text-center">Thêm thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Thêm thất bại</div>, { appearance: 'error' });
        })
    }

    const removeWheelCommand = (data) => {
        removeWheelSpin(data).then((res) => {
            dispatch(loadDataTableWheel());
            addToast(<div className="text-center">Xoá thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Xoá thất bại</div>, { appearance: 'error' });
        })
    }

    const updateAttributes = (index, key, value) => {
        modalCustom.data.configJson[key].value = value;
        modalCustom.data["edited"] = true;
        setModalCustom({ ...modalCustom })
    }

    return (
        <div className="content">
            <div className="block-content">
                <div className="row row-title">
                    <div className="btn-add">
                        <i className='fa fa-plus'
                            title='Thêm mới'
                            onClick={(e) => {
                                setModalCustom({ ...modalCustom, type: 'new', data: { disabled: false }, isOpen: true })
                            }}>
                            Thêm mới
                        </i>
                    </div>
                </div>
                <div className="row row-title mt-2">
                    <div className="col-md-12 table-height">
                        <DataGridControl
                            rows={wheelInstanceList}
                            columns={columns}
                            count={wheelInstanceList.length}
                            disableSelectionOnClick
                        />
                        {/* //modal crud strategy */}
                        {
                            <Modal
                                isOpen={modalCustom.isOpen}
                                modalName="role-modal"
                                showOverlay={true}
                                onClose={() => resetModal()}
                                title="Giao diện vòng quay"
                                size="xl"
                                centered
                            >
                                <Modal.Body>
                                    {
                                        ['edit', 'new'].includes(modalCustom.type) ?
                                            <>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <span>Tên giao diện</span>
                                                        <InputControl type="text" id="name" onChange={(e) => {
                                                            const value = e.target.value ?? '';
                                                            overwriteDataModal('name', value)
                                                        }} defaultValue={modalCustom.data?.name} />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <span>Mô tả</span>
                                                        <InputControl type="text" id="name" onChange={(e) => {
                                                            const value = e.target.value ?? '';
                                                            overwriteDataModal('desc', value)
                                                        }} defaultValue={modalCustom.data?.desc} />
                                                    </div>
                                                </div>
                                                <hr />
                                                <UIBuilder
                                                    objectKeys={modalCustom?.data?.configJson}
                                                    indexData={0}
                                                    modelChange={updateAttributes} />

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
                                        console.log({ data: modalCustom.data });
                                        if (modalCustom.type === 'new') {
                                            createWheelCommand(modalCustom.data)
                                        }
                                        if (modalCustom.type === 'edit') {
                                            updateWheelCommand(modalCustom.data)
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
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

WheelInstanceComponent.propTypes = {
};

export default WheelInstanceComponent;