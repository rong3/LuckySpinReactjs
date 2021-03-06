import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import Modal from "../../../../../../../../shared/packages/control/modal/index";
import { InputControl } from "../../../../../../../../shared/packages/control/input/inputControl"
import showConfirm from "../../../../../../../../shared/packages/control/dialog/confirmation"
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import { createWheelSpin, updateWheelSpin, removeWheelSpin } from "../../../../../../../../services/wheelInstance.service"
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
            addToast(<div className="text-center">Th??m th??nh c??ng</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Th??m th???t b???i</div>, { appearance: 'error' });
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
            addToast(<div className="text-center">C???p nh???t th??nh c??ng</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">C???p nh???t th???t b???i</div>, { appearance: 'error' });
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
            addToast(<div className="text-center">Xo?? th??nh c??ng</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">Xo?? th???t b???i</div>, { appearance: 'error' });
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
            addToast(<div className="text-center">C???p nh???t th??nh c??ng</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">C???p nh???t th???t b???i</div>, { appearance: 'error' });
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
                        <h1>Ch???n h??nh ???nh v??ng quay</h1>
                        <button class="btn btn-default" type="button" onClick={() =>
                            setModalCustom({ ...modalCustom, isOpen: true, type: 'new', data: {} })}
                        >
                            <img src="/asset/images/icons/cloud-upload-2.svg" alt="" />
                            <span>T???i l??n</span>
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
                                                        const confirm = await showConfirm("X??c nh???n", `B???n c?? ch???c ch???n mu???n xo?? ?????i t?????ng ${item?.name} ?`, "Xo??", "Tr??? v???");
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
                        <span style={{ color: "#454f5b" }}>&nbsp;L??u th??ng s??? v??ng quay</span>
                    </button>
                </>
            }

            {/* popup */}
            <Modal
                isOpen={modalCustom.isOpen}
                modalName="role-modal"
                showOverlay={true}
                onClose={() => resetModal()}
                title={modalCustom?.type === 'new' ? "T???o m???i giao di???n v??ng quay" : "S???a th??ng tin giao di???n v??ng quay"}
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
                                                    <p>T???i ???nh v??ng quay</p>
                                                </figcaption>
                                            </figure>
                                        </a>
                                    </li>

                                </ul>
                                <form class="wrap-form">
                                    <div class="form-group">
                                        <label for="">T??n giao di???n v??ng quay</label>
                                        <InputControl type="text" id="name" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataModal('name', value)
                                        }} defaultValue={modalCustom.data?.name} placeholder="Nh???p t??n giao di???n" />
                                    </div>
                                    <div class="form-group">
                                        <label for="">M?? t???</label>
                                        <InputControl type="text" id="desc" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataModal('desc', value)
                                        }} defaultValue={modalCustom.data?.desc} />
                                    </div>
                                    <div class="form-group">
                                        <label for="">Url ???nh v??ng quay</label>
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
                                            <span>{modalCustom?.type === "new" ? "T???o m???i" : "C???p nh???t"}</span>
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
                    <p class="title">K??ch th?????c v??ng quay</p>
                    <div class="form-group col-lg-3">
                        <label for="">????? r???ng</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">????? cao</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                </div>
                <div class="form-row row">
                    <p class="title">Th??ng s??? v??ng quay</p>
                    <div class="form-group col-lg-3">
                        <label for="">Canh l??? tr??n</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">Canh l??? d?????i</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">Canh l??? ph???i</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">Canh l??? tr??i</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">B??n k??nh v??ng quay</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">B??n k??nh t??m v??ng quay </label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                </div>
                <div class="form-row row">
                    <p class="title">Th??ng s??? kim quay </p>
                    <div class="form-group col-lg-12">
                        <label class="custom-file-label" for=""> <span>Url</span><img src="/asset/images/icons/cloud-upload.svg" alt="" /></label>
                        <input class="custom-file-input" id="customFile" type="file" name="" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">S??? d???ng ???nh kim v??ng quay</label>
                        <div class="custom-select">
                            <select class="form-control" name="">
                                <option value="0" disable="disable" selected="selected" hidden="hidden">True</option>
                                <option value="1">True</option>
                                <option value="2">False</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">????? l???ch kim</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">T???a ????? y kim v??ng quay</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">T???a ????? x kim v??ng quay</label>
                        <input class="form-control" type="text" placeholder="0" />
                    </div>
                </div>
                <div class="form-row row">
                    <p class="title">Th??ng s??? ki???u ch??? v??ng quay</p>
                    <div class="form-group col-lg-3">
                        <label for="">Font family</label>
                        <input class="form-control" type="type" placeholder="Arial" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">K??ch th?????c font</label>
                        <input class="form-control" type="type" placeholder="36" />
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">Canh l??? ch??? </label>
                        <div class="custom-select">
                            <select class="form-control" name="">
                                <option value="0" disable="disable" selected="selected" hidden="hidden">Center</option>
                                <option value="1">Left</option>
                                <option value="2">Right </option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group col-lg-3">
                        <label for="">H?????ng ch???</label>
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
                    <p class="title">??m thanh</p>
                    <div class="form-group col-lg-6">
                        <label for="">??m thanh khi b???t ?????u quay</label>
                        <input class="form-control" type="type" placeholder="mp3" /><img class="icon" src="/asset/images/icons/bxs-volume-full.svg" alt="" />
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="">??m thanh khi k???t th??c</label>
                        <input class="form-control" type="type" placeholder="mp3" /><img class="icon" src="/asset/images/icons/bxs-volume-full.svg" alt="" />
                    </div>
                </div>
            </form> */}
        </div>
    )
}
export default WheelUI;