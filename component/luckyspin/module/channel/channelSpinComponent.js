import React, { useState, useEffect } from 'react'
import { Typography, FormControl, Data, Button } from '@material-ui/core'
import { InputControl } from "../../../../shared/packages/control/input/inputControl"
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import mobileDetectHOC from "../../../../shared/packages/hocs/mobileDetect"
import { usePermission } from "../../../../shared/packages/provider/accessGateway"
import withPermission from "../../../../shared/packages/hocs/permission/permissionHOC"
import DataGridControl from '../../../../shared/packages/control/grid/datagrid';
import { loadDataTableChannelSpin } from "../../../../redux/actions/channelActions"
import { loadDataTableProxyAllocationGroup } from "../../../../redux/actions/proxyAllocationGroupActions"
import { updateChannelSpin, createChannelSpin, removeChannelSpin } from "../../../../services/channelSpin.service"
import Modal from "../../../../shared/packages/control/modal/index";
import SelectBox from "../../../../shared/packages/control/selectBox/selectBox"
import showConfirm from "../../../../shared/packages/control/dialog/confirmation"

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

function ChannelSpinComponent(props) {
    const [allows] = usePermission();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [modalCustom, setModalCustom] = useState({
        isOpen: false,
        data: null,
        type: null
    })

    const { channelSpinList } = useSelector((state) => state.channelSpin);
    const { proxyAllocationGroupList } = useSelector((state) => state.proxyAllocationGroup);
    const { classes } = props;
    const { t } = useTranslation('common');

    useEffect(() => {
        dispatch(loadDataTableChannelSpin({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
        dispatch(loadDataTableProxyAllocationGroup({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
    }, [])

    function getProxyName(params) {
        return `${params?.row?.proxyAllocationGroup?.name || ''}`;
    }

    function getProxyDesc(params) {
        return `${params?.row?.proxyAllocationGroup?.desc || ''}`;
    }

    const columns = [
        {
            field: 'channelName',
            headerName: 'Tên channel',
            headerClassName: 'headerColumn',
            flex: 1,
            editable: false,
        },
        {
            field: 'channelDesc',
            headerName: 'Mô tả channel',
            headerClassName: 'headerColumn',
            flex: 1,
            editable: false,
        },
        {
            field: 'proxyAllocationGroup_name',
            headerName: 'Tệp khách hàng',
            headerClassName: 'headerColumn',
            valueGetter: getProxyName,
            flex: 1,
            editable: false,
        },
        {
            field: 'proxyAllocationGroup_desc',
            headerName: 'Mô tả tệp khách hàng',
            headerClassName: 'headerColumn',
            valueGetter: getProxyDesc,
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

    const overwriteDataModal = (prefix, value) => {
        modalCustom.data[prefix] = value;
        setModalCustom({ ...modalCustom });
    }

    const renderActionGrid = (params) => {
        return (
            <div className="box-action-container">
                <div>
                    <i className="fas fa-edit text-info" onClick={() => {
                        console.log({ params });
                        setModalCustom({ ...modalCustom, type: 'edit', data: { ...params?.row }, isOpen: true })
                    }}></i>
                </div>
                <div>
                    <i className="fas fa-trash text-danger" onClick={async (e) => {
                        const confirm = await showConfirm("Xác nhận", `Bạn có chắc chắn muốn xoá đối tượng ${params?.row?.channelName} ?`, "Xoá", "Trở về");
                        if (confirm && params?.row?.id) {
                            removeChannelCommand(params?.row?.id);
                        }
                    }}></i>
                </div>
            </div>
        )
    }

    //update channel command
    const resetModal = () => {
        setModalCustom({ ...modalCustom, isOpen: false, data: null, type: null })
    }

    const createChannelCommand = (data) => {
        createChannelSpin(data).then((res) => {
            dispatch(loadDataTableChannelSpin());
            addToast(<div className="text-center">Thêm thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Thêm thất bại</div>, { appearance: 'error' });
        })
    }

    const updateChannelCommand = (data) => {
        updateChannelSpin(data).then((res) => {
            dispatch(loadDataTableChannelSpin());
            addToast(<div className="text-center">Cập nhật thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Cập nhật thất bại</div>, { appearance: 'error' });
        })
    }

    const removeChannelCommand = (data) => {
        removeChannelSpin(data).then((res) => {
            dispatch(loadDataTableChannelSpin());
            addToast(<div className="text-center">Xoá thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Xoá thất bại</div>, { appearance: 'error' });
        })
    }

    return (
        <div className={classes.root}>
            <div className="content">
                <div className="block-content">
                    <div className="row row-title">
                        <div className="col-md-12">
                            <i className="far fa-eye"></i>
                            <span className="title-text">&nbsp;Danh sách kênh vòng quay</span>
                        </div>
                        <div className="strategy-btn-add">
                            <i className='fa fa-plus'
                                title='Thêm mới'
                                onClick={(e) => {
                                    setModalCustom({ ...modalCustom, type: 'new', data: { disabled: false }, isOpen: true })
                                }}>
                            </i>
                        </div>
                    </div>
                    <div className="row row-title mt-3">
                        <div className="col-md-12 table-height">
                            <DataGridControl
                                rows={channelSpinList}
                                columns={columns}
                                count={channelSpinList.length}
                                disableSelectionOnClick
                            />
                            {
                                <Modal
                                    isOpen={modalCustom.isOpen}
                                    modalName="role-modal"
                                    showOverlay={true}
                                    onClose={() => resetModal()}
                                    title="Kênh vòng quay"
                                    size="md"
                                    centered
                                >
                                    <Modal.Body>
                                        {
                                            ['edit', 'new'].includes(modalCustom.type) ?
                                                <>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <span>Tên channel</span>
                                                            <InputControl type="text" id="name" onChange={(e) => {
                                                                const value = e.target.value ?? '';
                                                                overwriteDataModal('channelName', value)
                                                            }} defaultValue={modalCustom.data?.channelName} />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>Mô tả</span>
                                                            <InputControl type="text" id="name" onChange={(e) => {
                                                                const value = e.target.value ?? '';
                                                                overwriteDataModal('channelDesc', value)
                                                            }} defaultValue={modalCustom.data?.channelDesc} />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>Tệp khách hàng</span>
                                                            <SelectBox id="selectbox"
                                                                optionLabel="name"
                                                                optionValue="value"
                                                                onChange={(data) => {
                                                                    overwriteDataModal('proxyAllocationGroupId', data)
                                                                }}
                                                                value={modalCustom.data?.proxyAllocationGroupId}
                                                                isPortal
                                                                options={proxyAllocationGroupList?.map(x => ({ ...x, name: x?.name, value: x?.id })) ?? []}
                                                            />
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
                                            console.log({ data: modalCustom.data });
                                            if (modalCustom.type === 'new') {
                                                createChannelCommand(modalCustom.data)
                                            }
                                            if (modalCustom.type === 'edit') {
                                                updateChannelCommand(modalCustom.data)
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
        </div>
    )
}

ChannelSpinComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withPermission(mobileDetectHOC(withStyles(styles)(ChannelSpinComponent)));