import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { loadDataTableCategoryClient } from "../../../../../redux/actions/categoryClientActions"
import DataGridControl from '../../../../../shared/packages/control/grid/datagrid';
import SelectBox from "../../../../../shared/packages/control/selectBox/selectBox"
import Modal from "../../../../../shared/packages/control/modal/index";
import { InputControl } from "../../../../../shared/packages/control/input/inputControl"
import showConfirm from "../../../../../shared/packages/control/dialog/confirmation"
import { createCategoryClient, updateCategoryClient, removeCategoryClient } from "../../../../../services/categoryClient.service"

function CategoryClientComponent(props) {
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [modalCustom, setModalCustom] = useState({
        isOpen: false,
        data: null,
        type: null
    })

    const { classes } = props;
    const { t } = useTranslation('common');
    const { categoryClientList } = useSelector((state) => state.categoryClient);

    const columns = [
        {
            field: 'categoryName',
            headerName: 'Tên danh mục khách hàng',
            headerClassName: 'headerColumn',
            flex: 1,
            editable: false,
        },
        {
            field: 'categoryDesc',
            headerName: 'Mô tả',
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

    const renderActionGrid = (params) => {
        return (
            <div className="box-action-container">
                <div>
                    <i className="fas fa-edit text-info" onClick={() => {
                        setModalCustom({ ...modalCustom, type: 'edit', data: { ...params?.row }, isOpen: true })
                    }}></i>
                </div>
                <div>
                    <i className="fas fa-trash text-danger" onClick={async (e) => {
                        const confirm = await showConfirm("Xác nhận", `Bạn có chắc chắn muốn xoá đối tượng ${params?.row?.categoryName} ?`, "Xoá", "Trở về");
                        if (confirm && params?.row?.id) {
                            removeCategoryCommand(params?.row?.id);
                        }
                    }}></i>
                </div>
            </div>
        )
    }

    //update cate command
    const resetModal = () => {
        setModalCustom({ ...modalCustom, isOpen: false, data: null, type: null })
    }

    const createCategoryCommand = (data) => {
        createCategoryClient(data).then((res) => {
            dispatch(loadDataTableCategoryClient());
            addToast(<div className="text-center">Thêm thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Thêm thất bại</div>, { appearance: 'error' });
        })
    }

    const updateCategoryCommand = (data) => {
        updateCategoryClient(data).then((res) => {
            dispatch(loadDataTableCategoryClient());
            addToast(<div className="text-center">Cập nhật thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Cập nhật thất bại</div>, { appearance: 'error' });
        })
    }

    const removeCategoryCommand = (data) => {
        removeCategoryClient(data).then((res) => {
            dispatch(loadDataTableCategoryClient());
            addToast(<div className="text-center">Xoá thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Xoá thất bại</div>, { appearance: 'error' });
        })
    }


    return (
        <div className='content'>
            <div className="row">
                <div className="strategy-btn-add">
                    <i className='fa fa-plus'
                        title='Thêm mới'
                        onClick={(e) => {
                            setModalCustom({ ...modalCustom, type: 'new', data: { disabled: false }, isOpen: true })
                        }}>
                    </i>
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-md-12">
                    <DataGridControl
                        rows={[...categoryClientList]}
                        columns={columns}
                        count={categoryClientList.length}
                        disableSelectionOnClick
                    />
                    {
                        <Modal
                            isOpen={modalCustom.isOpen}
                            modalName="role-modal"
                            showOverlay={true}
                            onClose={() => resetModal()}
                            title="Danh mục"
                            size="md"
                            centered
                        >
                            <Modal.Body>
                                {
                                    ['edit', 'new'].includes(modalCustom.type) ?
                                        <>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <span>Tên danh mục khách hàng</span>
                                                    <InputControl type="text" id="name" onChange={(e) => {
                                                        const value = e.target.value ?? '';
                                                        overwriteDataModal('categoryName', value)
                                                    }} defaultValue={modalCustom.data?.categoryName} />
                                                </div>
                                                <div className="col-md-12">
                                                    <span>Mô tả danh mục</span>
                                                    <InputControl type="text" id="name" onChange={(e) => {
                                                        const value = e.target.value ?? '';
                                                        overwriteDataModal('categoryDesc', value)
                                                    }} defaultValue={modalCustom.data?.categoryDesc} />
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
                                        createCategoryCommand(modalCustom.data)
                                    }
                                    if (modalCustom.type === 'edit') {
                                        updateCategoryCommand(modalCustom.data)
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
    )
}

CategoryClientComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default CategoryClientComponent;