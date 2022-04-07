import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import Modal from "../../../../../../shared/packages/control/modal/index";
import UIBuilder from "../../../../../../shared/packages/control/uiBuilder/uiBuilder"
import { updateProxyStrategy } from "../../../../../../services/proxyAllocationStrategy.service"

function GroupAllocationAttributeModal(props) {
    const { modalAllocationAttribute, setModalAllocationAttribute } = props;
    const { addToast } = useToasts();
    const [groupAllocationEditModel, setGroupAllocationEditModel] = useState(null);

    useEffect(() => {
        if (modalAllocationAttribute.data)
            setGroupAllocationEditModel([...modalAllocationAttribute.data?.groupAllocation?.masterAllocationSelecteds])
    }, [modalAllocationAttribute.data])

    //update strategy command

    const resetModalAttribute = () => {
        setModalAllocationAttribute({ ...modalAllocationAttribute, isOpen: false, data: null })
    }

    const updateAttributes = (index, key, value) => {
        groupAllocationEditModel[index].attributes[key].value = value;
        groupAllocationEditModel[index]["edited"] = true;
        setGroupAllocationEditModel([...groupAllocationEditModel])
    }

    const updateAttributesCommand = (data) => {
        const copyData = [...data];
        copyData?.filter(x => x.edited)?.map(item => {
            const convert = ({
                "id": item?.idProxy,
                "strategySpinId": item?.strategyId,
                "masterAllocationSelectedId": item?.id,
                "attributes": JSON.stringify(item?.attributes)
            });
            updateProxyStrategy(convert).then((res) => {
                addToast(<div className="text-center">{`Cập nhật ${item?.masterId} thành công`}</div>, { appearance: 'success' });
            }).catch((err) => {
                addToast(<div className="text-center">Cập nhật thất bại</div>, { appearance: 'error' });
            })
        });
        resetModalAttribute();
    }

    return (

        <Modal
            isOpen={modalAllocationAttribute.isOpen}
            modalName="role-modal"
            showOverlay={true}
            onClose={() => resetModalAttribute()}
            title="Cấu hình đối tượng phân bổ"
            size="xl"
            centered
        >
            <Modal.Body>
                <div class="accordion" id="myAccordion">
                    {
                        groupAllocationEditModel?.map((item, index) => {
                            return (
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id={`index_${index}`}>
                                        <button type="button" class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target={`#collapse_${index}`}>{`{ master Id: ${item?.masterId}, master Code: ${item?.masterCode}} ${item?.edited ? " (trạng thái: chỉnh sửa)" : ""}`}</button>
                                    </h2>
                                    <div id={`collapse_${index}`} class="accordion-collapse collapse">
                                        <div class="card-body">
                                            <UIBuilder
                                                objectKeys={item?.attributes}
                                                indexData={index}
                                                modelChange={updateAttributes} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-danger mr-25" onClick={() => {
                    resetModalAttribute()
                }}>Đóng</button>
                <button className="btn btn-outline-primary mr-25" onClick={() => {
                    console.log({ data: groupAllocationEditModel });
                    updateAttributesCommand(groupAllocationEditModel);
                }}>
                    Cập nhật
                </button>
            </Modal.Footer>
        </Modal>

    )
}

GroupAllocationAttributeModal.propTypes = {
};

export default GroupAllocationAttributeModal;