import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import SelectBoxv2 from "../../../../../../shared/packages/control/selectBoxv2/selectBoxv2"
import DataGridControl from '../../../../../../shared/packages/control/grid/datagrid';
import { loadDataTableGroupAllocation } from "../../../../../../redux/actions/groupAllocationActions"
import { loadDataTableGroupChannelPrize } from "../../../../../../redux/actions/groupChannelPrizeAction"
import { getProxyPrizeAdmin } from "../../../../../../services/proxyPrize.service"
import { strategyConfig, prizeConfig } from "../../../../../luckyspin/module/strategySpin/config/strategyConfig"
import Modal from "../../../../../../shared/packages/control/modal/index";
import { InputControl } from "../../../../../../shared/packages/control/input/inputControl"
import showConfirm from "../../../../../../shared/packages/control/dialog/confirmation"
import { createGroupChannelPrize, updateGroupChannelPrize, removeGroupChannelPrize } from "../../../../../../services/groupChannelPrize.service"
import { createChannelPrize, updateChannelPrize, removeChannelPrize } from "../../../../../../services/channelPrize.service"
import { updateStrategySpin, createStrategySpin, removeStrategySpin } from "../../../../../../services/strategySpin.service"
import SelectBox from "../../../../../../shared/packages/control/selectBox/selectBox"
import { updateProxyPrize } from "../../../../../../services/proxyPrize.service"

const GroupChannelPrize = (props) => {
    const { material } = props
    const router = useRouter();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }
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
        if (!["quantity", "position", "allowPrizing", "percent", "hidden", "msgExtra"].includes(prefix)) {
            modalCustomPrizeSelected.data[prefix] = value;
        }
        else {
            modalCustomPrizeSelected.data.attributes[prefix] = value;
        }
        setModalCustomPrizeSelected({ ...modalCustomPrizeSelected });
    }


    const overwriteDataGroupAllocationModal = (prefix, value) => {
        modalCustomGroupPrize.data[prefix] = value;
        setModalCustomGroupPrize({ ...modalCustomGroupPrize });
    }

    function getAttribute(params) {
        if (params.field === 'position')
            return params.row?.attributes?.position;
        if (params.field === 'allowPrizing')
            return params.row?.attributes?.allowPrizing;
        if (params.field === 'percent')
            return params.row?.attributes?.percent;
        if (params.field === 'quantity')
            return params.row?.attributes?.quantity;
        if (params.field === 'hidden')
            return params.row?.attributes?.hidden;
        if (params.field === 'msgExtra')
            return params.row?.attributes?.msgExtra;
        else
            return ""
    }

    const columns = [
        {
            field: 'name',
            headerName: 'Tên giải thưởng',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        // {
        //     field: 'image',
        //     headerName: 'Hình ảnh',
        //     headerClassName: 'headerColumn',
        //     minWidth: 200,
        //     flex: 1,
        //     editable: false,
        // },
        {
            field: 'color',
            headerName: 'Màu nền',
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
            headerName: 'Màu đường kẻ',
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
            headerName: 'Màu chữ',
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
            headerName: 'Font size giải',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'position',
            headerName: 'Vị trí giải thưởng',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
            valueGetter: getAttribute,
        },
        {
            field: 'allowPrizing',
            headerName: 'Cho phép trúng',
            headerClassName: 'headerColumn',
            minWidth: 100,
            flex: 1,
            editable: false,
            valueGetter: getAttribute,
        },
        {
            field: 'percent',
            headerName: 'Tỷ lệ trúng (%)',
            headerClassName: 'headerColumn',
            minWidth: 100,
            flex: 1,
            editable: false,
            valueGetter: getAttribute,
        },
        {
            field: 'quantity',
            headerName: 'Số lượng giải',
            headerClassName: 'headerColumn',
            minWidth: 100,
            flex: 1,
            editable: false,
            valueGetter: getAttribute,
        },
        {
            field: 'hidden',
            headerName: 'Ẩn giải',
            headerClassName: 'headerColumn',
            minWidth: 100,
            flex: 1,
            editable: false,
            valueGetter: getAttribute,
        },
        {
            field: 'msgExtra',
            headerName: 'Nội dung trúng thưởng',
            headerClassName: 'headerColumn',
            minWidth: 100,
            flex: 1,
            editable: false,
            valueGetter: getAttribute,
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
                        const confirm = await showConfirm("Xác nhận", `Bạn có chắc chắn muốn xoá đối tượng ${params?.row?.name} ?`, "Xoá", "Trở về");
                        if (confirm && params?.row?.id) {
                            removePrizeCommand(params?.row?.id);
                        }
                    }}></i>
                </div>
            </div>
        )
    }

    const { groupChannelPrizeList } = useSelector((state) => state.groupChannelPrize);
    const [selectedGroupPrize, setSelectedGroupPrize] = useState(material?.strategySSR?.groupChannelPrize);

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
            const channelIDs = find?.channelPrizes?.map(x => x.id) ?? [];
            getProxyPrizeAdmin({
                "strategySpinId": material?.strategySSR?.id,
                "channelPrizeIds": channelIDs
            }).then((res) => {
                console.log({ res });
                const resData = res?.data?.data;
                const mergeData = {
                    ...find,
                    channelPrizes: find.channelPrizes?.map((item) => ({
                        ...item,
                        idProxy: resData?.find(x => x?.channelPrizeId === item?.id)?.id,
                        attributes: { ...resData?.find(x => x?.channelPrizeId === item?.id) }
                    }))
                }
                console.log({ mergeData });
                setSelectedGroupPrize({ ...mergeData })
            });
        }
        else
            setSelectedGroupPrize(null)
    }

    //func channelPrize selected

    const createPrizeCommand = (data) => {
        if (selectedGroupPrize?.id) {
            createChannelPrize({ ...data, groupChannelPrizeId: selectedGroupPrize?.id }).then((res) => {
                addToast(<div className="text-center">Thêm thành công</div>, { appearance: 'success' });
                const convert = ({
                    "id": data?.idProxy,
                    "strategySpinId": material?.strategySSR?.id,
                    "channelPrizeId": data?.id,
                    "position": data?.attributes?.position,
                    "allowPrizing": data?.attributes?.allowPrizing,
                    "percent": data?.attributes?.percent,
                    "quantity": data?.attributes?.quantity,
                    "hidden": data?.attributes?.hidden,
                    "msgExtra": data?.attributes?.msgExtra,
                });
                updateProxyPrize(convert).then((res) => {
                    dispatch(loadDataTableGroupChannelPrize({
                        header: {
                            pageNumber: 1,
                            pageSize: 999
                        }
                    }))
                }).catch((err) => {
                })
            }).catch((err) => {
                addToast(<div className="text-center">Thêm thất bại</div>, { appearance: 'error' });
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
            addToast(<div className="text-center">Xoá thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Xoá thất bại</div>, { appearance: 'error' });
        })
    }

    const updatePrizeCommand = (data) => {
        updateChannelPrize(data).then((res) => {
            addToast(<div className="text-center">Cập nhật thành công</div>, { appearance: 'success' });
            const convert = ({
                "id": data?.idProxy,
                "strategySpinId": material?.strategySSR?.id,
                "channelPrizeId": data?.id,
                "position": data?.attributes?.position,
                "allowPrizing": data?.attributes?.allowPrizing,
                "percent": data?.attributes?.percent,
                "quantity": data?.attributes?.quantity,
                "hidden": data?.attributes?.hidden,
                "msgExtra": data?.attributes?.msgExtra,
            });
            updateProxyPrize(convert).then((res) => {
                dispatch(loadDataTableGroupChannelPrize({
                    header: {
                        pageNumber: 1,
                        pageSize: 999
                    }
                }))
            }).catch((err) => {
            })
        }).catch((err) => {
            addToast(<div className="text-center">Cập nhật thất bại</div>, { appearance: 'error' });
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
            addToast(<div className="text-center">Cập nhật thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Cập nhật thất bại</div>, { appearance: 'error' });
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
            addToast(<div className="text-center">Thêm thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Thêm thất bại</div>, { appearance: 'error' });
        })
    }

    //
    const updateStrategyCommand = (data) => {
        updateStrategySpin(data).then((res) => {
            // addToast(<div className="text-center">Cập nhật chiến lược thành công</div>, { appearance: 'success' });
            material?.refreshStrategyData(material?.strategySSR?.id).then((res2) => {
                if (material?.isInternalModeParent) {
                    material?.updateStepValue(3);
                }
                else
                    material?.updateStepValue(4);
            })
        }).catch((err) => {
            addToast(<div className="text-center">Cập nhật chiến lược thất bại</div>, { appearance: 'error' });
        })
    }
    //


    return (
        <section class="choice-customer">
            <div class="wrapper-container">
                <div class="wrap-sort d-flex align-items-center">
                    <h1 class="title-small">Nhóm giải thưởng</h1>
                    <SelectBoxv2
                        id="selectbox"
                        style={{ width: "353px", marginLeft: "16px" }}
                        optionLabel="name"
                        optionValue="id"
                        onChange={(data) => {
                            findSelectedGroupPrize(data)
                        }}
                        value={selectedGroupPrize?.id}
                        options={groupChannelPrizeList ?? []}
                    />
                    {
                        selectedGroupPrize &&
                        <>
                            <a class="edit"
                                onClick={() => {
                                    sendUpdateGroupPrizeCommand(selectedGroupPrize)
                                }}
                                style={{ marginLeft: "-25px", cursor: "pointer" }}>
                                <img src="/asset/images/icons/pencle.svg" alt="" />
                            </a>
                        </>
                    }
                    <button class="edit ms-3 btn btn-add" onClick={() => {
                        setModalCustomGroupPrize({ ...modalCustomGroupPrize, type: 'new', data: { disabled: false }, isOpen: true })
                    }}>
                        <img src="/asset/images/icons/add.svg" alt="" />
                    </button>
                </div>
                <div class="wrap-body">
                    {
                        selectedGroupPrize &&
                        <div class="wrap-body_header d-flex align-items-center justify-content-between">
                            <h1 class="title-small">Danh sách giải thưởng</h1>
                            <div class="wrap-button d-flex align-items-center">
                                {/* <button class="btn btn-search"> <img src="/asset/images/icons/search.svg" alt="" /></button> */}
                                <button class="btn btn-add" onClick={() => {
                                    setModalCustomPrizeSelected({ ...modalCustomPrizeSelected, type: 'new', data: { disabled: false, attributes: strategyConfig.maskEditModel }, isOpen: true })
                                }}>
                                    <img src="/asset/images/icons/add.svg" alt="" />
                                    <span>&nbsp;Thêm mới</span>
                                </button>
                                {/* <button class="btn btn-upload" type="submit"> <img src="/asset/images/icons/cloud-upload.svg" alt="" /><span>&nbsp;Tải lên</span></button>
                                <button class="btn btn-setting" type="submit" data-fancybox="" data-src="#dialog-content"> <img src="/asset/images/icons/setting.svg" alt="" /><span>&nbsp;Cấu hình chung</span></button> */}
                            </div>
                        </div>
                    }
                    <div class="wrap-body_table">
                        {
                            selectedGroupPrize &&
                            <DataGridControl
                                rows={selectedGroupPrize?.channelPrizes}
                                columns={columns}
                                count={selectedGroupPrize?.channelPrizes?.length ?? 0}
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
                                if (material?.isInternalModeParent) {
                                    material?.updateStepValue(1);
                                }
                                else {
                                    material?.updateStepValue(2);
                                }
                            }} type="button">
                                <img src="/asset/images/icons/back.svg" alt="" /><span>Quay lại</span></button>
                            <button class="btn btn-submit" type="button"
                                onClick={() => {
                                    if (material?.strategySSR) {
                                        const groupSelectedId = selectedGroupPrize?.id;
                                        var clone = { ...material?.strategySSR }
                                        clone.groupChannelPrizeId = groupSelectedId;
                                        updateStrategyCommand(clone)
                                    }
                                }}
                            > <span>Tiếp tục tạo chiến lược</span><em class="material-icons">arrow_forward</em></button>
                        </div>
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
                    title="Đối tượng phân bổ"
                    size="md"
                    centered
                >
                    <Modal.Body>
                        {
                            ['edit', 'new'].includes(modalCustomPrizeSelected.type) ?
                                <div className="row">
                                    <div className="col-md-6">
                                        <span>Tên giải thưởng</span>
                                        <InputControl type="text" id="name" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('name', value)
                                        }} defaultValue={modalCustomPrizeSelected.data?.name} />
                                    </div>
                                    <div className="col-md-6">
                                        <span>Màu nền giải thưởng</span>
                                        <InputControl type="text" id="color" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('color', value)
                                        }} defaultValue={modalCustomPrizeSelected.data?.color} />
                                    </div>
                                    <div className="col-md-6">
                                        <span>Màu đường kẻ</span>
                                        <InputControl type="text" id="strokeStyle" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('strokeStyle', value)
                                        }} defaultValue={modalCustomPrizeSelected.data?.strokeStyle} />
                                    </div>
                                    <div className="col-md-6">
                                        <span>Màu chữ</span>
                                        <InputControl type="text" id="textFillStyle" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('textFillStyle', value)
                                        }} defaultValue={modalCustomPrizeSelected.data?.textFillStyle} />
                                    </div>
                                    <div className="col-md-6">
                                        <span>Font size giải</span>
                                        <InputControl type="text" id="textFontSize" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('textFontSize', value)
                                        }} defaultValue={modalCustomPrizeSelected.data?.textFontSize} />
                                    </div>
                                    {/* <div className="col-md-12">
                                        <span>Hình ảnh</span>
                                        <InputControl type="text" id="image" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('image', value)
                                        }} defaultValue={modalCustomPrizeSelected.data?.image} />
                                    </div> */}
                                    <div className="col-md-6">
                                        <span>Vị trí giải thưởng</span>
                                        <InputControl type="number" id="color" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('position', Number.parseInt(value))
                                        }} defaultValue={modalCustomPrizeSelected.data?.attributes?.position} />
                                    </div>
                                    <div className="col-md-6">
                                        <span>Cho phép trúng</span>
                                        <SelectBox id="selectbox"
                                            optionLabel="label"
                                            optionValue="value"
                                            onChange={(data) => {
                                                overwriteDataAllocationSelectedModal('allowPrizing', data)
                                            }}
                                            value={modalCustomPrizeSelected.data?.attributes?.allowPrizing}
                                            isPortal
                                            options={[{ label: "True", value: true }, { label: "False", value: false }]}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <span>Tỷ lệ trúng</span>
                                        <InputControl type="number" id="color" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('percent', Number.parseFloat(value))
                                        }} defaultValue={modalCustomPrizeSelected.data?.attributes?.percent} />
                                    </div>
                                    <div className="col-md-6">
                                        <span>Số lượng giải</span>
                                        <InputControl type="number" id="quantity" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('quantity', Number.parseInt(value))
                                        }} defaultValue={modalCustomPrizeSelected.data?.attributes?.quantity} />
                                    </div>
                                    <div className="col-md-6">
                                        <span>Ẩn giải</span>
                                        <SelectBox id="selectbox"
                                            optionLabel="label"
                                            optionValue="value"
                                            onChange={(data) => {
                                                overwriteDataAllocationSelectedModal('hidden', data)
                                            }}
                                            value={modalCustomPrizeSelected.data?.attributes?.hidden}
                                            isPortal
                                            options={[{ label: "True", value: true }, { label: "False", value: false }]}
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <span>Nội dung trúng thưởng</span>
                                        <InputControl type="text" id="msgExtra" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('msgExtra', value)
                                        }} defaultValue={modalCustomPrizeSelected.data?.attributes?.msgExtra} />
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
                            resetModalPrizeSelected()
                        }}>Đóng</button>

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
                                    return "Tạo mới"
                                }
                                if (modalCustomPrizeSelected.type === 'edit') {
                                    return "Cập nhật"
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
                    title="Nhóm giải thưởng"
                    size="md"
                    centered
                >
                    <Modal.Body>
                        {
                            ['edit', 'new'].includes(modalCustomGroupPrize.type) ?
                                <>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <span>Tên nhóm giải thưởng</span>
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
        </section>
    );
}
export default GroupChannelPrize;