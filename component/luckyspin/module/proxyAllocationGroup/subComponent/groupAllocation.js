import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { loadDataTable } from "../../../../../redux/actions/strategyActions"
import DataGridControl from '../../../../../shared/packages/control/grid/datagrid';
import SelectBox from "../../../../../shared/packages/control/selectBox/selectBox"
import { InputControl } from "../../../../../shared/packages/control/input/inputControl"
import ListBoxComponent from "../../../../../shared/packages/control/listBox/listBox"
import Modal from "../../../../../shared/packages/control/modal/index";
import { loadDataTableGroupAllocation } from "../../../../../redux/actions/groupAllocationActions"
import { createGroupAllocation, updateGroupAllocation, removeGroupAllocation } from "../../../../../services/groupAllocation.service"
import { createMasterAllocationSelected, updateMasterAllocationSelected, removeMasterAllocationSelected } from "../../../../../services/masterAllocationSelected.service"
import showConfirm from "../../../../../shared/packages/control/dialog/confirmation"

function GroupAllocationComponent(props) {
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [modalCustomAllocationSelected, setModalCustomAllocationSelected] = useState({
        isOpen: false,
        data: null,
        type: null
    })
    const [modalCustomGroupAllocation, setModalCustomGroupAllocation] = useState({
        isOpen: false,
        data: null,
        type: null
    })
    const { classes } = props;
    const { t } = useTranslation('common');
    const { groupAllocationsList } = useSelector((state) => state.groupAllocation);
    const [selectedGroupAllocation, setSelectedGroupAllocation] = useState(null);

    useEffect(() => {
    }, [])

    useEffect(() => {
        const find = groupAllocationsList?.find(x => x.id === selectedGroupAllocation?.id)
        if (find) {
            setSelectedGroupAllocation({ ...find })
        }
    }, [groupAllocationsList])

    const columns = [
        {
            field: 'masterId',
            headerName: 'T??n kh??ch h??ng',
            headerClassName: 'headerColumn',
            minWidth: 200,
            flex: 1,
            editable: false,
        },
        {
            field: 'masterCode',
            headerName: 'M?? kh??ch h??ng',
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


    const renderActionGrid = (params) => {
        return (
            <div className="box-action-container">
                <div>
                    <i className="fas fa-edit text-info" onClick={() => {
                        setModalCustomAllocationSelected({ ...modalCustomAllocationSelected, type: 'edit', data: { ...params?.row }, isOpen: true })
                    }}></i>
                </div>
                <div>
                    <i className="fas fa-trash text-danger" onClick={async (e) => {
                        const confirm = await showConfirm("X??c nh???n", `B???n c?? ch???c ch???n mu???n xo?? ?????i t?????ng ${params?.row?.masterId} ?`, "Xo??", "Tr??? v???");
                        if (confirm && params?.row?.id) {
                            removeAllocationSelectedCommand(params?.row?.id);
                        }
                    }}></i>
                </div>
            </div>
        )
    }

    //update cate command
    const resetModalAllocationSelected = () => {
        setModalCustomAllocationSelected({ ...modalCustomAllocationSelected, isOpen: false, data: null, type: null })
    }

    const resetModalGroupAllocation = () => {
        setModalCustomGroupAllocation({ ...modalCustomGroupAllocation, isOpen: false, data: null, type: null })
    }

    const overwriteDataAllocationSelectedModal = (prefix, value) => {
        modalCustomAllocationSelected.data[prefix] = value;
        setModalCustomAllocationSelected({ ...modalCustomAllocationSelected });
    }

    const overwriteDataGroupAllocationModal = (prefix, value) => {
        modalCustomGroupAllocation.data[prefix] = value;
        setModalCustomGroupAllocation({ ...modalCustomGroupAllocation });
    }

    const createAllocationSelectedCommand = (data) => {
        if (selectedGroupAllocation?.id) {
            createMasterAllocationSelected({ ...data, groupAllocationId: selectedGroupAllocation?.id }).then((res) => {
                dispatch(loadDataTableGroupAllocation({
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
    }

    const updateAllocationSelectedCommand = (data) => {
        updateMasterAllocationSelected(data).then((res) => {
            dispatch(loadDataTableGroupAllocation({
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

    const removeAllocationSelectedCommand = (data) => {
        removeMasterAllocationSelected(data).then((res) => {
            dispatch(loadDataTableGroupAllocation({
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

    //GroupAllocation
    const createGroupAllocationCommand = (data) => {
        createGroupAllocation(data).then((res) => {
            dispatch(loadDataTableGroupAllocation({
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

    const updateGroupAllocationCommand = (data) => {
        updateGroupAllocation(data).then((res) => {
            dispatch(loadDataTableGroupAllocation({
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

    const removeGroupAllocationCommand = (data) => {
        removeGroupAllocation(data).then((res) => {
            if (res?.data?.succeeded) {
                dispatch(loadDataTableGroupAllocation({
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

    const sendUpdateGroupAllocationCommand = (data) => {
        setModalCustomGroupAllocation({ ...modalCustomGroupAllocation, type: 'edit', data: data, isOpen: true })
    }

    const sendRemoveGroupAllocationCommand = async (data) => {
        const confirm = await showConfirm("X??c nh???n", `B???n c?? ch???c ch???n mu???n xo?? ?????i t?????ng ${data?.name} ?`, "Xo??", "Tr??? v???");
        if (confirm && data?.id) {
            removeGroupAllocationCommand(data?.id);
        }
    }

    return (
        <div className='content'>
            <div className="row">
                <div className='col-md-2'>
                    <ListBoxComponent
                        title={"T???p kh??ch h??ng"}
                        onClickItem={(e) => {
                            setSelectedGroupAllocation(e);
                        }}
                        onAddNew={()=>{
                            setModalCustomGroupAllocation({ ...modalCustomGroupAllocation, type: 'new', data: { disabled: false }, isOpen: true })
                        }}
                        onUpdate={(data) => sendUpdateGroupAllocationCommand(data)}
                        onDelete={async (data) => await sendRemoveGroupAllocationCommand(data)}
                        options={groupAllocationsList?.map(x => ({ ...x, label: x?.name, value: x?.id }))} />
                    {
                        <Modal
                            isOpen={modalCustomGroupAllocation.isOpen}
                            modalName="role-modal"
                            showOverlay={true}
                            onClose={() => resetModalGroupAllocation()}
                            title="T???p kh??ch h??ng"
                            size="md"
                            centered
                        >
                            <Modal.Body>
                                {
                                    ['edit', 'new'].includes(modalCustomGroupAllocation.type) ?
                                        <>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <span>T??n t???p kh??ch h??ng</span>
                                                    <InputControl type="text" id="name" onChange={(e) => {
                                                        const value = e.target.value ?? '';
                                                        overwriteDataGroupAllocationModal('name', value)
                                                    }} defaultValue={modalCustomGroupAllocation.data?.name} />
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
                                    resetModalGroupAllocation()
                                }}>????ng</button>

                                <button className="btn btn-outline-primary mr-25" onClick={() => {
                                    if (modalCustomGroupAllocation.type === 'new') {
                                        createGroupAllocationCommand(modalCustomGroupAllocation.data)
                                    }
                                    if (modalCustomGroupAllocation.type === 'edit') {
                                        updateGroupAllocationCommand(modalCustomGroupAllocation.data)
                                    }
                                    resetModalGroupAllocation();
                                }}>
                                    {(() => {
                                        if (modalCustomGroupAllocation.type === 'new') {
                                            return "T???o m???i"
                                        }
                                        if (modalCustomGroupAllocation.type === 'edit') {
                                            return "C???p nh???t"
                                        }
                                    })()}
                                </button>
                            </Modal.Footer>
                        </Modal>
                    }
                </div>
                {
                    selectedGroupAllocation &&
                    <div className="col-md-10">
                        <div className="row">
                            <i className='fa fa-list'>
                                <span>&nbsp;Danh s??ch ?????i t?????ng ph??n b???&nbsp;</span>
                            </i>
                            <br />
                            <hr />
                            <div className="strategy-btn-add">
                                <i className='fa fa-plus'
                                    title='Th??m m???i'
                                    onClick={(e) => {
                                        setModalCustomAllocationSelected({ ...modalCustomAllocationSelected, type: 'new', data: { disabled: false }, isOpen: true })
                                    }}>
                                    Th??m m???i
                                </i>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <DataGridControl
                                    rows={selectedGroupAllocation?.masterAllocationSelecteds}
                                    columns={columns}
                                    count={selectedGroupAllocation?.masterAllocationSelecteds?.length}
                                    disableSelectionOnClick
                                />
                                {
                                    <Modal
                                        isOpen={modalCustomAllocationSelected.isOpen}
                                        modalName="role-modal"
                                        showOverlay={true}
                                        onClose={() => resetModalAllocationSelected()}
                                        title="?????i t?????ng ph??n b???"
                                        size="md"
                                        centered
                                    >
                                        <Modal.Body>
                                            {
                                                ['edit', 'new'].includes(modalCustomAllocationSelected.type) ?
                                                    <>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <span>Master Id</span>
                                                                <InputControl type="text" id="name" onChange={(e) => {
                                                                    const value = e.target.value ?? '';
                                                                    overwriteDataAllocationSelectedModal('masterId', value)
                                                                }} defaultValue={modalCustomAllocationSelected.data?.masterId} />
                                                            </div>
                                                            <div className="col-md-12">
                                                                <span>Master Code</span>
                                                                <InputControl type="text" id="name" onChange={(e) => {
                                                                    const value = e.target.value ?? '';
                                                                    overwriteDataAllocationSelectedModal('masterCode', value)
                                                                }} defaultValue={modalCustomAllocationSelected.data?.masterCode} />
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
                                                resetModalAllocationSelected()
                                            }}>????ng</button>

                                            <button className="btn btn-outline-primary mr-25" onClick={() => {
                                                if (modalCustomAllocationSelected.type === 'new') {
                                                    createAllocationSelectedCommand(modalCustomAllocationSelected.data)
                                                }
                                                if (modalCustomAllocationSelected.type === 'edit') {
                                                    updateAllocationSelectedCommand(modalCustomAllocationSelected.data)
                                                }
                                                resetModalAllocationSelected();
                                            }}>
                                                {(() => {
                                                    if (modalCustomAllocationSelected.type === 'new') {
                                                        return "T???o m???i"
                                                    }
                                                    if (modalCustomAllocationSelected.type === 'edit') {
                                                        return "C???p nh???t"
                                                    }
                                                })()}
                                            </button>
                                        </Modal.Footer>
                                    </Modal>
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

GroupAllocationComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default GroupAllocationComponent;