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
import { loadDataTableChannelSpin } from "../../../../redux/actions/channelActions"
import { loadDataTableWheel } from "../../../../redux/actions/wheelInstanceAction"
import { loadDataTableThemeSpin } from "../../../../redux/actions/themeAction"
import Modal from "../../../../shared/packages/control/modal/index";
import SelectBox from "../../../../shared/packages/control/selectBox/selectBox"
import { updateStrategySpin, createStrategySpin, removeStrategySpin } from "../../../../services/strategySpin.service"
import { getGroupAllocationById } from "../../../../services/groupAllocation.service"
import { getProxyAllocationStrategy } from "../../../../services/proxyAllocationStrategy.service"
import { getChannelPrizeByWheelId } from "../../../../services/channelPrize.service"
import { getProxyPrize } from "../../../../services/proxyPrize.service"
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
    const { channelSpinList } = useSelector((state) => state.channelSpin);
    const { wheelInstanceList } = useSelector((state) => state.wheelInstance);
    const { themeInstanceList } = useSelector((state) => state.themeInstance);

    const { classes } = props;
    const { t } = useTranslation('common');

    useEffect(() => {
        dispatch(loadDataTable());
        dispatch(loadDataTableChannelSpin({
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
    }, [])



    // useEffect(() => {
    //     console.log({ groupAllocationEditModel });
    // }, [groupAllocationEditModel])

    function getAttribute(params) {
        if (params.field === 'channelSpinName')
            return params.row?.channelSpin?.channelName;
        if (params.field === 'wheelInstanceName')
            return params.row?.wheelInstance?.name;
        if (params.field === 'themeInstanceNamne')
            return params.row?.themeInstance?.name;
        else
            return ""
    }

    const columns = [
        {
            field: 'name',
            headerName: 'Tên chiến lược',
            headerClassName: 'headerColumn',
            flex: 1,
            editable: false,
            renderCell: (cell) => {
                return <a href={`/embedded/lucky-spin?id=${cell?.row?.id}`} target={'_blank'}>
                    {cell?.row?.name}
                </a>
            }
        },
        {
            field: 'channelSpinName',
            headerName: 'Kênh',
            headerClassName: 'headerColumn',
            flex: 1,
            valueGetter: getAttribute,
            editable: false,
        },
        {
            field: 'wheelInstanceName',
            headerName: 'Loại vòng quay',
            headerClassName: 'headerColumn',
            flex: 1,
            valueGetter: getAttribute,
            editable: false,
        },
        {
            field: 'themeInstanceNamne',
            headerName: 'Theme',
            headerClassName: 'headerColumn',
            flex: 1,
            valueGetter: getAttribute,
            editable: false,
        },
        {
            field: 'disabled',
            headerName: 'Vô hiệu lực',
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

    const overwriteDataModal = (prefix, value) => {
        modalCustom.data[prefix] = value;
        setModalCustom({ ...modalCustom });
    }

    //To check data exists groupAllocationId for custom allocaiton object attribute
    const checkShowLayerAllocation = (data) => {
        const row_channelID = data?.channelSpinId;
        if (row_channelID) {
            const channelData = channelSpinList?.find(x => x?.id === row_channelID);
            if (channelData) {
                return {
                    groupAllocationId: channelData?.proxyAllocationGroup?.groupAllocationId,
                    show: channelData?.proxyAllocationGroup?.groupAllocationId !== null
                }
            }
            else return {
                groupAllocationId: null,
                show: false
            };
        }
        return {
            groupAllocationId: null,
            show: false
        };
    }

    const checkShowPrizeAllocation = (data) => {
        return {
            wheelInstanceId: data?.wheelInstanceId,
            show: data?.wheelInstanceId !== null
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
        const groupAllcationId = checkShowLayerAllocation(params?.row)?.groupAllocationId;

        if (groupAllcationId) {
            //get group id to get all master selected
            getGroupAllocationById(groupAllcationId).then((res) => {
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
        const wheelId = params?.wheelInstanceId;
        if (wheelId) {
            getChannelPrizeByWheelId(wheelId).then((res) => {
                const strategyID = params?.id;
                const channelIds = res?.data?.data?.map(x => x.id) ?? [];
                //from list master selected, we put on proxy to get attributes data
                getProxyPrize({
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
            dispatch(loadDataTable());
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
                    <div className="row row-title mt-5">
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
                                    size="md"
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
                                                            <span>Kênh vòng quay</span>
                                                            <SelectBox id="selectbox"
                                                                optionLabel="name"
                                                                optionValue="value"
                                                                onChange={(data) => {
                                                                    overwriteDataModal('channelSpinId', data)
                                                                }}
                                                                value={modalCustom.data?.channelSpinId}
                                                                isPortal
                                                                options={channelSpinList?.map(x => ({ ...x, name: x?.channelName, value: x?.id })) ?? []}
                                                            />
                                                        </div>
                                                        <div className="col-md-12">
                                                            <span>Loại vòng quay</span>
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
                                                            <span>Theme vòng quay</span>
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