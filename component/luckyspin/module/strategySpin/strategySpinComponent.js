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
import { loadDataTable } from "../../../../redux/actions/strategyActions"
import { loadDataTableGroupAllocation } from "../../../../redux/actions/groupAllocationActions"
import { loadDataTableMasterObj } from "../../../../redux/actions/masterObjectAllocationActions"
import { loadDataTableWheel } from "../../../../redux/actions/wheelInstanceAction"
import { loadDataTableThemeSpin } from "../../../../redux/actions/themeAction"
import { loadDataTableGroupChannelPrize } from "../../../../redux/actions/groupChannelPrizeAction"
import Modal from "../../../../shared/packages/control/modal/index";
import SelectBox from "../../../../shared/packages/control/selectBox/selectBox"
import DateTimeInput from "../../../../shared/packages/control/input/datetime"
import { updateStrategySpin, createStrategySpin, removeStrategySpin } from "../../../../services/strategySpin.service"
import { getGroupAllocationById } from "../../../../services/groupAllocation.service"
import { getProxyAllocationStrategy } from "../../../../services/proxyAllocationStrategy.service"
import { getChannelPrizeByGroupChannelId } from "../../../../services/channelPrize.service"
import { getProxyPrizeAdmin } from "../../../../services/proxyPrize.service"
import showConfirm from "../../../../shared/packages/control/dialog/confirmation"
import { strategyConfig, prizeConfig } from "./config/strategyConfig"
import GroupAllocationAttributeModal from "./subModal/groupAllocationAttribute/groupAllocationAttribute"
import ChannelPrizeModal from "./subModal/channelPrizeModal/channelprizeModal"

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

function StrategySpinComponent(props) {
    const [allows] = usePermission();
    const { addToast } = useToasts();
    const dispatch = useDispatch();

    const [modalCustom, setModalCustom] = useState({
        isOpen: false,
        data: null,
        type: null
    })

    const [modalAllocationAttribute, setModalAllocationAttribute] = useState({
        isOpen: false,
        data: null,
    })

    const [modalPrizeAttribute, setModalPrizeAttribute] = useState({
        isOpen: false,
        data: null,
    })

    const { strategyList } = useSelector((state) => state.strategy);
    const { groupAllocationsList } = useSelector((state) => state.groupAllocation);
    const { wheelInstanceList } = useSelector((state) => state.wheelInstance);
    const { themeInstanceList } = useSelector((state) => state.themeInstance);
    const { masterObjectAllocationList } = useSelector((state) => state.masterObjectAllocation);
    const { groupChannelPrizeList } = useSelector((state) => state.groupChannelPrize);

    const { classes } = props;
    const { t } = useTranslation('common');

    useEffect(() => {
        dispatch(loadDataTable());
        dispatch(loadDataTableMasterObj({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
        dispatch(loadDataTableGroupAllocation({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
        dispatch(loadDataTableWheel({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
        dispatch(loadDataTableThemeSpin({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
        dispatch(loadDataTableGroupChannelPrize({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
    }, [])

    function getAttribute(params) {
        if (params.field === 'groupAllocationName')
            return params.row?.groupAllocation?.name;
        if (params.field === 'wheelInstanceName')
            return params.row?.wheelInstance?.name;
        if (params.field === 'themeInstanceNamne')
            return params.row?.themeInstance?.name;
        if (params.field === 'masterAllocationName')
            return params.row?.masterObjectAllocation?.objectName;
        if (params.field === 'groupChannelPrize')
            return params.row?.groupChannelPrize?.name;
        else
            return ""
    }

    const columns = [
        {
            field: 'name',
            headerName: 'Tên chiến lược',
            headerClassName: 'headerColumn',
            minWidth: 100,
            flex: 1,
            editable: false,
            renderCell: (cell) => {
                return <a href={`/embedded/lucky-spin?id=${cell?.row?.id}`} target={'_blank'}>
                    {cell?.row?.name}
                </a>
            }
        },
        {
            field: 'masterAllocationName',
            headerName: 'Loại chiến lược',
            headerClassName: 'headerColumn',
            minWidth: 100,
            flex: 1,
            valueGetter: getAttribute,
            editable: false,
        },
        {
            field: 'groupAllocationName',
            headerName: 'Nhóm khách hàng',
            headerClassName: 'headerColumn',
            minWidth: 150,
            flex: 1,
            valueGetter: getAttribute,
            editable: false,
        },
        {
            field: 'groupChannelPrize',
            headerName: 'Nhóm giải thưởng',
            headerClassName: 'headerColumn',
            minWidth: 150,
            flex: 1,
            valueGetter: getAttribute,
            editable: false,
        },
        {
            field: 'wheelInstanceName',
            headerName: 'Giao diện vòng quay',
            headerClassName: 'headerColumn',
            minWidth: 150,
            flex: 1,
            valueGetter: getAttribute,
            editable: false,
        },
        {
            field: 'themeInstanceNamne',
            headerName: 'Backdrop vòng quay',
            headerClassName: 'headerColumn',
            minWidth: 150,
            flex: 1,
            valueGetter: getAttribute,
            editable: false,
        },
        {
            field: 'disabled',
            headerName: 'Vô hiệu lực',
            headerClassName: 'headerColumn',
            minWidth: 100,
            flex: 1,
            editable: false,
        },
        {
            field: 'created',
            headerName: 'Ngày tạo',
            headerClassName: 'headerColumn',
            minWidth: 100,
            flex: 1,
            editable: false,
        },
        {
            field: 'lastModified',
            headerName: 'Ngày sửa lần cuối',
            headerClassName: 'headerColumn',
            minWidth: 100,
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

    const overwriteDataModal = (prefix, value) => {
        modalCustom.data[prefix] = value;
        setModalCustom({ ...modalCustom });
    }

    //To check data exists groupAllocationId for custom allocaiton object attribute
    const checkShowLayerAllocation = (data) => {
        const row_GroupAllocationID = data?.groupAllocationId;
        if (row_GroupAllocationID) {
            return {
                groupAllocationId: row_GroupAllocationID,
                show: true
            }
        }
        else return {
            groupAllocationId: null,
            show: false
        };
    }

    const checkShowPrizeAllocation = (data) => {
        return {
            groupChannelPrizeId: data?.groupChannelPrizeId,
            show: data?.groupChannelPrizeId !== null
        };
    }


    const convertEditAttributeUI = (data) => {
        let maskCopyEdit = _.cloneDeep(strategyConfig.maskEditModel);
        if (data === null) {
            return maskCopyEdit;
        }
        else {
            const parse = JSON.parse(data);
            const patch = { ...maskCopyEdit, ...parse }
            return patch;
        }
    }

    const convertEditPrizeUI = (data) => {
        let maskCopyEdit = _.cloneDeep(prizeConfig);
        if (data === null) {
            return maskCopyEdit;
        }
        else {
            Object.keys(maskCopyEdit)?.map(x => {
                maskCopyEdit[x].value = data[x];
            })
            return maskCopyEdit;
        }
    }

    const openAllocationLayer = (params) => {
        const groupAllocationId = checkShowLayerAllocation(params?.row)?.groupAllocationId;
        if (groupAllocationId) {
            //get group id to get all master selected
            getGroupAllocationById(groupAllocationId).then((res) => {
                const strategyID = params?.row?.id;
                const masterIds = res?.data?.data?.masterAllocationSelecteds?.map(x => x.id) ?? [];
                //from list master selected, we put on proxy to get attributes data
                getProxyAllocationStrategy({
                    "strategySpinId": strategyID,
                    "masterAllocationSelectedIds": masterIds
                }).then((res2) => {
                    const proxySelectedsList = res2?.data?.data;
                    setModalAllocationAttribute({
                        ...modalAllocationAttribute, data: {
                            strategySpin: params?.row,
                            groupAllocation: {
                                ...res?.data?.data,
                                masterAllocationSelecteds: res?.data?.data?.masterAllocationSelecteds?.map(x =>
                                ({
                                    ...x,
                                    idProxy: proxySelectedsList?.find(y => x.id === y.masterAllocationSelectedId)?.id,
                                    strategyId: params?.row?.id,
                                    attributes: convertEditAttributeUI(proxySelectedsList?.find(y => x.id === y.masterAllocationSelectedId)?.attributes)
                                }))
                            }
                        }, isOpen: true
                    })
                })
            })
        }
    }

    const openPrizeLayer = (params) => {
        const groupChannelPrizeId = params?.groupChannelPrizeId;
        if (groupChannelPrizeId) {
            getChannelPrizeByGroupChannelId(groupChannelPrizeId).then((res) => {
                const strategyID = params?.id;
                const channelIds = res?.data?.data?.map(x => x.id) ?? [];
                //from list master selected, we put on proxy to get attributes data
                getProxyPrizeAdmin({
                    "strategySpinId": strategyID,
                    "channelPrizeIds": channelIds
                }).then((res2) => {
                    const proxySelectedsList = res2?.data?.data;
                    setModalPrizeAttribute({
                        ...modalPrizeAttribute,
                        data: {
                            channelPrizes: res?.data?.data?.map(item => ({
                                ...item,
                                strategyId: params?.id,
                                idProxy: proxySelectedsList?.find(y => item.id === y.channelPrizeId)?.id,
                                proxyAttribute: convertEditPrizeUI(proxySelectedsList?.find(y => item.id === y.channelPrizeId)),
                            }))
                        },
                        isOpen: true
                    })
                })

            })
        }
    }


    const renderActionGrid = (params) => {
        return (
            <div className="box-action-container">
                {
                    checkShowLayerAllocation(params?.row)?.show &&
                    <div>
                        <i className="fas fa-layer-group" title='Chỉnh chỉ số đối tượng' onClick={(e) => {
                            openAllocationLayer(params)
                        }}></i>
                    </div>
                }
                {
                    checkShowPrizeAllocation(params?.row)?.show &&
                    <div>
                        <i className="fas fa-gift text-success" title='Chỉnh chỉ số giải thưởng' onClick={(e) => {
                            openPrizeLayer(params?.row)
                        }}></i>
                    </div>
                }
                <div>
                    <i className="fas fa-edit text-info" title='Chỉnh sửa' onClick={() => {
                        console.log({ params });
                        setModalCustom({ ...modalCustom, type: 'edit', data: { ...params?.row }, isOpen: true })
                    }}></i>
                </div>
                <div>
                    <i className="fas fa-trash text-danger" title='Xoá' onClick={async (e) => {
                        const confirm = await showConfirm("Xác nhận", `Bạn có chắc chắn muốn xoá đối tượng ${params?.row?.name} ?`, "Xoá", "Trở về");
                        if (confirm && params?.row?.id) {
                            removeStrategyCommand(params?.row?.id);
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

    const updateStrategyCommand = (data) => {
        updateStrategySpin(data).then((res) => {
            dispatch(loadDataTable());
            addToast(<div className="text-center">Cập nhật thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Cập nhật thất bại</div>, { appearance: 'error' });
        })
    }

    const createStrategyCommand = (data) => {
        createStrategySpin(data).then((res) => {
            dispatch(loadDataTable());
            addToast(<div className="text-center">Thêm thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Thêm thất bại</div>, { appearance: 'error' });
        })
    }

    const removeStrategyCommand = (data) => {
        removeStrategySpin(data).then((res) => {
            if (res?.Succeeded === false) {
                addToast(<div className="text-center">Xoá thất bại</div>, { appearance: 'error' });
            }
            else {
                dispatch(loadDataTable());
                addToast(<div className="text-center">Xoá thành công</div>, { appearance: 'success' });
            }
        }).catch((err) => {
            addToast(<div className="text-center">Xoá thất bại</div>, { appearance: 'error' });
        })
    }

    return (
        <div className={classes.root}>
            <div className="content">
                <div className="block-content">
                    <div className="row row-title">
                        <div className="btn-add">
                            <i className='fa fa-plus'
                                title='Thêm mới'
                                onClick={(e) => {
                                    setModalCustom({ ...modalCustom, type: 'new', data: { disabled: false, freeMode: true }, isOpen: true })
                                }}>
                                Thêm mới
                            </i>
                        </div>
                    </div>
                    <div className="row row-title mt-2">
                        <div className="col-md-12 table-height">
                            <DataGridControl
                                rows={strategyList}
                                columns={columns}
                                count={strategyList.length}
                                disableSelectionOnClick
                            />
                            {/* //modal crud strategy */}
                            {
                                <Modal
                                    isOpen={modalCustom.isOpen}
                                    modalName="role-modal"
                                    showOverlay={true}
                                    onClose={() => resetModal()}
                                    title="Chiến lược"
                                    size="xl"
                                    centered
                                >
                                    <Modal.Body>
                                        {
                                            ['edit', 'new'].includes(modalCustom.type) ?
                                                <>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <span>Tên chiến lược</span>
                                                            <InputControl type="text" id="name" onChange={(e) => {
                                                                const value = e.target.value ?? '';
                                                                overwriteDataModal('name', value)
                                                            }} defaultValue={modalCustom.data?.name} />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>Loại chiến lược</span>
                                                            <SelectBox id="selectbox"
                                                                optionLabel="objectName"
                                                                optionValue="id"
                                                                onChange={(data) => {
                                                                    overwriteDataModal('masterObjectAllocationId', data)
                                                                }}
                                                                value={modalCustom.data?.masterObjectAllocationId}
                                                                isPortal
                                                                options={masterObjectAllocationList ?? []}
                                                            />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>Nhóm khách hàng</span>
                                                            <SelectBox id="selectbox"
                                                                optionLabel="name"
                                                                optionValue="id"
                                                                onChange={(data) => {
                                                                    overwriteDataModal('groupAllocationId', data)
                                                                }}
                                                                value={modalCustom.data?.groupAllocationId}
                                                                isPortal
                                                                options={groupAllocationsList ?? []}
                                                            />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>Nhóm giải thưởng</span>
                                                            <SelectBox id="selectbox"
                                                                optionLabel="name"
                                                                optionValue="id"
                                                                onChange={(data) => {
                                                                    overwriteDataModal('groupChannelPrizeId', data)
                                                                }}
                                                                value={modalCustom.data?.groupChannelPrizeId}
                                                                isPortal
                                                                options={groupChannelPrizeList ?? []}
                                                            />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>Tỷ lệ trúng chia đều</span>
                                                            &nbsp;
                                                            <input class="form-check-input"
                                                                type="checkbox"
                                                                id="disabeldWheel"
                                                                name="disabeldWheel"
                                                                onChange={(e) => {
                                                                    const checked = e.target?.checked;
                                                                    overwriteDataModal('freeMode', checked);
                                                                }}
                                                                checked={modalCustom?.data?.freeMode} />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>Giao diện vòng quay</span>
                                                            <SelectBox id="selectbox"
                                                                optionLabel="name"
                                                                optionValue="value"
                                                                onChange={(data) => {
                                                                    overwriteDataModal('wheelInstanceId', data)
                                                                }}
                                                                value={modalCustom.data?.wheelInstanceId}
                                                                isPortal
                                                                options={wheelInstanceList?.map(x => ({ ...x, name: x?.name, value: x?.id })) ?? []}
                                                            />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>Backdrop vòng quay</span>
                                                            <SelectBox id="selectbox"
                                                                optionLabel="name"
                                                                optionValue="value"
                                                                onChange={(data) => {
                                                                    overwriteDataModal('themeInstanceId', data)
                                                                }}
                                                                value={modalCustom.data?.themeInstanceId}
                                                                isPortal
                                                                options={themeInstanceList?.map(x => ({ ...x, name: x?.name, value: x?.id })) ?? []}
                                                            />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <span>Ngày hiệu lực</span>
                                                            <DateTimeInput selected={modalCustom.data?.startDate && new Date(modalCustom.data?.startDate)}
                                                                isDefaultEmpty
                                                                isPortal
                                                                id="startDate" isOnlyDate={false} onChange={(data) => {
                                                                    overwriteDataModal('startDate', data)
                                                                }} />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <span>Ngày kết thúc hiệu lực</span>
                                                            <DateTimeInput selected={modalCustom.data?.endDate && new Date(modalCustom.data?.endDate)} id="endDate"
                                                                isDefaultEmpty
                                                                isOnlyDate={false} onChange={(data) => {
                                                                    overwriteDataModal('endDate', data)
                                                                }} />
                                                        </div>
                                                       
                                                        <div className="col-md-6">
                                                            <span>Vô hiệu vòng quay</span>
                                                            &nbsp;
                                                            <input class="form-check-input"
                                                                type="checkbox"
                                                                id="disabeldWheel"
                                                                name="disabeldWheel"
                                                                onChange={(e) => {
                                                                    const checked = e.target?.checked;
                                                                    overwriteDataModal('disabled', checked);
                                                                }}
                                                                checked={modalCustom?.data?.disabled} />
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
                                                createStrategyCommand(modalCustom.data)
                                            }
                                            if (modalCustom.type === 'edit') {
                                                updateStrategyCommand(modalCustom.data)
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

                            {/* //modal attribute */}
                            <GroupAllocationAttributeModal modalAllocationAttribute={modalAllocationAttribute}
                                setModalAllocationAttribute={setModalAllocationAttribute}
                            />

                            <ChannelPrizeModal
                                modalPrizeAttribute={modalPrizeAttribute}
                                setModalPrizeAttribute={setModalPrizeAttribute}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

StrategySpinComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withPermission(mobileDetectHOC(withStyles(styles)(StrategySpinComponent)));