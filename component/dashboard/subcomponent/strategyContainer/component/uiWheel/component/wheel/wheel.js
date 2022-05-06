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
    const dispatch = useDispatch();
    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }
    const { wheelInstanceList } = useSelector((state) => state.wheelInstance);
    const [convertData, setConvertData] = useState(null);

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


    useEffect(() => {
        dispatch(loadDataTableWheel({
            header: {
                pageNumber: 1,
                pageSize: 999
            }
        }))
    }, [])

    useEffect(() => {
        console.log({ wheelInstanceList });
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

    return (
        <div class="tab-container">
            <div class="swiper mySwiper layout-circle">
                <div class="swiper-header d-flex align-items-center">
                    <h1>Chọn hình ảnh vòng quay</h1>
                    <button class="btn btn-default" type="submit" data-fancybox="" data-src="#popup-bg"> <img src="/asset/images/icons/cloud-upload-2.svg" alt="" /><span>Tải lên</span></button>
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
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {
                <UIBuilderv2 modelChange={updateAttributes} section={sectionId} attribute={func?.tabData?.wheelUI?.data?.configJson} />
            }
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