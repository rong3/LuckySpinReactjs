import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import Modal from "../../../../../../../../shared/packages/control/modal/index";
import { InputControl } from "../../../../../../../../shared/packages/control/input/inputControl"
import showConfirm from "../../../../../../../../shared/packages/control/dialog/confirmation"
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import { loadDataTableThemeSpin } from "../../../../../../../../redux/actions/themeAction"
import { createTheme, updateTheme, removeTheme } from "../../../../../../../../services/themeInstance.service"
import { themeConfig } from "./attributeConfig"

const BackGroundUI = (props) => {
    const { material, func } = props
    const router = useRouter();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const [refresh, setRefresh] = useState(false)
    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }

    const { themeInstanceList } = useSelector((state) => state.themeInstance);
    const [convertData, setConvertData] = useState(null);
    const [modalCustom, setModalCustom] = useState({
        isOpen: false,
        data: null,
        type: null
    })
    const resetModal = () => {
        setModalCustom({ ...modalCustom, isOpen: false, data: null, type: null })
    }

    const convertEditAttributeUI = (data) => {
        let maskCopyEdit = _.cloneDeep(themeConfig);
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

    useEffect(() => {
        if (!refresh) {
            new Swiper(".layout-bg", {
                slidesPerView: 5,
                spaceBetween: 16,
                loop: false,
                loopFillGroupWithBlank: false,
                navigation: {
                    nextEl: ".layout-bg .swiper-header .swiper__arrows .swiper-button-next",
                    prevEl: ".layout-bg .swiper-header .swiper__arrows .swiper-button-prev"
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

    useEffect(() => {
        dispatch(loadDataTableThemeSpin({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
    }, [])

    useEffect(() => {
        if (themeInstanceList) {
            const convert = themeInstanceList?.map(item => ({
                ...item,
                configJson: convertEditAttributeUI(item?.configJson)
            }))
            //select default value
            func.tabData.backgroundUI.data = convert?.find(x => x.id === material?.strategySSR?.themeInstanceId) ?? null;
            func.setTabData({ ...func.tabData });
            setConvertData(convert);
        }
    }, [themeInstanceList, material?.strategySSR])

    const overwriteDataModal = (prefix, value) => {
        modalCustom.data[prefix] = value;
        setModalCustom({ ...modalCustom });
    }

    const updateThemeCommand = (data) => {
        func.tabData.backgroundUI.data.id = data?.id;
        func.tabData.backgroundUI.data.name = data?.name;
        func.tabData.backgroundUI.data.desc = data?.desc;
        func.tabData.backgroundUI.data.configJson['main_bg'].value = data?.main_bg;
        func.tabData.backgroundUI.data.configJson['main_bg_mb'].value = data?.main_bg_mb;
        const copyData = {
            id: data?.id,
            name: data?.name,
            desc: data?.desc,
            configJson: JSON.stringify(func.tabData.backgroundUI.data.configJson)
        };

        updateTheme(copyData).then((res) => {
            addToast(<div className="text-center">C???p nh???t th??nh c??ng</div>, { appearance: 'success' });
        }).catch((err) => {
            addToast(<div className="text-center">C???p nh???t th???t b???i</div>, { appearance: 'error' });
        })
    }

    const createThemeCommand = (data) => {
        let maskCopyEdit = _.cloneDeep(themeConfig);
        maskCopyEdit.main_bg.value = data?.main_bg;
        maskCopyEdit.main_bg_mb.value = data?.main_bg_mb;

        const copyData = {
            name: data?.name,
            desc: data?.desc,
            configJson: JSON.stringify(maskCopyEdit)
        };
        createTheme(copyData).then((res) => {
            dispatch(loadDataTableThemeSpin({
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

    const removeThemeCommand = (data) => {
        removeTheme(data).then((res) => {
            dispatch(loadDataTableThemeSpin({
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


    return (
        <div class="tab-container">
            {
                refresh ||
                <div class="swiper mySwiper layout-bg">
                    <div class="swiper-header d-flex align-items-center">
                        <h1>Ch???n h??nh ???nh v??ng quay</h1>
                        <button class="btn btn-default" onClick={() => {
                            setModalCustom({ ...modalCustom, isOpen: true, type: 'new', data: {} })
                        }} type="button">
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
                                            func.tabData.backgroundUI.data = item;
                                            func.setTabData({ ...func.tabData });
                                        }} class={`slide-inner ${func?.tabData?.backgroundUI?.data?.id === item?.id ? 'swiper-slide-active' : ''}`}>
                                            <a>
                                                <img src={item?.configJson?.main_bg?.value} alt="" />
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
                                                                main_bg: item?.configJson?.main_bg?.value,
                                                                main_bg_mb: item?.configJson?.main_bg_mb?.value,
                                                            }
                                                        })
                                                    }
                                                    }>
                                                        <a><img src="/asset/images/icons/edit2.svg" alt="" /></a>
                                                    </li>
                                                    <li onClick={async () => {
                                                        const confirm = await showConfirm("X??c nh???n", `B???n c?? ch???c ch???n mu???n xo?? ?????i t?????ng ${item?.name} ?`, "Xo??", "Tr??? v???");
                                                        if (confirm && item?.id) {
                                                            removeThemeCommand(item?.id);
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
                    <div class="popup-detail">
                        <div class="popup-main">
                            <div class="popup-body">
                                <ul class="d-flex align-items-center justify-content-center">
                                    <li>
                                        <a>
                                            <figure>
                                                <img src="/asset/images/icons/photo-upload.svg" alt="" />
                                                <figcaption>
                                                    <p>T???i h??nh <span>Desktop</span></p>
                                                </figcaption>
                                            </figure>
                                        </a>
                                    </li>
                                    <li>
                                        <a>
                                            <figure> <img src="/asset/images/icons/photo-upload.svg" alt="" />
                                                <figcaption>
                                                    <p>T???i h??nh <span>Mobile</span></p>
                                                </figcaption>
                                            </figure>
                                        </a>
                                    </li>
                                </ul>
                                <form class="wrap-form">
                                    <div class="form-group">
                                        <label for="">T??n h??nh ???nh</label>
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
                                        <label for="">Url ???nh n???n desktop</label>
                                        <InputControl type="text" id="wheelbg" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataModal('main_bg', value)
                                        }} defaultValue={modalCustom.data?.main_bg} />
                                    </div>
                                    <div class="form-group">
                                        <label for="">Url ???nh n???n mobile</label>
                                        <InputControl type="text" id="wheelbg" onChange={(e) => {
                                            const value = e.target.value ?? '';
                                            overwriteDataModal('main_bg_mb', value)
                                        }} defaultValue={modalCustom.data?.main_bg_mb} />
                                    </div>
                                    <div class="form-group">
                                        <button class="btn btn-submit" type="button" onClick={() => {
                                            if (modalCustom.type === 'new') {
                                                createThemeCommand(modalCustom.data)
                                            }
                                            if (modalCustom.type === 'edit') {
                                                updateThemeCommand(modalCustom.data)
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
        </div>
        // /* <div style="display: none;"><a href="/asset/images/bg-review-1.jpg" data-fancybox="gallery" data-thumb="/asset/images/bg-review-1.jpg"></a><a href="/asset/images/bg-review-2.jpg" data-fancybox="gallery" data-thumb="/asset/images/bg-review-2.jpg"></a><a href="/asset/images/bg-review-3.jpg" data-fancybox="gallery" data-thumb="/asset/images/bg-review-3.jpg"></a></div> */}
    )
}
export default BackGroundUI;