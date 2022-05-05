import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import SelectBoxv2 from "../../../../../../shared/packages/control/selectBoxv2/selectBoxv2"
import DataGridControl from '../../../../../../shared/packages/control/grid/datagrid';
import { loadDataTableGroupAllocation } from "../../../../../../redux/actions/groupAllocationActions"
import { getProxyAllocationStrategy } from "../../../../../../services/proxyAllocationStrategy.service"
import { strategyConfig, prizeConfig } from "../../../../../luckyspin/module/strategySpin/config/strategyConfig"
import Modal from "../../../../../../shared/packages/control/modal/index";
import { InputControl } from "../../../../../../shared/packages/control/input/inputControl"
import showConfirm from "../../../../../../shared/packages/control/dialog/confirmation"
import { createMasterAllocationSelected, updateMasterAllocationSelected, removeMasterAllocationSelected } from "../../../../../../services/masterAllocationSelected.service"
import SelectBox from "../../../../../../shared/packages/control/selectBox/selectBox"
import { updateProxyStrategy } from "../../../../../../services/proxyAllocationStrategy.service"

const GroupAllocation = (props) => {
    const { material } = props
    const router = useRouter();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }
    const [modalCustomAllocationSelected, setModalCustomAllocationSelected] = useState({
        isOpen: false,
        data: null,
        type: null
    })

    const resetModalAllocationSelected = () => {
        setModalCustomAllocationSelected({ ...modalCustomAllocationSelected, isOpen: false, data: null, type: null })
    }
    const overwriteDataAllocationSelectedModal = (prefix, value) => {
        if (!["quantity", "disabled"].includes(prefix)) {
            modalCustomAllocationSelected.data[prefix] = value;
        }
        else {
            modalCustomAllocationSelected.data.attributes[prefix].value = value;
        }
        setModalCustomAllocationSelected({ ...modalCustomAllocationSelected });
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

    function getAttribute(params) {
        if (params.field === 'quantity')
            return params.row?.attributes?.quantity?.value;
        if (params.field === 'disabled')
            return params.row?.attributes?.disabled?.value;
        else
            return ""
    }

    const columns = [
        {
            field: 'masterId',
            headerName: 'Tên khách hàng',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'masterCode',
            headerName: 'Mã khách hàng',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'quantity',
            headerName: 'Số lượt quay',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
            valueGetter: getAttribute,
        },
        {
            field: 'disabled',
            headerName: 'Vô hiệu hoá',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            valueGetter: getAttribute,
            editable: false,
        },
        {
            field: 'action',
            headerName: 'Thao tác',
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
                            setModalCustomAllocationSelected({ ...modalCustomAllocationSelected, type: 'edit', data: { ...params?.row }, isOpen: true })
                        }}
                        alt="" />
                </div>
                <div>
                    <i className="fas fa-trash text-danger" onClick={async (e) => {
                        const confirm = await showConfirm("Xác nhận", `Bạn có chắc chắn muốn xoá đối tượng ${params?.row?.masterId} ?`, "Xoá", "Trở về");
                        if (confirm && params?.row?.id) {
                            removeAllocationSelectedCommand(params?.row?.id);
                        }
                    }}></i>
                </div>
            </div>
        )
    }

    const [selectedGroupAllocation, setSelectedGroupAllocation] = useState(material?.strategySSR?.groupAllocation);

    const { groupAllocationsList } = useSelector((state) => state.groupAllocation);

    useEffect(() => {
        dispatch(loadDataTableGroupAllocation({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
    }, [])

    useEffect(() => {
        if (selectedGroupAllocation) {
            findSelectedGroupAllocation(selectedGroupAllocation?.id)
        }
    }, [groupAllocationsList])

    const findSelectedGroupAllocation = (id) => {
        const find = groupAllocationsList?.find(x => x.id === id)
        if (find) {
            const masterIds = find?.masterAllocationSelecteds?.map(x => x.id) ?? [];
            getProxyAllocationStrategy({
                "strategySpinId": material?.strategySSR?.id,
                "masterAllocationSelectedIds": masterIds
            }).then((res) => {
                console.log({ res });
                const resData = res?.data?.data;
                const mergeData = {
                    ...find,
                    masterAllocationSelecteds: find.masterAllocationSelecteds?.map((item) => ({
                        ...item,
                        idProxy: resData?.find(x => x?.masterAllocationSelectedId === item?.id)?.id,
                        attributes: convertEditAttributeUI(resData?.find(x => x?.masterAllocationSelectedId === item?.id)?.attributes)
                    }))
                }
                setSelectedGroupAllocation({ ...mergeData })
            });

        }
        else
            setSelectedGroupAllocation(null)
    }

    const updateAllocationSelectedCommand = (data) => {
        updateMasterAllocationSelected(data).then((res) => {
            addToast(<div className="text-center">Cập nhật thành công</div>, { appearance: 'success' });
            const convert = ({
                "id": data?.idProxy,
                "strategySpinId": material?.strategySSR?.id,
                "masterAllocationSelectedId": data?.id,
                "attributes": JSON.stringify(data?.attributes)
            });
            updateProxyStrategy(convert).then((res) => {
                dispatch(loadDataTableGroupAllocation({
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


    return (
        <section class="choice-customer">
            <div class="wrapper-container">
                <div class="wrap-sort d-flex align-items-center">
                    <h1 class="title-small">Nhóm Khách hàng</h1>
                    <SelectBoxv2
                        id="selectbox"
                        style={{ width: "353px", marginLeft: "16px" }}
                        optionLabel="name"
                        optionValue="id"
                        onChange={(data) => {
                            findSelectedGroupAllocation(data)
                        }}
                        value={selectedGroupAllocation?.id}
                        options={groupAllocationsList ?? []}
                    />
                    <a class="edit ms-3" href=""> <img src="/asset/images/icons/pencle.svg" alt="" /></a>
                    <a class="save ms-3" href=""> <img src="/asset/images/icons/save.svg" alt="" style={{ display: "none" }} /></a>
                </div>
                <div class="wrap-body">
                    {
                        selectedGroupAllocation &&
                        <div class="wrap-body_header d-flex align-items-center justify-content-between">
                            <h1 class="title-small">Danh sách Khách hàng</h1>
                            <div class="wrap-button d-flex align-items-center">
                                <button class="btn btn-search"> <img src="/asset/images/icons/search.svg" alt="" /></button>
                                <button class="btn btn-add"><img src="/asset/images/icons/add.svg" alt="" /><span>&nbsp;Thêm mới</span></button>
                                <button class="btn btn-upload" type="submit"> <img src="/asset/images/icons/cloud-upload.svg" alt="" /><span>&nbsp;Tải lên</span></button>
                                <button class="btn btn-setting" type="submit" data-fancybox="" data-src="#dialog-content"> <img src="/asset/images/icons/setting.svg" alt="" /><span>&nbsp;Cấu hình chung</span></button>
                            </div>
                        </div>
                    }
                    <div class="wrap-body_table">
                        {
                            selectedGroupAllocation &&
                            <DataGridControl
                                rows={selectedGroupAllocation?.masterAllocationSelecteds}
                                columns={columns}
                                count={selectedGroupAllocation?.masterAllocationSelecteds?.length ?? 0}
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
                                material?.updateStepValue(1);
                            }} type="button">
                                <img src="/asset/images/icons/back.svg" alt="" /><span>Quay lại</span></button>
                            <button class="btn btn-submit" type="button"> <span>Tiếp tục tạo chiến lược</span><em class="material-icons">arrow_forward</em></button>
                        </div>
                    </div>

                </div>

            </div>
            {
                <Modal
                    isOpen={modalCustomAllocationSelected.isOpen}
                    modalName="role-modal"
                    showOverlay={true}
                    onClose={() => resetModalAllocationSelected()}
                    title="Đối tượng phân bổ"
                    size="md"
                    centered
                >
                    <Modal.Body>
                        {
                            ['edit', 'new'].includes(modalCustomAllocationSelected.type) ?
                                <div className="row">
                                    <div className="col-md-6">
                                        <span>Tên khách hàng</span>
                                        <InputControl type="text" id="name" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('masterId', value)
                                        }} defaultValue={modalCustomAllocationSelected.data?.masterId} />
                                    </div>
                                    <div className="col-md-6">
                                        <span>Mã khách hàng</span>
                                        <InputControl type="text" id="name" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('masterCode', value)
                                        }} defaultValue={modalCustomAllocationSelected.data?.masterCode} />
                                    </div>
                                    <div className="col-md-6">
                                        <span>Số lượt quay</span>
                                        <InputControl type="text" id="name" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataAllocationSelectedModal('quantity', Number.parseInt(value))
                                        }} defaultValue={modalCustomAllocationSelected.data?.attributes?.quantity?.value} />
                                    </div>
                                    <div className="col-md-6">
                                        <span>Vô hiệu hoá</span>
                                        <SelectBox id="selectbox"
                                            optionLabel="label"
                                            optionValue="value"
                                            onChange={(data) => {
                                                overwriteDataAllocationSelectedModal('disabled', data)
                                            }}
                                            value={modalCustomAllocationSelected.data?.attributes?.disabled?.value}
                                            isPortal
                                            options={[{ label: "True", value: true }, { label: "False", value: false }]}
                                        />
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
                        }}>Đóng</button>

                        <button className="btn btn-outline-primary mr-25" onClick={() => {
                            if (modalCustomAllocationSelected.type === 'new') {
                                createAllocationSelectedCommand(modalCustomAllocationSelected.data)
                            }
                            if (modalCustomAllocationSelected.type === 'edit') {
                                updateAllocationSelectedCommand(modalCustomAllocationSelected.data)
                                console.log({ data: modalCustomAllocationSelected.data });
                            }
                            resetModalAllocationSelected();
                        }}>
                            {(() => {
                                if (modalCustomAllocationSelected.type === 'new') {
                                    return "Tạo mới"
                                }
                                if (modalCustomAllocationSelected.type === 'edit') {
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
export default GroupAllocation;