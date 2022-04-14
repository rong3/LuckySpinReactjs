import React, { useState, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import Modal from "../../../../../../shared/packages/control/modal/index";
import UIBuilder from "../../../../../../shared/packages/control/uiBuilder/uiBuilder"
import { updateProxyPrize } from "../../../../../../services/proxyPrize.service"

function ChannelPrizeModal(props) {
    const { modalPrizeAttribute, setModalPrizeAttribute } = props;
    const { addToast } = useToasts();
    const [groupPrizeEditModel, setGroupPrizeEditModel] = useState(null);

    const resetModalAttribute = () => {
        setModalPrizeAttribute({ ...modalPrizeAttribute, isOpen: false, data: null })
    }

    useEffect(() => {
        if (modalPrizeAttribute.data)
            setGroupPrizeEditModel([...modalPrizeAttribute.data?.channelPrizes])
    }, [modalPrizeAttribute.data])

    const updateAttributes = (index, key, value) => {
        groupPrizeEditModel[index].proxyAttribute[key].value = value;
        groupPrizeEditModel[index]["edited"] = true;
        setGroupPrizeEditModel([...groupPrizeEditModel])
    }

    const updateAttributesCommand = (data) => {
        const copyData = [...data];
        copyData?.filter(x => x.edited)?.map(item => {
            const convert = ({
                "id": item?.idProxy,
                "strategySpinId": item?.strategyId,
                "channelPrizeId": item?.id,
                "position": item?.proxyAttribute?.position?.value,
                "allowPrizing": item?.proxyAttribute?.allowPrizing?.value,
                "percent": item?.proxyAttribute?.percent?.value,
                "quantity": item?.proxyAttribute?.quantity?.value,
                "hidden": item?.proxyAttribute?.hidden?.value,
            });
            updateProxyPrize(convert).then((res) => {
                addToast(<div className="text-center">{`Cập nhật ${item?.name} thành công`}</div>, { appearance: 'success' });
            }).catch((err) => {
                addToast(<div className="text-center">Cập nhật thất bại</div>, { appearance: 'error' });
            })
        });
        resetModalAttribute();
    }


    return (
        <Modal
            isOpen={modalPrizeAttribute.isOpen}
            modalName="role-modal"
            showOverlay={true}
            onClose={() => resetModalAttribute()}
            title="Cấu hình giải thưởng"
            size="xl"
            centered
        >
            <Modal.Body>
                <div class="accordion" id="myAccordion">
                    <div className='row'>
                        <div className='col-md-3'>
                            <button className='btn btn-danger' id="btnExpand" onClick={(e) => {
                                var listCollapse = document.getElementsByClassName("accordion-button") ?? [];
                                for (var i = 0; i < listCollapse?.length; i++) {
                                    listCollapse[i]?.click()
                                }
                                var btnEx = $("#btnExpand")[0];
                                if (btnEx && btnEx.innerText === "Expand")
                                    btnEx.innerText = "Collapse";
                                else
                                    btnEx.innerText = "Expand";
                            }}>
                                {`Expand`}
                            </button>
                        </div>
                    </div>
                    <hr />
                    <div className='row'>
                        {
                            modalPrizeAttribute?.data?.channelPrizes?.map((item, index) => {
                                return (
                                    <div className='col-md-4'>
                                        <div class="accordion-item">
                                            <h2 class="accordion-header" id={`index_${index}`}>
                                                <button type="button" class="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target={`#collapse_${index}`}>{`${item?.name} ${item?.edited ? " (trạng thái: chỉnh sửa)" : ""}`}</button>
                                            </h2>
                                            <div id={`collapse_${index}`} class="accordion-collapse collapse">
                                                <div class="card-body">
                                                    <UIBuilder
                                                        objectKeys={item?.proxyAttribute}
                                                        indexData={index}
                                                        modelChange={updateAttributes} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-danger mr-25" onClick={() => {
                    resetModalAttribute()
                }}>Đóng</button>
                <button className="btn btn-outline-primary mr-25" onClick={() => {
                    console.log({ data: groupPrizeEditModel });
                    updateAttributesCommand(groupPrizeEditModel)
                }}>
                    Cập nhật
                </button>
            </Modal.Footer>
        </Modal>

    )
}

ChannelPrizeModal.propTypes = {
};

export default ChannelPrizeModal;