import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import Modal from "../../../../../../../../shared/packages/control/modal/index";
import { InputControl } from "../../../../../../../../shared/packages/control/input/inputControl"
import showConfirm from "../../../../../../../../shared/packages/control/dialog/confirmation"
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import { createWheelSpin, updateWheelSpin, removeWheelSpin } from "../../../../../../../../services/wheelInstance.service"
import { wheelConfig } from "../../../../../../../luckyspin/module/wheelUI/config/wheelUIConfig"
import { loadDataTableWheel } from "../../../../../../../../redux/actions/wheelInstanceAction"
import { attributesConfig, sectionId } from "./attributeConfig"
import UIBuilderv2 from "../../../../../../../../shared/packages/control/uiBuilderv2/uiBuilderv2"

const WheelUI = (props) => {
    const { material, func } = props;
    const router = useRouter();
    const { addToast } = useToasts();
    const [refresh, setRefresh] = useState(false)
    const dispatch = useDispatch();
    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }
    const { wheelInstanceList } = useSelector((state) => state.wheelInstance);
    const [convertData, setConvertData] = useState(null);
    const [modalCustom, setModalCustom] = useState({
        isOpen: false,
        data: null,
        type: null
    })

    const resetModal = () => {
        setModalCustom({ ...modalCustom, isOpen: false, data: null, type: null })
    }

    useEffect(() => {
        if (!refresh) {
            new Swiper(".layout-circle", {
                slidesPerView: 5,
                spaceBetween: 16,
                loop: false,
                loopFillGroupWithBlank: false,
                navigation: {
                    nextEl: ".layout-circle .swiper-header .swiper__arrows .swiper-button-next",
                    prevEl: ".layout-circle .swiper-header .swiper__arrows .swiper-button-prev"
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2
                    },
                    768: {
                        slidesPerView: 4
                    },
                    1281: {
                        slidesPerView: 5
                    }
                }
            });
        }
    }, [refresh])

    const convertEditAttributeUI = (data) => {
        let maskCopyEdit = _.cloneDeep(attributesConfig);
        if (data === null) {
            return maskCopyEdit;
        }
        else {
            try {
                const parse = JSON.parse(data);
                Object.keys(maskCopyEdit)?.map(x => {
                    maskCopyEdit[x].value = parse[x]?.value
                })
                return maskCopyEdit;
            }
            catch {
                return {}
            }
        }
    }

    const updateAttributes = (key, value) => {
        func.tabData.wheelUI.data.configJson[key].value = value;
        func.tabData.wheelUI.data["edited"] = true;
        func.setTabData({ ...func.tabData });
    }

    const createWheelCommand = (data) => {
        let maskCopyEdit = _.cloneDeep(attributesConfig);
        maskCopyEdit.wheel_bg.value = data?.wheelbg;

        const copyData = {
            name: data?.name,
            desc: data?.desc,
            configJson: JSON.stringify(maskCopyEdit)
        };
        createWheelSpin(copyData).then((res) => {
            dispatch(loadDataTableWheel({
                header: {
                    pageNumber: 1,
                    pageSize: 999
                }
            }))
            setRefresh(true)
            setTimeout(() => {
                setRefresh(false)
            }, 0);
            addToast(<div className="text-center">Thêm thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Thêm thất bại</div>, { appearance: 'error' });
        })
    }

    const updateWheelCommand = (data) => {
        const copyData = {
            id: data?.id,
            name: data?.name,
            desc: data?.desc,
            configJson: JSON.stringify(data?.configJson)
        };

        updateWheelSpin(copyData).then((res) => {
            addToast(<div className="text-center">Cập nhật thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Cập nhật thất bại</div>, { appearance: 'error' });
        })
    }

    const removeWheelCommand = (data) => {
        removeWheelSpin(data).then((res) => {
            dispatch(loadDataTableWheel({
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

    //for only modal
    const updateWheelLiteCommand = (data) => {
        func.tabData.wheelUI.data.id = data?.id;
        func.tabData.wheelUI.data.name = data?.name;
        func.tabData.wheelUI.data.desc = data?.desc;
        func.tabData.wheelUI.data.configJson['wheel_bg'].value = data?.wheelbg;
        const copyData = {
            id: data?.id,
            name: data?.name,
            desc: data?.desc,
            configJson: JSON.stringify(func.tabData.wheelUI.data.configJson)
        };
        updateWheelSpin(copyData).then((res) => {
            addToast(<div className="text-center">Cập nhật thành công</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Cập nhật thất bại</div>, { appearance: 'error' });
        })
    }


    useEffect(() => {
        dispatch(loadDataTableWheel({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
    }, [])

    useEffect(() => {
        if (wheelInstanceList) {
            const convert = wheelInstanceList?.map(item => ({
                ...item,
                configJson: convertEditAttributeUI(item?.configJson)
            }))
            //select default value
            func.tabData.wheelUI.data = convert?.find(x => x.id === material?.strategySSR?.wheelInstanceId) ?? null;
            func.setTabData({ ...func.tabData });
            setConvertData(convert);
        }
    }, [wheelInstanceList, material?.strategySSR])

    const overwriteDataModal = (prefix, value) => {
        modalCustom.data[prefix] = value;
        setModalCustom({ ...modalCustom });
    }

    return (
        <div class="tab-container">
            {
                refresh ||
                <div class="swiper mySwiper layout-circle">
                    <div class="swiper-header d-flex align-items-center">
                        <h1>Chọn hình ảnh vòng quay</h1>
                        <button class="btn btn-default" type="button" onClick={() =>
                            setModalCustom({ ...modalCustom, isOpen: true, type: 'new', data: {} })}
                        >
                            <img src="/asset/images/icons/cloud-upload-2.svg" alt="" />
                            <span>Tải lên</span>
                        </button>
                        <div class="swiper__arrows">
                            <div class="swiper-button-prev"></div>
                            <div class="swiper-button-next"></div>
                        </div>
                    </div>
                    <div class="swiper-wrapper">
                        {
                            convertData?.map((item, i) => {
                                return (
                                    <div class="swiper-slide">
                                        <div onClick={() => {
                                            func.tabData.wheelUI.data = item;
                                            func.setTabData({ ...func.tabData });
                                        }} class={`slide-inner ${func?.tabData?.wheelUI?.data?.id === item?.id ? 'swiper-slide-active' : ''}`}>
                                            <a>
                                                <img src={item?.configJson?.wheel_bg?.value} alt="" />
                                            </a>
                                            <div class="action-block">
                                                <ul>
                                                    <li><a><img src="/asset/images/icons/eye2.svg" alt="" /></a></li>
                                                    <li onClick={() => {
                                                        setModalCustom({
                                                            ...modalCustom, isOpen: true, type: 'edit', data: {
                                                                id: item?.id,
                                                                name: item?.name,
                                                                desc: item?.desc,
                                                                wheelbg: item?.configJson?.wheel_bg?.value
                                                            }
                                                        })
                                                    }
                                                    }>
                                                        <a><img src="/asset/images/icons/edit2.svg" alt="" /></a>
                                                    </li>
                                                    <li onClick={async () => {
                                                        const confirm = await showConfirm("Xác nhận", `Bạn có chắc chắn muốn xoá đối tượng ${item?.name} ?`, "Xoá", "Trở về");
                                                        if (confirm && item?.id) {
                                                            removeWheelCommand(item?.id);
                                                        }
                                                    }}>
                                                        <a><img src="/asset/images/icons/delete.svg" alt="" /></a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            }

            {
                func.tabData.wheelUI.data &&
                <>
                    <UIBuilderv2 modelChange={updateAttributes} section={sectionId} attribute={func?.tabData?.wheelUI?.data?.configJson} />
                    <button class="btn btn-add" style={{ margin: 'auto' }} onClick={() => {
                        console.log({ data: func.tabData.wheelUI.data });
                        updateWheelCommand(func.tabData.wheelUI.data)
                    }}>
                        <img src="/asset/images/icons/save.svg" alt="" />
                        <span style={{ color: "#454f5b" }}>&nbsp;Lưu thông số vòng quay</span>
                    </button>
                </>
            }

            {/* popup */}
            <Modal
                isOpen={modalCustom.isOpen}
                modalName="role-modal"
                showOverlay={true}
                onClose={() => resetModal()}
                title={modalCustom?.type === 'new' ? "Tạo mới giao diện vòng quay" : "Sửa thông tin giao diện vòng quay"}
                size="xl"
                centered
            >
                <Modal.Body>
                    <div class="popup-detail" id="popup-bg">
                        <div class="popup-main">
                            <div class="popup-body">
                                <ul class="d-flex align-items-center justify-content-center">
                                    <li>
                                        <a>
                                            <figure> <img src="/asset/images/icons/photo-upload.svg" alt="" />
                                                <figcaption>
                                                    <p>Tải ảnh vòng quay</p>
                                                </figcaption>
                                            </figure>
                                        </a>
                                    </li>

                                </ul>
                                <form class="wrap-form">
                                    <div class="form-group">
                                        <label for="">Tên giao diện vòng quay</label>
                                        <InputControl type="text" id="name" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataModal('name', value)
                                        }} defaultValue={modalCustom.data?.name} placeholder="Nhập tên giao diện" />
                                    </div>
                                    <div class="form-group">
                                        <label for="">Mô tả</label>
                                        <InputControl type="text" id="desc" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataModal('desc', value)
                                        }} defaultValue={modalCustom.data?.desc} />
                                    </div>
                                    <div class="form-group">
                                        <label for="">Url ảnh vòng quay</label>
                                        <InputControl type="text" id="wheelbg" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataModal('wheelbg', value)
                                        }} defaultValue={modalCustom.data?.wheelbg} />
                                    </div>
                                    <div class="form-group">
                                        <button class="btn btn-submit" type="button" onClick={() => {
                                            if (modalCustom.type === 'new') {
                                                createWheelCommand(modalCustom.data)
                                            }
                                            if (modalCustom.type === 'edit') {
                                                updateWheelLiteCommand(modalCustom.data)
                                            }
                                            resetModal();
                                        }}>
                                            <span>{modalCustom?.type === "new" ? "Tạo mới" : "Cập nhật"}</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* <form class="wrap-form">
                <div class="form-row row">
                    <p class="title">Kích thước vòng quay</p>
                    <div class="form-group col-lg-3">
                        <label for="">Độ rộng</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">độ cao</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                </div>
                <div class="form-row row">
                    <p class="title">Thông số vòng quay</p>
                    <div class="form-group col-lg-3">
                        <label for="">Canh lề trên</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">Canh lề dưới</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">Canh lề phải</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">Canh lề trái</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">Bán kính vòng quay</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">Bán kính tâm vòng quay </label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                </div>
                <div class="form-row row">
                    <p class="title">Thông số kim quay </p>
                    <div class="form-group col-lg-12">
                        <label class="custom-file-label" for=""> <span>Url</span><img src="/asset/images/icons/cloud-upload.svg" alt="" /></label>
                        <input class="custom-file-input" id="customFile" type="file" name="" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">Sử dụng ảnh kim vòng quay</label>
                        <div class="custom-select">
                            <select class="form-control" name="">
                                <option value="0" disable="disable" selected="selected" hidden="hidden">True</option>
                                <option value="1">True</option>
                                <option value="2">False</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">Độ lệch kim</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">Tọa độ y kim vòng quay</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">Tọa độ x kim vòng quay</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                </div>
                <div class="form-row row">
                    <p class="title">Thông số kiểu chữ vòng quay</p>
                    <div class="form-group col-lg-3">
                        <label for="">Font family</label>
                        <input class="form-control" type="type" placeholder="Arial" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">Kích thước font</label>
                        <input class="form-control" type="type" placeholder="36" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">Canh lề chữ </label>
                        <div class="custom-select">
                            <select class="form-control" name="">
                                <option value="0" disable="disable" selected="selected" hidden="hidden">Center</option>
                                <option value="1">Left</option>
                                <option value="2">Right </option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">Hướng chữ</label>
                        <div class="custom-select">
                            <select class="form-control" name="">
                                <option value="0" disable="disable" selected="selected" hidden="hidden">Horizontal</option>
                                <option value="1">Horizontal</option>
                                <option value="2">vertical </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-row row">
                    <p class="title">Âm thanh</p>
                    <div class="form-group col-lg-6">
                        <label for="">Âm thanh khi bắt đầu quay</label>
                        <input class="form-control" type="type" placeholder="mp3" /><img class="icon" src="/asset/images/icons/bxs-volume-full.svg" alt="" />
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="">Âm thanh khi kết thúc</label>
                        <input class="form-control" type="type" placeholder="mp3" /><img class="icon" src="/asset/images/icons/bxs-volume-full.svg" alt="" />
                    </div>
                </div>
            </form> */}
        </div>
    )
}
export default WheelUI;