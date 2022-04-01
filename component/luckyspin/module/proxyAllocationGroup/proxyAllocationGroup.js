import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import mobileDetectHOC from "../../../../shared/packages/hocs/mobileDetect"
import { usePermission } from "../../../../shared/packages/provider/accessGateway"
import withPermission from "../../../../shared/packages/hocs/permission/permissionHOC"
import Modal from "../../../../shared/packages/control/modal/index";
import showConfirm from "../../../../shared/packages/control/dialog/confirmation"
import ListBoxComponent from "../../../../shared/packages/control/listBox/listBox"
import SelectBox from "../../../../shared/packages/control/selectBox/selectBox"
import { InputControl } from "../../../../shared/packages/control/input/inputControl"
import { updateProxyGroup, createProxyGroup, deleteProxyGroup } from "../../../../services/proxyAllocationGroup.service"
import { loadDataTableProxyAllocationGroup } from "../../../../redux/actions/proxyAllocationGroupActions"
import { loadDataTableCategoryClient } from "../../../../redux/actions/categoryClientActions"
import { loadDataTableGroupAllocation } from "../../../../redux/actions/groupAllocationActions"
import { loadDataTableMasterObj } from "../../../../redux/actions/masterObjectAllocationActions"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CategoryClientComponent from "./subComponent/categoryClient"
import GroupAllocationComponent from "./subComponent/groupAllocation"
import 'react-tabs/style/react-tabs.css';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

function ProxyAllocationComponent(props) {
    const [allows] = usePermission();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const { classes } = props;
    const { t } = useTranslation('common');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const { proxyAllocationGroupList } = useSelector((state) => state.proxyAllocationGroup);
    const { groupAllocationsList } = useSelector((state) => state.groupAllocation);
    const { categoryClientList } = useSelector((state) => state.categoryClient);
    const [modalCustom, setModalCustom] = useState({
        isOpen: false,
        data: null,
        type: null
    })


    useEffect(() => {
        dispatch(loadDataTableProxyAllocationGroup({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
        dispatch(loadDataTableMasterObj({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
        dispatch(loadDataTableCategoryClient({
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
    }, [])

    useEffect(() => {
        const find = proxyAllocationGroupList?.find(x => x.id === selectedGroup?.id)
        if (find) {
            setSelectedGroup({ ...find })
        }
    }, [proxyAllocationGroupList])

    const overwriteDataModal = (prefix, value) => {
        modalCustom.data[prefix] = value;
        setModalCustom({ ...modalCustom });
    }

    const updateProxyAllocationCommand = (data) => {
        updateProxyGroup(data).then((res) => {
            dispatch(loadDataTableProxyAllocationGroup({
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

    const createProxyAllocationCommand = (data) => {
        createProxyGroup(data).then((res) => {
            dispatch(loadDataTableProxyAllocationGroup({
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

    const deleteProxyAllocationCommand = (data) => {
        deleteProxyGroup(data).then((res) => {
            dispatch(loadDataTableProxyAllocationGroup({
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

    const sendUpdateProxyAllocationCommand = (data) => {
        setModalCustom({ ...modalCustom, type: 'edit', data: data, isOpen: true })
    }

    const sendRemoveProxyAllocationCommand = async (data) => {
        const confirm = await showConfirm("Xác nhận", `Bạn có chắc chắn muốn xoá đối tượng ${data?.name} ?`, "Xoá", "Trở về");
        if (confirm && data?.id) {
            deleteProxyAllocationCommand(data?.id);
        }
    }

    //update cate command
    const resetModal = () => {
        setModalCustom({ ...modalCustom, isOpen: false, data: null, type: null })
    }


    return (
        <div className={classes.root}>
            <div className="content content-wrapper">
                <div className="row row-title">
                    <div className='col-md-2'>
                        <div className="btn-add">
                            <i className='fa fa-plus'
                                title='Thêm mới'
                                onClick={(e) => {
                                    setModalCustom({ ...modalCustom, type: 'new', data: { disabled: false }, isOpen: true })
                                }}>
                            </i>
                        </div>
                        <ListBoxComponent
                            title={"Tệp khách hàng"}
                            onClickItem={(e) => {
                                setSelectedGroup(e);
                            }}
                            onUpdate={(data) => sendUpdateProxyAllocationCommand(data)}
                            onDelete={async (data) => await sendRemoveProxyAllocationCommand(data)}
                            options={proxyAllocationGroupList?.map(x => ({ ...x, label: x?.name, value: x?.id })) ?? []} />
                        {
                            <Modal
                                isOpen={modalCustom.isOpen}
                                modalName="role-modal"
                                showOverlay={true}
                                onClose={() => resetModal()}
                                title="Tệp khách hàng"
                                size="md"
                                centered
                            >
                                <Modal.Body>
                                    {
                                        ['edit', 'new'].includes(modalCustom.type) ?
                                            <>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <span>Tên tệp khách hàng</span>
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
                                                    <div className="col-md-12">
                                                        <span>Danh mục khách hàng</span>
                                                        <SelectBox id="selectbox"
                                                            optionLabel="categoryName"
                                                            optionValue="id"
                                                            onChange={(data) => {
                                                                overwriteDataModal('categoryClientId', data)
                                                            }}
                                                            value={modalCustom.data?.categoryClientId}
                                                            isPortal
                                                            options={categoryClientList}
                                                        />
                                                    </div>
                                                    <div className="col-md-12">
                                                        <span>Nhóm phân bổ</span>
                                                        <SelectBox id="selectbox"
                                                            optionLabel="name"
                                                            optionValue="id"
                                                            onChange={(data) => {
                                                                overwriteDataModal('groupAllocationId', data)
                                                            }}
                                                            value={modalCustom.data?.groupAllocationId}
                                                            isPortal
                                                            options={groupAllocationsList}
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
                                            createProxyAllocationCommand(modalCustom.data)
                                        }
                                        if (modalCustom.type === 'edit') {
                                            updateProxyAllocationCommand(modalCustom.data)
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
                    <div className='col-md-10'>
                        <div className='wrapper-tab'>
                            <Tabs>
                                <TabList>
                                    <Tab>Quản lý Danh mục khách hàng</Tab>
                                    <Tab>Quản lý Nhóm phân bổ</Tab>
                                </TabList>
                                <TabPanel>
                                    <CategoryClientComponent selectedGroup={selectedGroup}
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <GroupAllocationComponent selectedGroup={selectedGroup}
                                    />
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

ProxyAllocationComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withPermission(mobileDetectHOC(withStyles(styles)(ProxyAllocationComponent)));