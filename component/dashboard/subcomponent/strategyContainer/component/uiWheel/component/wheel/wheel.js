import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import Modal from "../../../../../../../../shared/packages/control/modal/index";
import { InputControl } from "../../../../../../../../shared/packages/control/input/inputControl"
import showConfirm from "../../../../../../../../shared/packages/control/dialog/confirmation"
import { useToasts } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";

const WheelUI = (props) => {
    const { material } = props
    const router = useRouter();
    const { addToast } = useToasts();
    const dispatch = useDispatch();
    const changeRoute = (route) => {
        router.replace(route ?? "/")
    }


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
                    <div class="swiper-slide">
                        <div class="slide-inner swiper-slide-active"> <a > <img src="/asset/images/gd-1.png" alt="" /></a></div>
                    </div>
                    <div class="swiper-slide">
                        <div class="slide-inner"> <a > <img src="/asset/images/gd-2.png" alt="" /></a></div>
                    </div>
                    <div class="swiper-slide">
                        <div class="slide-inner"> <a > <img src="/asset/images/gd-1.png" alt="" /></a></div>
                    </div>
                    <div class="swiper-slide">
                        <div class="slide-inner"> <a > <img src="/asset/images/gd-2.png" alt="" /></a></div>
                    </div>
                    <div class="swiper-slide">
                        <div class="slide-inner"> <a > <img src="/asset/images/gd-1.png" alt="" /></a></div>
                    </div>
                </div>
            </div>
            <form class="wrap-form" action="" method="method">
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
            </form>
        </div>
    )
}
export default WheelUI;